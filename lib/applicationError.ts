enum StatusCode {
  CONTINUE = 100,
  SWITCHING_PROTOCOLS = 101,
  PROCESSING = 102,
  EARLY_HINTS = 103,
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NON_AUTHORITATIVE_INFORMATION = 203,
  NO_CONTENT = 204,
  RESET_CONTENT = 205,
  PARTIAL_CONTENT = 206,
  MULTI_STATUS = 207,
  ALREADY_REPORTED = 208,
  IM_USED = 226,
  MULTIPLE_CHOICES = 300,
  MOVED_PERMANENTLY = 301,
  FOUND = 302,
  SEE_OTHER = 303,
  NOT_MODIFIED = 304,
  USE_PROXY = 305,
  UNUSED = 306,
  TEMPORARY_REDIRCT = 307,
  PERMANENT_REDIRECT = 308,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  PAYMENT_REQUIRED = 402,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  NOT_ACCEPTABLE = 406,
  PROXY_AUTHENTICATION_REQUIRED = 407,
  REQUEST_TIMEOUT = 408,
  CONFLICT = 409, 
  GONE = 410,
  LENGTH_REQUIRED = 411,
  PRECONDITION_FAILED = 412,
  PAYLOAD_TOO_LARGE = 413,
  URI_TOO_LONG = 414,
  UNSUPPORTED_MEDIA_TYPE = 415,
  RANGE_NOT_SATISFIABLE = 416,
  EXPECTATION_FAILED = 417,
  IM_A_TEAPOT = 418,
  MISDIRECTED_REQUEST = 421,
  UNPROCESSABLE_CONTENT = 422,
  LOCKED = 423,
  FAILED_DEPENDENCY = 424,
  TOO_EARLY = 425,
  UPGRADE_REQUIRED = 426,
  PRECONDITION_REQUIRED = 428,
  TOO_MANY_REQUESTS = 429,
  REQUEST_HEADER_FIELDS_TOO_LARGE = 431,
  UNAVAILABLE_FOR_LEGAL_REASONS = 451,
};

interface ApplicationErrorOptions {
  type: string,
  code: string,
  message: string,
  statusCode?: number,
  statusMessage?: string,
}

export class ApplicationError extends Error {
  static TYPES = {
    CLIENT: "CLIENT",
    SERVER: "SERVER",
    UNKNOWN: "UNKNOWN",
  };

  type: string;
  code: string;
  message: string;
  statusCode: number | undefined;
  statusMessage: string | undefined;
  constructor(options: ApplicationErrorOptions) {
    super();
    const {type, code, message, statusCode, statusMessage} = options;
    if(!ApplicationError.TYPES[type]) {
      throw new Error(`ApplicationError: ${type} is not a valid type. Must be one of ${Object.values(ApplicationError.TYPES)}`);
    }
    if(['CLIENT', 'SERVER'].includes(type) && !statusCode) {
      throw new Error(`ApplicationError: statusCode must be included with ${type} Errors.`);
    }
    if(type === 'CLIENT' && statusCode && (statusCode < 400 || statusCode > 499)) {
      throw new Error('ApplicationError: CLIENT Errors must have statusCode in range 400 - 499.');
    }
    if(type === 'SERVER' && statusCode && (statusCode < 500 || statusCode > 599)) {
      throw new Error('ApplicationError: SERVER Errors must have statusCode in range 500 - 599.');
    }
    
    this.type = type;
    this.code = code;
    this.message = message;
    this.statusCode = statusCode;
    this.statusMessage = statusMessage || 'An unexpected error occurred.';
  }
}

export const AUTHENTICATION_ERRORS = {
  USERNAME_IN_USE: {
    type: ApplicationError.TYPES.CLIENT,
    code: 'USERNAME_IN_USE',
    message: 'Username already in use.',
    statusMessage: 'This username is already in use.',
    statusCode: 400,
  },
  INCORRECT_PASSWORD: {
    type: ApplicationError.TYPES.CLIENT,
    code: 'INCORRECT_PASSWORD',
    message: 'Invalid password',
    statusMessage: 'Password is incorrect.',
    statusCode: 400,
  },
  REGISTER_ERROR: {
    type: ApplicationError.TYPES.SERVER,
    code: 'REGISTRATION_FAILED',
    message: 'Unexpected registration error',
    statusMessage: 'An unexpected error occurred, please try agin.',
    statusCode: 500,
  },
  UNAUTHORIZED: {
    type: ApplicationError.TYPES.CLIENT,
    code: 'USER_UNAUTHORIZED',
    message: 'User is not authorized for this action.',
    statusMessage: 'Invalid login.',
    statusCode: 401,
  },
  USERNAME_REQUIRED: {
    type: ApplicationError.TYPES.CLIENT,
    code: 'USERNAME_REQUIRED',
    message: 'User did not provide a username.',
    statusMessage: 'Username is required.',
    statusCode: 400,
  },
  PASSWORD_REQUIRED: {
    type: ApplicationError.TYPES.CLIENT,
    code: 'PASSWORD_REQUIRED',
    message: 'User did not provide a password.',
    statusMessage: 'Password is required.',
    statusCode: 400,
  },
  INVALID_CODE: {
    type: ApplicationError.TYPES.CLIENT,
    code: 'INVALID_CODE',
    message: 'User provided an invalid referral code.',
    statusMessage: 'Invalid referral code.',
    statusCode: 400,
  },
};
