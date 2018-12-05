const PROD = 'production';
const TEST = 'test';
const DEV = 'development';
const ENV = process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase() || (process.env.NODE_ENV = DEV);

module.exports = { ENV, DEV, TEST, PROD };
