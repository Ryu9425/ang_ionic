var buildConfig = require('./scripts/build/config');
var gulp = require('gulp');
var path = require('path');
var argv = require('yargs').argv;
var del = require('del');
var rename = require('gulp-rename');
var through2 = require('through2');
var runSequence = require('run-sequence');
var watch = require('gulp-watch');
var babel = require('gulp-babel');
var tsc = require('gulp-typescript');
var cache = require('gulp-cached');
var minimist = require('minimist');

function getBabelOptions(moduleName, moduleType) {
  return {
    optional: ['es7.decorators'],
    modules: moduleType || "system",
    moduleIds: true,
    getModuleId: function(name) {
      if (moduleName == "e2e"){
        return name.replace(/^.*\/test\/[^\/]*\//, '');
      }
      else if (moduleName == "demos"){
        return name.replace(/^(.*?)\//, '')
      }

      return moduleName + '/' + name.split('/test').join('');
    }
  }
}

var tscOptions = {
  target: 'ES6',
  allowNonTsExtensions: true,
  isolatedModules: true,
  emitDecoratorMetadata: true,
  experimentalDecorators: true,
  noEmitOnError: false,  // ignore errors
  rootDir: '.'
}
var tscReporter = {
  error: function (error) {
    console.error(error.message);
  }
};

var flagConfig = {
  string: ['port', 'version', 'ngVersion', 'animations'],
  alias: {'p': 'port', 'v': 'version', 'a': 'ngVersion'},
  default: { port: 8000 }
};

var flags = minimist(process.argv.slice(2), flagConfig);

gulp.task('build', function(done) {
  runSequence(
    'bundle',
    'e2e',
    'demos',
    'sass',
    'fonts',
    done
  );
})

gulp.task('clean.build', function(done) {
  runSequence('clean', 'build', done);
})

gulp.task('watch', function(done) {
  runSequence(
    'build',
    'serve',
    function() {
      watch([
          'ionic/**/*.ts',
          '!ionic/components/*/test/**/*',
          '!ionic/util/test/*'
        ],
        function(file) {
          if (file.event === "unlink") {
            var basePath = file.base.substring(0, file.base.lastIndexOf("ionic/"));
            var relPath = file.history[0].replace(basePath, "").replace(".ts", ".js");

            var es6Path = basePath + "dist/src/es6/" + relPath;
            var commonPath = basePath + "dist/src/es5/common/" + relPath;
            var systemPath = basePath + "dist/src/es5/system/" + relPath;

            delete cache.caches.transpile[file.history[0]];

            del([es6Path, commonPath, systemPath], function(){
              gulp.start('bundle');
            });
          } else {
            gulp.start('bundle');
          }
        }
      );

      watch('ionic/components/*/test/**/*', function(file) {
        if (file.event === "unlink") {
          var paths = file.history[0].split("ionic/components/");
          var basePath = paths[0],
              relPath = paths[1].split("/test").join("").replace(".ts", ".js");

          var distPath = basePath + "dist/e2e/" + relPath;

          delete cache.caches.e2e[file.history[0]];

          del([distPath], function(){
            gulp.start('e2e');
          });
        } else {
          gulp.start('e2e');
        }
      });

      watch('ionic/**/*.scss', function() {
        gulp.start('sass');
      });

      done();
    }
  );
});

gulp.task('serve', function() {
  var connect = require('gulp-connect');
  connect.server({
    root: 'dist',
    port: flags.port,
    livereload: false
  });
});

gulp.task('clean', function(done) {
  del(['dist/**', '!dist', '!dist/ionic-site', '!dist/ionic-site/**/*'], done);
});

function transpile(moduleType) {
  var stream = gulp.src([
      'ionic/**/*.ts',
      '!ionic/components/*/test/**/*',
      '!ionic/util/test/*'
    ])
   .pipe(cache('transpile', { optimizeMemory: true }))
   .pipe(tsc(tscOptions, null, tscReporter))
   .on('error', function(error) {
     stream.emit('end');
   })
   .pipe(gulp.dest('dist/src/es6/ionic'))
   .pipe(babel(getBabelOptions('ionic', moduleType)))
   .on('error', function (err) {
     console.log("ERROR: " + err.message);
     this.emit('end');
   })
   .pipe(gulp.dest('dist/src/es5/' + moduleType + '/ionic'))

  return stream;
}

gulp.task('transpile.system', function() { return transpile("system"); });
gulp.task('transpile.common', function() {
  // necessary for publish task, remove if we ever do incremental builds with cjs
  cache.caches && delete cache.caches.transpile;
  return transpile("common");
});
gulp.task('transpile', ['transpile.system']);

gulp.task('bundle.ionic', ['transpile'], function() {
  var insert = require('gulp-insert');
  var concat = require('gulp-concat');

  var prepend = [];

  // force the web animations api polyfill to kick in
  if (flags.animations == 'polyfill') {
    prepend.push('window.Element.prototype.animate=undefined;');
  }

  // prepend correct system paths
  prepend.push('System.config({ "paths": { "ionic/*": "ionic/*", "rx": "rx" } });');

  return gulp.src([
      'dist/src/es5/system/ionic/**/*.js'
    ])
    .pipe(concat('ionic.js'))
    .pipe(insert.prepend(prepend.join('\n')))
    .pipe(gulp.dest('dist/js/'));
    //TODO minify + sourcemaps
});

gulp.task('bundle', ['bundle.ionic'], function() {
  var concat = require('gulp-concat');

  return gulp.src(buildConfig.scripts)
    .pipe(concat('ionic.bundle.js'))
    .pipe(gulp.dest('dist/js'));
})

gulp.task('tests', function() {
  return gulp.src('ionic/**/test/**/*.spec.ts')
    .pipe(tsc(tscOptions, null, tscReporter))
    .pipe(babel(getBabelOptions('dist/tests')))
    .pipe(rename(function(file) {
      var regex = new RegExp(path.sep + 'test(' + path.sep + '|$)');
      file.dirname = file.dirname.replace(regex, path.sep);
    }))
    .pipe(gulp.dest('dist/tests'))
})

gulp.task('e2e', function() {
  var gulpif = require('gulp-if');
  var lazypipe = require('lazypipe');
  var _ = require('lodash');
  var fs = require('fs');
  var VinylFile = require('vinyl');

  var buildTest = lazypipe()
             //.pipe(traceur, traceurOptions)
             .pipe(tsc, tscOptions, null, tscReporter)
             .pipe(babel, getBabelOptions('e2e'))

  var buildE2ETest = lazypipe()
             //.pipe(traceur, traceurOptions)
             .pipe(tsc, tscOptions, null, tscReporter)
             .pipe(babel)

  var indexTemplate = _.template(
   fs.readFileSync('scripts/e2e/e2e.template.html')
  )({
   buildConfig: buildConfig

  })
  var testTemplate = _.template( fs.readFileSync('scripts/e2e/e2e.template.js') )

  var platforms = [
    'android',
    'ios',
  ];

  // Get each test folder with gulp.src
  return gulp.src(['ionic/components/*/test/*/**/*', '!ionic/components/*/test/*/**/*.spec.ts'])
    .pipe(cache('e2e', { optimizeMemory: true }))
    .pipe(gulpif(/e2e.ts$/, buildE2ETest()))
    .pipe(gulpif(/.ts$/, buildTest()))
    .on('error', function (err) {
      console.log("ERROR: " + err.message);
      this.emit('end');
    })
    .pipe(gulpif(/index.js$/, createIndexHTML())) //TSC changes .ts to .js
    .pipe(rename(function(file) {
      file.dirname = file.dirname.replace(path.sep + 'test' + path.sep, path.sep)
    }))
    .pipe(gulpif(/e2e.js$/, createPlatformTests()))
    .pipe(gulp.dest('dist/e2e/'))

  function createIndexHTML() {
    return through2.obj(function(file, enc, next) {
      this.push(new VinylFile({
        base: file.base,
        contents: new Buffer(indexTemplate),
        path: path.join(path.dirname(file.path), 'index.html'),
      }));
      next(null, file);
    });
  }

  function createPlatformTests(file) {
    return through2.obj(function(file, enc, next) {
      var self = this
      var relativePath = path.dirname(file.path.replace(/^.*?ionic(\/|\\)components(\/|\\)/, ''))
      var contents = file.contents.toString()
      platforms.forEach(function(platform) {
        var platformContents = testTemplate({
          contents: contents,
          buildConfig: buildConfig,
          relativePath: relativePath,
          platform: platform
        })
        self.push(new VinylFile({
          base: file.base,
          contents: new Buffer(platformContents),
          path: file.path.replace(/e2e.js$/, platform + '.e2e.js')
        }))
      })
      next()
    })
  }
});

gulp.task('sass', function() {
  var sass = require('gulp-sass');
  var autoprefixer = require('gulp-autoprefixer');
  return gulp.src('ionic/ionic.scss')
    .pipe(sass()
      .on('error', sass.logError)
    )
    .pipe(autoprefixer(buildConfig.autoprefixer))
    .pipe(gulp.dest('dist/css/'));
});

gulp.task('fonts', function() {
  return gulp.src(['ionic/fonts/**/*.ttf', 'ionic/fonts/**/*.woff'])
    .pipe(gulp.dest('dist/fonts'));
});

require('./scripts/snapshot/snapshot.task')(gulp, argv, buildConfig);

gulp.task('karma', ['tests'], function() {
  var karma = require('karma').server;
  return karma.start({ configFile: __dirname + '/scripts/karma/karma.conf.js' })
});

gulp.task('karma-watch', function() {
  var karma = require('karma').server;
  return karma.start({ configFile: __dirname + '/scripts/karma/karma-watch.conf.js' })
});

gulp.task('docs', ['docs.demos'], function() {
  var Dgeni = require('dgeni');
  var semver = require('semver');

  var docVersion = flags['doc-version'] || 'nightly';
  if (docVersion != 'nightly' && !semver.valid(docVersion)) {
    console.log('Usage: gulp docs --doc-version=(nightly|versionName)\nversionName must be a valid semver version.');
    return process.exit(1);
  }
  try {
    var ionicPackage = require('./scripts/docs/dgeni-config')(docVersion);
    var dgeni = new Dgeni([ionicPackage]);
    return dgeni.generate();
  } catch (err) {
    console.log(err.stack);
  }
});

gulp.task('docs.demos', ['demos', 'bundle', 'sass', 'fonts'], function(){
  return gulp.src([
      'dist/**',
      '!dist/e2e',
      '!dist/e2e/**/*',
      '!dist/ionic-site',
      '!dist/ionic-site/**/*',
      '!dist/src',
      '!dist/src/**/*'
    ])
    .pipe(gulp.dest('dist/ionic-site/docs/v2/dist'));
})

gulp.task('copy.ts', function() {
  return gulp.src([
      'ionic/**/*.ts',
      '!ionic/components/*/test/**/*',
      '!ionic/util/test/*'
    ])
    .pipe(gulp.dest('dist/src/typescript'));
})

gulp.task('copy.scss', function() {
  return gulp.src([
      'ionic/**/*.scss',
      '!ionic/components/*/test/**/*',
      '!ionic/util/test/*'
    ])
    .pipe(gulp.dest('dist/src/scss'));
})

gulp.task('src', function(done){
  runSequence(
    'clean',
    ['bundle', 'sass', 'fonts', 'copy.ts', 'copy.scss'],
    'transpile.common',
    done
  );
})

gulp.task('demos', function(){
  var gulpif = require('gulp-if');
  var lazypipe = require('lazypipe');
  var _ = require('lodash');
  var fs = require('fs');
  var VinylFile = require('vinyl');

  var buildTest = lazypipe()
    .pipe(tsc, tscOptions, null, tscReporter)
    .pipe(babel, getBabelOptions('demos'))

  var indexTemplate = _.template(fs.readFileSync('scripts/demos/index.template.html'))();

  return gulp.src(['demos/**/*'])
    .pipe(cache('demos', { optimizeMemory: true }))
    .pipe(gulpif(/.ts$/, buildTest()))
    .pipe(gulpif(/index.js$/, createIndexHTML())) //TSC changes .ts to .js
    .pipe(gulp.dest('dist/demos'))

  function createIndexHTML() {
    return through2.obj(function(file, enc, next) {
      this.push(new VinylFile({
        base: file.base,
        contents: new Buffer(indexTemplate),
        path: path.join(path.dirname(file.path), 'index.html'),
      }));
      next(null, file);
    });
  }
})

gulp.task('publish', function(done) {
  var version = flags.version;
  var ngVersion = flags.ngVersion;
  if (!version || !ngVersion) {
    console.error("\nERR: You need to provide a version for Ionic as well as " +
                  "the version of Angular it depends on.\n\n" +
                  "gulp publish -v {version} -a {ngVersion}\n");
    return
  }
  if (version.indexOf("alpha") + version.indexOf("-") > -2 ||
      ngVersion.indexOf("alpha") + ngVersion.indexOf("-") > -2)
  {
    console.error("\n ERR: Just provide version number. Instead of 2.0.0-alpha.10, just enter 10\n");
    return
  }

  var exec = require('child_process').exec;
  var _ = require('lodash');
  var fs = require('fs');

  runSequence(
    'clean',
    ['bundle', 'sass', 'fonts', 'copy.ts', 'copy.scss'],
    'transpile.common',
    function() {
      var packageJSONTemplate = _.template(fs.readFileSync('scripts/npm/package.json'));
      packageJSONContents = packageJSONTemplate({ 'version': version, 'ngVersion': ngVersion });
      fs.writeFileSync("dist/package.json", packageJSONContents);

      // publish to npm
      exec('cd dist && npm publish', function (err, stdout, stderr) {
        console.log(stdout);
        console.error(stderr);
        done();
      });
    }
  )
})
