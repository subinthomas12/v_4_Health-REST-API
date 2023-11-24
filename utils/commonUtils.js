const multer = require('multer');
const db = require('./db')



// Function to set up Multer for image upload

function setupImageUpload() {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'public/images');
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + '-' + file.originalname);
        },
    });

    return multer({ storage: storage });
}


// QueryAsync function for controllers

function queryAsync(sql, values) {
    return new Promise((resolve, reject) => {
        db.query(sql, values, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}



module.exports = {
    setupImageUpload: setupImageUpload,
    queryAsync: queryAsync
};
