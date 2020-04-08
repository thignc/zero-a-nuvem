"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const reviewSchema = new mongoose.Schema({
    date: {
        required: true,
        type: Date,
    },
    rating: {
        required: true,
        type: Number,
        min: 0,
        max: 10,
    },
    comments: {
        required: true,
        type: String,
        maxlength: 500,
    },
    restaurant: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
    },
    user: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
    }
});
exports.Review = mongoose.model('Review', reviewSchema);
