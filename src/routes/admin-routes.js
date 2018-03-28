import Transport from '../db/models/transport';
import User from '../db/models/user';
import { EEZER_INVALID_USER_OR_PASS } from '../utils/error-codes';
import { toError, toResponse } from '../utils/response-utils';
import passwordHash from 'password-hash';
import jwt from 'jsonwebtoken';

import getConfig from '../config/config';
const config = getConfig();

/* Set up all the routes related to admin tasks. */
module.exports = {
  export: (req, res) => {
    Transport.find({}, '-_id -createdServerTime -__v -coordinates._id',
    (err, doc) => {

      if (err) {
        res.send(err);
        return;
      }

      res.json(doc);
    });
  },

  login: (req, res) => {

      if (req.body.username && req.body.password) {

        User.findOne({ username: req.body.username },
          { username: 1, role: 1, password: 1 }, (err, doc) => {

            if (err) {
              res.status(500).json(toError(err));
              return;
            }

            if (doc && passwordHash.verify(req.body.password, doc.password)) {
              // successful login, generate jwt and send back

              jwt.sign({ user: doc.username, role: doc.role }, config.JWT_SECRET,
                { expiresIn: config.TOKEN_EXPIRY_TIME }, (err, token) => {
                  if (err) {
                    res.status(500).json(toError(err));
                    return;
                  }

                  const response = {
                    token,
                    username: doc.username
                  };

                  res.json(toResponse(response));
              });
            } else {
              res.status(500).json(toError(EEZER_INVALID_USER_OR_PASS));
            }
        });
      } else {
        res.status(500).json(toError(EEZER_INVALID_USER_OR_PASS));
      }
  },

};
