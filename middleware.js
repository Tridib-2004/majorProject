const Review = require("./models/review.js");
const Listing = require("./models/listing.js");
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash('error', 'You must be LOG IN in first!');
        return res.redirect('/login');
    }
    next();
};
module.exports.saveUrl=(req, res, next) => {
    if(req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};
module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing.owner.equals(res.locals.currUser._id)) {
        req.flash('error', 'You are not the auther ');
        return res.redirect(`/listings/${id}`);
    }
    next();
};
module.exports.isReviewAuthor = async (req, res, next) => {
    const {reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.auther.equals(res.locals.currUser._id)) {
        req.flash('error', 'You are not the autherof the review');
        return  res.redirect(`/listings/${req.params.id}`);
    }
    next();
};