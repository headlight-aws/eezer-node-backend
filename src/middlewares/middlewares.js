/* In this file we set up all express middlewares */

const HEADER_CONTENT_LENGTH = 'content-length';

import { EEZER_UNAUTHORIZED, EEZER_INSUFFICIENT_PRIVILEGES } from '../utils/error-codes';
import { toError } from '../utils/response-utils';
import { USER_ROLE_ADMIN } from '../config/constants';

module.exports = {

  /* Sample middleware, maybe set up request logging or whatever.. */
  default: (req, res, next) => {
    const reqLength = req.headers[HEADER_CONTENT_LENGTH] || 0;
    console.log(`Received request with content length ${reqLength}.`);

    next();
  },

  /* Middleware to set CORS headers. */
  cors: (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'POST, GET, DELETE, OPTIONS');
    next();
  },

  /* Middleware to require authentication.
   * If successfully authorized req.user will be
   * set with the user object including username
   * and role.
   */
  auth: (err, req, res, next) => {

    if (err || !req.user) {
      res.status(401).json(toError(EEZER_UNAUTHORIZED));
      return;
    }

    next();
  },

  /* Middleware to check if user role is admin, if not, respond
   * with an error message.
   */
  adminCheck: (req, res, next) => {

    console.log(req.user);

    const user = req.user || { role: '' };

    // Check that the user role is set to ADMIN before allow request.
    if (user.role !== USER_ROLE_ADMIN) {
      res.status(401).json(toError(EEZER_INSUFFICIENT_PRIVILEGES));
      return;
    }

    next();
  }
};
