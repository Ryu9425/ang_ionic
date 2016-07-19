import { Animation } from '../animations/animation';
import { PageTransition } from './page-transition';
import { TransitionOptions } from './transition';
import { ViewController } from '../components/nav/view-controller';

const TRANSLATEY = 'translateY';
const OFF_BOTTOM = '40px';
const CENTER = '0px';
const SHOW_BACK_BTN_CSS = 'show-back-button';


class MDTransition extends PageTransition {

  constructor(enteringView: ViewController, leavingView: ViewController, opts: TransitionOptions) {
    super(enteringView, leavingView, opts);

    // what direction is the transition going
    let backDirection = (opts.direction === 'back');

    // do they have navbars?
    let enteringHasNavbar = enteringView.hasNavbar();
    let leavingHasNavbar = leavingView && leavingView.hasNavbar();

    if (backDirection) {
      this.duration(opts.duration || 200).easing('cubic-bezier(0.47,0,0.745,0.715)');
      this.enteringPage.before.clearStyles([TRANSLATEY]);

    } else {
      this.duration(opts.duration || 280).easing('cubic-bezier(0.36,0.66,0.04,1)');
      this.enteringPage
        .fromTo(TRANSLATEY, OFF_BOTTOM, CENTER, true)
        .fromTo('opacity', 0.01, 1, true);
    }

    if (enteringHasNavbar) {
      let enteringNavBar = new Animation(enteringView.navbarRef());
      enteringNavBar.before.addClass('show-navbar');
      this.add(enteringNavBar);

      let enteringBackButton = new Animation(enteringView.backBtnRef());
      this.add(enteringBackButton);
      if (enteringView.enableBack()) {
        enteringBackButton.before.addClass(SHOW_BACK_BTN_CSS);
      } else {
        enteringBackButton.before.removeClass(SHOW_BACK_BTN_CSS);
      }
    }

    // setup leaving view
    if (leavingView && backDirection) {
      // leaving content
      this.duration(opts.duration || 200).easing('cubic-bezier(0.47,0,0.745,0.715)');
      let leavingPage = new Animation(leavingView.pageRef());
      this.add(leavingPage.fromTo(TRANSLATEY, CENTER, OFF_BOTTOM).fromTo('opacity', 0.99, 0));
    }

  }

}

PageTransition.register('md-transition', MDTransition);
