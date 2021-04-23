const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');

router.get('/', (req, res) => {
  usersController.getAllUsers(req, res);
}).post('/', (req, res) => {
  usersController.addUser(req, res);
});

module.exports = router;