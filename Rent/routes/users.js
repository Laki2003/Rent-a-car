var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');


var csrfProtection = csrf();



router.use(csrfProtection);



router.get('/managing',allowAdmins, function(req, res, next){
 
      res.render('admin/managing');
    
});

router.get('/profile', isLoggedIn,  function(req, res, next){
    
     res.render('korisnik/profile');
   
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
  successRedirect: '/users/profile',
  failureRedirect: '/users/register',
   failureFlash: true
 }))
 router.get('/login', function(req, res, next){
  var messages = req.flash('error');
  res.render('korisnik/login', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length>0});
 });
 router.post('/login', passport.authenticate('local.login', {
  successRedirect: '/users/profile', 
  failureRedirect: '/users/login',
   failureFlash: true
 }));


 module.exports = router;

function isLoggedIn(req, res, next)
{
if(req.isAuthenticated())
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
 
 function allowAdmins(req, res, next){
  if(req.session.admin)
  {
    return next();
  }
  res.redirect('/');
 }