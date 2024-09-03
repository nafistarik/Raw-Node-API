// url module for path
const url = require('url');
// string_decoder for decoding chunks in post data
const { StringDecoder } = require('string_decoder');
// route module for path
const { after } = require('lodash');
const routes = require('../routes');
// notFound handler for 404 responses
const { notFoundHandler } = require('../handlers/routeHandlers/notFoundHandler');
// parseJSON utility for JSON
const { parseJSON } = require('./utilities');

const handler = {};

handler.handleReqRes = (req, res) => {
    // request handling
    // url parsing
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');
    const method = req.method.toLowerCase();
    const queryStringObject = parsedUrl.query;
    const headersObject = req.headers;

    const requestProperties = {
        parsedUrl,
        path,
        trimmedPath,
        method,
        queryStringObject,
        headersObject,
    };

    const decoder = new StringDecoder('utf-8');
    let realData = '';
    // chosenHandler function determines which handler should process the request

    const chosenHandler = routes[trimmedPath] ? routes[trimmedPath] : notFoundHandler;

    req.on('data', (buffer) => {
        realData += decoder.write(buffer);
        console.log(realData);
    });
    req.on('end', () => {
        realData += decoder.end();
        // to show access.body by requestProperties
        requestProperties.body = parseJSON(realData);

        chosenHandler(requestProperties, (statusCode, payload) => {
            // eslint-disable-next-line no-param-reassign
            statusCode = typeof statusCode === 'number' ? statusCode : 500;
            // eslint-disable-next-line no-param-reassign
            payload = typeof payload === 'object' ? payload : {};
            const payloadString = JSON.stringify(payload);
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);
        });
        // response handle
        // res.end('Hello World!');
    });
};
module.exports = handler;
