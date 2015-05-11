var path = require('path');
var appconfig = require('./app.config');
var rootpath = path.resolve(__dirname, '../');

module.exports = {
    debug: false,
    env: appconfig.env,
    mock: appconfig.mock,
    host: appconfig.host,
    port: appconfig.port,
    whost: 'localhost',
    wport: 8090,
    browserSyncUiPort: 9000,
    config: {
        cwd: path.resolve(rootpath, './config')
    },
    client: {
        cwd: path.resolve(rootpath, './client'),
        scripts: {
            entry: path.resolve(rootpath, './client/app/index.js'),
            app: ['app/**/*.js', 'app/**/*.jsx'],
            vendor: ['vendor/**/*.js']
        },
        html: {
            app: []
        },
        styles: {
            app: ['styles/index.less'],
            themes: ['styles/themes/index.less'],
            vendors: ['styles/vendors/index.less']
        }
    },
    dist: {
        cwd: path.resolve(rootpath, './dist')
    },
    server: {
        cwd: path.resolve(rootpath, './server')
    }
};
