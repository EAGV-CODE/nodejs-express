var mongoose = require ("mongoose");
var Activityzone = require("./models/activityzone");
var Comment = require("./models/comment");

var data = [
	{
		name:"Scharlotenburg", 
		image: "https://pixabay.com/get/54e2d0474257a814f6da8c7dda793f7f1636dfe2564c704c732773dd9448c05c_340.jpg",
		description: "industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
	},
	{
		name:"tiegarten", 
		image: "https://pixabay.com/get/54e4d64b4d56a914f6da8c7dda793f7f1636dfe2564c704c732773dd9448c05c_340.jpg",
		description: "industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
	},
	{
		name:"brandenburgo", 
		image: "https://pixabay.com/get/55e7d3474e52ab14f6da8c7dda793f7f1636dfe2564c704c732773dd9448c05c_340.jpg",
		description: "industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
	}
	
]


function seedDB(){
	// Remove all activityzones
	Activityzone.deleteMany({}, function(err){
		if(err){
			console.log (err);
		}
		console.log("removed activityzones!!!");
		
		//add a few activityzones
		data.forEach(function(seed){
			Activityzone.create(seed, function(err, activityzone){
				if(err){
					console.log(err);
				}else{
					console.log("added an activityzone");
					//add a few comments
					Comment.create(
					{
						text: "this place is scary!!!",
						author: "Homer"
					}, function(err, comment){
						if(err){
							console.log(err);
						}else{
							activityzone.comments.push(comment);
							activityzone.save();
							console.log("Created new comment");
						}	
					});
				}		
			});			
		});	
		
		
	});		
}

module.exports = seedDB;