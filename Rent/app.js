var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressHbs = require('express-handlebars');
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var validator = require('connect-flash');
var MongoStore = require('connect-mongo')(session);



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var controlRouter = require('./routes/control');
var profileRouter = require('./routes/profile');
var app = express();
const PORT = process.env.PORT || 3000;
const db = require('./config/keys').MongoURI;
mongoose.connect(db || process.env.MONGODB_URI, {useNewUrlParser: true}).then(()=> console.log('Connected')).catch(err=>console.log(err));
require('./config/passport');

// view engine setup
app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs', helpers: {
  datum : function(time)
  {
    return new Date(time).toDateString();
  }
}}));
app.set('view engine', '.hbs');
var hbs = expressHbs.create({});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());
app.use(session({secret: 'secret',
 resave: false,
  saveUninitialized: false,
store: new MongoStore({ mongooseConnection: mongoose.connection }),
cookie: { maxAge: 180*60*1000}
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));



app.use(function(req, res, next){
  res.locals.login = req.isAuthenticated();
  res.locals.admin = req.session.admin;
  res.locals.session = req.session;
  next();
})
app.use('/users/profile', profileRouter);
app.use('/users/managing', controlRouter);
app.use('/users', usersRouter);
app.use('/', indexRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
if(process.env.NODE_ENV == 'production'){
  
}
app.listen(PORT, ()=>{
  
});
module.exports = app;
