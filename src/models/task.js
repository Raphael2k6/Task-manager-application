const mongoose = require('mongoose');

const Tasks = mongoose.model('Tasks', {
    description: {
        type: String,
        trim: true,
        required: true,
    }, 
    completed: {
        type: Boolean,
        default: false,
    },
    owner: {
        type: mongoose.Types.ObjectId,
        required: true
    }
})

module.exports = Tasks;