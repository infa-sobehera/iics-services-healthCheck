var express = require("express");
var bodyParser = require("body-parser")
var path = require("path");
var routes = require("./routes");
var https = require('https');
var mysql = require('mysql');
var conn = require('./connection')

var app = express();

app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", function (req, res) {
  res.render('index')
})
app.use("/rel", routes);

app.get("/mrel", function (req, res) {
  res.render('mrel')
})

const global_service_list = ['package-manager','authz-service', 'orgexpiry','branding-service','content-repo','ma', 'scim-service', 'orgexpiry'];
const pod_service_list = ['admin-service','auditlog-service','autoscaler-service','bundle-service','callback-service','frs','jls-di','kms-service','license-service','ldm','migration','notification-service','p2pms','preference-service','scheduler-service','session-service','vcs']
var base_url = "https://qa-$$$.rel.infaqa.com/.../mgmtapi/version/";


function fetchData(url, name) {
  // console.log(url);
  https.get(url, (resp) => {
    let data = '';
    // console.log(url,name);
    // A chunk of data has been received.
    resp.on('data', (chunk) => {
      data += chunk;
    });

    // The whole response has been received. Print out the result.
    resp.on('end', () => {
      const attributes = data.split("\n");
      const ver = attributes[3].split("=")[1];
      var id = attributes[4].split("=")[1];
      id = parseInt(id);
      date = Date();
      let  d = date.toString();
      arr  = d.split(" ");
      arr.length =  5;
      let update = arr.join(" ");
      // console.log(url,typeof(ver), typeof(id));

      conn.query("SELECT * FROM rel_global WHERE service_name = ?", [name], (err, rows, fields) => {
        if (!err) {
          if (rows.length == 0) {

            conn.query("INSERT INTO rel_global (service_name, version,buildID,lastUpdated,service_url) VALUES (?)", [[name,ver,id,update,url]], function (err, result) {
              if (err) throw err;
              else
                console.log("Record inserted:");
            });
          }
          else {

            conn.query('UPDATE rel_global SET ? WHERE service_name = ?', [{ service_name: name, version: ver, buildID: id,lastUpdated :update, service_url:url}, name],(err,rows,fields)=>{
              // console.log(url);
              console.log("DB updated",name)
            })
          }

        }
      })

    });

  }).on("error", (err) => {
    console.log("Error: " + err.message);
  });
}
function updateData() {
  for (let i = 0; i < global_service_list.length; i++) {
    let resURL = base_url.replace("...", global_service_list[i]);
    if(global_service_list[i] == 'package-manager')
      resURL = resURL.replace("$$$", 'common');
    else
      resURL = resURL.replace("$$$", 'ma');
    fetchData(resURL, global_service_list[i]);

  }
}


function fetchDataPod(url, name) {
  https.get(url, (resp) => {
    let data = '';
    // A chunk of data has been received.
    resp.on('data', (chunk) => {
      data += chunk;
    });

    // The whole response has been received. Print out the result.
    resp.on('end', () => {

      let attributes = data.split("\n");
      let ver = attributes[3].split("=")[1];
      var id = attributes[4].split("=")[1];
      id = parseInt(id);
      date = Date();
      let  d = date.toString();
      arr  = d.split(" ");
      arr.length =  5;
      let update = arr.join(" ");

      conn.query("SELECT * FROM rel_pod WHERE service_name = ?", [name], (err, rows, fields) => {
        if (!err) {
          if (rows.length == 0) {

            conn.query("INSERT INTO rel_pod (service_name, version,buildID,lastUpdated,service_url) VALUES (?)", [[name,ver,id,update,url]], function (err, result) {
              if (err) throw err;
              else
                console.log("Record inserted:");
            });
          }
          else {

            conn.query('UPDATE rel_pod SET ? WHERE service_name = ?', [{ service_name: name, version: ver, buildID: id,lastUpdated :update, service_url:url}, name],(err,rows,fields)=>{
              console.log("DB updated",name)
            })
          }

        }
      })

    });

  }).on("error", (err) => {
    console.log("Error: " + err.message);
  });
}
function updateDataPod() {
  for (let i = 0; i < pod_service_list.length; i++) {
    let resURL = base_url.replace("...", pod_service_list[i]);
    resURL = resURL.replace("$$$", 'pod1');
    fetchDataPod(resURL, pod_service_list[i]);
  }
}

setInterval(function(){
  updateDataPod();
  updateData(); // global

}, 60000);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.listen(app.get("port"), "0.0.0.0", function() {
	console.log("Server started on port " + app.get("port"));
});