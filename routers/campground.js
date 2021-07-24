const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const campgroundControls = require('../controller/campground')
const {isLoggedIn, isAuthor, validateSchema} = require('../middleware/middleware');
const {storage} = require('../cloudinary/connectCloud')
const multer = require('multer');
const upload = multer({storage})

router.get('/', catchAsync(campgroundControls.index));

router.route('/new')
    .get(isLoggedIn, campgroundControls.renderNewForm)
    .post(isLoggedIn, upload.array('image'), validateSchema, catchAsync(campgroundControls.createCampground));

router.route('/:id/edit')
    .get(isLoggedIn, isAuthor, catchAsync(campgroundControls.renderEditForm))
    .patch(isLoggedIn, isAuthor, upload.array('image'), validateSchema, catchAsync(campgroundControls.editCampground));
    
router.get('/:id', catchAsync(campgroundControls.showCampgrounds))

router.delete('/:id/delete', isLoggedIn, isAuthor, catchAsync(campgroundControls.deleteCampground))

module.exports = router;