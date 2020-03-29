"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = require("../common/router");
const users_models_1 = require("./users.models");
class UsersRouter extends router_1.Router {
    applyRoutes(application) {
        application.get('/users', (req, res, next) => {
            users_models_1.Users.findAll().then(users => {
                res.json(users);
                return next();
            });
        });
        application.get('/users/:id', (req, res, next) => {
            users_models_1.Users.findById(req.params.id).then(user => {
                if (user) {
                    res.json(user);
                    return next();
                }
                res.send(404);
                return next();
            });
        });
    }
}
exports.usersRouter = new UsersRouter();
