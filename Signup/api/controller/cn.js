let Joi = require('joi');
let bodyParser = require('body-parser');
var dbc = require('../../dbCon');
var config = require('../../config.js');
var poolVar = dbc.pool
var express = require('express');
let app = express();
var nodemailer = require('nodemailer');
let jwt = require('jsonwebtoken');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var url = require('url');
var crypto = require('crypto');
let schema = Joi.object().keys({
  firstname: Joi.string().alphanum().min(3).max(30).required(),
  lastname: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email({ minDomainAtoms: 2 }).required(),
  password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required()
})

let c ;



module.exports.signup = (request, response) => {
    let a = request.body.fn;
    console.log(request.body);
    let b = request.body.ln;
    c= request.body.email;
    let d = request.body.pass;
    const result = Joi.validate({ firstname: a, lastname: b ,email: c,password: d }, schema );
       if(result.error!=null)
               {
                console.log(result.error);
                response.send(result.error);
                }
       else{
     
                 var hash = crypto.createHash('md5').update(d).digest('hex');
                 poolVar.query( "INSERT INTO myuser (fn, ln, email, pass) VALUES ( '"+a+"','"+b+"', '"+c+"','"+hash+"' )", (error, results) => {
        if(error){
          console.log("Entered E-mail account is already exist ");
          response.end("Entered E-mail account is already exist ");
        }
         else{
          var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'nitinvg97@gmail.com',
            pass: 'nitintiger@008'
          }
        });
          var adr='http://localhost:3031/email_verification?email='+c+'';
        
          var mailOptions = {
            from: 'nitinvg97@gmail.com',
            to: c,
            subject: 'Congrats! SIGNUP SUCCESSFUL',
            html: 'To verify your Email-account <b> Please click on the given link : </b> <a href='+adr+'>localhost:3031/email_verification</i></a>'
          };
        
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {

                  console.log('Email sent: ' + info.response);
                  console.log("Successfully Signup!");
                  
                      }
                    })
                  
                    response.end("Successfully Signup!");
                  }
              
                //response.status(200).json(results.rows)
              })
            } 
            }

          module.exports.email_verification = (request, response) => {
            var q = url.parse(request.url, true);
            var qdata = q.query;
            console.log(qdata.email);
            poolVar.query( "update myuser set isemailverified='1' where email = '"+qdata.email+"'", (error, results) => {
              if(!error){
              response.end("Your email is successfully verified");
              console.log("Your email is successfully verified");}
              else
              throw error;
          }
            )}

            module.exports.login = (request, response) => {
              
              let e= request.body.email;
              let f = request.body.pass;
              var hash = crypto.createHash('md5').update(f).digest('hex');
              poolVar.query( "select * from myuser where email = '"+e+"' and pass='"+hash+"'", (error, results) => {
                if(results.rowCount!=0){
                  token = jwt.sign({email : e},
                   config.secret,        
                    { expiresIn: '1h' // expires in 24 hours        
                    }
        
                    );
        
                  // return the JWT token for the future API calls
          
                  response.json({
        
                              success: true,
                    
                              message: 'Authentication successful!',
                    
                              token: token
        
                              });
                  console.log(response)
                  // sess.email=request.body.email;
                  // console.log(request.session);
                  // response.end("login success!!!!!");
                }
                else{
                  
                response.end("Wrong userID or Password!!!!!!");
                console.log("Wrong userID or Password!!!!!!");}
                }
              )
              }
              
            
              module.exports.checklogin = (request, response) => {
                let token = request.headers['authorization']; // Express headers are auto converted to lowercase
                
                console.log(token)
                

                if (token) {
                  jwt.verify(token, config.secret, (err, decoded) => {
                    if (err) {
                      return response.json({
                        success: false,
                        message: 'Token is not valid'
                      });
                    } else {
                      
                      
                      return response.json({
                        success: true,
                        message: 'Token is  valid'
                      });
                    }
                  });
                } else {
                  return response.json({
                    success: false,
                    message: 'Auth token is not supplied'
                  });
              }
              
              
                }
          


          module.exports.updatepass= (request, response) => {
            let token = request.headers['authorization']; // Express headers are auto converted to lowercase
          
         // console.log(token)
          

          if (token) {
            jwt.verify(token, config.secret, (err, decoded) => {
              if (err) {
                return response.json({
                  success: false,
                  message: 'Token is not valid'
                });
              } else {
                var d= request.body.newpass;
                var e= decoded.email;
                console.log(d);
                var hash = crypto.createHash('md5').update(d).digest('hex');
                poolVar.query( "update myuser set pass='"+hash+"' where email = '"+e+"'", (error, results) => {
                  if(!error){
                  response.end("Email UPDATED");
                  console.log("Email UPDATED");}
                  else
                  throw error;
              }
                )
              }
            });
          } else {
            return response.json({
              success: false,
              message: 'Auth token is not supplied'
            });
        }
          }

          module.exports.logout= (request, response) => {
            response.status(200).send({ auth: false, token: null });
            response.end("LOGOUT");
          } 