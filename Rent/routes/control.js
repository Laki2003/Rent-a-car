var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var assert = require('assert');
var Auto = require('../models/auto');
var Lokacija = require('../models/lokacija');
var Booking = require('../models/booking');
const url = require('../config/keys').MongoURI;

router.get('/search-bookings', allowAdmins, function(req,res, next){
  const{datumbukiranja, marka, model, from, to, lokacija} = req.query;
 date1 = new Date(datumbukiranja);
 date1.setHours(0,0,0,0);
 date4 = new Date(datumbukiranja)
 date4.setHours(23,59,59,999);

  date2 = new Date(from);
  date3 = new Date(to);
 
  if(!from)
{
  date2 = new Date();
}
if(!to)
{
  date3 = new Date('2030-12-31');
}
console.log(date2.getTime());
console.log(date3.getTime());
var bookings = [];
mongo.connect(url, function(err, db){
  assert.equal(null, err);
  var cursor;
if(datumbukiranja.length==0){
cursor = db.db('test').collection('bookings').find({from: {$gte: Number(date2.getTime()), $lte: Number(date3.getTime())},
    to: {$gte: Number(date2.getTime()),$lte: Number(date3.getTime())}});
}
else{
  cursor = db.db('test').collection('bookings').find({datumBukiranja: {$gte: Number(date1.getTime()), $lte: Number(date4.getTime())},from: {$gte: Number(date2.getTime()), $lte: Number(date3.getTime())},
    to: {$gte: Number(date2.getTime()),$lte: Number(date3.getTime())}});

}
   
    
     cursor.forEach(function(doc, err){
       bookings.push(doc);
     }, async function(){
       var resultArray = [];
       for(var b=0; b<bookings.length; ++b)
       {
var car;
if(marka.length == 0 && model.length == 0 && lokacija.length ==0)
{
  car = await Auto.findOne({_id: bookings[b].car}, function(err, car){
    return car;
  })
}
else if(marka.length == 0 && model.length == 0)
{  
  car = await Auto.findOne({_id: bookings[b].car, lokacija: lokacija}, function(err, car){
  return car;
})
}
else if(marka.length == 0 && lokacija.length == 0)
{
  car = await Auto.findOne({_id: bookings[b].car, model: model}, function(err, car){
    return car;
  })
} 
else if(model.length == 0 && lokacija.length == 0)
{
  car = await Auto.findOne({_id: bookings[b].car, marka: marka}, function(err, car){
    return car;
  })
}
else if (model.length == 0)
{
  car = await Auto.findOne({_id: bookings[b].car, marka: marka, lokacija: lokacija}, function(err, car){
    return car
  })
}
else if (lokacija.length == 0)
{
  car = await Auto.findOne({_id: bookings[b].car, model: model, marka: marka}, function(err, car){
    return car
  })
}
else if (marka.length == 0)
{
  car = await Auto.findOne({_id: bookings[b].car, lokacija: lokacija, model: model}, function(err, car){
    return car
  })
}
else{
  car = await Auto.findOne({_id: bookings[b].car, lokacija:lokacija, model: model, marka: marka}, function(err, car){
    return car
  })
}
console.log(car);
if(car != null)
{
  resultArray.push({auto: car.toObject(), booking: bookings[b]});
  console.log(resultArray);
  assert.equal(null, err);
}
       }
       db.close();
       res.render('admin/managing', {success: false, error: false, bookings: resultArray, lokacije: false, cars: false});

     })
})

 

});
router.get('/search-cars', allowAdmins, function(req, res, next){
const {model, marka, cenado, cenaod, sedista, motori, lokacija, klima} = req.query;
price1 = Number(cenaod);
price2 = Number(cenado);
sediste = Number(sedista);
if(!cenaod)
{
  price1= 0;
}
if(!cenado)
{
  price2 = 1000000;
}
if (!sedista)
{
  sediste = 1;
}
mongo.connect(url, function(err, db){
  var collection = db.db('test').collection('autos');
  var resultArray = [];
  assert.equal(null, err);
  var cars;
  if(model.length==0 && marka.length==0 && lokacija.length == 0)
  {
     cars = collection.find({motor: motori, klima: Boolean(klima), cena: {$gte: Number(price1), $lte: Number(price2)}, sedista: {$gte: Number(sediste)}});
  }
  else if(model.length==0 && lokacija.length == 0)
  {
    cars = collection.find({motor: motori,klima: Boolean(klima), cena: {$gte: Number(price1), $lte: Number(price2)}, sedista: {$gte: Number(sediste)},marka: marka});
  }
  else if (model.length == 0 && marka.length == 0)
  {
    cars = collection.find({motor: motori, lokacija: lokacija, klima: Boolean(klima), cena: {$gte: Number(price1), $lte: Number(price2)}, sedista: {$gte: Number(sediste)}});
  }
  else if (marka.length == 0 && lokacija.length == 0)
  {
    cars = collection.find({motor: motori,  klima: Boolean(klima), cena: {$gte: Number(price1), $lte: Number(price2)}, sedista: {$gte: Number(sediste)},
  model: model});
  }
  else if(marka.length == 0)
  {
    cars = collection.find({motor: motori,  klima: Boolean(klima), cena: {$gte: Number(price1), $lte: Number(price2)}, sedista: {$gte: Number(sediste)},
    model: model, lokacija: lokacija});
  
  }
else if(lokacija.length == 0)
{
  cars = collection.find({motor: motori,  klima: Boolean(klima), cena: {$gte: Number(price1), $lte: Number(price2)}, sedista: {$gte: Number(sediste)},
  model: model, marka: marka});

}
else if(model.length == 0)
{
  cars = collection.find({  motor: motori,  klima: Boolean(klima), cena: {$gte: Number(price1), $lte: Number(price2)}, sedista: {$gte: Number(sediste)},
  lokacija: lokacija, marka: marka});

}
else{
  cars = collection.find({  motor: motori,  klima: Boolean(klima), cena: {$gte: Number(price1), $lte: Number(price2)}, sedista: {$gte: Number(sediste)},
  lokacija: lokacija, marka: marka, model: model});

}
cars.forEach(function(doc, err){
  assert.equal(null, err);
  resultArray.push(doc);
}, function(){
  db.close();
  res.render('admin/managing', {success: false, error: false, bookings: false, lokacije: false, cars: resultArray});
})
})

});
router.post('/post-cars', allowAdmins, function(req, res, next){
  const {lokacija, marka, klima, model, cena, sedista, motori, img} = req.body;
let error = [];
let success = [];
  if(!lokacija || !marka || !cena || !model || !sedista || !motori || !img)
{
error.push({message: 'Popunite sva polja'});
req.flash('neuspesno', error);
  res.redirect('/users/managing');
}
else{
  var newAuto = new Auto();
  newAuto.lokacija = lokacija;
  newAuto.marka = marka;
  newAuto.klima = klima;
  newAuto.model = model;
  newAuto.cena = cena;
  newAuto.sedista = sedista;
  newAuto.motor = motori;
  newAuto.slika = img;
newAuto.save(function(err, auto){
  if (err) return console.error(err);
  console.log(auto.model + auto.marka + " saved to car collection.");

});  
success.push({message:"Uspesno ste dodali novi automobil"});
req.flash('uspesno', success);
res.redirect('/users/managing');
}
  });
router.get('/search-locations', allowAdmins,  function(req, res, next){
  const {grad, zemlja} = req.query;
  mongo.connect(url, function(err, db){
    var collection = db.db('test').collection('lokacijas');
    var resultArray = [];
    assert.equal(null, err);
    var lokacije;
    if(grad.length==0 && zemlja.length == 0)
    {
     lokacije = collection.find();
    }
else if(grad.length==0)
{
lokacije = collection.find({zemlja: zemlja});
}
else if(zemlja.length == 0)
{
lokacije = collection.find({grad: grad});
}
else{
lokacije = collection.find({grad: grad, zemlja: zemlja});
}
lokacije.forEach(function(doc, err){
  assert.equal(null, err);
  resultArray.push(doc);
}, function(){
  db.close();
  res.render('admin/managing', {success: false, error: false, bookings: false, lokacije: resultArray, locations: false, cars: false});

})
  })

 
})
router.post('/post-locations', allowAdmins, function(req, res, next){
  let errors = [];
  let success = [];
  const {zemlja, grad} = req.body;
  if(!zemlja || !grad)
  {
    errors.push({message: 'Popunite sva polja'});
    req.flash('neuspesno', errors);
res.redirect('/users/managing');
  }
  else{
var newLokacija = new Lokacija();

newLokacija.grad = grad;
newLokacija.zemlja = zemlja;
newLokacija.save(function(err, lokacija){
  if(err) return console.error(err);
  console.log(lokacija.grad + lokacija.zemlja + " saved to locations ");
}); 
success.push({message: "Uspesno ste dodali novu lokaciju"});
req.flash('uspesno', success)
res.redirect('/users/managing');
  }
});
router.post('/delete-car', allowAdmins, async function(req, res, next){
  
  const {itemid} = req.body;
  var e=await Booking.find({car: String(itemid)}).count();
  if(e>0)
  {
    var errors= [];
    errors.push({message: 'Imate neka bukiranja koja su vezana za ovaj automobil, ne mozete da izbrisete'});
    req.flash('neuspesno', errors);
  }
  else{
  await Auto.findOneAndRemove({_id: itemid}, function(err){
    if(err)
    {
      throw err;
    }
  })
  var success = [];
  success.push({message: 'Uspesno ste izbrisali automobil'});
  req.flash('uspesno', success);
  }
  res.redirect('/users/managing');

})
router.post('/delete-location', allowAdmins, async function(req, res, next){
  const {itemid} = req.body;
  await Lokacija.findOneAndRemove({_id: itemid}, function(err){
    if(err)
    {
      throw err;
    }
  })
  var success = [];
  success.push({message: 'Uspesno ste izbrisali lokaciju'});
  req.flash('uspesno', success);
  res.redirect('/users/managing');
})


router.post('/delete-booking', allowAdmins, async function(req, res, next){
  const {itemid} = req.body;
  await Booking.findOneAndRemove({_id: itemid}, function(err){
    if(err)
    {
      throw err;
    }
  })
  var success = [];
  success.push({message: 'Uspesno ste izbrisali rentiranje'});
  req.flash('uspesno', success);
  res.redirect('/users/managing');
})


module.exports = router;

function allowAdmins(req, res, next){
  if(req.session.admin)
  {
    return next();
  }
  res.redirect('/');
 }