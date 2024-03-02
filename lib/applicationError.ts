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
