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

  envelop(document) {
    let resource = super.envelop(document)
    const restaurantId = document.restaurant._id
      ? document.restaurant._id
      : document.restaurant
    resource._links.restaurant = `/restaurants/${restaurantId}`
    return resource
  }


  protected prepareOne(query: mongoose.DocumentQuery<Review, Review>): mongoose.DocumentQuery<Review, Review> {
    return query
            .populate('user', ['name', 'email'], User)
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

    application.get(`${this.basePath}`, this.findAll)
    application.get(`${this.basePath}/:id`, [this.validateID, this.findById])
    application.post(`${this.basePath}`, this.save)
    application.del(`${this.basePath}/:id`, [this.validateID, this.delete])

  }
}

export const reviewsRouter = new ReviewsRouter()