import { Server } from './server/server'
import { mainRouter } from './mainRouter'
import { restaurantsRouter } from './restaurants/restaurants.routers'
import { reviewsRouter } from './reviews/reviews.router'
import { usersRouter } from './users/users.router'


const server = new Server()
server.bootstrap([
  mainRouter,
  restaurantsRouter,
  reviewsRouter,
  usersRouter,
]).then(server => {
  console.log('Server is listening on: ', server.application.address())
}).catch(error => {
  console.log('Server failed to start')
  console.error(error)
  process.exit(1)
}) 

