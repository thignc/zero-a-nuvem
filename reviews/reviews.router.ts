import * as restify from 'restify'
import * as mongoose from 'mongoose'
import { ModelRouter } from '../common/model-router'
import { Review } from './review.model'
import { Router } from '../common/router'
import { User } from '../users/users.model'
import { Restaurant } from '../restaurants/restaurants.model'

class ReviewsRouter extends ModelRouter<Review> {
  constructor() {
    super(Review)
  }

  protected prepareOne(query: mongoose.DocumentQuery<Review, Review>): mongoose.DocumentQuery<Review, Review> {
    return query
            .populate('user', [], User)
            .populate('restaurant', [], Restaurant)
  }

  // findById = (req, res, next) => {
  //   this.model.findById(req.params.id)
  //     .populate('user')
  //     .populate('restaurant', 'name')
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