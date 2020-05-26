var express = require('express');
var router = express.Router();

var Booking = require('../models/booking');





router.post('/delete-rent', isLoggedIn, async function(req, res, next){
    const {bookingid} = req.body;
await  Booking.findOneAndRemove({_id: bookingid}, function(err){
      if(err)
      {
          throw err;
      }
  })  
  res.redirect('/users/profile');
})
  module.exports = router;

  function isLoggedIn(req, res, next)
  {
  if(req.isAuthenticated())
  {
    return next();
  }
}