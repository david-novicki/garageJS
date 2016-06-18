var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var twilio = require('twilio');

var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config'); // get our config file
var User   = require('./models/user'); // get our mongoose model
    
// =======================
// configuration =========
// =======================
var port = process.env.PORT || 8080; // used to create, sign, and verify tokens
mongoose.connect(config.database); // connect to database
app.set('superSecret', config.secret); // secret variable

var accountSid = 'insertsidhere'; // Your Account SID from www.twilio.com/console
var authToken = 'inserttokenhere';   // Your Auth Token from www.twilio.com/console

var twilio = require('twilio');
var client = new twilio.RestClient(accountSid, authToken);

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

// =======================
// routes ================
// =======================
// basic route
app.get('/', function(req, res) {
    res.sendfile('login.html');
});
app.get('/home', function(req, res) {
    res.sendfile('home.html');
});

// route to authenticate a user (POST http://localhost:8080/api/authenticate)
app.post('/authenticate', function(req, res) {

  // find the user
  User.findOne({
    username: req.body.username
  }, function(err, user) {

    if (err) throw err;

    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {

      // check if password matches
      if (user.password != req.body.password) {
        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
      } else {

        // if user is found and password is right
        // create a token
        var token = jwt.sign(user, app.get('superSecret'),{
          expiresIn:"24h"
        });//, {
          //expiresInMinutes: 1440 // expires in 24 hours
        //});

        // return the information including token as JSON
        res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token,
          redirect: 'home'
        });
      }   

    }

  });
});

// API ROUTES -------------------

// get an instance of the router for api routes
var apiRoutes = express.Router(); 

// route middleware to verify a token
apiRoutes.use(function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, app.get('superSecret'), function(err, decoded) {      
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });    
      } else {
        // if everything is good, save to request for use in other routes
        console.log(decoded);
        req.decoded = decoded;    
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });
    
  }
});

// route to show a random message (GET http://localhost:8080/api/)
apiRoutes.get('/', function(req, res) {
  res.json({ message: 'Welcome to the coolest API on earth!' });
});

apiRoutes.post('/garage', function(req, res) {
  var cp = require('child_process');
    var process = cp.spawn('python',["door.py"]);

    process.stdout.on('data', function(data){
      console.log(data);
    });
    process.on('close', function(code){
      console.log(code);
    });
    process.stderr.on('data', function(data){
      console.log('error: ' + data);
    });
    client.messages.create({
      body: 'Garage door pressed',
      to: '+1234567',  // Text this number
      from: '+1234567' // From a valid Twilio number
    }, function(err, message) {
      if (err) { console.log(err); };
        if (message) { console.log(message.sid); };
    });
});
// route to return all users (GET http://localhost:8080/api/users)
apiRoutes.get('/users', function(req, res) {
  User.find({}, function(err, users) {
    res.json(users);
  });
});  

apiRoutes.post('/register', function(req, res) {

  // create user
  var person = new User({ 
    username: req.body.username,
    email: req.body.email,
    firstname: req.body.firstname, 
    lastname: req.body.lastname,
    password: req.body.password,
    phone: req.body.phone,
    admin: req.body.admin 
  });
  console.log(person);

  // save user
  person.save(function(err) {
    if (err) {
      res.json({ success: false });
    }
    console.log('User saved successfully');
    res.json({ success: true });
  });
});
// apply the routes to our application with the prefix /api
app.use('/api', apiRoutes);


// =======================
// start the server ======
// =======================
app.listen(port);
console.log('Hosted at http://localhost:' + port);