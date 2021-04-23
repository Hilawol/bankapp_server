const mongoose = require('mongoose');
var validator = require('validator');

const userSchema = mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      console.log(value.length === 9);
      if (!(value.length == 9) || !validator.isNumeric(value)) {
        throw new Error('Id must be 9 digits and can only contain digit');
      }
    }
  }
})


const User = mongoose.model('User', userSchema);
module.exports = User;