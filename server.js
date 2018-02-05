//*******Initialize***************

// This project requires postgreSQL to function
// if your first time running, call 'createdb machinimavisiondb' on the terminal

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const fs = require('fs');
//const pgp = require('pg-promise')(/*options*/);
const movieserver = 'localhost:8000'
const Sequelize = require('sequelize');

const sequelize = new Sequelize('postgres://user:pass@localhost:5432/machinimavisiondb');
console.log(sequelize);

/*
const cn = {
    host: 'localhost', // server name or IP address;
    port: 5432,
    database: 'machinimaTestDB',
    user: 'william',
    password: 'MasterSwitch'
};

// alternative:
// const cn = 'postgres://username:password@host:port/database';
const db = pgp(cn); // database instance;
console.log("db: ", db);
*/

app.use(express.static(__dirname + '/public'));

//allow Cross-Origin Resource Sharing
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//*********Routes*************

//==GETS==

app.get('/',function(req,res){
  console.log('home');
  res.sendFile(__dirname + "/index.html");
});

app.get('/style.css',function (req, res) {
    res.sendFile(__dirname + '/style.css')
});

app.get('/browse',function(req,res){
  console.log("browse page");
  res.sendFile(__dirname + "/browse.html");
});

app.get('/create',function(req,res){
  console.log("create page");
  res.sendFile(__dirname + "/create.html");
});

app.get('/threejs_demo/',function(req,res){
  console.log("three js demo page");
  res.sendFile(__dirname + "/threejs_demo/index.html");
});

/*threejs gets
const threejs = '/threejs_demo/three/examples/js/three.js';
const loadersupportjs= '/threejs_demo/three/examples/js/loaders/loadersupport.js';
const objloader2js = '/threejs_demo/three/examples/js/loaders/OBJLoader2.js';
const objloaderjs = '/threejs_demo/three/examples/js/loaders/OBJLoader.js';
const orbitcontrolsjs = '/threejs_demo/three/examples/js/controls/OrbitControls.js';
const webvrjs = '/threejs_demo/three/examples/js/vr/WebVR.js';
//'https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js'
app.get(threejs, function(req,res){res.sendFile(threejs); });
app.get(loadersupportjs, function(req,res){res.sendFile(loadersupportjs); });
app.get(objloader2js, function(req,res){res.sendFile(objloader2js); });
app.get(objloaderjs, function(req,res){res.sendFile(objloaderjs); });
app.get(orbitcontrolsjs, function(req,res){res.sendFile(orbitcontrolsjs); });
app.get(webvrjs, function(req,res){res.sendFile(webvrjs); });
*/

//==POSTS==

app.post('/', function(req, res){
    console.log('POST /');
    console.dir(req.body);
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end('thanks');
});

app.post('/create', function(req, res){
  console.log("this function will generate an html file for a new movie from the base template");
  console.log(req.body);
  //fs.writeFile("/threejs_demo/test");
  }
);

app.post(movieserver, function(req, res){
  console.log(req);
  }
);

//*******Listen on port 3000********

app.listen(3000,function(){
  console.log("Started on PORT 3000");
});