import { Router } from '../common/router'
import * as restify from 'restify'
import { Users } from './users.models'

class UsersRouter extends Router {
  applyRoutes(application: restify.Server) {

    application.get('/users', (req, res, next) => {
      Users.findAll().then(users => {
        res.json(users)
        return next()
      })
    })

    application.get('/users/:id', (req, res, next) => {
      Users.findById(req.params.id).then(user => {
        if(user){
          res.json(user)
          return next()
        }
        res.send(404)
        return next()
      })
    })

  }  
}

export const usersRouter = new UsersRouter()