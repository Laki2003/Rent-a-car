var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');
var mongo = require('mongodb');
var assert = require('assert');
var Booking = require('../models/booking');
var Auto = require('../models/auto');

var csrfProtection = csrf();



router.use(csrfProtection);


var url = require('../config/keys').MongoURI;

router.get('/managing',allowAdmins, function(req, res, next){
  var successMessages = req.flash('uspesno'), errorMessages = req.flash('neuspesno');
  mongo.connect(url, function(err, db){
    var collection = db.db('test').collection('lokacijas').find();
    var locationArray = [];
    assert.equal(null, err);
    collection.forEach(function(doc, err){
      assert.equal(null, err);
       locationArray.push(doc);
    }, function(){
      db.close();
      res.render('admin/managing',{locations: locationArray, error: errorMessages, success: successMessages, cars: false, lokacije: false, bookings: false});
    })
  })
  
});

router.get('/profile', isLoggedIn,  function(req, res, next){
  var bookings = [];
  mongo.connect(url, function(err, db){
    assert.equal(null, err);
    var cursor = db.db('test').collection('bookings').find({user: req.user._id});
   cursor.forEach(function(doc, err){
       bookings.push(doc);
     
   }, async function(){
     var resultArray = [];
     for(var b = 0; b<bookings.length;++b)
     {
  var car =  await Auto.findOne({_id: bookings[b].car}, function(err, car){
   return car;
    });
    resultArray.push({auto: car.toObject(), booking: bookings[b]})
   assert.equal(null, err);
   
     }
     console.log(resultArray);
          db.close();
     res.render('korisnik/profile', {rent: resultArray});
   })
  }) 
})

router.get('/logout', isLoggedIn,  function(req, res, next){
  req.user = null;
  req.session.admin = false;
  req.logout();
  res.redirect('/');
});
router.use('/', notLoggedIn, function(req, res, next){
  next();
})

router.get('/register', function(req, res, next){
  var messages = req.flash('error')
   res.render('korisnik/register', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length >0});
 });
 
 router.post('/register', passport.authenticate('local.register', {
   failureRedirect: '/users/register',
   failureFlash: true
 }), function(req, res, next){
  if (req.session.oldUrl){
    var oldUrl = req.session.oldUrl;
    req.session.oldUrl = null;
    res.redirect(oldUrl);
  } else{
    res.redirect('/users/profile');
  }
});
 router.get('/login', function(req, res, next){
  var messages = req.flash('error');
  res.render('korisnik/login', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length>0});
 });
 router.post('/login', passport.authenticate('local.login', {
   failureRedirect: '/users/login',
   failureFlash: true
 }), function(req, res, next){
   if (req.session.oldUrl){
    var oldUrl = req.session.oldUrl;
    req.session.oldUrl = null;
    res.redirect(oldUrl);
   } else{
     res.redirect('/users/profile');
   }
 });




 module.exports = router;

function isLoggedIn(req, res, next)
{
if(req.isAuthenticated())
{
  return next();
}
res.redirect('/');
}
 function allowAdmins(req, res, next){
 if(req.session.admin)
 {
   return next();
 }
 res.redirect('/');
}
 function notLoggedIn(req, res, next)
 {
   if(!req.isAuthenticated())
   {
     return next();
   }
   res.redirect('/');
 }