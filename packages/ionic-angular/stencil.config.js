exports.config = {
  namespace: 'IonicAngular',
  buildDir: 'dist',
  publicPath: '/dist',
  bundles: [
    { components: ['ion-badge'] }
  ],
  collections: [
    { name: '@ionic/core', includeBundledOnly: true }
  ],
  preamble: '(C) Ionic http://ionicframework.com - MIT License'
};

exports.devServer = {
  watchGlob: ['demos/**/*', '/dist/***/*', 'src/**/*.html']
}
