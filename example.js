(function () {
    var http = require('http'),
        fs = require('fs');

    http.createServer(function (req, res) {
        if (req.url === '/dist/angular.url_matcher.js') {
            res.writeHead(200, {'Content-Type': 'text/javascript'});
            res.end(fs.readFileSync('./dist/angular.url_matcher.js'));
        }
        else if (req.url === '/dist/angular.url_matcher.min.js') {
            res.writeHead(200, {'Content-Type': 'text/javascript'});
            res.end(fs.readFileSync('./dist/angular.url_matcher.min.js'));
        }
        else {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(fs.readFileSync('./example.html'));
        }
    }).listen(8080, '127.0.0.1');
})();
