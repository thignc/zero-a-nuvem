"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_router_1 = require("../common/model-router");
const review_model_1 = require("./review.model");
const users_model_1 = require("../users/users.model");
const restaurants_model_1 = require("../restaurants/restaurants.model");
class ReviewsRouter extends model_router_1.ModelRouter {
    constructor() {
        super(review_model_1.Review);
    }
    envelop(document) {
        let resource = super.envelop(document);
        const restaurantId = document.restaurant._id
            ? document.restaurant._id
            : document.restaurant;
        resource._links.restaurant = `/restaurants/${restaurantId}`;
        return resource;
    }
    prepareOne(query) {
        return query
            .populate('user', ['name', 'email'], users_model_1.User)
            .populate('restaurant', [], restaurants_model_1.Restaurant);
    }
    // findById = (req, res, next) => {
    //   this.model.findById(req.params.id)
    //     .populate('user')
    //     .populate('restaurant', 'name')
    //     .then(this.render(res, next))
    //     .catch(next)
    // }
    applyRoutes(application) {
        application.get(`${this.basePath}`, this.findAll);
        application.get(`${this.basePath}/:id`, [this.validateID, this.findById]);
        application.post(`${this.basePath}`, this.save);
        application.del(`${this.basePath}/:id`, [this.validateID, this.delete]);
    }
}
exports.reviewsRouter = new ReviewsRouter();
