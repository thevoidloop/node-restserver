const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let roleValid = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} not is a role valid'
}

let Schema = mongoose.Schema;
let userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'The name is neccesary']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'The email is neccesary']
    },
    password: {
        type: String,
        required: [true, 'The password is neccesary']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: roleValid
    },
    status: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

userSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}

userSchema.plugin(uniqueValidator, { message: '{PATH} must be unique' });


module.exports = mongoose.model('User', userSchema);