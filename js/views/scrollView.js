(function(ionic) {
'use strict';

  ionic.views.ScrollView = function(opts) {
    var _this = this;

    // Extend the options with our defaults
    ionic.Utils.extend(opts, {
      decelerationRate: ionic.views.ScrollView.prototype.DECEL_RATE_NORMAL,
      dragThresholdY: 10,
      resistance: 2,
      scrollEventName: 'momentumScrolled',
      intertialEventInterval: 50,

      bounceTime: 600 //how long to take when bouncing back in a rubber band
    });

    ionic.Utils.extend(this, opts);

    this.el = opts.el;

    // Listen for drag and release events
    ionic.onGesture('drag', function(e) {
      _this._handleDrag(e);
    }, this.el);
    ionic.onGesture('release', function(e) {
      _this._handleEndDrag(e);
    }, this.el);
    ionic.on('webkitTransitionEnd', function(e) {
      _this._endTransition();
    });
  };

  ionic.views.ScrollView.prototype = {
    DECEL_RATE_NORMAL: 0.998,
    DECEL_RATE_FAST: 0.99,
    DECEL_RATE_SLOW: 0.996,

    _getMomentum: function (current, start, time, lowerMargin, wrapperSize) {
      var distance = current - start,
        speed = Math.abs(distance) / time,
        destination,
        duration,
        deceleration = 0.0006;

      // Calculate the final desination
      destination = current + ( speed * speed ) / ( 2 * deceleration ) * ( distance < 0 ? -1 : 1 );
      duration = speed / deceleration;

      // Check if the final destination needs to be rubber banded
      if ( destination < lowerMargin ) {
        // We have dragged too far down, snap back to the maximum
        destination = wrapperSize ? lowerMargin - ( wrapperSize / 2.5 * ( speed / 8 ) ) : lowerMargin;
        distance = Math.abs(destination - current);
        duration = distance / speed;
      } else if ( destination > 0 ) {
        // We have dragged too far up, snap back to 0
        destination = 0;//wrapperSize ? wrapperSize / 2.5 * ( speed / 8 ) : 0;
        distance = Math.abs(current) + destination;
        duration = distance / speed;
      }

      console.log('Momentum of time', time, speed, destination, duration);
      return {
        destination: Math.round(destination),
        duration: duration
      };
    },

    /**
     * Scroll to the given X and Y point, taking 
     * the given amount of time, with the given
     * easing function defined as a CSS3 timing function.
     *
     * @param {float} the x position to scroll to (CURRENTLY NOT SUPPORTED!)
     * @param {float} the y position to scroll to
     * @param {float} the time to take scrolling to the new position
     * @param {easing} the animation function to use for easing
     */
    scrollTo: function(x, y, time, easing) {
      var _this = this;

      easing = easing || 'cubic-bezier(0.1, 0.57, 0.1, 1)';

      var el = this.el;

      el.style.webkitTransitionTimingFunction = easing;
      el.style.webkitTransitionDuration = time;
      el.style.webkitTransform = 'translate3d(0,' + y + 'px, 0)';

      // Start triggering events as the element scrolls from inertia.
      // This is important because we need to receive scroll events
      // even after a "flick" and adjust, etc.
      this._momentumStepTimeout = setTimeout(function eventNotify() {
        var scrollTop = parseFloat(_this.el.style.webkitTransform.replace('translate3d(', '').split(',')[1]) || 0;
        ionic.trigger(_this.scrollEventName, {
          target: _this.el,
          scrollTop: -scrollTop
        });

        if(_this._isDragging) {
          _this._momentumStepTimeout = setTimeout(eventNotify, _this.inertialEventInterval);
        }
      }, this.inertialEventInterval)

      console.log('TRANSITION ADDED!');
    },


    _initDrag: function() {
      this._endTransition();
      this._isStopped = false;
    },



    _endTransition: function() {
      this._isDragging = false;
      this._drag = null;
      this.el.classList.remove('scroll-scrolling');

      console.log('REMOVING TRANSITION');
      this.el.style.webkitTransitionDuration = '0';

      clearTimeout(this._momentumStepTimeout)
    },



    /**
     * Initialize a drag by grabbing the content area to drag, and any other
     * info we might need for the dragging.
     */
    _startDrag: function(e) {
      var offsetX, content;

      this._initDrag();

      var scrollTop = parseFloat(this.el.style.webkitTransform.replace('translate3d(', '').split(',')[1]) || 0;

      this._drag = {
        direction: 'v',
        y: scrollTop,
        pointY: e.gesture.touches[0].pageY,
        startY: scrollTop,
        resist: 1,
        startTime: Date.now()
      };
    },



    /**
     * Process the drag event to move the item to the left or right.
     */
    _handleDrag: function(e) {
      var _this = this;

      var content;

      // The drag stopped already, don't process this one
      if(_this._isStopped) {
        _this._initDrag();
        return;
      }

      // We really aren't dragging
      if(!_this._drag) {
        _this._startDrag(e);
      }

      // Stop any default events during the drag
      e.preventDefault();

      var py = e.gesture.touches[0].pageY;
      var deltaY = py - _this._drag.pointY;
      console.log("Delta y", deltaY);

      _this._drag.pointY = py;

      // Check if we should start dragging. Check if we've dragged past the threshold.
      if(!_this._isDragging && (Math.abs(e.gesture.deltaY) > _this.dragThresholdY)) {
        _this._isDragging = true;
      }

      if(_this._isDragging) {
        var drag = _this._drag;
        window.requestAnimationFrame(function() {
          // We are dragging, grab the current content height
          // and the height of the parent container
          var totalHeight = _this.el.offsetHeight;
          var parentHeight = _this.el.parentNode.offsetHeight;
          var timestamp = Date.now();

          // Calculate the new Y point for the container
          var newY = drag.y + deltaY;

          // Check if the dragging is beyond the bottom or top
          if(newY > 0 || (-newY + parentHeight) > totalHeight) {
            // Rubber band
            newY = drag.y + deltaY / 3;//(-_this.resistance);
          }
          // Update the new translated Y point of the container
          _this.el.style.webkitTransform = 'translate3d(0,' + newY + 'px, 0)';

          drag.y = newY;

          // Check if we need to reset the drag initial states if we've
          // been dragging for a bit
          if(timestamp - drag.startTime > 300) {
            console.log('Resetting timer');
            drag.startTime = timestamp;
            drag.startY = drag.y;
          }

          ionic.trigger(_this.scrollEventName, {
            target: _this.el,
            scrollTop: -newY
          });
        });
      }
    },



    _handleEndDrag: function(e) {
      // We didn't have a drag, so just init and leave
      if(!this._drag) {
        this._initDrag();
        return;
      }

      // Set a flag in case we don't cleanup completely after the
      // drag animation so we can cleanup the next time a drag starts
      this._isStopped = true;

      // Animate to the finishing point
      this._animateToStop(e);

    },


    // Find the stopping point given the current velocity and acceleration rate, and
    // animate to that position
    _animateToStop: function(e) {
      var _this = this;

      if(this._drag.direction == 'v') {
        this._animateToStopVertical(e);
      } else {
        this._animateToStopHorizontal(e);
      }

    },

    _animateToStopHorizontal: function(e) {
    },
    
    _animateToStopVertical: function(e) {
      var _this = this;
      window.requestAnimationFrame(function() {
        var drag = _this._drag;

        // Calculate the viewport height and the height of the content
        var totalHeight = _this.el.offsetHeight;
        var parentHeight = _this.el.parentNode.offsetHeight;

        // Calculate how long we've been dragging for, with a max of 300ms
        var duration = Math.min(300, (Date.now()) - _this._drag.startTime);


        //var newX = Math.round(this.x),
        var newY = Math.round(drag.y);
        //distanceX = Math.abs(newX - this.startX),
        //var distanceY = Math.abs(newY - drag.startY);


        var momentum = _this._getMomentum(drag.y, drag.startY, duration, parentHeight - totalHeight, parentHeight);
        //var newX = momentumX.destination;
        newY = momentum.destination;
        var time = momentum.duration;

        if(drag.y > 0) {
          _this.scrollTo(0, 0, _this.bounceTime);
          return;
        } else if ((-drag.y + parentHeight) > totalHeight) {
          _this.scrollTo(0, totalHeight - parentHeight, _this.bounceTime);
          return;
        }

        var el = _this.el;
        
        // Turn on animation
        _this.scrollTo(0, newY, time);
      });
    }
  };

})(ionic);
