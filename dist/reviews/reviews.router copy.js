"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_router_1 = require("../common/model-router");
const review_model_1 = require("./review.model");
class ReviewsRouter extends model_router_1.ModelRouter {
    constructor() {
        super(review_model_1.Review);
    }
    // findById = (req, res, next) => {
    //   this.model.findById(req.params.id)
    //     .populate('user', 'name')
    //     .populate('restaurant')
    //     .then(this.render(res, next))
    //     .catch(next)
    // }
    applyRoutes(application) {
        application.get('/reviews', this.findAll);
        application.get('/reviews/:id', [this.validateID, this.findById]);
        application.post('/reviews', this.save);
        application.del('/reviews/:id', [this.validateID, this.delete]);
    }
}
exports.reviewsRouter = new ReviewsRouter();
