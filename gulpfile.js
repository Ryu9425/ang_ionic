var _ = require('lodash');
var buildConfig = require('./scripts/build/config');
var fs = require('fs');
var gulp = require('gulp');
var karma = require('karma').server;
var path = require('path');
var VinylFile = require('vinyl');
var argv = require('yargs').argv;
var concat = require('gulp-concat');
var del = require('del');
var gulpif = require('gulp-if');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var through2 = require('through2');
var runSequence = require('run-sequence');
var watch = require('gulp-watch');
var exec = require('child_process').exec;
var babel = require('gulp-babel');
var tsc = require('gulp-typescript');
var lazypipe = require('lazypipe');
var cache = require('gulp-cached');
var connect = require('gulp-connect');
var Dgeni = require('dgeni');
var insert = require('gulp-insert');
var minimist = require('minimist');

function getBabelOptions(moduleName, moduleType) {
  return {
    optional: ['es7.decorators'],
    modules: moduleType || "system",
    moduleIds: true,
    getModuleId: function(name) {
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
  string: 'port',
  alias: {'p': 'port'},
  default: { port: 8000 }
};

var flags = minimist(process.argv.slice(2), flagConfig);

gulp.task('build', function(done) {
  runSequence(
    'bundle',
    'e2e',
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
            var relPath = file.history[0].replace(base, "").replace(".ts", ".js");

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
  connect.server({
    root: 'dist',
    port: flags.port,
    livereload: false
  });
});

gulp.task('clean', function(done) {
  del(['dist/'], done);
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
  return gulp.src([
      'dist/src/es5/system/ionic/**/*.js'
    ])
    .pipe(concat('ionic.js'))
    .pipe(insert.append('System.config({ "paths": { "ionic/*": "ionic/*" } });'))
    .pipe(gulp.dest('dist/js/'));
    //TODO minify + sourcemaps
});

gulp.task('bundle', ['bundle.ionic'], function() {
  return gulp.src(buildConfig.scripts)
    .pipe(concat('ionic.bundle.js'))
    .pipe(gulp.dest('dist/js'));;
})

gulp.task('tests', function() {
  return gulp.src('ionic/components/*/test/*/**/*.spec.ts')
    .pipe(tsc(tscOptions, null, tscReporter))
    .pipe(babel(getBabelOptions('dist/tests')))
    .pipe(rename(function(file) {
      file.dirname = file.dirname.replace(path.sep + 'test' + path.sep, path.sep)
    }))
    .pipe(gulp.dest('dist/tests'))
})

gulp.task('e2e', function() {
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
      var self = this;

      var module = path.dirname(file.path)
                      .replace(__dirname, '')
                      .replace('/ionic/components/', 'e2e/')
                      .replace('/test/', '/') +
                      '/index';

      var indexContents = indexTemplate.replace('{{MODULE}}', module);

      self.push(new VinylFile({
        base: file.base,
        contents: new Buffer(indexContents),
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

gulp.task('sass', function(done) {
  return gulp.src('ionic/ionic.scss')
    .pipe(sass()
      .on('error', sass.logError)
    )
    .pipe(autoprefixer(buildConfig.autoprefixer))
    .pipe(gulp.dest('dist/css/'));
});

gulp.task('sass.dark', function() {
  return gulp.src('scripts/build/ionic.dark.scss')
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

gulp.task('karma', function() {
  return karma.start({ configFile: __dirname + '/scripts/karma/karma.conf.js' })
  //return karma.start({ configFile: __dirname + '/karma.conf.js' })
});

gulp.task('karma-watch', function() {
  return karma.start({ configFile: __dirname + '/scripts/karma/karma-watch.conf.js' })
});

gulp.task('docs', function() {
  try {
    var dgeni = new Dgeni([require('./scripts/docs/dgeni-config')]);
    return dgeni.generate();
  } catch (err) {
    console.log(err.stack);
  }
});

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

gulp.task('publish', function(done) {
  runSequence(
    'clean',
    ['bundle', 'sass', 'fonts', 'copy.ts', 'copy.scss'],
    'transpile.common',
    function() {
      var packageJSONContents = '{\n  "name": "ionic-framework",\n  "version": "2.0.0-alpha.1",\n  "license": "Apache-2.0",\n  "repository": {\n    "type": "git",\n    "url": "https://github.com/driftyco/ionic2.git"\n  }\n}\n';
      fs.writeFile("dist/package.json", packageJSONContents, done);
    }
  )
})
