let bookController = function (Book) {

    let post = function (req, res) {

        if (!req.body.title) {
            res.status(400);
            res.send('Title is required.');
        } else {
            let book = new Book(req.body);
            book.save(function (err) {
                if (err) {
                    res.status(500);
                    res.send(err);
                } else {
                    res.status(201);
                    res.send(book);
                }
            });
        }
    }

    let get = function (req, res) {
        let query = req.query;

        Book.find(query, function (err, books) {
            if (err) {
                res.status(500);
                res.send(err);
            } else {
                var returnBooks = [];                
                books.forEach(book => {
                    var newBook = JSON.parse(JSON.stringify(book));
                    newBook.links = {};
                    newBook.links.self = 'http://' + req.headers.host + '/api/books/' + newBook._id;
                    returnBooks.push(newBook);
                    
                }); 
                res.json(returnBooks);
            }
        });
    }

    return {
        post: post,
        get: get,
    }

}

module.exports = bookController;