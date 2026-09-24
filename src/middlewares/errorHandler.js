const error = ((err, _req, res, _next) => {
   let statusCode = err.statusCode || 500;
   let message = err.message;

   if (err.name === 'CastError') {
      statusCode = 400;
      message = 'Formato de datos inválido';
   } else if (err.code === 11000) {
      statusCode = 409;
      message = 'El email ingresado ya está registrado';
   };

   res.status(statusCode).json({ status: 'error', message: message });
});

export default { error };