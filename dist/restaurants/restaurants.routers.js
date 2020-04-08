"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const restify = require("restify");
const model_router_1 = require("../common/model-router");
const restify_errors_1 = require("restify-errors");
const restaurants_model_1 = require("../restaurants/restaurants.model");
class RestaurantsRouter extends model_router_1.ModelRouter {
    constructor() {
        super(restaurants_model_1.Restaurant);
        this.findMenu = (req, res, next) => {
            restaurants_model_1.Restaurant.findById(req.params.id, '+menu')
                .then(restaurant => {
                if (restaurant) {
                    res.json(restaurant.menu);
                    return next();
                }
                else {
                    throw new restify_errors_1.NotFoundError('Restaurant not found.');
                }
            }).catch(next);
        };
        this.replaceMenu = (req, res, next) => {
            restaurants_model_1.Restaurant.findById(req.params.id)
                .then(restaurant => {
                if (restaurant) {
                    restaurant.menu = req.body; // Array de MenuItem
                    return restaurant.save();
                }
                else {
                    throw new restify_errors_1.NotFoundError('Restaurant nof found.');
                }
            }).then(restaurant => {
                res.json(restaurant.menu);
                return next();
            }).catch(next);
        };
        this.findByName = (req, res, next) => {
            if (req.query.name) {
                restaurants_model_1.Restaurant.findByName(req.query.name)
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
    }
    applyRoutes(application) {
        // teste
        application.get('/restaurants', restify.plugins.conditionalHandler([
            { version: '1.0.0', handler: [this.findAll] },
            { version: '2.0.0', handler: [this.findByName, this.findAll] },
        ]));
        // application.get('/restaurants', this.findAll)
        application.get('/restaurants/:id', [this.validateID, this.findById]);
        application.post('/restaurants', this.save);
        application.put('/restaurants/:id', [this.validateID, this.replace]);
        application.patch('/restaurants/:id', [this.validateID, this.update]);
        application.del('/restaurants/:id', [this.validateID, this.delete]);
        application.get('/restaurants/:id/menu', [this.validateID, this.findMenu]);
        application.put('/restaurants/:id/menu', [this.validateID, this.replaceMenu]);
    }
}
exports.restaurantsRouter = new RestaurantsRouter();
