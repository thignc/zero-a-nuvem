import * as restify from 'restify'
import { ModelRouter } from '../common/model-router'
import { NotFoundError, RestifyHttpErrorOptions } from 'restify-errors'
import { Restaurant } from '../restaurants/restaurants.model'

class RestaurantsRouter extends ModelRouter<Restaurant> {
  constructor() {
    super(Restaurant)
  }

  envelop(document) {
    let resource = super.envelop(document)
    resource._links.menu = `${this.basePath}/${resource._id}/menu`
    return resource
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
    application.get(`${this.basePath}`, restify.plugins.conditionalHandler([
      { version: '1.0.0', handler: [this.findAll]},
      { version: '2.0.0', handler: [ this.findByName ,this.findAll]},
    ]))

    // application.get(`${this.basePath}`, this.findAll)
    application.get(`${this.basePath}/:id`, [this.validateID, this.findById])
    application.post(`${this.basePath}`, this.save)
    application.put(`${this.basePath}/:id`, [this.validateID, this.replace])
    application.patch(`${this.basePath}/:id`, [this.validateID, this.update])
    application.del(`${this.basePath}/:id`, [this.validateID, this.delete])

    application.get(`${this.basePath}/:id/menu`, [this.validateID, this.findMenu])
    application.put(`${this.basePath}/:id/menu`, [this.validateID, this.replaceMenu])
  }
}

export const restaurantsRouter = new RestaurantsRouter()