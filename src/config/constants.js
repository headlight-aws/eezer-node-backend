/*

ALL EEZER BACKEND APPLICATION CONSTANTS

All the API paths are listed here, to access a resource
the URL will look something like: <host>:<port>/<base path>/<resource path>

Ex: api.eezer.se:8080/api/store

The api base path is defined in the config.js file.

*/

// Transport routes
export const API_PATH_STORE = 'store';
export const API_PATH_ALL = 'all';
export const API_PATH_COORDS = 'coords';
export const API_PATH_REMOVE = 'remove';
export const API_PATH_TOTAL_DISTANCE = 'totaldistance';
export const API_PATH_TOTAL_DURATION = 'totalduration';
export const API_PATH_LATEST_ROUTE = 'latestroute';

// User routes
export const API_PATH_ADD_USER = 'adduser';
export const API_PATH_DELETE_USERS = 'rmuser';
export const API_PATH_GET_USERS = 'getusers';
export const API_PATH_GET_DRIVERS = 'drivers';
export const API_PATH_NUMBER_DRIVERS = 'getnumberdrivers';

// Vehicle routes
export const API_PATH_ADD_VEHICLE = 'addvehicle';
export const API_PATH_DELETE_VEHICLE = 'rmvehicle';
export const API_PATH_GET_VEHICLES = 'getvehicles';
export const API_PATH_NUMBER_VEHICLES = 'getnumbervehicles';

// Admin routes
export const API_PATH_EXPORT = 'export';
export const API_PATH_LOGIN = 'login';

/* Whitelisted URLs (that require not authentication)
 * Note: If you change the API root endpoint, you must
 * update this urls accordingly.
 */

export const URL_WHITELIST = [ '/api/login', '/api' ];

/* User roles (don't forget to add to the array if adding new) */

export const USER_ROLE_ADMIN = 'ADMIN';
export const USER_ROLE_DRIVER = 'DRIVER';

export const USER_ROLES = [ USER_ROLE_ADMIN, USER_ROLE_DRIVER ];
