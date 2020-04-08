import * as mongoose from 'mongoose'

export interface MenuItem extends mongoose.Document {
  name: string,
  price: number,
}

export interface Restaurant extends mongoose.Document {
  name: string,
  menu: MenuItem[],
}

export interface RestaurantModel extends mongoose.Model<Restaurant> {
  findByName(name: string): Promise<Restaurant>
}

const menuSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
  },
  price: {
    required: true,
    type: Number,
  },
})

const restaurantSchema =  new mongoose.Schema({
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
})

restaurantSchema.statics.findByName = function(name: string) {
  return this.findOne({ name: name })
}

export const Restaurant = mongoose.model<Restaurant, RestaurantModel>('Restaurant', restaurantSchema)