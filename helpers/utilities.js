const crypto = require('crypto');
const environments = require('./environments');

const utilities = {};

utilities.parseJSON = (jsonString) => {
    let jsObject;
    try {
        jsObject = JSON.parse(jsonString);
    } catch (error) {
        jsObject = {};
    }
    return jsObject;
};

utilities.hash = (str) => {
    if (typeof str === 'string' && str.length > 0) {
        const hash = crypto.createHmac('sha256', environments.secretKey).update(str).digest('hex');
        return hash;
    }
    return false;
};

module.exports = utilities;
