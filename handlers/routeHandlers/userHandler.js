/* eslint-disable no-underscore-dangle */
/* eslint-disable prettier/prettier */
const handler = {};
const data = require('../../lib/data');
const { hash, parseJSON } = require('../../helpers/utilities');

handler.userHandler = (requestProperties, callback) => {
  const acceptedMethods = ['get', 'post', 'put', 'delete'];
  if (acceptedMethods.indexOf(requestProperties.method) > -1) {
    // eslint-disable-next-line no-underscore-dangle
    handler._user[requestProperties.method](requestProperties, callback);
  } else {
    callback(405, { message: 'method not allowed' });
  }
};

handler._user = {};

handler._user.post = (requestProperties, callback) => {
  const firstName = typeof requestProperties.body.firstName === 'string'
    && requestProperties.body.firstName.trim().length > 0
      ? requestProperties.body.firstName
      : false;
  const lastName = typeof requestProperties.body.lastName === 'string'
    && requestProperties.body.lastName.trim().length > 0
      ? requestProperties.body.lastName
      : false;
  const phone = typeof requestProperties.body.phone === 'string'
    && requestProperties.body.phone.trim().length === 11
      ? requestProperties.body.phone
      : false;
  const password = typeof requestProperties.body.password === 'string'
    && requestProperties.body.password.trim().length > 0
      ? requestProperties.body.password
      : false;
  const tosAgreement = typeof requestProperties.body.tosAgreement === 'boolean'
    && requestProperties.body.tosAgreement === true
      ? requestProperties.body.tosAgreement
      : false;

  if (firstName && lastName && phone && password && tosAgreement) {
    data.read('users', phone, (err) => {
      if (err) {
        const userObject = {
          firstName,
          lastName,
          phone,
          password: hash(password),
          tosAgreement,
        };
        data.create('users', phone, userObject, (err1) => {
          if (!err1) {
            callback(200, { message: 'success' });
          } else {
            callback(500, { error: 'failed to create user' });
          }
        });
      } else {
        callback(500, { error: 'server side problem!' });
      }
    });
  } else {
    callback(400, { error: 'user error' });
  }
};

handler._user.get = (requestProperties, callback) => {
  const phone = typeof requestProperties.queryStringObject.phone === 'string'
    && requestProperties.queryStringObject.phone.trim().length === 11
      ? requestProperties.queryStringObject.phone
      : false;

  if (phone) {
    data.read('users', phone, (err, userData) => {
      userData = parseJSON(userData);
      delete userData.password;
      if (!err && userData) {
        callback(200, userData);
      } else {
        callback(404, { error: 'user not found' });
      }
    });
  }
};

handler._user.put = (requestProperties, callback) => {
  const firstName = typeof requestProperties.body.firstName === 'string'
      && requestProperties.body.firstName.trim().length > 0
      ? requestProperties.body.firstName
      : false;

  const lastName = typeof requestProperties.body.lastName === 'string'
      && requestProperties.body.lastName.trim().length > 0
      ? requestProperties.body.lastName
      : false;

  const phone = typeof requestProperties.body.phone === 'string'
      && requestProperties.body.phone.trim().length === 11
      ? requestProperties.body.phone
      : false;

  const password = typeof requestProperties.body.password === 'string'
      && requestProperties.body.password.trim().length > 0
      ? requestProperties.body.password
      : false;

  if (phone) {
      // Read user data
      data.read('users', phone, (err1, userData) => {
        userData = parseJSON(userData);
          if (!err1 && userData) {
              // Update user data if new data is provided
              if (firstName) userData.firstName = firstName;
              if (lastName) userData.lastName = lastName;
              if (password) userData.password = hash(password);

              // Update the user data in the file
              data.update('users', phone, userData, (err2) => {
                  if (!err2) {
                      callback(200, { message: 'User updated successfully' });
                  } else {
                      callback(500, { error: 'Failed to update user' });
                  }
              });
          } else {
              callback(404, { error: 'User not found' });
          }
      });
  } else {
      callback(400, { error: 'Invalid phone number' });
  }
};

handler._user.delete = (requestProperties, callback) => {
  const phone = typeof requestProperties.queryStringObject.phone === 'string'
      && requestProperties.queryStringObject.phone.trim().length === 11
      ? requestProperties.queryStringObject.phone
      : false;
  if (phone) {
    data.read('users', phone, (err1, userData) => {
      userData = parseJSON(userData);
      if (!err1 && userData) {
        data.delete('users', phone, (err2) => {
          if (!err2) {
            callback(200, { message: 'User deleted successfully' });
          } else {
            callback(500, { error: 'Failed to delete user' });
          }
        });
      } else {
        callback(404, { error: 'User not found' });
      }
    });
  } else {
    callback(400, { error: 'Invalid phone number' });
  }
};

module.exports = handler;
