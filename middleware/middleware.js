const {campgroundSchema, reviewSchema} = require('../schemas');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../model/campground')
const Review = require('../model/reviews')

module.exports.isLoggedIn = (req, res, next) =>{
    if(!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'Please Login first!')
        return res.redirect('/login')
    } 
    next() 
}

module.exports.validateSchema = (req, res, next) =>{
    const {error} = campgroundSchema.validate(req.body)
    if(error){
        const msg = error.details.map(er => er.message).join(',')
        throw new ExpressError(msg, 400)
    } else{
        next()
    }
}

module.exports.isAuthor = async(req, res, next) =>{
    const {id} = req.params
    const camp = await Campground.findById(id);
    if(!camp.author.equals(req.user._id)) {
        req.flash('error', 'Sorry, you are not the author !')
        res.redirect(`/campground/${id}`)
    } else {
        next()
    }
}

module.exports.isReviewAuthor = async(req, res, next) =>{
    const {reviewId, id} = req.params
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)) {
        req.flash('error', 'Sorry, you are not the author !')
        res.redirect(`/campground/${id}`)
    } else {
        next()
    }
}

module.exports.validateReviews = (req, res, next) =>{
    const {error} = reviewSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}
