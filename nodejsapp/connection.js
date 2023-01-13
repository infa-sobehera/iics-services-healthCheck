var mysql = require('mysql');

var conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "prameet",
    // password:"Infa@1234",
    database: "services",
    timezone: 'utc',
    multipleStatements: true
});

conn.connect(function (err) {
    if (err) {
        throw err;
    }
    console.log("Connected")
})

module.exports = conn