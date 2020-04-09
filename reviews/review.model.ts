import * as mongoose from 'mongoose'
import { Restaurant } from '../restaurants/restaurants.model'
import { User } from '../users/users.model'

export interface Review extends mongoose.Document {
  date: Date,
  rating: number,
  comments: String,
  restaurant: mongoose.Types.ObjectId | Restaurant,
  user: mongoose.Types.ObjectId | User,
}

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
})

export const Review = mongoose.model<Review>('Review', reviewSchema)