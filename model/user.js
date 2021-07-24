const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
})

userSchema.plugin(userLocalMongoose)

module.exports = mongoose.model('User', userSchema)