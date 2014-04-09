var restify = require('restify'),
    mongojs = require("mongojs"),
    fs = require('fs'),
    passport = require('passport'),
    jwt = require('jwt-simple');

// Setup some https server options
var https_options = {
  name: "tb-api",
  key: fs.readFileSync('ssl/server.key'),
  certificate: fs.readFileSync('ssl/server.crt'),
  requestCert: true,
  rejectUnauthorized: false
};
 
var ip_addr = '127.0.0.1';
var port    =  '8080';

var server = restify.createServer(https_options);

// set server parsers for parsing requests
server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(restify.CORS());
server.use(passport.initialize());
server.use(passport.session());
// server.use(express.logger('dev'));
// server.use(express.json());
// server.use(express.urlEncodedBodyParser());
// server.use(express.methodOverride());
// server.use(express.cookieParser());
// server.use(passport.initialize());
// server.use(server.router);

// connect to mongoDB
var connection_string = 'mongodb://heroku_app23945910:21kcbqsnvgro5p3ue3k66opajo@ds037987.mongolab.com:37987/heroku_app23945910';
var db = mongojs(connection_string, ['tb-api']);
require("./routes/tb-api")(server, db);
require("./auth/authentication")(server, db, passport, jwt);

// listen to requests for the declared IP above 
server.listen(port ,ip_addr, function(){
    console.log('%s listening at %s ', server.name , server.url);
});