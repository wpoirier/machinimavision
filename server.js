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

app.get('/',function(req,res){
  console.log(req.url);
  var movie_id = req.url.split('/?')[1]
  console.log(movie_id);
  var movie_data = client.lindex('movie id list', movie_id, function (err,reply){
    console.log(reply);
    res.send(reply);
  })
});

//==POSTS==

app.post('/', function(req, res){
    console.log('POST /: send movie data to redis');
    //console.log(JSON.parse( req.body) );
    var mdata = req.body;
    console.log(mdata);
    console.log(mdata.movie_id);
    console.log(JSON.stringify(mdata.saved_inputs_array));
    client.lset('movie id list', mdata.movie_id, JSON.stringify( mdata.saved_inputs_array) );
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