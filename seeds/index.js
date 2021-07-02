const mongoose = require('mongoose');
const Campground = require('../model/campground');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelper');

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

const sample = arr => {
    return arr[Math.floor(Math.random() * arr.length)]
}

const seedDb = async () => {
    await Campground.deleteMany({})
    for (let i = 0; i < 50; i++) {
        const random = Math.floor(Math.random() * 1000)
        const camp = new Campground({
            location: `${cities[random].city}, ${cities[random].state}`,
            title: `${sample(descriptors)} ${sample(places)}`
        })
        await camp.save()
    }
}

seedDb().then(() => {
    mongoose.connection.close()
})