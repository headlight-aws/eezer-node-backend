/* All error codes can be found in this file */

// Mongoose error codes
export const MONGOOSE_UNIQUE_INDEX_CONST = { code: 11000, msg: 'UniqueIndexError' };

// Eezer defined error codes (starting from 95000)
export const EEZER_DOCUMENT_NOT_FOUND = { code: 950001, msg: 'DocumentNotFound' };
export const EEZER_INVALID_USER_OR_PASS = { code: 95002, msg: 'InvalidUserOrPass' };
export const EEZER_UNAUTHORIZED = { code: 95003, msg: 'Unauthorized' };
export const EEZER_INSUFFICIENT_PRIVILEGES = { code: 95004, msg: 'InsufficientPrivileges' };

export const EEZER_UNKNOWN_ERROR = { code: 959999, msg: 'Unknown error.' };
