const accountModel = require('../models/accounts.model');
const userModel = require('../models/users.model');

const getAccounts = async (req, res) => {
  try {
    const accounts = await accountModel.find({});
    return res.send(accounts);
  } catch (error) {
    return res.status(500).json({ "error": error });
  }
}

const getUserAccounts = async (req, res) => {
  const { id } = req.params;
  try {
    const accounts = await accountModel.find({ userId: id });
    if (accounts.legth <= 0) {
      return res.status(404).send();
    }
    return res.send(accounts);
  } catch (error) {
    return res.status(500).json({ "error": error });
  }
}

const createAccount = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await userModel.findOne({ id: id });
    if (!user) {
      return res.status(404).send();
    }
    const account = new accountModel(
      {
        userId: user.id,
        credit: 0,
        balance: 0
      }
    )
    const result = await account.save();
    return res.status(201).send(result);

  } catch (error) {
    return res.status(500).json({ "error": error });
  }
}

module.exports = {
  getAccounts,
  getUserAccounts,
  createAccount
}