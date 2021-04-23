const mongoose = require('mongoose');
var validator = require('validator');

const accountSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true,
    validate(value) {
      if (!(value.length == 9) || !validator.isNumeric(value)) {
        throw new Error('Id must be 9 digits and can only contain digit');
      }
    }
  },
  credit: {
    type: Number,
    min: 0,
    default: 0
  },
  balance: {
    type: Number,
    default: 0
  }
})

const Account = mongoose.model('Account', accountSchema);
module.exports = Account;