const handler = {};
handler.notFoundHandler = (requestProperties, callback) => {
    callback(404, { message: 'error 404' });
};
module.exports = handler;
