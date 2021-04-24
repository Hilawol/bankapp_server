const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema({
  accountId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  type: {
    type: String,
    required: true,
    validate(value) {
      const types = ["transfer", "deposit", "withdraw"];
      if (!types.includes(value)) {
        throw new Error('Invalid transaction type');
      }
    }
  },
  amount: {
    type: Number,
    required: true
  },
  destAccount: { //destination account for transfer transcation
    type: mongoose.Types.ObjectId,
    required: false,
  }
});

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;