var fs = require('fs');
var url = require('url');
var path = require('path');
var gulp = require('gulp');
var argv = require('yargs').argv;
var eslint = require('gulp-eslint');
var gulpUtil = require('gulp-util');
var less = require('gulp-less');
var cssMinify = require('gulp-minify-css');
var cssConcat = require('gulp-concat-css');
var proxyMiddleware = require('proxy-middleware');
var combiner = require('stream-combiner2');
var browserSync = require('browser-sync').create();
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var webpackConfig = require('./config/webpack.config.js');
var gulpconfig = require('./config/gulpfile.config');

function log(s) {
  gulpUtil.log(gulpUtil.colors.bold(gulpUtil.colors.blue(s)));
}

var banner = function() {
  return '/*! ' + package.name + ' - v' + package.version + ' - ' + gutil.date(new Date(), "yyyy-mm-dd") +
    ' [copyright: ' + package.copyright + ']' + ' */';
};

log('ENV : ' + gulpconfig.env);
log('PORT : ' + gulpconfig.port);
log('HOST : ' + gulpconfig.host);
log('MOCK : ' + gulpconfig.mock);
log('DEBUG : ' + gulpconfig.debug);
log('WEBPACK_DEV_SERVER: ' + gulpconfig.whost + ':' + gulpconfig.wport);

gulp.task('clean:client', function() {
  return del([gulpconfig.dist.cwd]);
});

gulp.task('lint:client', function() {
  return gulp.src([gulpconfig.client.scripts.app])
    .pipe(eslint({
      useEslintrc: true
    }))
    .pipe(eslint.format());
});

gulp.task('dev:client:styles:app', function() {
  var tasks = [
    gulp.src(gulpconfig.client.styles.app),
    less(),
    cssConcat('app.css'),
    gulp.dest(gulpconfig.dist.cwd),
    browserSync.reload({
      stream: true
    })
  ];
  var combined = combiner.obj(tasks);
  combined.on('error', console.log.bind(console));
  return combined;
});

gulp.task('dev:client:serve', function() {
  var webpackProxy = function() {
    var options = url.parse('http://' + gulpconfig.whost + ':' + gulpconfig.wport + '/assets/js');
    options.route = '/assets/js/';
    return proxyMiddleware(options);
  };

  if (gulpconfig.mock) {
    browserSync.init({
      ui: {
        port: gulpconfig.browserSyncUiPort
      },
      ghostMode: {
        clicks: true,
        scroll: true,
        forms: true
      },
      reloadOnRestart: false,
      reloadDebounce: 5000,
      host: gulpconfig.host,
      minify: false,
      notify: true,
      open: true,
      online: false,
      port: gulpconfig.port,
      server: {
        baseDir: gulpconfig.dist.cwd,
        directory: false,
        routes: {
          '/vendors': 'bower_components'
        },
        middleware: [
          webpackProxy()
        ]
      }
    });
  }
});

gulp.task('dev:client:hotload', function() {
  var server = new WebpackDevServer(webpack(webpackConfig), {
    publicPath: webpackConfig.output.publicPath,
    hot: true,
    colors: true,
    stats: {
      assets: true,
      colors: true,
      version: false,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false
    },
    watchDelay: 10,
    historyApiFallback: true
  });

  server.listen(gulpconfig.wport, gulpconfig.whost, function(err) {
    if (err) {
      throw new gulpUtil.PluginError('[dev:client:hotload]', err);
    }
    gulpUtil.log('[dev:client:hotload]', 'started on ' + gulpconfig.whost + ':' + gulpconfig.wport);
  });
});

gulp.task('dev:client', [
  // 'clean:client',
  // 'lint:client',
  'dev:client:styles:app',
  'dev:client:hotload',
  'dev:client:serve',
]);
