var _ = require("lodash");
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json());

module.exports = {

    express: express,

    app: app,

    start: function () {
        var callback = arguments.length && _.isFunction(arguments[arguments.length-1]) ? arguments[arguments.length-1] : undefined;
        var opts = arguments.length && _.isObject(arguments[0]) ? arguments[0] : {};
        var port = opts.port || process.env.PORT || 3000;
        module.exports.url = "http://localhost:"+port;
        console.log("express-runner starting, port: "+port+", onStart: "+!!opts.onStart+", callback: "+!!callback);
        module.exports.server = app.listen(port, function () {
            console.log("listening at port "+port);
            if (opts.onStart) opts.onStart(module.exports);
            if (callback) callback(module.exports);
        });
        return module.exports;
    },

    stop: function (callback) {
        module.exports.server.close(function () {
            if (callback) callback();
        });
    }

};

// called directly

if (require.main === module) {
    console.log("running express-runner with arg: "+process.argv[2]);
    var appis = require(process.argv[2]);
    if (!appis.app) {
        console.log("no exported app in: "+process.argv[2]+", generating app...");
        _.each(appis, function (val, key) {
            if (_.isFunction(val)) {
                console.log("create endpoint GET /"+key);
                app.get("/"+key, function (req, resp) {
                    console.log("GET /"+key);
                    var callbackCalledCount = 0;
                    // call func
                    val(req.query, function (err, result) {
                        console.log("GET /"+key+" => err: "+err+", result: "+result);
                        if (callbackCalledCount++ > 0) {
                            console.error("WARN callback called now "+callbackCalledCount+" times, skipping sending response!");
                            return;
                        }
                        if (err) resp.status(500).send(err);
                        else resp.json(result);
                    });
                });
            }
        })
    }
    module.exports.start({port:80});
}
