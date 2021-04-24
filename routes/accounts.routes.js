const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accounts.controller');

router.get('/', (req, res) => {
  accountController.getAccounts(req, res);
}).get('/user/:id', (req, res) => {
  accountController.getUserAccounts(req, res);
}).post('/user/:id', (req, res) => {
  accountController.createAccount(req, res);
}).put('/user/:id', (req, res) => {
  accountController.setCredit(req, res);
});

module.exports = router;