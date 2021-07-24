const Campground = require('../model/campground');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');   
const mbxToken = process.env.MAPBOX_TOKEN;
const geoCode = mbxGeocoding({accessToken: mbxToken})

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campground/campground', { campgrounds })
}

module.exports.renderNewForm = (req, res) => {
    res.render('campground/new')
}

module.exports.createCampground = async (req, res) => {
    const geoData = await geoCode.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    let newCamp = new Campground(req.body.campground)
    newCamp.geometry = geoData.body.features[0].geometry
    newCamp.images = req.files.map(im => ({filename: im.filename, url: im.path}))
    newCamp.author = req.user._id
    console.log(newCamp);
    await newCamp.save()
    req.flash('success', 'Successfully made a new Campground :)')
    res.redirect(`/campground/${newCamp._id}`)
}

module.exports.showCampgrounds = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate(
        {
            path:'reviews',
            populate:{
                path: 'author'
            }
        }
    ).populate('author');
    if(!campground){
        req.flash('error', 'Can not find this Campground :(')
        return res.redirect('/campground')
    }
    res.render('campground/show', { campground })
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
    if(!campground){
        req.flash('error', 'Can not find this Campground :(')
        return res.redirect('/campground')
    }
    res.render('campground/edit', { campground })
}

module.exports.editCampground = async (req, res) => {
    const { id } = req.params
    const editCamp = await Campground.findByIdAndUpdate(id, req.body.campground, {runValidators: true})
    if(req.body.deleteImages){
        // req.body.deleteImages.forEach((imgfile =>{
        //     cloudinary.uploader.destroy(imgfile)
        // }))
        await editCamp.updateOne({$pull :{images :{filename :{$in : req.body.deleteImages}}}})
    }
    const newImages = req.files.map(im => ({filename: im.filename, url: im.path}))
    editCamp.images.push(...newImages)
    await editCamp.save()
    req.flash('success', 'Campground Updated Successfully :)')
    res.redirect(`/campground/${id}`)
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params
    await Campground.findByIdAndDelete(id)
    req.flash('success', 'Campground Deleted Successfully :)')
    res.redirect('/campground')
}