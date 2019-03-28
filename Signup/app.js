let express = require('express');
let app = express();
module.exports.app=app;
let routes = require("./api/routes");

routes.routeApis(app);

  
  app.listen(3031);