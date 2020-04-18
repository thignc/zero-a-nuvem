import { Router } from './common/router'
import * as restify from 'restify'

class MainRouter extends Router {
  applyRoutes(application: restify.Server) {
    application.get('/', (req, res, next) => {
      res.json({
        restaurants: '/restaurants',
        reviews: '/reviews',
        users: '/users',
      })
    })
  }
}

export const mainRouter = new MainRouter()