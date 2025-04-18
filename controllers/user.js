const User=require("../models/user.js");
module.exports.sign=(req,res)=>{
    res.render("users/signup.ejs");
};
module.exports.signed=async(req,res)=>{   
    try{
    let {username,email,password}=req.body;
    let user=new User({username:username,
        email:email,
    });
    const resisteredUser=await User.register(user,password);
    req.login(resisteredUser,function(err){
        if(err) {
            return next(err);
        }
        req.flash("success","Welcome to Wanderlast!");
    res.redirect("/listings");
    });
    
}catch(e){
    req.flash("error","Username already taken!");
    res.redirect("/signup");
}
};
module.exports.login=(req,res)=>{
    res.render("users/login.ejs");
};
module.exports.logedin=async(req,res)=>{
    req.flash("success","Welcome back!");
    let redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
    
};
module.exports.destroy=(req,res,next)=>{
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash("success","Logged out successfully!");
        res.redirect("/listings");
      });
};