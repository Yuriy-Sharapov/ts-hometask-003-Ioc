import {Schema, model} from 'mongoose'

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    displayName: {
        type: String,
        default: true
    },
    email: {
        type: String,
        default: ""
    }
})

export = model('Users', userSchema)