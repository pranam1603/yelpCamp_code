const mongoose = require('mongoose');
const Campground = require('../model/campground');
const cities = require('./cities');
const {
  places,
  descriptors
} = require('./seedHelper');

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
  for (let i = 0; i < 300; i++) {
    const random = Math.floor(Math.random() * 1000)
    const price = Math.floor(Math.random() * 30) + 10
    const camp = new Campground({
      location: `${cities[random].city}, ${cities[random].state}`,
      author: '60f865b7bccb7a285c24297f',
      title: `${sample(descriptors)} ${sample(places)}`,
      geometry: {
        type: 'Point',
        coordinates: [
          cities[random].longitude, cities[random].latitude
        ]
      },
      images: [{
          filename: 'YelpCamp/qjaynmpjhwivbsz6z04g',
          url: 'https://res.cloudinary.com/dajovwfd6/image/upload/v1626625503/YelpCamp/qjaynmpjhwivbsz6z04g.jpg'
        },
        {
          filename: 'YelpCamp/beruhefdqevdur802bwq',
          url: 'https://res.cloudinary.com/dajovwfd6/image/upload/v1626625504/YelpCamp/beruhefdqevdur802bwq.jpg'
        },
        {
          filename: 'YelpCamp/t9osyzywfsqzijsqxaxn',
          url: 'https://res.cloudinary.com/dajovwfd6/image/upload/v1626625504/YelpCamp/t9osyzywfsqzijsqxaxn.jpg'
        },
        {
          filename: 'YelpCamp/wjvugg86r6zhe5wtmng7',
          url: 'https://res.cloudinary.com/dajovwfd6/image/upload/v1626625504/YelpCamp/wjvugg86r6zhe5wtmng7.jpg'
        }

      ],
      description: "A mountain is an elevated portion of the Earth's crust, generally with steep sides that show significant exposed bedrock. A mountain differs from a plateau in having a limited summit area, and is larger than a hill, typically rising at least 300 metres (1000 feet) above the surrounding land.",
      price
    })
    await camp.save()
  }
}

seedDb().then(() => {
  mongoose.connection.close()
})