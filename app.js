require("dotenv").config();
const express=require("express");
const app=express();

const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/expressError.js");
const mongoose=require("mongoose");
const port=5000;
const Listing=require("./models/listing.js");
const Review=require("./models/review.js");
const path=require("path");
const {listingSchema,reviewSchema}=require("./schema.js");
const ejsMate=require("ejs-mate");
const session=require("express-session");
const MongoStore=require("connect-mongo");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
app.engine("ejs",ejsMate);
const methodOverride=require("method-override");
app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname, "public")));
const listingsRouter=require("./routes/listing.js");  
const reviewsRouter=require("./routes/review.js");
const usersRouter=require("./routes/user.js");  
const dbUrl=process.env.ATLASDB_URL;
main().then(()=>{
    console.log("connection successfull");
}).catch(err=>console.log(err));
async function main(){
    await mongoose.connect(dbUrl);

}
const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
});
store.on("error",()=>{
    console.log("session store error");
});
const sessionOptions={
    store:store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized: true,
    cookie:{
        expires:Date.now()+1000*60*60*24*7,
        maxAge:1000*60*60*24*7,
        httpOnly:true,
    }
}
app.get("/",(req,res)=>{
    res.send("Welcome to Wanderlast!");
});
app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
})
app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",usersRouter);



app.use((err,req,res,next)=>{
    const { statusCode = 500, message = "Something went wrong!" } = err;

    res.status(statusCode).send(message);
});
app.listen(port,()=>{
    console.log("App is listening in the port of 4000");
})