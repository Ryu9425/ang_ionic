(function() {
'use strict';

angular.module('ionic.ui.list', ['ngAnimate'])

.directive('listItem', function() {
  return {
    restrict: 'E',
    require: '^list',
    replace: true,
    transclude: true,
    scope: {
      item: '=',
      onSelect: '&',
      onDelete: '&',
      canDelete: '@',
      canReorder: '@',
      canSwipe: '@',
      buttons: '=',
    },
    template: '<a href="#" class="item item-slider">\
            <div class="item-content slide-left" ng-transclude>\
            </div>\
            <div class="item-options" ng-if="canSwipe && !isEditing">\
             <button ng-click="buttonClicked(button)" class="button" ng-class="button.type" ng-repeat="button in buttons">{{button.text}}</button>\
           </div>\
          </a>',

    /*
    template:   '<li class="list-item">\
                   <div class="list-item-edit" ng-if="canDelete && isEditing">\
                     <button class="button button-icon" ng-click="onDelete()"><i ng-class="deleteIcon"></i></button>\
                   </div>\
                   <div class="list-item-content" ng-transclude>\
                   </div>\
                   <div class="list-item-drag" ng-if="canReorder && isEditing">\
                     <button data-ionic-action="reorder" class="button button-icon"><i ng-class="reorderIcon"></i></button>\
                   </div>\
                   <div class="list-item-buttons" ng-if="canSwipe && !isEditing">\
                     <button ng-click="buttonClicked(button)" class="button" ng-class="button.type" ng-repeat="button in buttons">{{button.text}}</button>\
                   </div>\
                </li>',*/
    link: function($scope, $element, $attr, list) {
      $scope.isEditing = false;
      $scope.deleteIcon = list.scope.deleteIcon;
      $scope.reorderIcon = list.scope.reorderIcon;

      $scope.buttonClicked = function(button) {
        button.onButtonClicked && button.onButtonClicked($scope.item, button);
      };

      list.scope.$watch('isEditing', function(v) {
        $scope.isEditing = v;
      });
    }
  };
})

.directive('list', function() {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,

    scope: {
      isEditing: '=',
      deleteIcon: '@',
      reorderIcon: '@'
    },

    // So we can require being under this
    controller: function($scope) {
      var _this = this;

      this.scope = $scope;

      $scope.$watch('isEditing', function(v) {
        _this.isEditing = true;
      });
    },

    template: '<ul class="list" ng-class="{\'list-editing\': isEditing}" ng-transclude>\
              </ul>',

    compile: function(element, attr, transclude) {
      return function($scope, $element, $attr) {
        var lv = new ionic.views.List({el: $element[0]});

        if(attr.animation) {
          $element.addClass(attr.animation);
        }
      };
    }
  };
});

})();
