var express = require("express");
var router 	= express.Router({mergeParams:true});
var Activityzone = require("../models/activityzone");
var Comment 	 = require("../models/comment");
var middleware   = require("../middleware");

// Comments New ===== Show me the New Comment form
router.get("/new", middleware.isLoggedIn, function(req, res){
	//find activityzone by id
	Activityzone.findById(req.params.id, function(err, activityzone){
		if(err){
			console.log(err);
		}else{
			res.render("comments/new", {activityzone:activityzone});
		}	
	});
});

// Comments Create
router.post("/", middleware.isLoggedIn, function(req, res){
	//lookup activityzone using ID
	Activityzone.findById(req.params.id, function(err, activityzone){
		if(err){
			console.log(err);
			res.redirect("/activityzones");
		}else{
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					req.flash("error", "Something went wrong");
					console.log(err);
				}else{
					// add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					//save commnent
					comment.save();
					activityzone.comments.push(comment);
					activityzone.save();
					console.log(comment);
					req.flash("success", "Successfully added comment");
					res.redirect("/activityzones/" + activityzone._id);	
				}
			});
		}
	});
});

//COMMENT EDIT ROUTE === Show me the Edit Comment form
router.get("/:comment_id/edit", middleware.checkCommentOwnership,  function(req, res){
	Activityzone.findById(req.params.id, function(err, foundActivityzone){
		if(err || !foundActivityzone){
			req.flash("error", "No activityzone found");
			return res.redirect("back");
		}
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err) {
				res.redirect("back");
			}else{
				res.render("comments/edit", {activityzone: foundActivityzone , comment: foundComment});
			}	
		});		
	});	
});
			
		
// COMMENT UPDATE ROUTE	
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if(err){
			res.redirect("back");
		}else{
			res.redirect("/activityzones/" + req.params.id);	
		}
	});
});

//COMMENT DELETE ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	//findByIdAndRemove
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			res.redirect("back");
		}else{
			req.flash("success", "Comment deleted");
			res.redirect("/activityzones/" + req.params.id);	
		}
	});
});

module.exports = router;
