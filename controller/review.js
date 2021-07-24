const Campground = require('../model/campground')
const Review = require('../model/reviews')

module.exports.createReview = async (req, res) =>{
    const {id} = req.params
    if(!req.user){
        req.flash('error', 'Please Login for Review!')
        return res.redirect(`/campground/${id}`)
    }
    const campground = await Campground.findById(req.params.id)
    const review = new Review(req.body.review);
    review.author = req.user._id
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    req.flash('success', 'Successfully made a new Review :)')
    res.redirect(`/campground/${campground._id}`)
}

module.exports.deleteReview = async (req, res) =>{
    const {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId)
    req.flash('success', 'Review Deleted Successfully :)')
    res.redirect(`/campground/${id}`)
}