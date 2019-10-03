var mongoose = require("mongoose");

var activityzoneSchema = new mongoose.Schema({
	name: String,
	fear: String,
	image: String,
	description: String,
	location: String,
	lat: Number,
	lng: Number,
	createdAt: {type: Date, default: Date.now},
	image2: String,
	image3: String,
	image4: String,
	image5: String,
	author: {
		id: {
			type:mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
	
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	]
});

module.exports = mongoose.model("Activityzone", activityzoneSchema);