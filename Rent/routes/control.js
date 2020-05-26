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
    date2 = new Date(from);
    date3 = new Date(to);
    if(!datumbukiranja)
    {
      date1 = new Date();
    }
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
    var cursor = db.db('test').collection('bookings').find({from: {$gte: Number(date2.getTime()), $lte: Number(date3.getTime())},
      to: {$gte: Number(date2.getTime()),$lte: Number(date3.getTime())}});
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