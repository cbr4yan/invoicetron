const validator = require('validator');
const Clients = require('../models/client');

exports.validateFormClient = (mode, data, callback) => {
  let error = null;
  if (!validator.isLength(data.name, { min: 3, max: 100 })) {
    error = { message: 'Nombre no valido.' };
    return callback(error, data);
  }
  if (mode === 'add') {
    Clients.findOne({ dni: data.dni }, (err, client) => {
      if (client) {
        error = { message: 'DNI/NIE ya exite.' };
      }
      return callback(error, data);
    });
  } else {
    return callback(null, data);
  }
};
