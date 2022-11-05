var express = require("express");
var Router = express.Router();
var conn = require('../../connection')

var https = require('https');
const { type } = require("os");
const { resolveAny } = require("dns");
const { verify } = require("crypto");
let data = '';
const env = 'GCP_PATCH'
Router.get("/", (req, res) => {
    conn.query("SELECT sinfo.service_name,sinfo.refreshed_at,sinfo.image_version,sinfo.build_date,sinfo.api_url,sinfo.global_or_pod,einfo.env_name FROM service_info sinfo, environment_info einfo WHERE sinfo.env_id=einfo.env_id AND einfo.env_name = ? ORDER BY sinfo.service_name ASC",[env], (err, rows, fields) => {
        if (!err) {
            res.render('gcp_patch', { page_title: "GCP PATCH Services ", data: rows });
        }
        else {
            console.log(error);
            res.render('gcp_pathc', { page_title: "GCP PATCH Services ", data: '' });

        }
    })

   
});

module.exports = Router;
//build date ,service name,version,refreshed at