const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const path = require('path');
const pdf = require('express-pdf');

// own modules
const config = require('./config');


const app = express();

// view engine
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'hbs');

// app middleware
//app.use(morgan('dev'));
app.use(logger('dev', {stream: fs.createWriteStream('./access.log', {flags: 'a'})}))
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// passport config
config.passport(passport);
app.use(session(config.session(MongoStore)));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// hbs
config.helpershbs_ifcond();
config.helpershbs_toDate();
config.helpershbs_eachRow();
config.helpershbs_eachRowPrint();
config.helpershbs_eachRowClass();

// routes
app.use('/', require('./app/routes/index'));
app.use('/login', require('./app/routes/login'));
app.use('/logout', require('./app/routes/logout'));
app.use('/clients', require('./app/routes/client'));
app.use('/budgets', require('./app/routes/budget'));
app.use('/invoices', require('./app/routes/invoice'));
app.use('/bills', require('./app/routes/bill'));
app.use('/api', require('./app/routes/api'));


app.listen(config.server.port, () => {
  console.log(`Invoicetron running on port: ${config.server.port}`);
});
