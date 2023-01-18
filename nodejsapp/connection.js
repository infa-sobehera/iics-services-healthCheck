var mysql = require('mysql');

var conn = mysql.createConnection({
    host: "localhost",
    // user: "root",
    user: "infa",

    // password: "prameet",
    password:"Infa@12345",
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