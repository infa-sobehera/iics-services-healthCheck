var express = require("express");
var bodyParser = require("body-parser")
var path = require("path");
const nodemailer = require('nodemailer');
const fs = require('fs')

var routes = require("./routes/aws/routes");
var routes_aws_mrel = require("./routes/aws/r_mrel");
var routes_aws_ml = require("./routes/aws/ml");
var routes_aws_patch = require("./routes/aws/patch")
var routes_aws_ebf = require("./routes/aws/ebf")
var routes_aws_upgrade = require("./routes/aws/upgrade")
var routes_aws_fedramp = require("./routes/aws/fedramp")
var routes_aws_fedramp_mrel = require("./routes/aws/fedramp_mrel")
var routes_aws_perf = require("./routes/aws/perf")
var routes_aws_dev_perf = require("./routes/aws/dev_perf")

var routes_azure_rel = require("./routes/azure/rel")
var routes_azure_mrel = require("./routes/azure/mrel")
var routes_azure_patch = require("./routes/azure/patch")
var routes_azure_upgrade = require("./routes/azure/upgrade")
var routes_gcp_rel = require("./routes/gcp/rel")
var routes_gcp_mrel = require("./routes/gcp/mrel")
var routes_gcp_patch = require("./routes/gcp/patch")
var routes_gcp_upgrade = require("./routes/gcp/upgrade")


var https = require('https');
var mysql = require('mysql');
var conn = require('./connection');
const { AssertionError } = require("assert");

var app = express();

app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
app.use(express.static(__dirname + '/static'));
app.set("view engine", "ejs");

// app.get("/", function (req, res) {
//   res.render('index')
// })
app.use("/", routes);

app.use("/aws_rel", routes);
app.use("/aws_mrel", routes_aws_mrel);
app.use("/aws_ml", routes_aws_ml);
app.use("/aws_patch", routes_aws_patch);
app.use("/aws_ebf", routes_aws_ebf);
app.use("/aws_upgrade", routes_aws_upgrade);
app.use("/aws_fedramp", routes_aws_fedramp);
app.use("/aws_fedramp_mrel", routes_aws_fedramp_mrel);
app.use("/aws_perf", routes_aws_perf);
app.use("/aws_dev_perf", routes_aws_dev_perf);

app.use("/azure_rel", routes_azure_rel)
app.use("/azure_mrel", routes_azure_mrel)
app.use("/azure_patch", routes_azure_patch)
app.use("/azure_upgrade", routes_azure_upgrade)
app.use("/gcp_rel", routes_gcp_rel)
app.use("/gcp_mrel", routes_gcp_mrel)
app.use("/gcp_patch", routes_gcp_patch)
app.use("/gcp_upgrade", routes_gcp_upgrade)

// var transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'pupadhyay.infa@gmail.com',
//     pass: 'arfgafujveyfzuwc'
//   }
// });

// var transporter = nodemailer.createTransport({
//   host: "smtp.office.365.com",
//   port: 25,
//   secure: false, // upgrade later with STARTTLS
//   auth: {
//     user: 'pupadhyay.infa@gmail.com',
//     pass: "Uprameet@1106",
//   },
// })





const env = ['REL', 'ML', 'MREL', 'PATCH', 'EBF', 'UPGRADE', 'FEDRAMP', 'FEDRAMP_MREL', 'PERFORMANCE', 'DEV_PERF']
//EA left
var AWS_env_dict = { 'REL': 'rel', 'ML': 'ml', 'MREL': 'mrel', 'PATCH': 'patch', 'EBF': 'ebf', 'UPGRADE': 'upgrade', 'EA': 'ea', 'FEDRAMP': 'qa', 'FEDRAMP_MREL': 'qa-mrel', 'PERFORMANCE': 'perf', 'DEV_PERF': 'devperf' }
var GCP_env_dict = { 'REL': 'crel2', 'MREL': 'mrel2', 'PATCH': 'rel2', 'UPGRADE': 'upgrade2' }
var AZURE_env_dict = { 'REL': 'rel1', 'MREL': 'mrel1', 'PATCH': 'rel-azure', 'UPGRADE': 'upgrade1' }
var pod2 = ['REL', 'MREL', 'PATCH', 'UPGRADE']


const global_service_list = ['package-manager', 'authz-service', 'orgexpiry', 'branding-service', 'content-repo', 'ma', 'scim-service', 'orgexpiry'];
const pod_service_list = ['admin-service', 'auditlog-service', 'autoscaler-service', 'bundle-service', 'callback-service', 'frs', 'jls-di', 'kms-service', 'license-service', 'ldm', 'migration', 'notification-service', 'p2pms', 'preference-service', 'scheduler-service', 'session-service', 'vcs', 'ac', 'runtime','cis']

const aws_global_service_list = ['package-manager', 'authz-service', 'orgexpiry', 'branding-service', 'content-repo', 'ma', 'scim-service', 'staticui', 'identity-service'];
const aws_pod_service_list = ['admin-service', 'auditlog-service', 'autoscaler-service', 'bundle-service', 'callback-service', 'frs', 'jls-di', 'kms-service', 'license-service', 'ldm', 'migration', 'notification-service', 'p2pms', 'preference-service', 'scheduler-service', 'session-service', 'vcs', 'ac', 'runtime', 'token-service', 'ca-service', 'channel', 'mona','cis','cloudshell','cloudUI']
const azure_global_service_list = ['package-manager', 'authz-service', 'orgexpiry', 'branding-service', 'content-repo', 'ma', 'scim-service', 'staticui', 'identity-service'];
const azure_pod_service_list = ['admin-service', 'auditlog-service', 'autoscaler-service', 'bundle-service', 'callback-service', 'frs', 'jls-di', 'kms-service', 'license-service', 'ldm', 'migration', 'notification-service', 'p2pms', 'preference-service', 'scheduler-service', 'session-service', 'vcs', 'ac', 'runtime', 'ntt-service', 'azure-service', 'token-service', 'ca-service', 'channel', 'mona','cis','cloudshell','cloudUI']
const gcp_global_service_list = ['package-manager', 'authz-service', 'orgexpiry', 'branding-service', 'content-repo', 'ma', 'scim-service', 'staticui', 'gcpmarketplace', 'identity-service'];
const gcp_pod_service_list = ['admin-service', 'auditlog-service', 'autoscaler-service', 'bundle-service', 'callback-service', 'frs', 'jls-di', 'kms-service', 'license-service', 'ldm', 'migration', 'notification-service', 'p2pms', 'preference-service', 'scheduler-service', 'session-service', 'vcs', 'ac', 'runtime', 'token-service', 'ca-service', 'channel', 'mona','cloudshell','cloudUI','cis']



var base_url = "https://qa-$$$.rel.infaqa.com/.../mgmtapi/version/";





// https.get("https://qa-pod1.rel.infaqa.com/ac/mgmtapi/version/", (resp) => {
//   let data = '';
//   // A chunk of data has been received.
//   resp.on('data', (chunk) => {
//     data += chunk;
//   });

//   // The whole response has been received. Print out the result.
//   resp.on('end', () => {
//     console.log(data)
//     let attributes = '';
//     data = data.split("\"").join("");
//     data = data.split("\\n").join("\n")




//     console.log(data)
//     attributes = data.split("\n")
//     console.log(attributes)
//     // let ver = attributes[3].split("=")[1];
//     // var id = attributes[4].split("=")[1];
//     // id = parseInt(id);

//   });

// }).on("error", (err) => {
//   console.log("Error: " + err.message);
// });


//adding data into environment_info table
//data would be only inserted if the table is empty 




function addDataEnvironment_info() {
  var base_url_env = "https://qa-$$$.#ENV#.infaqa.com"
  var base_url_env_fed = "https://$$$.#ENV#.informaticagovcloud.com"


  for (let i = 0; i < env.length; i++) {

    if (AWS_env_dict[env[i]] != undefined) {
      let global_url = '';
      let common_url = '';
      let pod1_url = '';

      if (env[i] == 'FEDRAMP' || env[i] == 'FEDRAMP MREL') {
        // console.log("AWS" + env[i] + "\t\t\t\n\n")
        global_url = base_url_env_fed.replace('$$$', 'ma')
        global_url = global_url.replace('#ENV#', AWS_env_dict[env[i]]);
        // console.log("GLOBAL : " + global_url);
        common_url = base_url_env_fed.replace('$$$', 'common')
        common_url = common_url.replace('#ENV#', AWS_env_dict[env[i]]);
        // console.log("COMMON : " + common_url);
        pod1_url = base_url_env_fed.replace('$$$', 'pod1')
        pod1_url = pod1_url.replace('#ENV#', AWS_env_dict[env[i]]);
        // console.log("POD1 : " + pod1_url);
      }
      else {
        // console.log("AWS" + env[i] + "\t\t\t\n\n")
        global_url = base_url_env.replace('$$$', 'ma')
        global_url = global_url.replace('#ENV#', AWS_env_dict[env[i]]);
        // console.log("GLOBAL : " + global_url);
        common_url = base_url_env.replace('$$$', 'common')
        common_url = common_url.replace('#ENV#', AWS_env_dict[env[i]]);
        // console.log("COMMON : " + common_url);
        pod1_url = base_url_env.replace('$$$', 'pod1')
        pod1_url = pod1_url.replace('#ENV#', AWS_env_dict[env[i]]);
        // console.log("POD1 : " + pod1_url);
      }
      let pod2_url = '';
      if (pod2.indexOf(env[i]) != -1) {
        pod2_url = pod1_url.replace('pod1', 'pod2')
        // console.log("POD2 : " + pod2_url)
      }
      let name = "AWS_" + env[i];
      let dt = new Date().toISOString().slice(0, 19).replace('T', ' ');

      conn.query("SELECT * FROM environment_info WHERE env_name = ? ", [name], (err, rows, fields) => {
        if (!err) {
          if (rows.length == 0) {
            if (pod2_url != '') {
              conn.query("INSERT INTO environment_info (env_name, cloud_provider,global_url,common_url,pod1_url,pod2_url,created_date,active_flag) VALUES (?)", [[name, "AWS", global_url, common_url, pod1_url, pod2_url, dt, "Y"]], function (err, result) {
                if (err) throw err;
                // else
                console.log("Record inserted:");
              });
            }
            else {
              conn.query("INSERT INTO environment_info (env_name, cloud_provider,global_url,common_url,pod1_url,created_date,active_flag) VALUES (?)", [[name, "AWS", global_url, common_url, pod1_url, dt, "Y"]], function (err, result) {
                if (err) throw err;
                // else
                // console.log("Record inserted:");
              });
            }
          }
        }
      })
    }
    if (AZURE_env_dict[env[i]] != undefined) {
      // console.log("AZURE    " + env[i] + "\t\t\t\n\n")
      let global_url = base_url_env.replace('$$$', 'ma')
      global_url = global_url.replace('#ENV#', AZURE_env_dict[env[i]]);
      // console.log("GLOBAL : " + global_url);
      let common_url = base_url_env.replace('$$$', 'common')
      common_url = common_url.replace('#ENV#', AZURE_env_dict[env[i]]);
      // console.log("COMMON : " + common_url);
      let pod1_url = base_url_env.replace('$$$', 'pod1')
      pod1_url = pod1_url.replace('#ENV#', AZURE_env_dict[env[i]]);
      // console.log("POD1 : " + pod1_url);
      let name = "AZURE_" + env[i];
      let dt = new Date().toISOString().slice(0, 19).replace('T', ' ');
      conn.query("SELECT * FROM environment_info WHERE env_name = ? ", [name], (err, rows, fields) => {
        if (!err) {
          if (rows.length == 0) {

            conn.query("INSERT INTO environment_info (env_name, cloud_provider,global_url,common_url,pod1_url,created_date,active_flag) VALUES (?)", [[name, "AZURE", global_url, common_url, pod1_url, dt, "Y"]], function (err, result) {
              if (err) throw err;
              else
                console.log("Record inserted:");
            });
          }
        }
      })

    }
    if (GCP_env_dict[env[i]] != undefined) {
      // console.log("GCP    " + env[i] + "\t\t\t\n\n")
      let global_url = base_url_env.replace('$$$', 'ma')
      global_url = global_url.replace('#ENV#', GCP_env_dict[env[i]]);
      // console.log("GLOBAL : " + global_url);
      let common_url = base_url_env.replace('$$$', 'common')
      common_url = common_url.replace('#ENV#', GCP_env_dict[env[i]]);
      // console.log("COMMON : " + common_url);
      let pod1_url = base_url_env.replace('$$$', 'pod1')
      pod1_url = pod1_url.replace('#ENV#', GCP_env_dict[env[i]]);
      let name = "GCP_" + env[i];
      let dt = new Date().toISOString().slice(0, 19).replace('T', ' ');

      conn.query("SELECT * FROM environment_info WHERE env_name = ? ", [name], (err, rows, fields) => {
        if (!err) {
          if (rows.length == 0) {

            conn.query("INSERT INTO environment_info (env_name, cloud_provider,global_url,common_url,pod1_url,created_date,active_flag) VALUES (?)", [[name, "GCP", global_url, common_url, pod1_url, dt, "Y"]], function (err, result) {
              if (err) throw err;
              else
                console.log("Record inserted:");
            });
          }
        }
      })


    }
  }


}

//based on the urls data in updated into the db 
function updateDataService_info(eid, name, url, created_date, active_flag, global_or_pod) {
  https.get(url, (resp) => {
    let data = '';
    // console.log(url,name);
    // A chunk of data has been received.
    resp.on('data', (chunk) => {
      data += chunk;
    });


    // The whole response has been received. Print out the result.
    resp.on('end', () => {

      if (data.search("Service Unavailable") == -1) {
        data = data.split("\"").join("");
        data = data.split("\\n").join("\n")
        // console.log(data)
        const attributes = data.split("\n");
        const ver = attributes[3].split("=")[1];
        const bd = attributes[0].replace("#", "");
        var id = attributes[4].split("=")[1];
        id = parseInt(id);
        let lu = new Date().toISOString().slice(0, 19).replace('T', ' ');
        // console.log(url,typeof(ver), typeof(id));

        conn.query("SELECT * FROM service_info WHERE service_name = ? AND env_id = ? and global_or_pod = ? ", [name, eid, global_or_pod], (err, rows, fields) => {
          if (!err) {
            if (rows.length == 0) {

              conn.query("INSERT INTO service_info (env_id,service_name, image_version,api_url,build_date,refreshed_at,created_date,active_flag,global_or_pod,pod_status) VALUES (?)", [[eid, name, ver, url, bd, lu, created_date, active_flag, global_or_pod, 'G']], function (err, result) {
                if (err) {
                  //pass
                }
                else
                  console.log("Record inserted:", name);
              });
            }
            else {

              conn.query('UPDATE service_info SET ? WHERE service_name = ? AND env_id = ? AND global_or_pod = ?', [{ service_name: name, api_url: url, image_version: ver, build_date: bd, refreshed_at: lu, global_or_pod: global_or_pod }, name, eid, global_or_pod], (err, rows, fields) => {
                // console.log(url);
                // console.log(rows)
                // console.log("DB updated", name)
              })
              conn.query('UPDATE service_info SET pod_status = CASE WHEN timestampdiff(MINUTE,refreshed_at,utc_timestamp()) >= 30 THEN ? ELSE ? END WHERE service_name = ? AND env_id = ? AND global_or_pod = ?', ['O', 'G', name, eid, global_or_pod], (err, rows, fields) => {
              })
            }

          }
        })

      }
      else {
        let lu = new Date().toISOString().slice(0, 19).replace('T', ' ');


        // console.log(lu)
        // console.log(url,typeof(ver), typeof(id));

        conn.query("SELECT * FROM service_info WHERE service_name = ? AND env_id = ? and global_or_pod = ? ", [name, eid, global_or_pod], (err, rows, fields) => {
          if (!err) {
            if (rows.length != 0) {
              let failed_env_name = ''
              // conn.query('SELECT env_name FROM environment_info WHERE env_id = ?', eid, (err, rows, fields) => {
              //   var mailOptions = {
              //     from: 'pupadhyay.infa@gmail.com',
              //     to: 'pupadhyay@informatica.com',
              //     subject: 'Service Down: ' + name,
              //     text: 'Service Down: ' + name + '\nLast Updated: ' + lu + ' \nEnv: ' + rows[0]['env_name']
              //   };
              //   transporter.sendMail(mailOptions, function (error, info) {
              //     if (error) {
              //       console.log(error);
              //     } else {
              //       console.log('Email sent: ' + info.response);
              //     }
              //   });
              // })


              let ver1 = "Service Unvavilable"
              conn.query('UPDATE service_info SET ? WHERE service_name = ? AND env_id = ? AND global_or_pod = ?', [{ image_version: ver1, refreshed_at: lu, active_flag: active_flag, pod_status: 'R' }, name, eid, global_or_pod], (err, rows, fields) => {
                // console.log(url);
                // console.log(rows)
                // console.log("DB updated", name)
              })
            }

          }
        })
      }

    });

  }).on("error", (err) => {
    // console.log("Error: " + err.message);
    let lu = new Date().toISOString().slice(0, 19).replace('T', ' ');

    conn.query("SELECT * FROM service_info WHERE service_name = ? AND env_id = ? and global_or_pod = ? ", [name, eid, global_or_pod], (err, rows, fields) => {
      if (!err) {

        if (rows.length != 0) {
          conn.query('UPDATE service_info SET ? WHERE service_name = ? AND env_id = ? AND global_or_pod = ?', [{ service_name: name, api_url: url, image_version: 'Service Error' }, name, eid, global_or_pod], (err, rows, fields) => {
            // console.log(url);
            // console.log(rows)
            // console.log("DB updated", name)
          })
          conn.query('UPDATE service_info SET pod_status = CASE WHEN timestampdiff(MINUTE,refreshed_at,utc_timestamp()) >= 1 THEN ? ELSE ? END WHERE service_name = ? AND env_id = ? AND global_or_pod = ?', ['O', 'G', name, eid, global_or_pod], (err, rows, fields) => {
          })
        }

      }
    })
  });


}

//genrates the  API url for all the services in a environments and then calls updateDataService_info function
function genrateServiceURL(cloud_provider, eid, global_url, common_url, pod1_url, pod2_url, created_date, active_flag) {
  if (cloud_provider == 'AWS') {

    for (let i = 0; i < aws_global_service_list.length; i++) {
      if (aws_global_service_list[i] == 'package-manager') {
        var url = common_url + '/' + aws_global_service_list[i] + '/mgmtapi/version';
        updateDataService_info(eid, aws_global_service_list[i], url, created_date, active_flag, 'COMMON')
      }
      else {
        var url = global_url + '/' + aws_global_service_list[i] + '/mgmtapi/version';
        updateDataService_info(eid, aws_global_service_list[i], url, created_date, active_flag, 'GLOBAL')
      }
    }

    for (let i = 0; i < aws_pod_service_list.length; i++) {
      var p1url = pod1_url + '/' + aws_pod_service_list[i] + '/mgmtapi/version';
      // console.log(p1url)
      updateDataService_info(eid, aws_pod_service_list[i], p1url, created_date, active_flag, 'POD1')
    }
    for (let i = 0; i < aws_pod_service_list.length; i++) {
      if (pod2_url != null) {
        var p2url = pod2_url + '/' + aws_pod_service_list[i] + '/mgmtapi/version';
        updateDataService_info(eid, aws_pod_service_list[i], p2url, created_date, active_flag, 'POD2')
      }
    }

  }
  if (cloud_provider == 'AZURE') {
    for (let i = 0; i < azure_global_service_list.length; i++) {
      if (azure_global_service_list[i] == 'package-manager') {
        var url = common_url + '/' + azure_global_service_list[i] + '/mgmtapi/version';
        updateDataService_info(eid, azure_global_service_list[i], url, created_date, active_flag, 'COMMON')
      }
      else {
        var url = global_url + '/' + azure_global_service_list[i] + '/mgmtapi/version';
        updateDataService_info(eid, azure_global_service_list[i], url, created_date, active_flag, 'GLOBAL')
      }
    }

    for (let i = 0; i < azure_pod_service_list.length; i++) {
      var p1url = pod1_url + '/' + azure_pod_service_list[i] + '/mgmtapi/version';
      // console.log(p1url)
      updateDataService_info(eid, azure_pod_service_list[i], p1url, created_date, active_flag, 'POD1')
    }
  }
  if (cloud_provider == 'GCP') {
    for (let i = 0; i < gcp_global_service_list.length; i++) {
      if (gcp_global_service_list[i] == 'package-manager') {
        var url = common_url + '/' + gcp_global_service_list[i] + '/mgmtapi/version';
        updateDataService_info(eid, gcp_global_service_list[i], url, created_date, active_flag, 'COMMON')
      }
      else {
        var url = global_url + '/' + gcp_global_service_list[i] + '/mgmtapi/version';
        updateDataService_info(eid, gcp_global_service_list[i], url, created_date, active_flag, 'GLOBAL')
      }
    }

    for (let i = 0; i < gcp_pod_service_list.length; i++) {
      var p1url = pod1_url + '/' + gcp_pod_service_list[i] + '/mgmtapi/version';
      updateDataService_info(eid, gcp_pod_service_list[i], p1url, created_date, active_flag, 'POD1')
    }
  }
}


//names all the environments and queries all the data from the environment_info table and calls genrateServiceURL function
function addDataService_info() {
  for (let i = 0; i < env.length; i++) {
    const ename = "AWS_" + env[i];
    conn.query("SELECT * FROM environment_info WHERE env_name = ?", [ename], (err, rows, fields) => {
      genrateServiceURL(rows[0].cloud_provider, rows[0].env_id, rows[0].global_url, rows[0].common_url, rows[0].pod1_url, rows[0].pod2_url, rows[0].created_date, rows[0].active_flag)
    })
    const ename2 = "AZURE_" + env[i];
    conn.query("SELECT * FROM environment_info WHERE env_name = ?", [ename2], (err, rows, fields) => {
      if (rows.length) {
        // console.log(ename2)

        genrateServiceURL(rows[0].cloud_provider, rows[0].env_id, rows[0].global_url, rows[0].common_url, rows[0].pod1_url, rows[0].pod2_url, rows[0].created_date, rows[0].active_flag)
      }
    })
    const ename3 = "GCP_" + env[i];
    conn.query("SELECT * FROM environment_info WHERE env_name = ?", [ename3], (err, rows, fields) => {
      if (rows.length) {
        // console.log(ename3)

        genrateServiceURL(rows[0].cloud_provider, rows[0].env_id, rows[0].global_url, rows[0].common_url, rows[0].pod1_url, rows[0].pod2_url, rows[0].created_date, rows[0].active_flag)
      }
    })
  }
}


addDataService_info();
setInterval(function () {
  addDataService_info();
}, 60000)

// var pass =  ''

// fs.readFileSync('pass.txt',(err,data) => {
//   console.log(data.toString());
//   pass = data.toString();
//   console.log(data.toString());
// })



// addDataEnvironment_info()
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.listen(app.get("port"), "0.0.0.0", function () {
  console.log("Server started on port " + app.get("port"));
});

