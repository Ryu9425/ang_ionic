/**
 * ionic.views.Scroll. Portions adapted from the great iScroll 5, which is
 * also MIT licensed.
 * iScroll v5.0.5 ~ (c) 2008-2013 Matteo Spinelli ~ http://cubiq.org/license
 *
 * Think of ionic.views.Scroll like a Javascript version of UIScrollView or any 
 * scroll container in any UI library. You could just use -webkit-overflow-scrolling: touch,
 * but you lose control over scroll behavior that native developers have with things
 * like UIScrollView, and you don't get events after the finger stops touching the
 * device (after a flick, for example).
 *
 * Some people are afraid of using Javascript powered scrolling, but
 * with today's devices, Javascript is probably the best solution for
 * scrolling in hybrid apps.
 */
(function(ionic) {
'use strict';
  var EASING_FUNCTIONS = {
    quadratic: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
		circular: 'cubic-bezier(0.1, 0.57, 0.1, 1)',
    circular2: 'cubic-bezier(0.075, 0.82, 0.165, 1)',

    bounce: 'cubic-bezier(.02,.69,.67,1)',

    // It closes like a high-end toilet seat. Fast, then nice and slow.
    // Thanks to our @xtheglobe for that.
    toiletSeat: 'cubic-bezier(0.05, 0.60, 0.05, 0.60)'
  };

  ionic.views.Scroll = ionic.views.View.inherit({
    initialize: function(opts) {
      var _this = this;

      // Extend the options with our defaults
      opts = ionic.Utils.extend({
        decelerationRate: ionic.views.Scroll.prototype.DECEL_RATE_NORMAL,
        dragThreshold: 10,
        resistance: 2,
        scrollEventName: 'momentumScrolled',
        scrollEndEventName: 'momentumScrollEnd',
        inertialEventInterval: 50,
        mouseWheelSpeed: 20,
        invertWheel: false,
        isVerticalEnabled: true,
        isHorizontalEnabled: false,
        bounceEasing: EASING_FUNCTIONS.bounce,
        bounceTime: 600 //how long to take when bouncing back in a rubber band
      }, opts);

      ionic.extend(this, opts);

      this.el = opts.el;

      this.y = 0;
      this.x = 0;

      // Listen for drag and release events
      ionic.onGesture('drag', function(e) {
        _this._handleDrag(e);
      }, this.el);
      ionic.onGesture('release', function(e) {
        _this._handleEndDrag(e);
      }, this.el);
      ionic.on('mousewheel', function(e) {
        _this._wheel(e);
      }, this.el);
      ionic.on('DOMMouseScroll', function(e) {
        _this._wheel(e);
      }, this.el);
      ionic.on(this.scrollEndEventName, function(e) {
        _this._onScrollEnd(e);
      }, this.el);
      ionic.on('webkitTransitionEnd', function(e) {
        _this._onTransitionEnd(e);
      });
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

      var ox = x, oy = y;

      var el = this.el;

      if(x !== null) {
        this.x = x;
      } else {
        x = this.x;
      }
      if(y !== null) {
        this.y = y;
      } else {
        y = this.y;
      }

      el.offsetHeight;
      el.style.webkitTransitionTimingFunction = easing;
      el.style.webkitTransitionDuration = time;
      el.style.webkitTransform = 'translate3d(' + x + 'px,' + y + 'px, 0)';

      clearTimeout(this._momentumStepTimeout);
      // Start triggering events as the element scrolls from inertia.
      // This is important because we need to receive scroll events
      // even after a "flick" and adjust, etc.
      this._momentumStepTimeout = setTimeout(function eventNotify() {
        var trans = _this.el.style.webkitTransform.replace('translate3d(', '').split(',');
        var scrollLeft = parseFloat(trans[0] || 0);
        var scrollTop = parseFloat(trans[1] || 0);

        _this.didScroll && _this.didScroll({
          target: _this.el,
          scrollLeft: -scrollLeft,
          scrollTop: -scrollTop
        });
        ionic.trigger(_this.scrollEventName, {
          target: _this.el,
          scrollLeft: -scrollLeft,
          scrollTop: -scrollTop
        });

        if(_this._isDragging) {
          _this._momentumStepTimeout = setTimeout(eventNotify, _this.inertialEventInterval);
        }
      }, this.inertialEventInterval)
    },

    needsWrapping: function() {
      var _this = this;

      var totalWidth = this.el.scrollWidth;
      var totalHeight = this.el.scrollHeight;
      var parentWidth = this.el.parentNode.offsetWidth;
      var parentHeight = this.el.parentNode.offsetHeight;

      var maxX = Math.min(0, (-totalWidth + parentWidth));
      var maxY = Math.min(0, (-totalHeight + parentHeight));

      if (this.isHorizontalEnabled && (this.x > 0 || this.x < maxX)) {
        return true;
      }
      
      if (this.isVerticalEnabled && (this.y > 0 || this.y < maxY)) {
        return true;
      }

      return false;
    },

    /**
     * If the scroll position is outside the current bounds,
     * animate it back.
     */
    wrapScrollPosition: function(transitionTime) {
      var _this = this;

      var totalWidth = _this.el.scrollWidth;
      var totalHeight = _this.el.scrollHeight;
      var parentWidth = _this.el.parentNode.offsetWidth;
      var parentHeight = _this.el.parentNode.offsetHeight;

      var maxX = Math.min(0, (-totalWidth + parentWidth));
      var maxY = Math.min(0, (-totalHeight + parentHeight));

        //this._execEvent('scrollEnd');
      var x = _this.x, y = _this.y;

      if (!_this.isHorizontalEnabled || _this.x > 0) {
        x = 0;
      } else if ( _this.x < maxX) {
        x = maxX;
      }

      if (!_this.isVerticalEnabled || _this.y > 0) {
        y = 0;
      } else if (_this.y < maxY) {
        y = maxY;
      }

      // No change
      if (x == _this.x && y == _this.y) {
        return false;
      }
      _this.scrollTo(x, y, transitionTime || 0, _this.bounceEasing);
    
      return true;
    },

    _wheel: function(e) {
      var wheelDeltaX, wheelDeltaY,
        newX, newY,
        that = this;

      var totalWidth = this.el.scrollWidth;
      var totalHeight = this.el.scrollHeight;
      var parentWidth = this.el.parentNode.offsetWidth;
      var parentHeight = this.el.parentNode.offsetHeight;

      var maxX = Math.min(0, (-totalWidth + parentWidth));
      var maxY = Math.min(0, (-totalHeight + parentHeight));

      // Execute the scrollEnd event after 400ms the wheel stopped scrolling
      clearTimeout(this.wheelTimeout);
      this.wheelTimeout = setTimeout(function () {
        that._doneScrolling();
      }, 400);

      e.preventDefault();

      if('wheelDeltaX' in e) {
        wheelDeltaX = e.wheelDeltaX / 120;
        wheelDeltaY = e.wheelDeltaY / 120;
      } else if ('wheelDelta' in e) {
        wheelDeltaX = wheelDeltaY = e.wheelDelta / 120;
      } else if ('detail' in e) {
        wheelDeltaX = wheelDeltaY = -e.detail / 3;
      } else {
        return;
      }

      wheelDeltaX *= this.mouseWheelSpeed;
      wheelDeltaY *= this.mouseWheelSpeed;

      if(!this.isVerticalEnabled) {
        wheelDeltaX = wheelDeltaY;
        wheelDeltaY = 0;
      }

      newX = this.x + (this.isHorizontalEnabled ? wheelDeltaX * (this.invertWheel ? -1 : 1) : 0);
      newY = this.y + (this.isVerticalEnabled ? wheelDeltaY * (this.invertWheel ? -1 : 1) : 0);

      if(newX > 0) {
        newX = 0;
      } else if (newX < maxX) {
        newX = maxX;
      }

      if(newY > 0) {
        newY = 0;
      } else if (newY < maxY) {
        newY = maxY;
      }

      this.scrollTo(newX, newY, 0);
    },

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
        destination = wrapperSize ? wrapperSize / 2.5 * ( speed / 8 ) : 0;
        distance = Math.abs(current) + destination;
        duration = distance / speed;
      }

      return {
        destination: Math.round(destination),
        duration: duration
      };
    },

    _onTransitionEnd: function(e) {
      var _this = this;

      if (e.target != this.el) {
        return;
      }

      var needsWrapping = this.needsWrapping();

      // Triggered to end scroll, once the final animation has ended
      if(needsWrapping && this._didEndScroll) {
        this._didEndScroll = false;
        this._doneScrolling();
      } else if(!needsWrapping) {
        this._didEndScroll = false;
        this._doneScrolling();
      }

      this.el.style.webkitTransitionDuration = '0';

      window.requestAnimationFrame(function() {
        if(_this.wrapScrollPosition(_this.bounceTime)) {
          _this._didEndScroll = true;
        }
      });
    },

    _onScrollEnd: function() {
      this._isDragging = false;
      this._drag = null;
      this.el.classList.remove('scroll-scrolling');

      this.el.style.webkitTransitionDuration = '0';

      clearTimeout(this._momentumStepTimeout)
    },


    _initDrag: function() {
      this._onScrollEnd();
      this._isStopped = false;
    },


    /**
     * Initialize a drag by grabbing the content area to drag, and any other
     * info we might need for the dragging.
     */
    _startDrag: function(e) {
      var offsetX, content;

      this._initDrag();

      var scrollLeft = parseFloat(this.el.style.webkitTransform.replace('translate3d(', '').split(',')[0]) || 0;
      var scrollTop = parseFloat(this.el.style.webkitTransform.replace('translate3d(', '').split(',')[1]) || 0;

      var totalWidth = this.el.scrollWidth;
      var totalHeight = this.el.scrollHeight;
      var parentWidth = this.el.parentNode.offsetWidth;
      var parentHeight = this.el.parentNode.offsetHeight;

      var maxX = Math.min(0, (-totalWidth + parentWidth));
      var maxY = Math.min(0, (-totalHeight + parentHeight));

      // Check if we even have enough content to scroll, if not, don't start the drag
      if((this.isHorizontalEnabled && maxX == 0) || (this.isVerticalEnabled && maxY == 0)) {
        return;
      }

      this.x = scrollLeft;
      this.y = scrollTop;

      this._drag = {
        direction: 'v',
        pointX: e.gesture.touches[0].pageX,
        pointY: e.gesture.touches[0].pageY,
        startX: scrollLeft,
        startY: scrollTop,
        resist: 1,
        startTime: Date.now()
      };
    },



    /**
     * Process the drag event to move the item to the left or right.
     *
     * This function needs to be as fast as possible to make sure scrolling
     * performance is high.
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
        if(!_this._drag) { return; }
      }

      // Stop any default events during the drag
      e.preventDefault();

      var px = e.gesture.touches[0].pageX;
      var py = e.gesture.touches[0].pageY;

      var deltaX = px - _this._drag.pointX;
      var deltaY = py - _this._drag.pointY;

      _this._drag.pointX = px;
      _this._drag.pointY = py;

      // Check if we should start dragging. Check if we've dragged past the threshold.
      if(!_this._isDragging && 
          ((Math.abs(e.gesture.deltaY) > _this.dragThreshold) ||
          (Math.abs(e.gesture.deltaX) > _this.dragThreshold))) {
        _this._isDragging = true;
      }

      if(_this._isDragging) {
        var drag = _this._drag;

        // Request an animation frame to batch DOM reads/writes
        window.requestAnimationFrame(function() {
          // We are dragging, grab the current content height

          var totalWidth = _this.el.scrollWidth;
          var totalHeight = _this.el.scrollHeight;
          var parentWidth = _this.el.parentNode.offsetWidth;
          var parentHeight = _this.el.parentNode.offsetHeight;
          var maxX = Math.min(0, (-totalWidth + parentWidth));
          var maxY = Math.min(0, (-totalHeight + parentHeight));

          // Grab current timestamp to keep our speend, etc.
          // calculations in a window
          var timestamp = Date.now();

          // Calculate the new Y point for the container
          // TODO: Only enable certain axes
          var newX = _this.x + deltaX;
          var newY = _this.y + deltaY;

          if(newX > 0 || (-newX + parentWidth) > totalWidth) {
            // Rubber band
            newX = _this.x + deltaX / 3;
          }
          // Check if the dragging is beyond the bottom or top
          if(newY > 0 || (-newY + parentHeight) > totalHeight) {
            // Rubber band
            newY = _this.y + deltaY / 3;//(-_this.resistance);
          }

          if(!_this.isHorizontalEnabled) {
            newX = 0;
          }
          if(!_this.isVerticalEnabled) {
            newY = 0;
          }

          // Update the new translated Y point of the container
          _this.el.style.webkitTransform = 'translate3d(' + newX + 'px,' + newY + 'px, 0)';

          // Store the last points
          _this.x = newX;
          _this.y = newY;

          // Check if we need to reset the drag initial states if we've
          // been dragging for a bit
          if(timestamp - drag.startTime > 300) {
            drag.startTime = timestamp;
            drag.startX = _this.x;
            drag.startY = _this.y;
          }

          _this.didScroll && _this.didScroll({
            target: _this.el,
            scrollLeft: -newX,
            scrollTop: -newY
          });

          // Trigger a scroll event
          ionic.trigger(_this.scrollEventName, {
            target: _this.el,
            scrollLeft: -newX,
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
      window.requestAnimationFrame(function() {

        var drag = _this._drag;

        // Calculate the viewport height and the height of the content
        var totalWidth = _this.el.scrollWidth;
        var totalHeight = _this.el.scrollHeight;

        // The parent bounding box helps us figure max/min scroll amounts
        var parentWidth = _this.el.parentNode.offsetWidth;
        var parentHeight = _this.el.parentNode.offsetHeight;

        // Calculate how long we've been dragging for, with a max of 300ms
        var duration = Date.now() - _this._drag.startTime;
        var time = 0;
        var easing = '';

        var newX = Math.round(_this.x);
        var newY = Math.round(_this.y);

        _this.scrollTo(newX, newY);


        // Check if we just snap back to bounds
        if(_this.wrapScrollPosition(_this.bounceTime)) {
          return;
        }

        // If the duration is within reasonable bounds, enable momentum scrolling so we
        // can "slide" to a finishing point
        if(duration < 300) {
          var momentumX = _this._getMomentum(_this.x, drag.startX, duration, parentWidth - totalWidth, parentWidth);
          var momentumY = _this._getMomentum(_this.y, drag.startY, duration, parentHeight - totalHeight, parentHeight);
          //var newX = momentumX.destination;
          newX = momentumX.destination;
          newY = momentumY.destination;

          // Calculate the longest required time for the momentum animation and
          // use that.
          time = Math.max(momentumX.duration, momentumY.duration);
        }
        
        // If we've moved, we will need to scroll
        if(newX != _this.x || newY != _this.y) {
          // If the end position is out of bounds, change the function we use for easing
          // to get a different animation for the rubber banding
          if ( newX > 0 || newX < (-totalWidth + parentWidth) || newY > 0 || newY < (-totalHeight + parentHeight)) {
            easing = EASING_FUNCTIONS.bounce;
          }

          _this.scrollTo(newX, newY, time, easing);
        } else {
          // We are done
          _this._doneScrolling();
        }
      });
    },

    _doneScrolling: function() {
      this.didStopScrolling && this.didStopScrolling({
        target: this.el,
        scrollLeft: this.x,
        scrollTop: this.y
      });
      ionic.trigger(this.scrollEndEventName, {
        target: this.el,
        scrollLeft: this.x,
        scrollTop: this.y
      });
    }
  }, {
    DECEL_RATE_NORMAL: 0.998,
    DECEL_RATE_FAST: 0.99,
    DECEL_RATE_SLOW: 0.996,
  });

})(ionic);
