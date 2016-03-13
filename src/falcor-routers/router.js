var Router = require("falcor-router");
var axios = require("axios");
var _flattenDeep = require('lodash.flattendeep');
var Rx = require("rx");

module.exports = Router.createClass([
  {
    // match a request for the key "greeting"
    route: "greeting",
    // respond with a PathValue with the value of "Hello World."
    get: function() {
      return { path: ["greeting"], value: "Hello World" };
    },
  },
  {
    route: "github.[{keys:userIds}].['name','created_at']",
    get: function(pathSet) {
      var userIds = pathSet.userIds;
      return Rx.Observable.from(userIds).flatMap((uid) => {
        return axios
          .get("https://api.github.com/users/" + uid, {
            headers: {
              "User-Agent": "kkpoon/falcor-express-server-boilerplate",
            },
          })
          .then(function(res) {
            var user = res.data;
            return pathSet[2].map(function(key) {
              return { path: ["github", uid, key], value: user[key] };
            });
          });
      });
    },
  },
  {
    route: "github.[{keys:userIds}].repos.[{integers:indices}].[{keys:repoProps}]",
    get: function(pathSet) {
      var userIds = pathSet.userIds;
      return Rx.Observable.from(userIds).flatMap((uid) => {
        return axios
          .get("https://api.github.com/users/" + uid + "/repos", {
            params: {
              sort: "pushed",
            },
            headers: {
              "User-Agent": "kkpoon/falcor-express-server-boilerplate",
            },
          })
          .then(function(res) {
            var repos = res.data;
            return _flattenDeep(pathSet.indices.map(function(i) {
              return pathSet.repoProps.map(function(key) {
                return {
                  path: ["github", uid, "repos", i, key],
                  value: repos[i][key],
                };
              });
            }));
          });
      });
    },
  },
]);
