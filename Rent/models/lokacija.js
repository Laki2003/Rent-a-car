var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var lokacijaSchema = new Schema({
    grad: {type: String ,required: true},
    zemlja: {type: String, required: true}
});

module.exports = mongoose.model('Lokacija', lokacijaSchema);