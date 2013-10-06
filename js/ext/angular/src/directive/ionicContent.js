angular.module('ionic.ui.content', [])

// The content directive is a core scrollable content area
// that is part of many View hierarchies
.directive('content', function() {
  return {
    restrict: 'E',
    replace: true,
    template: '<div class="content-wrapper"><div class="content"></div></div>',
    transclude: true,
    compile: function(element, attr, transclude) {
      return function($scope, $element, $attr) {
        var c = $element.children().eq(0);

        c.addClass('content');

        if(attr.hasHeader) {
          c.addClass('has-header');
        }
        if(attr.hasTabs) {
          c.addClass('has-tabs');
        }
        c.append(transclude($scope));
      }
    }
  }
})
