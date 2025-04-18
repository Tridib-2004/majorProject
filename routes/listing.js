const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/expressError.js");


const {listingSchema,reviewSchema}=require("../schema.js");
const {isLoggedIn,isAuthor}=require("../middleware.js");
const listingController=require("../controllers/listings.js");
const validateListing=(req,res,next)=>{
    let {err}=listingSchema.validate(req.body);
    if(err){
        let errmsg=err.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errmsg);
    }else{
        next()
    }
};
router.get("/",wrapAsync(listingController.getAllListings));
router.get("/new",isLoggedIn,listingController.new);
router.get("/:id",wrapAsync(listingController.showOne));
router.post("/",validateListing,wrapAsync(listingController.post));
router.get("/:id/edit",isLoggedIn,isAuthor,wrapAsync(listingController.edit));
router.put("/:id",validateListing,isLoggedIn,wrapAsync(listingController.edited));
router.delete("/:id",isLoggedIn,isAuthor,wrapAsync(listingController.destroy));
module.exports=router;
