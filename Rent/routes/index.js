var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var assert = require('assert');
var mongoose = require('mongoose');
var Booking= require('../models/booking');
var Auto = require('../models/auto');
var Lokacija = require('../models/lokacija');


 var url = require('../config/keys').MongoURI;

 router.get('/', async function(req, res, next) {
  var Greska = req.flash('greska');
  var success = req.flash('success');
var lokacija = await Lokacija.find().count();
var auto = await Auto.find().count();
var booking = await Booking.find().count();
    res.render('index', {Greska: Greska, lokacija:lokacija, auto: auto, booking: booking, 
    success: success});
 

})
router.get('/search',  function(req, res, next) {
  const {people, location, cenaod, cenado, marka} =  req.query;
  var errors = [];
  const {from, to} = req.query
var p = Number(people), price1 = Number(cenaod), price2= Number(cenado);
  var date1 = new Date(from);
  var date2 = new Date(to);
  var number = date2.getTime() - date1.getTime();
var today = new Date();
  if(from.length==0 || to.length==0)
{
  
  errors.push({message: 'Morate uneti datume!'});
  req.flash('greska', errors);
  res.redirect('/');
}
else if(number<0)
{
  errors.push({message: 'Pogresno uneti datumi!'});
  req.flash('greska', errors);
  res.redirect('/');
}
else if(date1.getTime()-today.getTime()<0)
{
  errors.push({message: "Uneli ste datume iz proslosti"});
  req.flash('greska', errors);
  res.redirect('/');
}
else {
  if(!people)
  {
  p = 0;
  }

   if (!cenaod)
  {
    price1 = 0;
  }

 if (!cenado)
{
  price2  = 100000;
}
  var resultArray = [];
  mongo.connect(url, function(err, db){
    var autos = db.db('test').collection('autos');
 
  assert.equal(null, err);
   var cursor;

 
 if (marka.length == 0 && location.length == 0)
  {
    cursor = autos.find({sedista:{$gte: p}, cena: {$gte: price1, $lte: price2}});

  }
else if(location.length ==0)
{
  cursor = autos.find({sedista:{$gte: p}, cena: {$gte: price1, $lte: price2}, marka:marka});
}

else if (marka.length == 0)
{
  cursor = autos.find({sedista:{$gte: Number(p)}, cena: {$gte: Number(price1), $lte: Number(price2)}, lokacija: String(location)});

}
  else {
    cursor = autos.find({sedista:{$gte: Number(p)}, cena: {$gte: Number(price1), $lte: Number(price2)}, lokacija: String(location), 
  marka: String(marka)});

}


 cursor.forEach(function(doc, err){
  resultArray.push(doc);
 },async function(){
 var cars= [];
 for(var b = 0; b<resultArray.length;++b)
 {

 
  
 var e= await db.db('test').collection('bookings').find({$or: [{car: String(resultArray[b]._id), from: {$gte: Number(date1.getTime()), $lte: Number(date2.getTime())}},
     {car: String(resultArray[b]._id), to: {$gte: Number(date1.getTime()), $lte: Number(date2.getTime())}}]}).count()
  
     if(e>0)
   {
     console.log('Bukirano');
   
   }
   else{
    
    cars.push(resultArray[b]);
    console.log(resultArray[b]);
  }
}
db.close();
    res.render('search', {cars: cars, from:from, to:to, people: people, location: location, cenaod: cenaod, cenado: cenado, marka: marka}); 
 })
   
    
  })
}
})

router.get('/check', async function(req, res, next){
  const {from, to, carid, carprice} = req.query;
  var date1 = new Date(from);
  var date2 = new Date(to);
  var number = date2.getTime() - date1.getTime();
  var today = new Date();
  let errors = [];
  if(from.length==0 || to.length==0)
  {
  errors.push({message: 'Morate uneti datume!'});
  }
  if(number<0)
  {
  errors.push({message: 'Pogresno uneti datumi!'});
  }
  if(date1.getTime()-today.getTime()<0)
  {
  errors.push({message: "Uneli ste datume iz proslosti"});
  }
  var e = await Booking.find({$or:[{car: String(carid), from: {$gte: Number(date1.getTime()), $lte: Number(date2.getTime())}}, 
  {car: String(carid), to: {$gte: Number(date1.getTime()), $lte: Number(date2.getTime())}}]}).count();
    if(e>0)
    {
      errors.push({message: 'Nije raspoloziv za unete datume'});
    }
  
  if(errors.length>0){
  req.flash('upozorenje', errors);
  }
  var upozorenje = req.flash('upozorenje');
  var days = (date2.getTime() - date1.getTime())/(1000*3600*24);
           var total = days*Number(carprice);
      Auto.findOne({_id: carid}, function(err,car){
             res.render('car', {days: days, total: total, from:from, to:to, upozorenje: upozorenje, marka: car.marka, model: car.model,
            location: car.lokacija, price: carprice, img: car.slika, carid: carid});
  })
  })
  router.get('/car', function(req, res, next){
      const {carid, from ,to, carprice} = req.query;
      var date1= new Date(from);
      var date2 = new Date(to);
      var days = (date2.getTime() - date1.getTime())/(1000*3600*24);
       var upozorenje = req.flash('upozorenje'); 
       var total = days*Number(carprice);
      Auto.findOne({_id: carid}, function(err,car){
             res.render('car', {days: days, total: total, from:from, to:to, upozorenje: upozorenje, marka: car.marka, model: car.model,
            location: car.lokacija, price: carprice, img: car.slika, carid: carid});
        
      });
      
    
  })

module.exports = router;
 