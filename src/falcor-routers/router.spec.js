var expect = require("chai").expect;
var Router = require("./router");

var router = new Router();

describe("falcor router", function() {
  this.timeout(5000);

  it("should greet with `Hello World`", (done) => {
    var fPath = ["greeting"];
    var expected = "Hello World";
    router.get([fPath]).subscribe((result) => {
      expect(result.jsonGraph.greeting).to.equal(expected);
      done();
    });
  });
  it("should load user github profile", (done) => {
    var fPath = ["github", "kkpoon", ['login', 'created_at']];
    var expected = {login: "kkpoon", created_at: "2010-01-29T02:35:40Z"};
    router.get([fPath]).subscribe((result) => {
      expect(result.jsonGraph.github.kkpoon.id).to.equal(expected.id);
      expect(result.jsonGraph.github.kkpoon.created_at).to.equal(expected.created_at);
      done();
    });
  });
  it("should return the user 10 most recent pushed repos", (done) => {
    var fPath = ["github", "kkpoon", "repos", {from: 0, to: 5}, ['pushed_at']];
    var expected = {login: "kkpoon", created_at: "2010-01-29T02:35:40Z"};
    router.get([fPath]).subscribe((result) => {
      var repos = result.jsonGraph.github.kkpoon.repos;
      expect(repos["0"].pushed_at >= repos["1"].pushed_at).to.be.true;
      expect(repos["1"].pushed_at >= repos["2"].pushed_at).to.be.true;
      expect(repos["2"].pushed_at >= repos["3"].pushed_at).to.be.true;
      expect(repos["3"].pushed_at >= repos["4"].pushed_at).to.be.true;
      expect(repos["4"].pushed_at >= repos["5"].pushed_at).to.be.true;
      done();
    });
  });
});
