const mg = require('mongoose');
const postSch = mg.Schema({
    id: {
        type: Number,
        required: true
    },
    nama: {
        type: String,
        required: true
    },
    nim: {
        type: Number,
        required: true
    },
    pass: {
        type: String,
        required: true
    },
    alamat: {
        type: String
    },
    email: {
        type: String
    },
    telp: {
        type: String
    },
    dosen: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mg.model('post', postSch);