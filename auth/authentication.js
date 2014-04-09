var Authentication = function (server, db, passport, jwt) {

    var bcrypt = require('bcrypt-nodejs');

    console.log("authenticate file required - success");
    var LocalStrategy = require('passport-local').Strategy;

    server.post({path: '/login', version:'0.0.1'}, login);
    server.post({path: '/register', version:'0.0.1'}, register);
    server.get({path: '/logout', version:'0.0.1'}, logout);

//    app.post('/login', passport.authenticate('local', { successReturnToOrRedirect: '/', failureRedirect: '/login' }));
    function login(req, res, next) {
        console.log("request to login - recieved");
        // TODO: must generate an API Token that logged in users 
        //       can then include in the request to access the API methods
        //       use JWT-SIMPLE
        passport.authenticate('local', function (err, user, info) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.send(401);
            }
            req.logIn(user, function (err) {
                if (err) {
                    return next(err);
                }
                // var encoded_token = {"token":jwt.encode(user, user._id.toString())};
                return res.send(200);
            });
        })(req, res, next);
    };

    function logout(req, res) {
        console.log("request to logout - recieved");
        // TODO: make this a post request, and remove the 
        //       temporary API Token associated with user
        req.logout();
        res.clearCookie("user");
        // res.redirect('/');
    };

    function register(req, res, next) {
        console.log("request to register - recieved");
        var collection = db.collection('users');
        // TODO: make sure that only admin access level users
        //       are allowed to add/register new users
        db.collection('users').findOne({email: req.body.email}, function (err, item) {
            if (item == null) {
                collection.find().toArray(function (err, users) {
                    var lastId = 0;
                    if (users && users.length > 0) {
                        lastId = users[users.length - 1].id;
                    }
                    var newId = lastId + 1;
                    bcrypt.genSalt(10, function (err, salt) {
                        bcrypt.hash(req.body.password, salt, null, function (err, hash) {
                            collection.insert({
                                                id: newId, 
                                                email: req.body.email, 
                                                password: hash,
                                                franchisee_id: req.body.franchisee_id,
                                                access_level: req.body.access_level,
                                                profile_info: req.body.profile_info
                                            }, function (err, result) {});
                            console.log("request to register - success");
                            return res.send(200);
                        });
                    });
                })
            } else {
                console.log("request to register - user already exists");
                return res.send(409);
            }
        });
    };

    function findById(id, fn) {
        console.log("find by id request - recieved");
        db.collection('users').findOne({id: id}, function (err, item) {
            return fn(null, item);
        });
    }

    function findByEmail(email, fn) {
        console.log("find by Email request - recieved");
        db.collection('users').findOne({email: email}, function (err, item) {
            console.log(item);
            user = fn(null, item);
            return user;
        });
    }

    // Passport session setup.
    //   To support persistent login sessions, Passport needs to be able to
    //   serialize users into and deserialize users out of the session.  Typically,
    //   this will be as simple as storing the user ID when serializing, and finding
    //   the user by ID when deserializing.
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        findById(id, function (err, user) {
            done(err, user);
        });
    });

    // Use the LocalStrategy within Passport.
    //   Strategies in passport require a `verify` function, which accept
    //   credentials (in this case, a username and password), and invoke a callback
    //   with a user object.  In the real world, this would query a database;
    //   however, in this example we are using a baked-in set of users.
    passport.use(new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        function (email, password, done) {
            // Find the user by username.  If there is no user with the given
            // username, or the password is not correct, set the user to `false` to
            // indicate failure and set a flash message.  Otherwise, return the
            // authenticated `user`.

//            findByUsername(username, function (err, user) {
            findByEmail(email, function (err, user) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false, { message: 'Unknown user ' + email });
                }

                if (!bcrypt.compareSync(password, user.password)) {
                    return done(null, false, { message: 'Invalid password' });
                }
                return done(null, user);
            })
        }
    ));
}

module.exports = Authentication;