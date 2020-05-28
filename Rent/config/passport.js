var passport = require('passport');
var Korisnik = require('../models/korisnik');

var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(korisnik, done){
    done(null, korisnik.id);

});

passport.deserializeUser(function(id, done){
    Korisnik.findById(id, function(err, korisnik){
        done(err, korisnik);

    });
});

passport.use('local.register', new LocalStrategy({
usernameField: 'email',
passwordField: 'password',
passReqToCallback: true    
}, function(req, email, password,done){
    var username = req.body.username;
  var passwordd = req.body.password;
  var emaill = req.body.email;
  var confirmpassword = req.body.confirm;
  var errors = [];
  
  if(username.length == 0 || passwordd.length == 0 || emaill.length == 0  || confirmpassword.length == 0 )
  {
errors.push({message: "Polja su prazna"});
  }
if(passwordd.length<6)
{
    errors.push({message: "Sifra mora da bude dugacka najmanje 6 karaktera"});
}
if(passwordd != confirmpassword)
{
    errors.push({message: "Sifre se ne podudaraju"});
}


if(errors.length>0)
{
    var messages = [];
    errors.forEach(function(error){
        messages.push(error.message);
    });
    return done(null, false, req.flash('error', messages));
}

Korisnik.findOne({$or: [{'email': email}, {'username': username}]}, function(err, korisnik){
   
    if(err){
        return done(err);
    }
    if(korisnik)
    {
        return done(null, false, {message: 'Email / Korisnicko ime je vec u upotrebi'});
    }
    var newKorisnik = new Korisnik();
    newKorisnik.username = username;
    newKorisnik.email = email;
    newKorisnik.password = newKorisnik.encryptPassword(password);
    newKorisnik.save(function(err, result){
        if(err){
            return done(err);
        }
        req.session.admin = newKorisnik.admin;
        return done(null, newKorisnik);
    });
});
}));

passport.use('local.login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, email, password, done){
Korisnik.findOne({'email':email}, function(err, korisnik){
    if(err)
    {
        return done(err);
    }
    if(!korisnik)
    {
return done(null, false, {message: 'Korisnik sa ovom email adresom ne postoji!'});
    }
    if(!korisnik.validPassword(password)){
return done(null, false, {message: 'Pogresna sifra!'});
    }
    req.session
    req.session.admin = korisnik.admin;
    return done(null, korisnik);
})
}));