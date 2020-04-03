import * as mongoose from 'mongoose'
import { validateCPF } from '../common/validators/cpf'
import * as bcrypt from 'bcrypt'
import { enviroment } from '../common/enviroment'

export interface User extends mongoose.Document {
  name: string,
  email: string,
  password: string,
}

const userSchema = new mongoose.Schema({
  cpf: {
    type: String,
    // unique: true,
    required: false,
    validate: {
      validator: validateCPF,
      msg: '{PATH}: Invalid CPF ({VALUE})'
    }
  },
  name: {
    required: true,
    type: String,
    minlength: 3,
    maxlength: 120,
  },
  email: {
    required: true,
    type: String,
    unique: true,
    match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  },
  password: {
    required: true,
    type: String,
    select: false,
  },
  gender: {
    required: false,
    type: String,
    enum: ['masculino', 'feminino'],
  }
})

userSchema.pre('save', function (next) {
  const user: User = this
  if (!user.isModified('password')) {
    next()
  } else {
    bcrypt.hash(user.password, enviroment.security.saltRounds)
      .then(hash => {
        user.password = hash
        next()
      }).catch(next)
  }
})


export const User = mongoose.model<User>('User', userSchema)