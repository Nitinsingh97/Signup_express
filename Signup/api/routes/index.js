var fscontroller=require('../controller/cn');
let bodyParser = require('body-parser');
var ap= require("/home/vvdn/Desktop/Signup/app");
var apk=ap.app;
apk.use(bodyParser.json());
apk.use(bodyParser.urlencoded({ extended: true }));
exports.routeApis = function(app){
 app.post('/signup', fscontroller.signup) ;
 app.get('/email_verification', fscontroller.email_verification) ;
 app.post('/login', fscontroller.login) ;
 app.post('/updatepass', fscontroller.updatepass) ;
 app.get('/checklogin', fscontroller.checklogin) ;
 app.get('/logout', fscontroller.logout) ;
}


