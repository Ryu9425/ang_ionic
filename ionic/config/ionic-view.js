import {coreDirectives} from 'angular2/angular2';

import {View} from 'angular2/src/core/annotations_impl/view';

import {
  Aside, Content, Refresher,
  Slides, Slide, SlidePager,
  Tabs, Tab,
  List, Item,
  Icon,
  Checkbox, Switch, Label, Input, Segment, SegmentButton, SegmentControlValueAccessor,
  RadioGroup, RadioButton, SearchBar,
  Nav, NavbarTemplate, Navbar, NavPush, NavPop
} from 'ionic/ionic';


export class IonicView extends View {
  constructor(config) {
    let directives = [

      // Angular
      coreDirectives,

      // Content
      Aside, Content, Refresher,
      List, Item,
      Slides, Slide, SlidePager,
      Tabs, Tab,

      // Media
      Icon,

      // Form elements
      Segment, SegmentButton, SegmentControlValueAccessor,
      //Checkbox, Switch, Label, Input
      //RadioGroup, RadioButton, SearchBar,

      // Nav
      Nav, NavbarTemplate, Navbar, NavPush, NavPop
    ];

    config.directives = (config.directives || []).concat(directives);
    super(config);
  }
}
