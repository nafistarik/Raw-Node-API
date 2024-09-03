const fs = require('fs');
const path = require('path');

const lib = {};

lib.basedir = path.join(__dirname, '/../.data/');

lib.create = (dir, file, data, callback) => {
    // Construct the full path to the file
    const filePath = `${lib.basedir + dir}/${file}.json`;

    // Open the file for writing
    fs.open(filePath, 'wx', (err, fileDescriptor) => {
        if (!err && fileDescriptor) {
            // Convert data to a JSON string
            const stringData = JSON.stringify(data);
            // Write the string data to the file
            fs.writeFile(fileDescriptor, stringData, (err2) => {
                if (!err2) {
                    // Close the file after writing
                    fs.close(fileDescriptor, (err3) => {
                        if (!err3) {
                            // Success callback
                            callback(false);
                        } else {
                            // Err3 at closing the file
                            callback('Error closing the new file.');
                        }
                    });
                } else {
                    // Err2 at writing to the file
                    callback('Error writing to the new file.');
                }
            });
        } else {
            // Err at opening the file (it may already exist)
            callback('Could not create a new file.');
        }
    });
};

lib.read = (dir, file, callback) => {
    fs.readFile(`${lib.basedir + dir}/${file}.json`, 'utf8', (err, data) => {
        callback(err, data);
    });
};

lib.update = (dir, file, data, callback) => {
    // Construct the full path to the file
    const filePath = `${lib.basedir + dir}/${file}.json`;
    // Open the file for writing
    fs.open(filePath, 'r+', (err, fileDescriptor) => {
        if (!err && fileDescriptor) {
            // Convert data to a JSON string
            const stringData = JSON.stringify(data);
            // Truncate the file (remove all content)
            fs.ftruncate(fileDescriptor, (err2) => {
                if (!err2) {
                    // Write the string data to the file
                    fs.writeFile(fileDescriptor, stringData, (err3) => {
                        if (!err3) {
                            // Close the file after writing
                            fs.close(fileDescriptor, (err4) => {
                                if (!err4) {
                                    // Success callback
                                    callback(false);
                                } else {
                                    // Err4 at closing the file
                                    callback('Error closing the new file.');
                                }
                            });
                        } else {
                            // Err3 at writing to the file
                            callback('Error updating the file.');
                        }
                    });
                } else {
                    // Err2 at writing to the file
                    callback('Error deleting the data');
                }
            });
        } else {
            // Err at opening the file (it may already exist)
            callback('Could not open a new file.');
        }
    });
};

lib.delete = (dir, file, callback) => {
    fs.unlink(`${lib.basedir + dir}/${file}.json`, (err) => {
        if (!err) {
            callback(false);
        } else {
            callback('Could not delete');
        }
    });
};

module.exports = lib;
