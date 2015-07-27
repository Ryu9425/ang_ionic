
exports.config = {

  groupId: 'ionic2',

  appId: 'snapshots',

  domain: 'ionic-snapshot-go.appspot.com',
  //domain: 'localhost:8080',

  specs: 'dist/e2e/**/*e2e.js',
  //specs: 'dist/e2e/nav/basic/*e2e.js',

  sleepBetweenSpecs: 1200,

  platformDefauls: {
    browser: 'chrome',
    platform: 'linux',
    params: {
      platform_id: 'chrome_local',
      platform_index: 0,
      platform_count: 1,
      width: 400,
      height: 760
    }
  },

  accessKey: process.env.IONIC_SNAPSHOT_KEY

};
