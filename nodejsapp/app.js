var express = require("express");
var bodyParser = require("body-parser")
var path = require("path");
var routes = require("./routes");
var http = require('http');


var app = express();
app.set("port", process.env.PORT || 3000);
// app.set("views", path.join(__dirname, "views"));
// app.set("view engine", "ejs");



app.get("/",function(req,res){
	res.sendFile((__dirname + "/index.html"))
})
app.get("/rel",function(req,res){
	res.sendFile((__dirname + "/rel.html"))
})
app.get("/rel/global",function(req,res){
	res.sendFile((__dirname + "/global.html"))
})
app.get("/rel/pod",function(req,res){
	res.sendFile((__dirname + "/pod.html"))
})
app.get("/mrel",function(req,res){
	res.sendFile((__dirname + "/mrel.html"))
})

app.use(routes);
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.listen(app.get("port"), "0.0.0.0", function() {
	console.log("Server started on port " + app.get("port"));
});