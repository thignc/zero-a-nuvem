import * as bcrypt from 'bcrypt'
import * as mongoose from 'mongoose'
import { enviroment } from '../common/enviroment'
import { validateCPF } from '../common/validators/cpf'

export interface User extends mongoose.Document {
  cpf?: string,
  name: string,
  email: string,
  password: string,
  gender?: string,
}

export interface UserModel extends mongoose.Model<User> {
  findByEmail(email: string): Promise<User>
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
    select: false, // não retorna em um select
  },
  gender: {
    required: false,
    type: String,
    enum: ['masculino', 'feminino'],
  }
})

userSchema.statics.findByEmail = function(email: string) {
  return this.findOne({email}) // {email: email}
}

const hashPassword = (object, next) => {
  bcrypt.hash(object.password, enviroment.security.saltRounds)
    .then(hash => {
      object.password = hash
      next()
    }).catch(next)
}

const saveMiddleware = function (next) {
  const user: User = this
  if (!user.isModified('password')) {
    next()
  } else {
    hashPassword(user, next)
  }
}

const updateMiddlaware = function (next) {
  if (!this.getUpdate().password) {
    next()
  } else {
    hashPassword(this.getUpdate(), next)
  }
}

userSchema.pre('save', saveMiddleware)
userSchema.pre('findOneAndUpdate', updateMiddlaware)
userSchema.pre('update', updateMiddlaware)


export const User = mongoose.model<User, UserModel>('User', userSchema)