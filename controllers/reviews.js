const Review=require("../models/review.js");
const Listing=require("../models/listing.js");
module.exports.posted=async(req,res)=>{
    let {id}=req.params;
    let newReview=new Review(req.body.review);
    let list=await Listing.findById(id);
    newReview.auther=req.user._id;
    list.reviews.push(newReview);
    await newReview.save();
    await list.save();
    res.redirect("/listings/"+id);
};
module.exports.destroy=async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect("/listings/"+id);
};