"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const restify = require("restify");
const mongoose = require("mongoose");
const enviroment_1 = require("../common/enviroment");
const merge_patch_parser_1 = require("./merge-patch.parser");
const error_handler_1 = require("./error.handler");
class Server {
    initializedDb() {
        mongoose.Promise = global.Promise;
        return mongoose.connect(enviroment_1.enviroment.db.url, {
        // useMongoClient: true,
        // useNewUrlParser: true,
        // useUnifiedTopology: true
        });
    }
    initRoutes(routers) {
        return new Promise((resolve, reject) => {
            try {
                this.application = restify.createServer({
                    name: 'meat-api',
                    version: '1.0.0'
                });
                this.application.use(restify.plugins.queryParser());
                this.application.use(restify.plugins.bodyParser());
                this.application.use(merge_patch_parser_1.mergePatchBodyParser);
                // routes
                for (let router of routers) {
                    router.applyRoutes(this.application);
                }
                this.application.listen(enviroment_1.enviroment.server.port, () => {
                    resolve(this.application);
                });
                this.application.on('restifyError', error_handler_1.handleError);
            }
            catch (error) {
                reject(error);
            }
        });
    }
    bootstrap(routers = []) {
        return this.initializedDb()
            .then(() => this.initRoutes(routers).then(() => this));
    }
}
exports.Server = Server;
