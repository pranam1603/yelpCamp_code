const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate')
const mongoose = require('mongoose');
const Campground = require('./model/campground')

const port = 8080;
const hostname = 'localhost'

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Database Connected!');
});

app.engine('ejs', ejsMate)

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(methodOverride('_method'))
app.use(express.urlencoded({ extended: true }));
app.use(express.json())

app.get('/', (req, res) => {
    res.render('campground/home');
});

app.get('/campground', async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campground/campground', { campgrounds })
});

app.get('/campground/new', (req, res) => {
    res.render('campground/new')
})

app.post('/campground/new', async (req, res) => {
    // console.log(req.body);
    const newCamp = new Campground(req.body.campground)
    await newCamp.save()
    res.redirect(`/campground/${newCamp._id}`)
})

app.get('/campground/:id', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campground/show', { campground })
})

app.get('/campground/:id/edit', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
    res.render('campground/edit', { campground })
})

app.patch('/campground/:id/edit', async (req, res) => {
    const { id } = req.params
    await Campground.findByIdAndUpdate(id, req.body.campground)
    res.redirect(`/campground/${id}`)
})

app.delete('/campground/:id/delete', async (req, res) => {
    const { id } = req.params
    await Campground.findByIdAndDelete(id)
    res.redirect('/campground')
})

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});