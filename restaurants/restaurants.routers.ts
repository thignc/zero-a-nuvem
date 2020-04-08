import * as restify from 'restify'
import { ModelRouter } from '../common/model-router'
import { NotFoundError, RestifyHttpErrorOptions } from 'restify-errors'
import { Restaurant } from '../restaurants/restaurants.model'

class RestaurantsRouter extends ModelRouter<Restaurant> {
  constructor() {
    super(Restaurant)
  }

  findMenu = (req, res, next) => {
    Restaurant.findById(req.params.id, '+menu')
      .then(restaurant => {
        if (restaurant) {
          res.json(restaurant.menu)
          return next()
        } else {
          throw new NotFoundError('Restaurant not found.')
        }
      }).catch(next)
  }

  replaceMenu = (req, res, next) => {
    Restaurant.findById(req.params.id)
      .then(restaurant => {
        if (restaurant) {
          restaurant.menu = req.body // Array de MenuItem
          return restaurant.save()
        } else {
          throw new NotFoundError('Restaurant nof found.')
        }
      }).then(restaurant => {
        res.json(restaurant.menu)
        return next()
      }).catch(next)
  }

  findByName = (req, res, next) => {
    if(req.query.name) {
      Restaurant.findByName(req.query.name)
      .then(user => {
        if(user) {
          return [user]
        } else {
          return []
        }
      })
      .then(this.renderAll(res, next))
      .catch(next)
    } else {
      next()
    }
  }

  applyRoutes(application: restify.Server) {

    // teste
    application.get('/restaurants', restify.plugins.conditionalHandler([
      { version: '1.0.0', handler: [this.findAll]},
      { version: '2.0.0', handler: [ this.findByName ,this.findAll]},
    ]))

    // application.get('/restaurants', this.findAll)
    application.get('/restaurants/:id', [this.validateID, this.findById])
    application.post('/restaurants', this.save)
    application.put('/restaurants/:id', [this.validateID, this.replace])
    application.patch('/restaurants/:id', [this.validateID, this.update])
    application.del('/restaurants/:id', [this.validateID, this.delete])

    application.get('/restaurants/:id/menu', [this.validateID, this.findMenu])
    application.put('/restaurants/:id/menu', [this.validateID, this.replaceMenu])
  }
}

export const restaurantsRouter = new RestaurantsRouter()