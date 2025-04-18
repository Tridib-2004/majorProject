const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/expressError.js");
const {isLoggedIn,isReviewAuthor}=require("../middleware.js");
const Listing=require("../models/listing.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const Review=require("../models/review.js");
const reviewController=require("../controllers/reviews.js");
const validateReview=(req,res,next)=>{
    let {err}=reviewSchema.validate(req.body);
    if(err){
        let errmsg=err.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errmsg);
    }else{
        next()
    }
};
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.posted));
router.route("/:reviewId")
.get( (req, res) => {
    const { id } = req.params;
    res.redirect(`/listings/${id}`);
  })
.delete(isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroy));

module.exports=router;
