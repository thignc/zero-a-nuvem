"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const enviroment_1 = require("../common/enviroment");
const cpf_1 = require("../common/validators/cpf");
const userSchema = new mongoose.Schema({
    cpf: {
        type: String,
        // unique: true,
        required: false,
        validate: {
            validator: cpf_1.validateCPF,
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
});
userSchema.statics.findByEmail = function (email) {
    return this.findOne({ email }); // {email: email}
};
const hashPassword = (object, next) => {
    bcrypt.hash(object.password, enviroment_1.enviroment.security.saltRounds)
        .then(hash => {
        object.password = hash;
        next();
    }).catch(next);
};
const saveMiddleware = function (next) {
    const user = this;
    if (!user.isModified('password')) {
        next();
    }
    else {
        hashPassword(user, next);
    }
};
const updateMiddlaware = function (next) {
    if (!this.getUpdate().password) {
        next();
    }
    else {
        hashPassword(this.getUpdate(), next);
    }
};
userSchema.pre('save', saveMiddleware);
userSchema.pre('findOneAndUpdate', updateMiddlaware);
userSchema.pre('update', updateMiddlaware);
exports.User = mongoose.model('User', userSchema);
