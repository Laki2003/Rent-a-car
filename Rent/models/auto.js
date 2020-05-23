var mongoose= require('mongoose');
var Schema = mongoose.Schema;

var autoSchema = new Schema({
        marka: {type: String, require: true},
    model:{type: String, require: true},
    motor: {type: String, require: true},
    sedista: {type: Number, require: true},
    klima: {type: Boolean, require: true},
    lokacija: {type: String, require: true},
    slika: {type: String, require: true},
    cena: {type: Number, require: true}
});

module.exports = mongoose.model('Auto', autoSchema);