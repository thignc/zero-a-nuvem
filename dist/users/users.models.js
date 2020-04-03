"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const cpf_1 = require("../common/validators/cpf");
const bcrypt = require("bcrypt");
const enviroment_1 = require("../common/enviroment");
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
userSchema.pre('save', function (next) {
    const user = this;
    if (!user.isModified('password')) {
        next();
    }
    else {
        bcrypt.hash(user.password, enviroment_1.enviroment.security.saltRounds)
            .then(hash => {
            user.password = hash;
            next();
        }).catch(next);
    }
});
exports.User = mongoose.model('User', userSchema);
