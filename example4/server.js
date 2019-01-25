/*******************************
 * Import Required Modules
 ****************************/
var express = require('express');
var bodyParser = require('body-parser');
var layout = require('express-layout');
var path = require("path")
var app = express();
var cookieParser = require('cookie-parser')
var session = require('cookie-session');
var compression = require('compression')


/*******************************
 * Require Configuration
 ****************************/
var conf = require("./config");


app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// compress all responses
app.use(compression())

//For Static Files
app.set('views', path.join(__dirname, 'views'));


var options = {
    maxAge: '1d',
    setHeaders: function (res, path, stat) {
        res.set('vary', 'Accept-Encoding');
        res.set('x-timestamp', Date.now());
    }
};

var controllerOptions = {
    maxAge: 0,
    setHeaders: function (res, path, stat) {
        res.set('vary', 'Accept-Encoding');
        res.set('x-timestamp', Date.now());
    }
};

app.use('/css', express.static(__dirname + '/webapps/css', options));
app.use('/images', express.static(__dirname + '/webapps/images', options));
app.use('/libraries', express.static(__dirname + '/webapps/libraries', options));
app.use('/webfonts', express.static(__dirname + '/webapps/webfonts', options));

app.use('/js', express.static(__dirname + '/webapps/js', controllerOptions));
app.use(express.static(__dirname + '/webapps', controllerOptions));


app.use(layout());

app.use(cookieParser('boodskap inc'));
app.use(session({secret: '637e0554-7092-11e8-adc0-fa7ae01bbebc'}));


//For Template Engine
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set("view options", {layout: "layout.html"});


var server = require('http').Server(app);

app.conf = conf;

console.log("************************************************************************************");
console.log(new Date() + ' | Boodskap IoT Platform Web Portal Listening on ' + conf['port']);
console.log("************************************************************************************");

server.listen(conf['port']);


//Initializing the web routes
var Routes = require('./routes/http-routes');
new Routes(app);




