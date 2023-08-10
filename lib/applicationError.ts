interface ApplicationErrorOptions {
  type: string,
  code: string,
  message: string,
  statusCode?: number,
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
  constructor(options: ApplicationErrorOptions) {
    super();
    const {type, code, message, statusCode} = options;
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
  }
}
