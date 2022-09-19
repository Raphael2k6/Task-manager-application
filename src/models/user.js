const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// the schema helps to utilize a middleware function, a function that can help to do something before or after an action 
// like saving things to the db is performed

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    }, 
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a positive number')
            }
        }
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true, //ensures emails are unique
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        //minLength: 6,
        validate(value) {
            if(!validator.isLength(value, {min: 7})) {
                throw new Error('Length must be greater then 6')
            }
            if (value.toLowerCase().includes('password')) {
                throw new Error("Must not include the string 'password'")
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

// hide private info like password and token
// first method -  THIS METHOD IS MANUAL AS IT NEEDS TO BE CALLED IN ALL THE ROUTES
userSchema.methods.getPublicProfile = function () {
    const user  = this;
    const userObject = user.toObject()

    delete userObject.password;
    delete userObject.tokens;
    
    return userObject;
}

//THIS APPROACH IS AUTOMATIC, IT DOESN'T NEED TO BE CALLED IN ALL THE ROUTE HANDLERS 
userSchema.methods.toJSON = function () {
    const user  = this;
    const userObject = user.toObject()

    delete userObject.password;
    delete userObject.tokens;
    
    return userObject;
}

//methods are accessible on the instances (instance methods)
userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, 'hello')
    user.tokens = user.tokens.concat({token})
    await user.save();

    return token
}


//statics are accessible on the models (model methods)
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email});
    if (!user) {
        throw new Error('Unable to log in')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    
    if (!isMatch) {
        throw new Error('Unable to log in')
    }

    return user;
}

// using a function declaration instead of an arrow function to access the "this" bindind
//hash plain text password before saving
userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next()

})

const User = mongoose.model('User', userSchema)

module.exports = User;