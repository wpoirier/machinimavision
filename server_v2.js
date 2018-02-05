//*******Initialize***************

// This project requires postgreSQL to function
// if your first time running, call 'createdb machinimavisiondb' on the terminal

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const fs = require('fs');
const movieserver = 'http://localhost:8000'
const redis = require('redis')
const client = redis.createClient()
var mid; //movie id

client.on('error', function (err) {
  console.log('Error ' + err)
})

//allow Cross-Origin Resource Sharing
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//==GETS==
app.get('/browse',function(req,res){
  console.log("Get the browsing page data");
  var len = client.llen('movie id list', function (err,reply){
    console.log(reply);
    res.send(reply.toString());
    res.end("end of browse");
  });
});

//==POSTS==

app.post('/', function(req, res){
    console.log('POST /');
    console.dir(req.body);
    res.writeHead(200, {'Content-Type': 'text/html'});
      /*
  var movie_list = client.lrange('movie id list',0,len-1, function (err,reply) {
    console.log("reply in get: " + reply.toString() );
  });
  console.log(movie_list);*/
    res.end('thanks');
});

app.post('/create', function(req, res){
  console.log("generate a new movie ID and write it to the Redis database");
  console.log(req.body);

  //client.set('string key', 'string val', redis.print)
  client.rpush('movie id list', 'new', redis.print);
});

//*******Listen on port 3000********

app.listen(3000,function(){
  console.log("Started on PORT 3000");
});