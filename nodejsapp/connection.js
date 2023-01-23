var mysql = require('mysql');
var pass = ''

const fs = require('fs')
var cred = fs.readFileSync("credentials.txt").toString().split(/\r?\n/);
var conn = mysql.createConnection({
    host: "localhost",
    user: cred[0],
    password: cred[1],
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