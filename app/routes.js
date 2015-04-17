var Todo = require('./models/todo');
var Server = require('./models/server');
var http = require('http');

module.exports = function(app) {
    // api ---------------------------------------------------------------------
    app.get('/api/server.json', function(req, res) {

        // use mongoose to get all todos in the database
        Server.find(function(err, servers) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)

            res.json(servers); // return all servers in JSON format
        });
    });

    // create todo and send back all servers after creation
    app.post('/api/server.json', function(req, res) {

        // create a todo, information comes from AJAX request from Angular
        Server.create({
            url : req.body.url,
            publicKey : req.body.publicKey,
            privateKey : req.body.privateKey
        }, function(err, todo) {
            if (err)
                res.send(err);

            // get and return all the servers after you create another
            Server.find(function(err, servers) {
                if (err)
                    res.send(err)
                res.json(servers);
            });
        });

    });
    // delete a server
    app.delete('/api/server/:idServer.json', function(req, res) {
        Server.remove({
            _id : req.params.idServer
        }, function(err, server) {
            if (err)
                res.send(err);

            // get and return all the servers after you create another
            Server.find(function(err, servers) {
                if (err)
                    res.send(err)
                res.json(servers);
            });
        });
    });


    // api ---------------------------------------------------------------------
    app.get('/api/server/:idServer/status.json', function(req, res) {
        console.log("status");
    //The url we want is `www.nodejitsu.com:1337/`
        var options = {
            host: 'localhost',
            path: '/status.json',
            //since we are listening on a custom port, we need to specify it by hand
            port: '8080',
            //This is what changes the request to a POST request
            method: 'GET'
        };

        callback = function(response) {
            var str = ''
            response.on('data', function (chunk) {
                str += chunk;
            });

            response.on('end', function () {
                console.log(str);
                res.json(JSON.parse(str));
            });
        }
        var req = http.request(options, callback);
        //This is the data we are posting, it needs to be a string or a buffer
//        req.write("hello world!");
        req.end();


    });

//project: "null"

//    {
//        "alive": true,
//        "authenticated": true,
//        "version": "20140506",
//        "serverURL": "http://10.0.2.2:8080",
//        "user": 16
//    }



//    var http = require('http');
//
////The url we want is `www.nodejitsu.com:1337/`
//    var options = {
//        host: 'www.nodejitsu.com',
//        path: '/',
//        //since we are listening on a custom port, we need to specify it by hand
//        port: '1337',
//        //This is what changes the request to a POST request
//        method: 'POST'
//    };
//
//    callback = function(response) {
//        var str = ''
//        response.on('data', function (chunk) {
//            str += chunk;
//        });
//
//        response.on('end', function () {
//            console.log(str);
//        });
//    }
//
//    var req = http.request(options, callback);
////This is the data we are posting, it needs to be a string or a buffer
//    req.write("hello world!");
//    req.end();
//










	// get all todos
	app.get('/api/todos', function(req, res) {

		// use mongoose to get all todos in the database
		Todo.find(function(err, todos) {

			// if there is an error retrieving, send the error. nothing after res.send(err) will execute
			if (err)
				res.send(err)

			res.json(todos); // return all todos in JSON format
		});
	});

	// create todo and send back all todos after creation
	app.post('/api/todos', function(req, res) {

		// create a todo, information comes from AJAX request from Angular
		Todo.create({
			text : req.body.text,
			done : false
		}, function(err, todo) {
			if (err)
				res.send(err);

			// get and return all the todos after you create another
			Todo.find(function(err, todos) {
				if (err)
					res.send(err)
				res.json(todos);
			});
		});

	});

	// delete a todo
	app.delete('/api/todos/:todo_id', function(req, res) {
		Todo.remove({
			_id : req.params.todo_id
		}, function(err, todo) {
			if (err)
				res.send(err);

			// get and return all the todos after you create another
			Todo.find(function(err, todos) {
				if (err)
					res.send(err)
				res.json(todos);
			});
		});
	});

	// application -------------------------------------------------------------
	app.get('*', function(req, res) {
		res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
	});
};