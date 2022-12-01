var express = require("express");
var Router = express.Router();
var conn = require('../../connection')

var https = require('https');
const { type } = require("os");
const { resolveAny } = require("dns");
const { verify } = require("crypto");
let data = '';
const env = 'AZURE_REL'
Router.get("/", (req, res) => {
    conn.query("SELECT sinfo.pod_status,sinfo.service_name,sinfo.refreshed_at,sinfo.image_version,sinfo.build_date,sinfo.api_url,sinfo.global_or_pod,einfo.env_name FROM service_info sinfo, environment_info einfo WHERE sinfo.env_id=einfo.env_id AND einfo.env_name = ? ORDER BY sinfo.service_name ASC",[env], (err, rows, fields) => {
        if (!err) {
            res.render('azure_rel', { page_title: "AZURE REL Services ", data: rows });
        }
        else {
            console.log(error);
            res.render('azure_rel', { page_title: "AZURE REL Services ", data: '' });

        }
    })

   
});

module.exports = Router;
//build date ,service name,version,refreshed at