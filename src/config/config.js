
/*

This is the main configuration file for the eezer backend API.

To use different profiles set the NODE_ENV variable when running
the application to the desired value (ex. development, test, prod).

Example: NODE_ENV=development npm run start
Example npm run dev (preconfigured with the development env)

Make sure to have a config file for the specified environment, for
example if using the 'development' environment the config file should
be named config.development.js and reside in the config directory.

There is an example config file named 'config.test.js' that shows
the neccessary config attributes that must be set for the application
to run.

Use the getConfig method to retrieve the config objects
for a specific environment.

The NODE_ENV variable must be set in package.json file or in the command
line when running the application.

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
