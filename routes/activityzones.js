var express = require("express");
var router 	= express.Router();
var Activityzone = require("../models/activityzone");
var middleware   = require("../middleware");
var NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);

//INDEX -show all activityzones===========_____READ_____==========================
router.get("/", function(req, res) {
	//Get all activityzones from DB
	Activityzone.find({}, function(err, allActivityzones){ 
		if(err){
			console.log(err);
		}else{	
			res.render ("activityzones/index", {activityzones: allActivityzones});
		}
	});
});

// CREATE - add new activityzone to DB
router.post("/", middleware.isLoggedIn, function(req, res){
	//get data from form and add to activityzones array	
	var name   = req.body.name;
	var fear   = req.body.fear;
	var image  = req.body.image;
	var desc   = req.body.description;
	var image2 = req.body.image2;
	var image3 = req.body.image3;
	var image4 = req.body.image4;
	var image5 = req.body.image5;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	
	geocoder.geocode(req.body.location, function (err, data) {
		if (err || !data.length) {
			console.log(err);
			req.flash('error', 'Invalid address');
			return res.redirect('back');
		}
		var lat = data[0].latitude;
		var lng = data[0].longitude;
		var location = data[0].formattedAddress;

		var newActivityzone = {name: name, fear: fear, image: image, description: desc, image2: image2, image3: image3, image4: image4, image5: image5, author:author, location: location, lat: lat, lng: lng};
		//create a new activityzone and save to DB
		Activityzone.create(newActivityzone, function(err, newlyCreated){
			if(err){
				console.log(err);
			}else{
				res.redirect("/activityzones");
			}	
		});		
	});
});

// NEW - show form to create new activityzone
router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("activityzones/new");
});

//SHOW - more info about one activityzone
router.get("/:id", function(req, res){
	// find the activityzone with provided ID
	Activityzone.findById(req.params.id).populate("comments").exec(function(err, foundActivityzone){
		if(err || !foundActivityzone){
			console.log(err);
			req.flash("error","Activityzone not found");
			res.redirect("back");
		}else{
			
			//render show template with that activityzone
			res.render("activityzones/show", {activityzone: foundActivityzone});	
		}
	});
});

//EDIT FORM ACTIVITYZONE ROUTE

router.get("/:id/edit", middleware.checkActivityzoneOwnership, function(req, res){
	Activityzone.findById(req.params.id, function(err, foundActivityzone){
		if(err){		
			res.redirect("/activityzones/" + req.params.id);
		}else{
		res.render("activityzones/edit", {activityzone: foundActivityzone});
	  	}
	});
});

//UPDATE ACTIVITYZONE ROUTE
router.put("/:id", middleware.checkActivityzoneOwnership, function (req, res){
	geocoder.geocode(req.body.location, function (err, data) {
		if (err || !data.length) {
			req.flash('error', 'Invalid address');
			return res.redirect('back');
		}else{
			req.body.activityzone.lat = data[0].latitude;
			req.body.activityzone.lng = data[0].longitude;
			req.body.activityzone.location = data[0].formattedAddress;	
		}
		
		// find and update the correct activityzone
		Activityzone.findByIdAndUpdate(req.params.id, req.body.activityzone, function(err, updatedActivityzone){
			if(err){
				req.flash("error", err.message);
				res.redirect("/activityzones");
			}else{
				//redirect somewhere (show page)
				req.flash("success","Successfully Updated!");
				res.redirect("/activityzones/" + req.params.id);
			}
		});
	});
});

//DELETE (DESTROY) ACTIVITYZONE ROUTE
router.delete("/:id", middleware.checkActivityzoneOwnership, function(req, res){
	Activityzone.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/activityzones");
		}else{
			res.redirect("/activityzones");
		}
	});
});

module.exports = router;