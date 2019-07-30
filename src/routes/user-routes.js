import User from '../db/models/user';
import { toError, toResponse, toValidationError } from '../utils/response-utils';
import { EEZER_DOCUMENT_NOT_FOUND } from '../utils/error-codes';
import passwordHash from 'password-hash';
import { USER_ROLE_DRIVER, USER_ROLE_ADMIN } from '../config/constants';

/* Set up all the routes related to users. */
module.exports = {

  // POST /adduser | Add a new user to the db.
  addUser: (req, res) => {

    const newUser = new User();

    newUser.username      = req.body.username;
    newUser.password      = req.body.password;
    newUser.role          = (req.body.role || "").toUpperCase();
    newUser.realName      = req.body.realName;
    newUser.phone         = req.body.phone;
    newUser.email         = req.body.email;
    newUser.organization  = req.body.organization;
    newUser.other         = req.body.other;

    const validationError = newUser.validateSync();

    if (validationError) {
      res.status(400).json(toValidationError(validationError));
      return;
    }

    // Hash password after validating doc but before storing it ;)
    newUser.password = passwordHash.generate(req.body.password);

    newUser.save((err, doc) => {

      if (err) {
        res.status(500).json(toError(err));
        return;
      }

      const user = {
        username:     doc.username,
        password:     '***',
        role:         doc.role,
        realName:     doc.realName,
        phone:        doc.phone,
        email:        doc.email,
        organization: doc.organization,
        other:        doc.other,
      };

      res.json(toResponse(user));
    });
  },

  // DELETE /rmuser | Remove a user from the db.
  deleteUser: (req, res) => {
    User.remove({ username: req.params.username }, (err, doc) => {
      if (err) {
        res.status(500).json(toError(err));
        return;
      }

      if (doc.result.n === 1) {
          res.json(toResponse(""));
      } else {
        res.json(toError(EEZER_DOCUMENT_NOT_FOUND));
      }
    });
  },

  // GET /getusers | Get all existing users, not drivers, in system.
  getUsers: (req, res) => {

    User.find({"role" : {"$ne" : USER_ROLE_DRIVER}}, '-_id -__v -password', (err, doc) => {
      if (err) {
        res.status(500).json(toError(err));
        return;
      }

      res.json(toResponse(doc));
    });
  },

  // GET /drivers | Get all existing drivers in system.
  getDrivers: (req, res) => {

    User.find({"role" : USER_ROLE_DRIVER}, '-_id -__v -password', (err, doc) => {
      if (err) {
        res.status(500).json(toError(err));
        return;
      }
      console.log(doc);
      res.json(toResponse(doc));
    });
  },

  // GET /getnumberdrivers | Get the number of all drivers existing in system.
  getNumberDrivers: (req, res) => {

    
    User.find({"role" : USER_ROLE_DRIVER}, '-_id -__v', (err, doc) => {
      if (err) {
        res.status(500).json(toError(err));
        return;
      }
      var lengthDoc = doc.length;
      res.json(toResponse(lengthDoc));
    });
  }
};
