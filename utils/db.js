const mysql = require('mysql2')

const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'v4health'
})


// Connect to the MySQL database
db.connect(function (err) {
    if (err) {
        console.log('mySql connection error', err);
    } else {
        console.log('mySql connected');
    }
})


module.exports = db;