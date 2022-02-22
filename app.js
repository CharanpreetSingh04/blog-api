const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash');
const passport = require('passport');
const path = require('path')
require('./config/passport')(passport);
require('dotenv').config(path.join(__dirname,'./env'))
const mongoDb = process.env.MONGODB_URI;
mongoose.connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true });

app.engine('handlebars',exphbs.engine({defaultLayout: 'layout'}));
app.set('view engine', 'handlebars');

app.use(express.urlencoded({extended: false}))
// const hbs = exphbs.create({});

// hbs.handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
//     return (arg1 === arg2) ? options.fn(this) : options.inverse(this);
// });



app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))


app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

//global_variables
app.use( (req,res,next) => {
    app.locals.success_msg = req.flash('success_msg')
    app.locals.error_msg = req.flash('error_msg')
    app.locals.error = req.flash('error')
    next()
})

app.use('/', require('./routes/index'))
app.use('/users',require('./routes/users'))

app.listen(PORT,()=>{
    console.log('connected')
})