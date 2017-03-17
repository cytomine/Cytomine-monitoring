

When using our software, we kindly ask you to cite our website url and related publications in all your work (publications, studies, oral presentations,...). In particular, we recommend to cite (Marée et al., Bioinformatics 2016) paper, and to use our logo when appropriate. See our license files for additional details.

- URL: http://www.cytomine.be/
- Logo: http://www.cytomine.be/logo/logo.png
- Scientific paper: Raphaël Marée, Loïc Rollus, Benjamin Stévens, Renaud Hoyoux, Gilles Louppe, Rémy Vandaele, Jean-Michel Begon, Philipp Kainz, Pierre Geurts and Louis Wehenkel. Collaborative analysis of multi-gigapixel imaging data using Cytomine, Bioinformatics, 2016.




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
