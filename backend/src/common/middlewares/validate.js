import { BadRequestError } from '../errors/AppError.js';

export const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    const dataToValidate = req[source];
    const { error, value } = schema.validate(dataToValidate, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorDetails = error.details.map((detail) => detail.message);
      return next(new BadRequestError('Validation failed', errorDetails));
    }

    req[source] = value;
    return next();
  };
};
