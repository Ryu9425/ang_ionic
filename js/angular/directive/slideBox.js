/**
 * @ngdoc directive
 * @name ionSlideBox
 * @module ionic
 * @delegate ionic.service:$ionicSlideBoxDelegate
 * @restrict E
 * @description
 * The Slide Box is a multi-page container where each page can be swiped or dragged between:
 *
 * ![SlideBox](http://ionicframework.com.s3.amazonaws.com/docs/controllers/slideBox.gif)
 *
 * Note: The slideBox will always take up all of the space within its parent scroll
 * container. If you wish to have a smaller slidebox, create a custom-sized parent
 * <ion-scroll> element.
 *
 * @usage
 * ```html
 * <ion-content>
 *   <ion-slide-box on-slide-changed="slideHasChanged($index)"
 *     loop="shouldLoop"
 *     auto-play="3000">
 *     <ion-slide>
 *       <div class="box blue"><h1>BLUE</h1></div>
 *     </ion-slide>
 *     <ion-slide>
 *       <div class="box yellow"><h1>YELLOW</h1></div>
 *     </ion-slide>
 *     <ion-slide>
 *       <div class="box pink"><h1>PINK</h1></div>
 *     </ion-slide>
 *   </ion-slide-box>
 * </ion-content>
 * ```
 *
 * @param {expression=} selected A model bound to the selected slide index.
 * with {@link ionic.service:$ionicSlideBoxDelegate}.
 * @param {boolean=} loop Whether the slide box should loop. Default false.
 * @param {number=} auto-play If a positive number, then every time the given number of milliseconds have passed, slideBox will go to the next slide. Set to a non-positive number to disable. Default: -1.
 * @param {expression=} on-slide-changed Expression called whenever the slide is changed.  Is passed an '$index' variable.
 * @param {string=} delegate-handle The handle used to identify this slideBox with
 * {@link ionic.service:$ionicSlideBoxDelegate}.
 */
IonicModule
.directive('ionSlideBox', [
  '$ionicSlideBoxDelegate',
  '$window',
function($ionicSlideBoxDelegate, $window) {

  return {
    restrict: 'E',
    controller: '$ionSlideBox',
    require: ['ionSlideBox', '^$ionicScroll'],
    transclude: true,
    scope: {
      selectedIndex: '=?selected',
      onSlideChanged: '&'
    },
    template: '<div class="slider-slides" ng-transclude></div>',
    compile: compile
  };

  function compile(element, attr) {
    // DEPRECATED attr.doesContinue
    isDefined(attr.doesContinue) && attr.$set('loop', attr.doesContinue);

    return postLink;
  }

  function postLink(scope, element, attr, ctrls) {
    var slideBoxCtrl = ctrls[0];
    var scrollCtrl = ctrls[1];

    element.addClass('slider');

    var deregister = $ionicSlideBoxDelegate._registerInstance(slideBoxCtrl, attr.delegateHandle);
    scope.$on('$destroy', deregister);

    isDefined(attr.loop) && watchLoop();
    isDefined(attr.selected) && watchSelected();
    isDefined(attr.autoPlay) && watchAutoPlay();

    var throttledReposition = ionic.animationFrameThrottle(repositionSlideBox);
    throttledReposition();

    var oldScrollingY = scrollCtrl.scrollView.options.scrollingY;
    scrollCtrl.scrollView.options.scrollingY = false;

    angular.element($window).on('resize', throttledReposition);
    scope.$on('$destroy', function() {
      angular.element($window).off('resize', throttledReposition);
      scrollCtrl.scrollView.options.scrollingY = oldScrollingY;
    });

    // ***
    // Methods
    // ***

    // There is no way to make the slidebox stretch to a large enough size
    // when its children are all position: absolute elements.
    // We just make it so the slidebox is *always* as large as its parent scroll
    // container.
    function repositionSlideBox() {
      element.css({
        width: scrollCtrl.$element.prop('offsetWidth') + 'px',
        height: scrollCtrl.$element.prop('offsetHeight') + 'px'
      });
    }

    function watchLoop() {
      var unwatchParent = scope.$parent.$watch(attr.loop, slideBoxCtrl.loop);
      scope.$on('$destroy', unwatchParent);
    }

    function watchSelected() {
      scope.$watch('selectedIndex', function selectedAttrWatchAction(newIndex) {
        if (slideBoxCtrl.isInRange(newIndex) &&
            slideBoxCtrl.selected() !== newIndex) {
          slideBoxCtrl.select(newIndex);
        }
      });
      scope.$watch(slideBoxCtrl.selected, function shownWatchAction(newIndex) {
        scope.selectedIndex = newIndex;
        scope.onSlideChanged({
          $index: newIndex
        });
      });
    }

    function watchAutoPlay() {
      var unwatchParent = scope.$parent.$watch(attr.autoPlay, slideBoxCtrl.autoPlay);
      scope.$on('$destroy', unwatchParent);
    }
  }

}]);


