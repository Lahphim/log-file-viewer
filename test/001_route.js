const assert = require("assert");
const request = require("supertest");

describe("### Routing", function() {
    var url = "localhost:3000";

    describe("GET /", function(done) {
        it("should respond with status 200", function(done) {
            request(url)
                .get("/")
                .expect(200, done);
        });
    });

    describe("POST /getloglines", function(done) {
        it("should repond with status 200", function(done) {
            request(url)
                .post("/getloglines")
                .send({
                    path: "./test/data/file.log",
                    page: 1
                })
                .expect(200, done);
        });
    });

    describe("GET /getloglines", function(done) {
        it("should repond with status 404", function(done) {
            request(url)
                .get("/getloglines")
                .send({
                    path: "./test/data/file.log",
                    page: 1
                })
                .expect(404, done);
        });
    });
});