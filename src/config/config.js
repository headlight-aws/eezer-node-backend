
/*

This is the main configuration file for the eezer backend API.

All of the below config parameters must be set, for local development
use the .env file to set the desired config params (do not upload that
file to github).

In staging/production set the environment variables before running the
application, the .env file is not read in production environment.

 */

const getConfig = () => {
  return {
    dbuser: process.env.DB_USER,
    dbpass: process.env.DB_PASS,
    dbUrl: process.env.DB_URL,
    apiRootEndpoint: process.env.API_ENDP || '/api',
    defaultPort: process.env.PORT || 8080,

    TOKEN_EXPIRY_TIME: process.env.TOKEN_EXP_TIME || '1d',
    JWT_SECRET: process.env.JWT_SECRET
  };
}

module.exports = getConfig;
