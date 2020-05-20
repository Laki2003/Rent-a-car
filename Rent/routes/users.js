var express = require('express');
var router = express.Router();

router.get('/register', function(req, res, next){
     res.render('korisnik/register');
   });

   router.get('/login', function(req, res, next){
    res.render('korisnik/login');
   });

   module.exports = router;