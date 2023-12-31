export const schemaValidation = (schema) => {
  return (req, res, next) => {

    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) return res.status(400).send(error.details.map(({ message }) => message));

    next();
  }
}