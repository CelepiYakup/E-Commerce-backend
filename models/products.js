const mongoose = require('mongoose');
const Product = require('../models/products');


const productSchema = new mongoose.Schema({

    name:{
        type:String,
        required: true
    },
    description:{
        type:String,
        required: true
    },
    price:{
        type:String,
        required: true
    },
    stock:{
        type:Number,
        required: true,
        default: 1
    },
    category:{
        type:String,
        required:true
    },
    rating:{
        type:Number,
        default:0

    },
    images: [
        {
            public_id:{
                type : String,
                required: true
            },
            url:{
                type: String,
                required: true
            },
        }
    ],
    user:{
        type: mongoose.Schema.ObjectId,
        ref:"user",
        required:true
    },
    reviews:[{
        user:{
            type: mongoose.Schema.ObjectId,
            ref:"user",
            required:true
        },
        name:{
            type:String,
            required: true

        },
        comment:{
            type:String,
            required: true

        },
        rating:{
            type:Number,
            required:true

        },

    }]




}, {timestamps: true});

module.exports = mongoose.model('Product', productSchema);