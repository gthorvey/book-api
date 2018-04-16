let express = require("express");

let routes = function (Book) {

    let bookRouter = express.Router();

    bookRouter.route("/")
        .post(function (req, res) {
            console.log(req.body);
            let book = new Book(req.body);
            book.save(function(err){
                if (err) {
                    res.status(500).send(err);
                }else {
                    res.status(201).send(book);
                }
            });           
        })
        .get(function (req, res) {
            let query = req.query;
            // if(req.query.genre){
            //     query.genre = req.query.genre;
            // }
            Book.find(query, function (err, books) {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.json(books);
                }
            });
        });

    bookRouter.use("/:id", function (req, res, next) {
        Book.findById(req.params.id, function (err, book) {
            if (err) {
                res.status(500).send(err);
            } else if (book) {
                req.book = book;
                next();
            } else {
                res.status(404).send('no book found');
            }
        });
    });

    bookRouter.route("/:id")
        .get(function (req, res) {
            res.json(req.book);
        }).put(function (req, res) {
            let book = req.book;
            book.title = req.body.title;
            book.author = req.body.author;
            book.genre = req.body.genre;
            book.read = req.body.read;
            book.save(function(err){
                if (err) {
                    res.status(500).send(err);
                }else {
                    res.status(201).send(book);
                }
            });
            res.status(201).send(book);
        }).patch(function (req, res) {            
            if(req.body._id){
                delete req.body._id;
            }
            let book = req.book;
            for(let key in req.body){
                book[key]= req.body[key];
            }
            book.save(function(err){
                if (err) {
                    res.status(500).send(err);
                }else {
                    res.status(201).send(book);
                }
            });
            
        }).delete(function (req, res) {
            req.book.remove(function(err){
                if (err) {
                    res.status(500).send(err);
                }else {
                    res.status(204).send('Removed');
                }
            });
         });

    return bookRouter;
}

module.exports = routes;