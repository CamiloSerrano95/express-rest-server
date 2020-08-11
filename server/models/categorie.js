const mongoose = require('mongoose')
const Schema = mongoose.Schema;

let categorieSchema = new Schema({
    description: { type: String, unique: true, required: [true, 'La descripción es obligatoria'] },
    user_id: { type: Schema.Types.ObjectId, ref: 'User' }
});


module.exports = mongoose.model('Categorie', categorieSchema);