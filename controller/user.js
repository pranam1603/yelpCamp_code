const User = require('../model/user');

module.exports.renderRegisterForm =  (req, res) =>{
    res.render('user/register');
}

module.exports.register = async(req, res, next) =>{
    try{
        const {email, username, password} = req.body;
        const newuser = new User({username, email});
            console.log(req.user);
        const registeredUser = await User.register(newuser, password)
        console.log(newUser);
        req.login( registeredUser, err =>{
            if(err) return next(err);
            req.flash('success', "Welcome to YelpCamp!");
            res.redirect('/campground')
        })
    } catch (e) {
        req.flash('error', `${e.message}`)
        res.redirect('/register')
    }
}

module.exports.renderLoginForm =  (req, res) =>{
    res.render('user/login')
}

module.exports.login =  async (req, res) =>{
    req.flash('success', "Welcome Back :)");
    const redirectUrl = req.session.returnTo || '/campground'
    delete req.session.returnTo
    res.redirect(redirectUrl)
}

module.exports.logout = (req, res) =>{
    req.logOut()
    req.flash('success', 'GoodBye!')
    res.redirect('/campground')
}