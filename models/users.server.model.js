const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    user: {
        type: String,
        unique: true
    },
    pw: String
});
mongoose.model('users',UserSchema);