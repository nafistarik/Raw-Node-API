/* eslint-disable prettier/prettier */
/*
    Raw node uptime monitoring API project.
*/
// http module for server
const http = require('http');
const environment = require('./helpers/environments');
const { handleReqRes } = require('./helpers/handleReqRes');
const data = require('./lib/data');

// app object - module scaffolding
const app = {};

// data.create('test', 'newFile', { name: 'nafis', country: 'bangladesh' }, (error) => {
//     console.log('Error:', error);
// });

// data.read('test', 'newFile', (err, data) => {
//     console.log(err, data);
// });

// data.update('test', 'newFile', { 'name': 'messi', 'country': 'argentina' }, (error) => {
//     console.log('Error:', error);
// });

// data.delete('test', 'newFile', (error) => {
//     console.log('Error:', error);
// });

// create server
app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(environment.port, () => {
        console.log(`listening to port ${environment.port}`);
    });
};

// handle Request Response
// eslint-disable-next-line padded-blocks
app.handleReqRes = handleReqRes;

// start the server
app.createServer();

// Shortcuts

// const app = {
//     config: {
//         port: 3000,
//     },

//     handleReqRes: (req, res) => {
//         res.end('Hello, Node Programmers!!!');
//     },

//     createServer: () => {
//         const server = http.createServer(app.handleReqRes);
//         server.listen(app.config.port, () => {
//             console.log('Server started on port: 3000');
//         });
//     },
// };

// app.createServer();
