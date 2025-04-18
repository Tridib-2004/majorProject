const Listing = require("../models/listing.js");
//geocoding
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });
//
module.exports.getAllListings=async(req,res)=>{
    const allListings = await Listing.find({});
        //console.log("Fetched Listings:", allListings);
        res.render("listings/index.ejs", { allListings }); 
};
module.exports.new=(req,res)=>{
    res.render("listings/new.ejs");
};
module.exports.showOne=async(req,res)=>{
    let {id}=req.params;
    const list=await Listing.findById(id).populate({path:"reviews",populate:{path:"auther"},}).populate("owner");
    
    res.render("listings/show.ejs",{list});
};
module.exports.post=async(req,res,next)=>{
    let response=await geocodingClient.forwardGeocode({
        query: req.body.location,
        limit: 1
      })
        .send();
        let{title,description,image,price,location,country}=req.body;
       const owner=req.user._id;
        let list1= await new Listing({
             title:title,
             description:description,
             image:image,
             price:price,
             location:location,
             country:country,
             owner:owner,
             geometry:response.body.features[0].geometry,
         });
        console.log(response.body.features[0].geometry);
         await list1.save();
         req.flash("success","Successfully created a new listing!");
         res.redirect("/listings");
   
   
};
module.exports.edit=async(req,res)=>{
    let {id}=req.params;
    let list=await Listing.findById(id);
    res.render("listings/edit.ejs",{list});
};
module.exports.edited=async(req,res)=>{
    let {id}=req.params;
    
    let{title,description,image,price,location,country}=req.body;
    await Listing.findByIdAndUpdate(id,{
        title:title,
        description:description,
        image:image,
        price:price,
        location:location,
        country:country
    });
    res.redirect("/listings");
};
module.exports.destroy=async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
};