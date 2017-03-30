const assert = require("assert");
const request = require("supertest");

describe("### API", function() {
    var url = "localhost:3000";

    describe("POST /getloglines (page no.0)", function(done) {
        it("should repond no items", function(done) {
            request(url)
                .post("/getloglines")
                .send({
                    path: "./test/data/file.log",
                    page: 0
                })
                .expect(200)
                .end(function(err, res) {
                    if((/No items\./.test(res.text))) {
                        done();
                    }
                });;
        });
    });

    describe("POST /getloglines (page no.1)", function(done) {
        it("should repond with page no.1", function(done) {
            request(url)
                .post("/getloglines")
                .send({
                    path: "./test/data/file.log",
                    page: 1
                })
                .expect(200)
                .end(function(err, res) {
                    if(/data-page="1"/.test(res.text)) {
                        done();
                    }
                });;
        });
    });

    describe("POST /getloglines (page no.3)", function(done) {
        it("should repond with page no.3", function(done) {
            request(url)
                .post("/getloglines")
                .send({
                    path: "./test/data/file.log",
                    page: 3
                })
                .expect(200)
                .end(function(err, res) {
                    if(/data-page="3"/.test(res.text)) {
                        done();
                    }
                });;
        });
    });

    describe("POST /getloglines (page no.100)", function(done) {
        it("should repond with page no.100 with no items", function(done) {
            request(url)
                .post("/getloglines")
                .send({
                    path: "./test/data/file.log",
                    page: 100
                })
                .expect(200)
                .end(function(err, res) {
                    if(/No items\./.test(res.text)) {
                        done();
                    }
                });;
        });
    });
    
    describe("POST /getloglines (last page)", function(done) {
        it("should repond with page and exist items", function(done) {
            request(url)
                .post("/getloglines")
                .send({
                    path: "./test/data/file.log",
                    totail: true
                })
                .expect(200)
                .end(function(err, res) {
                    if(!(/No items\./.test(res.text))) {
                        done();
                    }
                });;
        });
    });
});