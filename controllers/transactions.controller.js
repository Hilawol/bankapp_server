const transactionModel = require('../models/transactions.model');
const accountModel = require('../models/accounts.model');
// var validator = require('validator');

const getTrasactions = async (req, res) => {
  try {
    const transactions = await transactionModel.find({});
    return res.send(transactions);
  } catch (error) {
    return res.status(500).json({ "error": error });
  }
}

const getAccountTransactions = async (req, res) => {
  const { id } = req.params;
  try {
    const transactions = await transactionModel.find({ accountId: id });
    return res.send(transactions);
  } catch (error) {
    return res.status(500).json({ "error": error });
  }
}

const deposit = async (accountId, amount, res) => {
  try {
    await accountModel.findOneAndUpdate({ _id: accountId }, { $inc: { balance: amount } });
    const transaction = new transactionModel({
      accountId: accountId,
      type: "deposit",
      amount: amount,
    });
    transaction.save();
    return res.status(201).json(transaction);
  } catch (error) {
    return res.status(500).json({ "error": error });
  }
}

const withdraw = async (accountId, amount, res) => {
  try {
    const account = await accountModel.findById({ _id: accountId });
    console.log(account.balance, account.credit, amount)
    if (!account) {
      return res.status(400).json({ "error": `Account ${account} not found` });
    }
    if (account.balance + account.credit < amount) {
      console.log("cannot make withdraw or transfer. amount=", amount, "funds:", account.balance + account.credit);
      return res.status(403).json({ "error": `Insufficient funds.` });
    }
    await accountModel.updateOne({ _id: accountId }, { $inc: { balance: -1 * amount } });
    const transaction = new transactionModel({
      accountId: accountId,
      type: "withdraw",
      amount: amount,
    });
    transaction.save();
    return res.status(201).json(transaction);
  } catch (error) {
    return res.status(500).json({ "error": error });
  }
}

const transfer = async (fromId, toId, amount, res) => {
  console.log("transfer");
  if (!toId) {
    return res.status(400).json({ "error": "Please provide a destination account." });
  }
  if (fromId === toId) {
    return res.status(400).json({ "error": "Please provied a diffrent destination account" });
  }
  try {
    console.log("before find. fromId:", fromId, " toId:", toId);
    const fromAccount = await accountModel.findById({ _id: fromId });
    console.log("after find account:", fromAccount)
    if (!fromAccount) {
      return res.status(400).json({ "error": "Sender account not found." });
    }
    if (fromAccount.balance + fromAccount.credit < amount) {
      return res.status(400).json({ "error": "Insufficient funds." });
    }
    const toAccount = await accountModel.findById({ _id: toId });
    if (!toAccount) {
      return res.status(400).json({ "error": "Accepting account not found." });
    }
    await accountModel.findByIdAndUpdate({ _id: fromId }, { $inc: { balance: -1 * amount } });
    await accountModel.findByIdAndUpdate({ _id: toId }, { $inc: { balance: amount } });

    const transfer = new transactionModel({
      accountId: fromId,
      type: "transfer",
      amount: amount,
      destAccount: toId
    });
    transfer.save();
    return res.json(transfer);
  } catch (error) {

  }
}

const addTransaction = async (req, res) => {
  const { id } = req.params;
  let { amount, type, destAccount } = req.body;
  if (amount && type && amount > 0) {//TODO :400
    switch (type) {
      case "deposit":
        return deposit(id, amount, res);
      case "withdraw":
        return withdraw(id, amount, res);
      case "transfer":
        return transfer(id, destAccount, amount, res);
    }
  }
  return res.status(400).json({ "error": "Invalid transaction data. Please provide a positive amount and valid transaction type." })
}
// try {
// const account = await accountModel.findOne({ _id: id });
// console.log("found first account:", account);
// if (!account) {
//   return res.status(400).json({ "error": `Account ${account} not found` });
// }
// if (type === "transfer") {
//   return transfer(id, destAccount, amount, res);
// }

// if (type === "withdraw") {
//   amount = -1 * amount;
// }
// const updated = await accountModel.findOneAndUpdate({ _id: id }, { $inc: { balance: amount } });
// const transaction = new transactionModel({
//   accountId: id,
//   type: type,
//   amount: amount,
// });
// transaction.save();
// return res.status(201).send();

//     if (type === "withdraw" || type === "transfer") {
//       if (account.balance + account.credit < amount) {
//         console.log("cannot make withdraw or transfer. amount=", amount, "funds:", account.balance + account.credit);
//         return res.status(403).json({ "error": `Insufficient funds.` });
//       }
//       const updated = await accountModel.findOneAndUpdate({ _id: id }, { $inc: { balance: -1 * amount } });
//     }
//     const updated = await accountModel.findOneAndUpdate({ _id: id }, { $inc: { balance: amount } });
//     if (type === "transfer") {
//       console.log("type is:", type, "destAccount:", destAccount);
//       if (!destAccount) {
//         return res.status(400).json({ "error": "Transer failed. Invalid destination account" });
//       }
//       console.log("48:", destAccount);
//       const destAccount = await accountModel.findOneAndUpdate({ _id: destAccount }, { $inc: { balance: (-1 * amount) } });
//       if (!destAccount) {
//         await accountModel.findOneAndUpdate({ _id: id }, { $inc: { balance: (-1 * amount) } });
//         return res.status(400).json({ "error": ` Destination account ${destAccount} not found` });
//       }
//       const transaction = new transactionModel({
//         accountId: id,
//         type: type,
//         amount: amount,
//         destAccount: destAccount
//       });
//       transaction.save();
//       return res.status(201).send();
//     }
//     const transaction = new transactionModel({
//       accountId: id,
//       type: type,
//       amount: amount,
//     });
//     transaction.save();
//     return res.status(201).send();
//   } catch (error) {
//     return res.status(500).json({ "error": error });
//   }
// }
// else return res.status(400).json({ "error": "Invalid transaction data." });
// }
// try {
//   const user = await userModel.findOne({ id: id });
//   if (!user) {
//     return res.status(404).send();
//   }
//   let transaction;
//   try {
//     if (req.body.type === "transfer") {
//       transaction = new transactionModel(
//         {
//           type: req.body.type,
//           accountId: id,
//           amount: req.body.amount,
//           destAccount: req.body.destAccount,
//         });
//     }
//     else {
//       transaction = new transactionModel(
//         {
//           type: req.body.type,
//           accountId: id,
//           amount: req.body.amount,
//         });
//     }

//   } catch (error) {
//     console.log(error);
//     return res.status(400).send('Invalid trasaction infromation');
//   }

//   const result = await transaction.save();
//   return res.status(201).send(result);

// } catch (error) {
//   return res.status(500).json({ "error": error });
// }


module.exports = {
  getTrasactions,
  getAccountTransactions,
  addTransaction
}