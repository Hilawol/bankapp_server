const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const usersRoute = require('./routes/users.routes');
const accountsRoute = require('./routes/accounts.routes');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/bank/users', usersRoute);
app.use('/bank/accounts', accountsRoute);

//connect to db with mongoose
mongoose.connect("mongodb+srv://hila_admin:J2ughdciUs7PR9d@cluster0.dhhlk.mongodb.net/bankapp?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}).then(() => {
  console.log("database connect")
}).catch((error) => {
  console.log(error);
})

app.listen(process.env.PORT || 5000, () => {
  console.log(`application start at ${5000}`);
})
