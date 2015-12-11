import {Platform} from './platform';
import {windowLoad} from '../util/dom';


Platform.register({
  name: 'core',
  settings: {
    mode: 'ios',
    keyboardHeight: 290,
  }
});
Platform.setDefault('core');


Platform.register({
  name: 'mobile'
});


Platform.register({
  name: 'phablet',
  isMatch(p) {
    let smallest = Math.min(p.width(), p.height());
    let largest = Math.max(p.width(), p.height());
    return (smallest > 390 && smallest < 520) &&
           (largest > 620 && largest < 800);
  }
});


Platform.register({
  name: 'tablet',
  isMatch(p) {
    let smallest = Math.min(p.width(), p.height());
    let largest = Math.max(p.width(), p.height());
    return (smallest > 460 && smallest < 820) &&
           (largest > 780 && largest < 1400);
  }
});


Platform.register({
  name: 'android',
  superset: 'mobile',
  subsets: [
    'phablet',
    'tablet'
  ],
  settings: {
    activator: function(p) {
      // md mode defaults to use ripple activator
      // however, under-powered devices shouldn't use ripple
      // if this a linux device, and is using Android Chrome v36 (Android 5.0)
      // or above then use ripple, otherwise do not use a ripple effect
      if (p.testNavigatorPlatform('linux')) {
        let chromeVersion = p.matchUserAgentVersion(/Chrome\/(\d+).(\d+)?/);
        if (chromeVersion) {
          // linux android device using modern android chrome browser gets ripple
          return (parseInt(chromeVersion.major, 10) < 36 ? 'none' : 'ripple');
        }
        // linux android device not using chrome browser checks just android's version
        if (p.version().major < 5) {
          return 'none';
        }
      }

      // fallback to always use ripple
      return 'ripple';
    },
    hoverCSS: false,
    keyboardHeight: 300,
    mode: 'md',
    scrollAssist: true,
  },
  isMatch(p) {
    return p.isPlatform('android', 'android|silk');
  },
  versionParser(p) {
    return p.matchUserAgentVersion(/Android (\d+).(\d+)?/);
  }
});



Platform.register({
  name: 'ios',
  superset: 'mobile',
  subsets: [
    'ipad',
    'iphone'
  ],
  settings: {
    clickBlock: true,
    hoverCSS: false,
    keyboardHeight: 300,
    mode: 'ios',
    scrollAssist: isIOSDevice,
    swipeBackEnabled: isIOSDevice,
    swipeBackThreshold: 40,
    tapPolyfill: isIOSDevice,
  },
  isMatch(p) {
    return p.isPlatform('ios', 'iphone|ipad|ipod');
  },
  versionParser(p) {
    return p.matchUserAgentVersion(/OS (\d+)_(\d+)?/);
  }
});


Platform.register({
  name: 'ipad',
  superset: 'tablet',
  settings: {
    keyboardHeight: 500,
  },
  isMatch(p) {
    return p.isPlatform('ipad');
  }
});


Platform.register({
  name: 'iphone',
  subsets: [
    'phablet'
  ],
  isMatch(p) {
    return p.isPlatform('iphone');
  }
});


Platform.register({
  name: 'windowsphone',
  superset: 'mobile',
  subsets: [
    'phablet',
    'tablet'
  ],
  settings: {
    mode: 'md',
  },
  isMatch(p) {
    return p.isPlatform('windowsphone', 'windows phone');
  },
  versionParser(p) {
    return p.matchUserAgentVersion(/Windows Phone (\d+).(\d+)?/);
  }
});


Platform.register({
  name: 'cordova',
  isEngine: true,
  methods: {
    ready: function(resolve) {
      function isReady() {
        document.removeEventListener('deviceready', isReady);
        resolve();
      }
      windowLoad(function() {
        document.addEventListener('deviceready', isReady);
      });
    }
  },
  isMatch() {
    return !!(window.cordova || window.PhoneGap || window.phonegap);
  }
});


function isIOSDevice(p) {
  // shortcut function to be reused internally
  // checks navigator.platform to see if it's an actual iOS device
  // this does not use the user-agent string because it is often spoofed
  // an actual iPad will return true, a chrome dev tools iPad will return false
  return p.testNavigatorPlatform('iphone|ipad|ipod');
}
