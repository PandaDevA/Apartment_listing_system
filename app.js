const express = require('express');
const app = express();
const ejs = require('ejs');
const expressLayouts = require('express-ejs-layouts');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const util = require('util');
const flash = require('express-flash');
const MongoDBStore = require('connect-mongo')(session); // It will store our session id in database.
const server = require('http').Server(app);
const connection = require('./app/config/dbConnection');

//Session Store
let mongoStore = new MongoDBStore({
    mongooseConnection: connection,
    collection: 'sessions',
    autoRemove: 'native',
});
mongoStore.clear();
//Session Config
const appsession = session({
    secret: "apartment-listing-system",
    resave: false,
    store: mongoStore,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24 hours
});
app.use(appsession);

//Assets
app.use(express.static('public'));
app.use(express.json());

app.use(flash());

//Global Middleware to use session and user(if logged in) in client side
app.use(cors());

//Set Template Engine
app.use(expressLayouts);
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

let log_file = fs.createWriteStream(__dirname + '/debug.log', {flags : 'w'});
let log_stdout = process.stdout;

console.log = function(d) { //
  const now = new Date();
  log_file.write( now.toLocaleTimeString()+ ' ' + util.format(d) + '\n');
  log_stdout.write( now.toLocaleTimeString()+ ' ' + util.format(d) + '\n');
};

//Set Route
// require('./routes/web.js')(app);

server.listen(process.env.PORT || 8084, () => {
    console.log('Listening on port 8084');
    setInterval(function() {
        clearPhotoDirectory();
    }, 24 * 3600 * 1000);
});