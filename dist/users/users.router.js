"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import { Router } from '../common/router' 
const model_router_1 = require("../common/model-router");
const restify = require("restify");
const users_model_1 = require("./users.model");
class UsersRouter extends model_router_1.ModelRouter {
    constructor() {
        super(users_model_1.User);
        this.findByEmail = (req, res, next) => {
            if (req.query.email) {
                // User.find({email: req.query.email})
                users_model_1.User.findByEmail(req.query.email)
                    .then(user => {
                    if (user) {
                        return [user];
                    }
                    else {
                        return [];
                    }
                })
                    .then(this.renderAll(res, next))
                    .catch(next);
            }
            else {
                next();
            }
        };
        this.on('beforeRender', document => {
            document.password = undefined;
        });
    }
    applyRoutes(application) {
        /*Aqui temos uma implementação antiga onde funcinava, o client recebia o tratamento para a versão mais atual, ou seja, a '2.0.0'
        
        application.get({path: '/users', version: '1.0.0'}, this.findAll)
        application.get({path: '/users', version: '2.0.0'}, [this.findByEmail, this.findAll])
        
        Porém nas versões mais atual do restify se faz necessário o uso de um plugin para versionar essas APIs.
        */
        application.get(`${this.basePath}`, restify.plugins.conditionalHandler([
            { version: '1.0.0', handler: [this.findAll] },
            { version: '2.0.0', handler: [this.findByEmail, this.findAll] }
        ]));
        application.get(`${this.basePath}/:id`, [this.validateID, this.findById]);
        application.post(`${this.basePath}`, this.save);
        application.put(`${this.basePath}/:id`, [this.validateID, this.replace]);
        application.patch(`${this.basePath}/:id`, [this.validateID, this.update]);
        application.del(`${this.basePath}/:id`, [this.validateID, this.delete]);
    }
}
exports.usersRouter = new UsersRouter();
