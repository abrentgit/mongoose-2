'use strict';

const mongoose = require('mongoose');
mongoose.promise = global.Promise;

// schema you lay out the types 

const blogPostSchmema = mongoose.Schema({
	author: {
		firstName: String,
		lastName: String,
	},
	title: {type: String, required: true},
	content: {type: String},
	created: {type: Date, default: Date.now}
});

blogPostSchmema.virtual('authorName').get(function() {
	return `${this.author.firstName} ${this.author.lastName}`.trim();
});

// serialize into a JSON object

blogPostSchmema.methods.serialize = function() {
	return {
		id: this._id,
		author: this.authorName,
		contnet: this.content,
		title: this.title,
		created: this.created
	};
};

const BlogPost = mongoose.model('BlogPost', blogPostSchmema);

module.exports = {BlogPost};

