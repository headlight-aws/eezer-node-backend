
/*

This is the main configuration file for the eezer backend API.
The config profiles are development, test and production.

The resource paths are defined in the api-paths.js file.

Don't use the config objects directly, use the getConfig method
to retrieve the config objects for a specific environment.

The NODE_ENV variable must be set in package.json file.

 */

const devConfig = {
  dbuser: 'admin',
  dbpass: '****',
  dbUrl: 'dsXXXXXXX.mlab.com:37191/eezer',
  apiRootEndpoint: '/api',
  defaultPort: 8080,

  TOKEN_EXPIRY_TIME: '1d',
  JWT_SECRET: 'secret'
};

const prodConfig = {
  dbuser: 'admin',
  dbpass: '****',
  dbUrl: 'localhost:27017/eezer',
  apiRootEndpoint: '/api',
  defaultPort: 8080,

  // we keep a long expiry time so users won't
  // need to log in all the time..
  TOKEN_EXPIRY_TIME: '30d',
  // keep secret!
  JWT_SECRET: 'this should be kept secret'
};

// This configuration is the "staging" environment on Heroku.
// Note: For now we use the same db as the dev environment.
const stageConfig = {
  dbuser: 'admin',
  dbpass: '****',
  dbUrl: 'dsXXXXXXX.mlab.com:37191/eezer',
  apiRootEndpoint: '/api',
  defaultPort: 8080,

  // we keep a long expiry time so users won't
  // need to log in all the time..
  TOKEN_EXPIRY_TIME: '10m',
  // keep secret!
  JWT_SECRET: 'this should also be kept secret'
};

const testConfig = {
  dbuser: 'test',
  dbpass: 'testare',
  dbUrl: 'dsXXXXXXX.mlab.com:51544/eezer-test',
  apiRootEndpoint: '/api',
  defaultPort: 8080,

  TOKEN_EXPIRY_TIME: '10m',
  JWT_SECRET: 'secret'
}

const getConfig = () => {
  if (process.env.NODE_ENV === 'development') {
    return devConfig;
  } else if (process.env.NODE_ENV === 'test') {
    return testConfig;
  } else if (process.env.NODE_ENV === 'staging') {
    return stageConfig;
  }

  return prodConfig;
}

module.exports = getConfig;
