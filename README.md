# Cytomine monitoring

Webapp with basic functionalities to monitor one or multiple cytomine instances.

## Installation

Install node.js
Install mongodb

## Configuration

Rename config/config_base.js to config/config.js

    module.exports = {
		emailTo: "xxx xx <xxxxx@xxxxx.xx>",
		emailFrom: "xxx xx <xxxxx@xxxxx.xx>",
		smtpService : "Gmail",
		smtpFrom: "xxxx@xxx.xxx",
		smtpPassword: "xxxxxx",
		cytominePublicKey: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
		cytominePrivateKey: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
		interval: 30000,
		port: 8000
	}

Change config/database.js if necessary

## Run

node server.js

Goto localhost:8000/ (default port)
