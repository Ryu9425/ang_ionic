
/**
 * @ngdoc directive
 * @name ionSlides
 * @module ionic
 * @delegate ionic.service:$ionicSlideBoxDelegate
 * @restrict E
 * @description
 * The Slides component is a powerful multi-page container where each page can be swiped or dragged between.
 *
 * Note: this is a new version of the Ionic Slide Box based on the [Swiper](http://www.idangero.us/swiper/#.Vmc1J-ODFBc) widget from
 * [idangerous](http://www.idangero.us/).
 *
 * ![SlideBox](http://ionicframework.com.s3.amazonaws.com/docs/controllers/slideBox.gif)
 *
 * @usage
 * ```html
 * <ion-slides  options="options" slider="data.slider">
 *   <ion-slide-page>
 *     <div class="box blue"><h1>BLUE</h1></div>
 *   </ion-slide-page>
 *   <ion-slide-page>
 *     <div class="box yellow"><h1>YELLOW</h1></div>
 *   </ion-slide-page>
 *   <ion-slide-page>
 *     <div class="box pink"><h1>PINK</h1></div>
 *   </ion-slide-page>
 * </ion-slides>
 * ```
 *
 * ```js
 * $scope.options = {
 *   loop: false,
 *   effect: fade,
 *   speed: 500,
 * }
 * $scope.data = {};
 * $scope.$watch('data.slider', function(nv, ov) {
 *   $scope.slider = $scope.data.slider;
 * })
 * ```
 *
 */
IonicModule
.directive('ionSlides', [
  '$animate',
  '$timeout',
  '$compile',
function($animate, $timeout, $compile) {
  return {
    restrict: 'E',
    transclude: true,
    scope: {
      options: '=',
      slider: '='
    },
    template: '<div class="swiper-container">' +
      '<div class="swiper-wrapper" ng-transclude>' +
      '</div>' +
        '<div ng-hide="!showPager" class="swiper-pagination"></div>' +
      '</div>',
    controller: ['$scope', '$element', function($scope, $element) {
      var _this = this;

      this.update = function() {
        $timeout(function() {
          if (!_this.__slider) {
            return;
          }

          _this.__slider.update();
          if (_this._options.loop) {
            _this.__slider.createLoop();
          }

          var slidesLength = _this.__slider.slides.length;

          // Don't allow pager to show with > 10 slides
          if (slidesLength > 10) {
            $scope.showPager = false;
          }

          // When slide index is greater than total then slide to last index
          if (_this.__slider.activeIndex > slidesLength - 1) {
            _this.__slider.slideTo(slidesLength - 1);
          }
        });
      };

      this.rapidUpdate = ionic.debounce(function() {
        _this.update();
      }, 50);

      this.getSlider = function() {
        return _this.__slider;
      };

      var options = $scope.options || {};

      var newOptions = angular.extend({
        pagination: '.swiper-pagination',
        paginationClickable: true,
        lazyLoading: true,
        preloadImages: false
      }, options);

      this._options = newOptions;

      $timeout(function() {
        var slider = new ionic.views.Swiper($element.children()[0], newOptions, $scope, $compile);

        _this.__slider = slider;
        $scope.slider = _this.__slider;

        $scope.$on('$destroy', function() {
          slider.destroy();
          _this.__slider = null;
        });
      });

    }],


    link: function($scope) {
      $scope.showPager = true;
      // Disable ngAnimate for slidebox and its children
      //$animate.enabled(false, $element);
    }
  };
}])
.directive('ionSlidePage', [function() {
  return {
    restrict: 'E',
    require: '?^ionSlides',
    transclude: true,
    replace: true,
    template: '<div class="swiper-slide" ng-transclude></div>',
    link: function($scope, $element, $attr, ionSlidesCtrl) {
      ionSlidesCtrl.rapidUpdate();

      $scope.$on('$destroy', function() {
        ionSlidesCtrl.rapidUpdate();
      });
    }
  };
}]);
