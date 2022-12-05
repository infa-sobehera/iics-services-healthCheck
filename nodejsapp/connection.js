var mysql = require('mysql');

var conn = mysql.createConnection({
    host: "iics-qa-mgmt-api-rds.cce748qswozo.us-west-2.rds.amazonaws.com",
    user: "root",
    password: "Infa1234",
    database: "services",
    multipleStatements: true
});

conn.connect(function (err) {
    if (err) {
        throw err;
    }
    console.log("Connected")
})

module.exports = conn