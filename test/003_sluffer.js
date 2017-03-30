const assert = require("assert");

var setting = require("../setting");
var reqpath = require('path');

const sluffer = require("../sluffer");

describe("### Sluffer (Library)", function() {
    describe("File type .txt", function() {
        it("should get list of records", function(done) {
            var path = "./test/data/lines.txt";
            sluffer(
                isAbsolutePath(path) ? reqpath.join(setting.PROJECT_DIR, path) : path,
                { page: 1, limit: 5, totail: false },
                function(response, page) {
                    if(response.status) {
                        done();
                    }
                });
        });
    });

    describe("File type .log", function() {
        it("should get list of records", function(done) {
            var path = "./test/data/file.log";
            sluffer(
                isAbsolutePath(path) ? reqpath.join(setting.PROJECT_DIR, path) : path,
                { page: 1, limit: 5, totail: false },
                function(response, page) {
                    if(response.status) {
                        done();
                    }
                });
        });
    });

    describe("No file type", function() {
        it("should get list of records", function(done) {
            var path = "./test/data/words";
            sluffer(
                isAbsolutePath(path) ? reqpath.join(setting.PROJECT_DIR, path) : path,
                { page: 1, limit: 5, totail: false },
                function(response, page) {
                    if(response.status) {
                        done();
                    }
                });
        });
    });

    describe("Display 0 item", function() {
        it("should respond with 0 item", function(done) {
            var path = "./test/data/lines.txt";
            sluffer(
                isAbsolutePath(path) ? reqpath.join(setting.PROJECT_DIR, path) : path,
                { page: 1, limit: 0, totail: false },
                function(response, page) {
                    if(response.status) {
                        if(response.data.length === 0) done();
                    }
                });
        });
    });

    describe("Display 10 items", function() {
        it("should respond with 10 items", function(done) {
            var path = "./test/data/file.log";
            sluffer(
                isAbsolutePath(path) ? reqpath.join(setting.PROJECT_DIR, path) : path,
                { page: 1, limit: 10, totail: false },
                function(response, page) {
                    if(response.status) {
                        if(response.data.length === 10) done();
                    }
                });
        });
    });

    describe("Display 90,000 items", function() {
        it("should respond with 90,000 items", function(done) {
            var path = "./test/data/words";
            sluffer(
                isAbsolutePath(path) ? reqpath.join(setting.PROJECT_DIR, path) : path,
                { page: 1, limit: 90000, totail: false },
                function(response, page) {
                    if(response.status) {
                        if(response.data.length === 90000) done();
                    }
                });
        });
    });

    describe("Go to page 0", function() {
        it("should respond with no item", function(done) {
            var path = "./test/data/file.log";
            sluffer(
                isAbsolutePath(path) ? reqpath.join(setting.PROJECT_DIR, path) : path,
                { page: 0, limit: 10, totail: false },
                function(response, page) {
                    if(response.status) {
                        if(response.data.length === 0) done();
                    }
                });
        });
    });

    describe("Go to page 100", function() {
        it("should respond not more than 10 items", function(done) {
            var path = "./test/data/words";
            sluffer(
                isAbsolutePath(path) ? reqpath.join(setting.PROJECT_DIR, path) : path,
                { page: 100, limit: 10, totail: false },
                function(response, page) {
                    if(response.status) {
                        if(response.data.length <= 10) done();
                    }
                });
        });
    });

    describe("Go to page 1000", function() {
        it("should respond not more than 10 items", function(done) {
            var path = "./test/data/words";
            sluffer(
                isAbsolutePath(path) ? reqpath.join(setting.PROJECT_DIR, path) : path,
                { page: 1000, limit: 10, totail: false },
                function(response, page) {
                    if(response.status) {
                        if(response.data.length <= 10) done();
                    }
                });
        });
    });

    var lastpage1;
    describe("Go to page last page", function() {
        it("should respond any items", function(done) {
            var path = "./test/data/file.log";
            sluffer(
                isAbsolutePath(path) ? reqpath.join(setting.PROJECT_DIR, path) : path,
                { limit: 10, totail: true },
                function(response, page) {
                    if(response.status) {
                        if(response.data.length <= 10) done();
                        lastpage1 = page + 1;
                    }
                });
        });
    });

    describe("Go to next page of the previous last page", function() {
        it("should respond with no item", function(done) {
            var path = "./test/data/file.log";
            sluffer(
                isAbsolutePath(path) ? reqpath.join(setting.PROJECT_DIR, path) : path,
                { page: lastpage1, limit: 10, totail: false },
                function(response, page) {
                    if(response.status) {
                        if(response.data.length === 0) done();
                    }
                });
        });
    });

    var lastpage2;
    describe("Go to page last page of the huge file", function() {
        it("should respond any items", function(done) {
            var path = "./test/data/words";
            sluffer(
                isAbsolutePath(path) ? reqpath.join(setting.PROJECT_DIR, path) : path,
                { limit: 10, totail: true },
                function(response, page) {
                    if(response.status) {
                        if(response.data.length <= 10) done();
                        lastpage2 = page + 1;
                    }
                });
        });
    });

    describe("Go to next page of the previous last page", function() {
        it("should respond with no item", function(done) {
            var path = "./test/data/words";
            sluffer(
                isAbsolutePath(path) ? reqpath.join(setting.PROJECT_DIR, path) : path,
                { page: lastpage2, limit: 10, totail: false },
                function(response, page) {
                    if(response.status) {
                        if(response.data.length === 0) done();
                    }
                });
        });
    });
});

function isAbsolutePath (path) {
  return /^(\.){0,2}(\\|\/).*/.test(path);
}