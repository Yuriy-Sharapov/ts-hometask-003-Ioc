//const {Schema, model, ObjectId} = require('mongoose')
import {Schema, model, ObjectId} from 'mongoose'

const commentSchema = new Schema({
    bookId: {
        type: Schema.Types.ObjectId,   
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    },    
    date: {
        type: Date,
        required: true
    },
    text: {
        type: String,
        default: ""
    }
})

export = model('Comments', commentSchema)