var passport = require('passport');
var Account = require('../models/db_Account');

module.exports = function(app, appData) {
    
    app.route('/')
        // GET - accueil
        .get(connected, function (req, res) {
            res.render('index', { user: req.user });
        });


    app.route('/login')
        // GET - formulaire d'authentification
        .get(function (req, res) {
            res.render('login', { error : req.flash('error') });
        })
        // POST - authentification
        .post(function (req, res) {

            // vérif pseudo renseigné
            if (!req.body.username) {
                return res.render('login', { error : 'Le pseudo doit être renseigné.' });
            }
            // vérif mdp renseigné
            if (!req.body.password) {
                return res.render('login', { error : 'Le mot de passe doit être renseigné.' });
            }

            // authentification
            passport.authenticate('local', { 
                failureRedirect: '/login',
                failureFlash: 'Pseudo ou mot de passe incorrect.'
            })(req, res, function () {
                // success
                res.redirect('/');
            });
        });


    app.route('/register')
        // GET - formulaire de création de compte
        .get(function (req, res) {
            res.render('register');
        })
        // POST - création du compte
        .post(function (req, res) {

            // vérif pseudo renseigné
            if (!req.body.username) {
                return res.render('register', { 
                    error : 'Le pseudo doit être renseigné.' 
                });
            }
            // vérif mdp renseigné
            if (!req.body.password) {
                return res.render('register', { 
                    error : 'Le mot de passe doit être renseigné.' 
                });
            }

            // vérif du pseudo déjà existant
            Account.findByUsername(req.body.username, function (err, account) {
                if (account) {
                    return res.render('register', { 
                        error : 'Ce pseudo est déjà pris.' 
                    });
                }
            });

            Account.register(
                new Account({ username : req.body.username }), req.body.password, function (err, account) {
                passport.authenticate('local')(req, res, function () {
                    res.redirect('/');
                });
            });
        });


        app.route('/account')
            // GET - formulaire de changement de mdp
            .get(connected, function (req, res) {
                res.render('account', { 
                    user: req.user, 
                    error : req.flash('error') 
                });
            })
            // POST - changement du mdp
            .post(passport.authenticate('local', { 
                failureRedirect: '/account',
                failureFlash: 'Le mot de passe actuel est incorrect.'
            }), function (req, res) {
                if (req.body.newpassword) {
                    Account.findByUsername(req.user.username, function (err, account) {
                        account.setPassword(req.body.newpassword, function (err) {
                            if (err) {
                                console.log(err);
                            } else {
                                account.save();
                                return res.render('index', {
                                    user: req.user, 
                                    msg : 'Mot de passe changé avec succès.'
                                });
                            }
                        })
                    });
                } else {
                    return res.render('account', { 
                        user: req.user,
                        error : 'Le nouveau mot de passe doit être renseigné.' 
                    });
                }
            });


    app.route('/logout')
        // GET - déconnexion
        .get(function (req, res) {
            req.logout();
            res.redirect('/login');
        });


    app.route('*')
        // 404
        .get(function(req, res) { 
            res.status(404).render('404', { title: appData.title });
        });
};

var connected = function (req, res, next) {
    if (req.user) {
        return next();
    } else {
        res.redirect('/login');
    }
}

