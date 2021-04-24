const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactions.controller');

router.get('/', (req, res) => {
  transactionController.getTrasactions(req, res);
}).post('/account/:id', (req, res) => {
  transactionController.addTransaction(req, res);
}).get('/account/:id', (req, res) => {
  transactionController.getAccountTransactions(req, res);
});

module.exports = router;