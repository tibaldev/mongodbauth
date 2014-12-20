/** --- MODULES --- **/
var path           = require('path'),
    express        = require('express'), 
    http           = require('http'),
    bodyParser     = require('body-parser'),
    session        = require('express-session'),
    errorHandler   = require('errorhandler'),
    mongoose       = require('mongoose'),
    passport       = require('passport'),
    flash          = require('connect-flash'),
    app            = express(),
    appData        = require('./config/config.js'),
    router         = express.Router();


/** --- CONFIGURATION --- **/
app.set('port', process.env.PORT || appData.port);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set('env', 'development');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({secret: 'abitbol', resave: true, saveUninitialized: true}));
app.use(flash());
// doit être déclaré en dernier :
app.use(passport.initialize());
app.use(passport.session());


/** --- PASSPORT --- **/
require('./script/passport')(passport);


/** --- MONGOOSE --- **/
mongoose.connect(appData.mongoconnect);


/** --- ROUTES --- **/
require('./routes/index.js')(app, router, appData);

/** --- SERVEUR --- **/
if (app.get('env') == 'dev') {
    app.use(errorHandler());
}
app.listen(app.get('port'));