/*
 * Copyright (c) 2009-2015. Authors: see NOTICE file.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// set up ======================================================================
var express  = require('express');
var url = require("url");
var app      = express(); 								// create our app w/ express
var mongoose = require('mongoose'); 					// mongoose for mongodb
				// set the port
var database = require('./config/database'); 			// load the database config
var config = require('./config/config'); 			// load the app config
var http = require('http');
var CryptoJS = require("crypto-js");
var port  	 = config.port; 

var nodemailer = require("nodemailer");

var smtpTransport = nodemailer.createTransport("SMTP",{
    service: config.smtpService,
    auth: {
        user: config.smtpFrom,
        pass: config.smtpPassword
    }
});

// configuration ===============================================================
mongoose.connect(database.url); 	// connect to mongoDB database on modulus.io

app.configure(function() {
    app.use(express.static(__dirname + '/public')); 		// set the static files location /public/img will be /img for users
    app.use(express.logger('dev')); 						// log every request to the console
    app.use(express.bodyParser()); 							// pull information from html in POST
    app.use(express.methodOverride()); 						// simulate DELETE and PUT
});

// routes ======================================================================
require('./app/routes.js')(app);

// listen (start app with node server.js) ======================================
app.listen(port);
console.log("App listening on port " + port);

var monitoringInterval = config.interval;

var Server = require('./app/models/server');



var updateSucces = function(server,json,status,time) {
    if(
        server.downNumber>0
        ) {
        sendMail("!!! SUCCESS !!! ==>" + server.url + " IS NOW ONLINE!",server.url + " dindn't response since " + server.lastSuccessStatus);
    }

    Server.update({
            _id : server.id
        },
        {
            status:status,
            lastUpdateStatus: new Date(),
            version: json.version,
            lastSuccessStatus: new Date(),
            downNumber : 0,
            ping :time
        },

        function(err, server) {
            if (err)
                console.log(err)
        });
}

var updateError = function(server,status,time) {
    //send a mail after two successive faillure
    if(
        server.downNumber==2
    ) {
        sendMail("!!! PANIC !!! ==>" + server.url + " FAILED!",server.url + " not response since " + server.lastSuccessStatus);
    }
    Server.update({
            _id : server.id
        },
        {
            status:status,
            lastUpdateStatus: new Date(),
            downNumber : server.downNumber+1,
            ping :time
        },

        function(err, server) {
            if (err)
                console.log(err)
        });
}

var sendMail = function(subject,message) {
    smtpTransport.sendMail({
        from: config.emailFrom, // sender address
        to: config.emailTo, // comma separated list of receivers
        subject: subject, // Subject line
        text: message // plaintext body
    }, function(error, response){
        if(error){
            console.log(error);
        }else{
            console.log("Message sent: " + response.message);
        }
    });
}

var checkServer = function(server) {
    console.log(server.url);
    var serverUrl = url.parse(server.url);
    if(serverUrl.port==null) {
        serverUrl.port = 80;
    }
    console.log("Request to " +  serverUrl.hostname + ":"+serverUrl.port + " [last:"+server.lastUpdateStatus+"]");
    console.log("DownNumber = " +server.downNumber);

    var headers = authorize(config.cytominePublicKey,config.cytominePrivateKey,"GET", "/server/ping.json", "", "application/json,*/*");

    //The url we want is `www.nodejitsu.com:1337/`
    var options = {
        host: serverUrl.hostname,
        //path: '/status.json',
        path: '/server/ping.json',
        //since we are listening on a custom port, we need to specify it by hand
        port: serverUrl.port,
        //This is what changes the request to a POST request
        method: 'GET',
        timeout : 5000,
        headers : headers
    };

    callback = function(response) {
        var str = ''
        response.on('data', function (chunk) {
            str += chunk;
        });

        response.on('end', function () {
            var end = new Date().getTime();
            console.log(response.statusCode);

            if(response.statusCode==200) {
                var json = JSON.parse(str);
                console.log("UPDATE SUCCESS " + server.url);
                updateSucces(server,json,response.statusCode,end-start);
            } else {
                console.log("UPDATE ERROR " + server.url);
                updateError(server,response.statusCode,end-start);
            }

            // .update(query, { name: 'jason borne' }, options, callback)


        });
    }

    var start = new Date().getTime();
    var req = http.request(options, callback);

    req.on('error', function(error){
        console.log("UPDATE ERROR " + server.url);
        updateError(server,0,0);
    });

    req.end();
}

var checkServers = function() {
    Server.find(function(err, servers) {
        for(var i=0;i<servers.length;i++) {
            checkServer(servers[i]);
        }
    });

}

setInterval(function(){
    // use mongoose to get all todos in the database
    checkServers();
}, monitoringInterval);
checkServers();

//
    //url = urm without http...cytomine.be
var authorize = function(publicKey,privateKey,action,url,contentType,accept) {
     var headers = {};
     headers.accept = accept;
     headers.date = new Date();

     var canonicalHeaders = action + "\n\n" + contentType + "\n" + headers.date + "\n";

     var messageToSign = canonicalHeaders + url;


     //var signature = base64.b64encode(hmac.new(self.__private_key, message_to_sign, sha).digest())

     var hash = CryptoJS.HmacSHA1(messageToSign, privateKey);
     var hashInBase64 = CryptoJS.enc.Base64.stringify(hash);
     var signature = hashInBase64;
     var authorization = "CYTOMINE " + publicKey + ":" + signature;
     headers.authorization = authorization;
     return headers;
}


