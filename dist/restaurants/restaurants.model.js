"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const menuSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String,
    },
    price: {
        required: true,
        type: Number,
    },
});
const restaurantSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String,
    },
    menu: {
        required: false,
        type: [menuSchema],
        select: false,
        default: [],
    },
});
restaurantSchema.statics.findByName = function (name) {
    return this.findOne({ name: name });
};
exports.Restaurant = mongoose.model('Restaurant', restaurantSchema);
