var LocalStrategy = require('passport-local').Strategy;
var Account = require('../models/db_Account');

module.exports = function(passport) {

    passport.use(new LocalStrategy(Account.authenticate()));

    passport.serializeUser(Account.serializeUser());
    passport.deserializeUser(Account.deserializeUser());
};