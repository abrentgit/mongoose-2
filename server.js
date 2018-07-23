'use strict'

const express = require('express');
const app = express(); 

const morgan = require('morgan');
const mongoose = require('mongoose')
mongoose.Promise = global.Promise;

const { DATABASE_URL, PORT } = require('./config');
const { BlogPost } = require('./models');

const app = express();

app.use(morgan('common'));
app.use(express.json());

app.get('/posts', (req, res) => {
	BlogPost
		.find()
		.then(posts => {
			res.json(posts.map(post => post.serialize()));
		})
		.catch(err => {
			console.log(error(err);
			res.status(500).json({error: 'something went wrong'});
		});
});

app.get('/posts/:id', (req, res) => {
	BlogPost
		.findById(req.params.id)
		.then(post => res.json(post.serialize()))
		.catch(err => {
		  console.error(err);
		  res.status(500)({ error: 'something messed up'});
	    });
});

app.post('/posts', (req, res) => {
	const requiredFields = ['title', 'content', 'author']; 
	for (let i = 0; i <requiredFields.length; i++) {
		if (!(field in req.body)) {
			const message = `Missing \`${field}\` in request body`;
			console.error(message);
			return res.status(400).send(message);
		}
	}

 BlogPost
    .create({
      title: req.body.title,
      content: req.body.content,
      author: req.body.author
    })
    .then(blogPost => res.status(201).json(blogPost.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'something went wrong' });
    });

});

app.delete('/posts/:id', (req, res) => {
	BlogPost
	.findByIdAndRemove(req.params.id)
	.then(() => {
	  res.status(204).json({message: 'success'});
	})
	.catch(err => {
	  console.log(err);
	  res.status(500).json({message: 'something went wrong'}); 
	});
});

app.put('/posts/:id', (req, res) => {
	if(!(req.params.id && req.body.id && req.params.id === req.body.id)) {
		res.status(400).json({message:'Request path id and request body id  values must match'
		});
	}

	//if successful request

	const updated = {};
	const updateableFields = ['title', 'content', 'author'];

	updateableFields.forEach(field => {
		if (field in req.body) { //if field is in the req body
			updated[field] = req.body[field];
		}
	});

	// put it in updated object

	BlogPost
	 .findByIdAndUpdate(req.params.id, { $set: updated }, { new: true }) // find id and set the updated fields to that id, true
	 .then(updatedPost => res.status(204).end());

	});


	// deleting post just by id number parameter
	// other delete by post with id number, you have request body and params

	app.delete('/:id', (req, res) => {
		BlogPost
		.findByIdAndRemove(req.params.id)
		.then(() => {
			console.log(`Deleted blog post with id \`${req.params.id}\``);
			res.status(204).end();
		});
	});	


	app.use('*', function (req, res) {
		res.status(404).json({message:'Not Found'});
	}); // asterisk means it should match any URL path, if it doesn't return not found 404, asterisk like CSS
	 //updated post response function is 204
	
	let server;

	function runServer(databaseURL, port = PORT) {
		return new Promise((resolve, reject) => {
			mongoose.connect(databaseURL, err => {
				if (err) {
					return reject(err);
				}
				server = app.listen(port, () => {
					console.log(`Your app is listening on port ${port}`);
					resolve();
				})
				.on('error', err => {
					mongoose.disconnect();
					reject(err);
				});
			});
		});
	}

	function closeServer() {
		return mongoose.disconnect().then(() => {
			return new Promise((resolve,reject) => {
				console.log('Closing server');
				server.close(err => {
					if (err) {
						return reject(err); //if error in closing server, reject
					}
					resolve(); //all else resolve
				});
			});
		});
	}

	if(require.main === module) {
		runServer(DATABASE_URL).catch(err => console.log(err));
	}

	module.exports = { runServer, app, closeServer }; //module.exports uses those function blocks









