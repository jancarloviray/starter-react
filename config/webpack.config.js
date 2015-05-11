var _ = require('lodash');
var path = require('path');
var webpack = require('webpack');
var env = require('./app.config').env;
var gulpconfig = require('./gulpfile.config');
var rootpath = path.resolve(__dirname, '../');

var common = {
  target: 'web',
  cache: false,
  // entry point of bundle
  entry: gulpconfig.client.scripts.entry,
  output: {
    // output directory as absolute path
    path: gulpconfig.dist.cwd,
    // filename of entry chunk relative to path
    filename: 'app.js',
    // the path from the view of html
    publicPath: '/assets/js/'
  },
  module: {
    loaders: [{
      test: /\.js$|.jsx$/,
      exclude: /node_modules/,
      loaders: ['react-hot', 'babel']
    }, {
      test: /\.(jpe?g|png|gif|svg|woff|eot|ttf)$/,
      loader: 'url?limit=10000&name=[sha512:hash:base64:7].[ext]'
    }],
    // do not parse these files (assumed to not be required)
    noParse: /\.min\.js/
  },
  resolve: {
    // the absolute path that contains your modules
    root: [rootpath, rootpath + '/client'],
    extensions: ['', '.js', '.json', '.jsx'],
    // dir names to be resolved as cwd for modules
    moduleDirectories: ['node_modules', 'client'],
    // if module not found in root or moduleDirectories, check here
    fallback: [path.resolve(rootpath, './client/app')]
  },
  node: {
    console: true,
    process: true,
    global: true,
    Buffer: true,
    __dirname: true
  }
};

if (env === 'development') {
  module.exports = _.assign(common, {
    // eval, source-map
    devtool: 'eval',
    debug: true,
    entry: [
      'webpack-dev-server/client?http://' + gulpconfig.whost + ':' + gulpconfig.wport,
      'webpack/hot/only-dev-server',
      gulpconfig.client.scripts.entry
    ],
    module: {
      loaders: [{
        test: /\.js/,
        loaders: ['react-hot', 'babel-loader'],
        exclude: /node_modules/
      }]
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin(),
      new webpack.DefinePlugin({
        'process.env': {
          BROWSER: JSON.stringify(true),
          ENV: JSON.stringify('development'),
          NODE_ENV: JSON.stringify('development')
        }
      }),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.OccurenceOrderPlugin()
    ]
  });
}

if (env === 'production') {
  module.exports = _.assign(common, {
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          BROWSER: JSON.stringify(true),
          ENV: JSON.stringify('development'),
          NODE_ENV: JSON.stringify('development')
        }
      }),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false,
          screw_ie8: true,
          sequences: true,
          dead_code: true,
          drop_debugger: true,
          comparisons: true,
          conditionals: true,
          evaluate: true,
          booleans: true,
          loops: true,
          unused: true,
          hoist_funs: true,
          if_return: true,
          join_vars: true,
          cascade: true,
          drop_console: true
        },
        output: {
          comments: false
        },
        sourceMap: false
      })
    ]
  });
}
