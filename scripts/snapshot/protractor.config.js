
var buildConfig = require('../build/config');
var path = require('canonical-path');
var projectRoot = path.resolve(__dirname, '../..');

exports.config = {

  // Spec patterns are relative to the location of the spec file. They may
  // include glob patterns.
  specs: [
    path.resolve(projectRoot, 'dist/e2e/**/*e2e.js'),
  ],

  // Options to be passed to Jasmine-node.
  jasmineNodeOpts: {
    showColors: true, // Use colors in the command line report.
    defaultTimeoutInterval: 120000,
    isVerbose: true
  },

  baseUrl: 'http://localhost:' + buildConfig.protractorPort,

  onPrepare: function() {
    beforeEach(function() {
      patchProtractorWait(global.browser);
    });

    var snapshotConfig = require('./snapshot.config').config;
    var ionicSnapshot = require('./ionic.snapshot');
    ionicSnapshot(snapshotConfig);
  }

};

// From https://github.com/angular/angular/blob/master/protractor-shared.js
// Disable waiting for Angular as we don't have an integration layer yet...
// TODO remove this once protractor supports angular2
function patchProtractorWait(browser) {
  browser.ignoreSynchronization = true;
  var _get = browser.get;
  var sleepInterval = process.env.TRAVIS || process.env.JENKINS_URL ? 7000 : 3000;
  browser.get = function() {
    var result = _get.apply(this, arguments);
    browser.sleep(sleepInterval);
    return result;
  }
}
