import {
  MONGOOSE_UNIQUE_INDEX_CONST,
  EEZER_DOCUMENT_NOT_FOUND,
  EEZER_UNKNOWN_ERROR,
  EEZER_INVALID_USER_OR_PASS,
  EEZER_UNAUTHORIZED,
  EEZER_INSUFFICIENT_PRIVILEGES } from './error-codes';

module.exports = {

  // Generates a unsucessful response document.
  toError: (error) => {
      let message;
      let message_extra;

      switch (error.code) {
        // mongoose error code
        case MONGOOSE_UNIQUE_INDEX_CONST.code:
          message = MONGOOSE_UNIQUE_INDEX_CONST.msg;
          message_extra = error.errmsg;
          break;
        case EEZER_DOCUMENT_NOT_FOUND.code:
          message = EEZER_DOCUMENT_NOT_FOUND.msg;
          break;
        case EEZER_INVALID_USER_OR_PASS.code:
          message = EEZER_INVALID_USER_OR_PASS.msg;
          break;
        case EEZER_UNAUTHORIZED.code:
          message = EEZER_UNAUTHORIZED.msg;
          break;
        case EEZER_INSUFFICIENT_PRIVILEGES.code:
          message = EEZER_INSUFFICIENT_PRIVILEGES.msg;
          message_extra = 'User role must be ADMIN to permit this operation.';
          break;
        default:
          message = EEZER_UNKNOWN_ERROR.msg;
      }

      const response = { success: false, message, message_extra };
      console.log({ time: new Date().toString(), response });
      return response;
  },

  // Generates a successful response document.
  toResponse: (data) => {

    return { success: true, data };
  },

  // Generates a json error object from a mongoose validation error object.
  toValidationError: (error) => {

      let validationMessage = [];
      Object.keys(error.errors || {}).map(key => {

        validationMessage.push(error.errors[key].message);
      });

      return { success: false, message: 'ValidationError',
               message_extra: validationMessage };
  },

};
