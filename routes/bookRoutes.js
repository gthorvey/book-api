let express = require("express");

let routes = function (Book) {

    let bookRouter = express.Router();
    let bookController = require("../controllers/bookController")(Book);

    bookRouter.route("/")
        .post(bookController.post)
        .get(bookController.get);

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
            var book = req.book;
            var newBook = JSON.parse(JSON.stringify(book));
            newBook.links = {};
            var link = 'http://' + req.headers.host + '/api/books/?genre=' + newBook.genre;
            newBook.links.filterByThisGenre = link.replace(' ', '%20');
            res.json(newBook);            
        }).put(function (req, res) {
            let book = req.book;
            book.title = req.body.title;
            book.author = req.body.author;
            book.genre = req.body.genre;
            book.read = req.body.read;
            book.save(function (err) {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.status(201).send(book);
                }
            });
            res.status(201).send(book);
        }).patch(function (req, res) {
            if (req.body._id) {
                delete req.body._id;
            }
            let book = req.book;
            for (let key in req.body) {
                book[key] = req.body[key];
            }
            book.save(function (err) {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.status(201).send(book);
                }
            });

        }).delete(function (req, res) {
            req.book.remove(function (err) {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.status(204).send('Removed');
                }
            });
        });

    return bookRouter;
}

module.exports = routes;