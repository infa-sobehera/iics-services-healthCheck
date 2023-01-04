var express = require("express");
var Router = express.Router();
var conn = require('../../connection')

var https = require('https');
const { type } = require("os");
const { resolveAny } = require("dns");
const { verify } = require("crypto");
let data = '';
const env = 'AWS_PERFORMANCE'
Router.get("/", (req, res) => {
    conn.query("SELECT sinfo.pod_status,sinfo.service_name,sinfo.refreshed_at,sinfo.image_version,sinfo.build_date,sinfo.api_url,sinfo.global_or_pod,sinfo.active_flag,einfo.env_name FROM service_info sinfo, environment_info einfo WHERE sinfo.env_id=einfo.env_id AND einfo.env_name = ? ORDER BY sinfo.service_name ASC",[env], (err, rows, fields) => {
        if (!err) {
            res.render('aws_perf', { page_title: "AWS REL Services ", data: rows });
        }
        else {
            console.log(error);
            res.render('aws_perf', { page_title: "AWS REL Services ", data: '' });

        }
    })

   
});

module.exports = Router;