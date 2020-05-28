var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bookingSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'Korisnik'},
    datumBukiranja: {type: Number, required: true},
    from: {type: Number, required: true},
    to: {type:Number, required: true},
    car: {type: String},
      paymentId: {type: String, required: true}
});

module.exports = mongoose.model('Booking', bookingSchema);