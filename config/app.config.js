var host;
var port;
var mock;
var env = process.env.ENV || 'development';

switch (env) {
    case 'production':
        host = process.env.HOST || 'localhost';
        port = process.env.PORT || 3000;
        mock = true;
        break;
    case 'test':
    case 'development':
        host = process.env.HOST || 'localhost';
        port = process.env.PORT || 8080;
        mock = true;
        break;
    default:
        break;
}

module.exports = {
    mock: mock,
    host: host,
    port: port,
    env: env
};
