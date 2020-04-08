import * as restify from 'restify'
import * as mongoose from 'mongoose'
import { ModelRouter } from '../common/model-router'
import { Review } from './review.model'
import { Router } from '../common/router'

class ReviewsRouter extends ModelRouter<Review> {
  constructor() {
    super(Review)
  }

  // findById = (req, res, next) => {
  //   this.model.findById(req.params.id)
  //     .populate('user', 'name')
  //     .populate('restaurant')
  //     .then(this.render(res, next))
  //     .catch(next)
  // }

  applyRoutes(application: restify.Server) {

    application.get('/reviews', this.findAll)
    application.get('/reviews/:id', [this.validateID, this.findById])
    application.post('/reviews', this.save)
    application.del('/reviews/:id', [this.validateID, this.delete])

  }
}

export const reviewsRouter = new ReviewsRouter()