var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var productoSchema = new Schema({
    name: { type: String, required: [true, 'El nombre es necesario'] },
    price_uni: { type: Number, required: [true, 'El precio únitario es necesario'] },
    description: { type: String, required: false },
    avalaible: { type: Boolean, required: true, default: true },
    categorie_id: { type: Schema.Types.ObjectId, ref: 'Categorie', required: true },
    user_id: { type: Schema.Types.ObjectId, ref: 'User' }
});


module.exports = mongoose.model('Product', productoSchema);