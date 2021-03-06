"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server/server");
const mainRouter_1 = require("./mainRouter");
const restaurants_routers_1 = require("./restaurants/restaurants.routers");
const reviews_router_1 = require("./reviews/reviews.router");
const users_router_1 = require("./users/users.router");
const server = new server_1.Server();
server.bootstrap([
    mainRouter_1.mainRouter,
    restaurants_routers_1.restaurantsRouter,
    reviews_router_1.reviewsRouter,
    users_router_1.usersRouter,
]).then(server => {
    console.log('Server is listening on: ', server.application.address());
}).catch(error => {
    console.log('Server failed to start');
    console.error(error);
    process.exit(1);
});
