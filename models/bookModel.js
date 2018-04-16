var mongoose = require("mongoose"),
Schema = mongoose.Schema;

var bookModel = new Schema(
    {
        title: String,
        author: String,
        genre: String,
        read: Boolean
    }
);

module.exports = mongoose.model('Book', bookModel);