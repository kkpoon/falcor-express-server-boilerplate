var path = require("path");
var express = require("express");
var morgan = require("morgan");

var falcorExpress = require("falcor-express");
var FalcorRouter = require("./falcor-routers/router");

const app = express();

app.use(morgan("tiny"));

app.use("/model.json", falcorExpress.dataSourceRoute(() => {
  return new FalcorRouter();
}));

module.exports = app;
