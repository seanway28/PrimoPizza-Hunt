const { Schema, model } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const PizzaSchema = new Schema({
    pizzaName: {
        type: String,
        required: 'Please provide a pizza name.',
        trim: true
    },
    createdBy: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: (createdAtVal) => dateFormat(createdAtVal)
    },
    size: {
        type: String,
        required: true,
        enum: ['Personal', 'Small', 'Medium', 'Large', 'Extra Large'],
        default: 'Large'
    },
    toppings: [],
    comments: [
        {
            type: Schema.Tyes.ObjectId,
            ref: 'Comment'
        }
    ] 
},
    {
        toJSON: {
            virtuals: true,
            getters: true
        },
        id: false
    }
);

// Get total number of replies and comments on retrieval
PizzaSchema.virtual('commentCount').get(function() {
    return this.comments.reduce((total, comment) => total + comment.replies.length + 1, 0);
});


// Create the Pizza Model using the PizzaSchema
const Pizza = model('Pizza', PizzaSchema);

// Export Pizza model
module.exports = Pizza;