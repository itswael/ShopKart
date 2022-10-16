const path = require('path');

const express = require('express');

const csrf = require('csurf');
const expressSession = require('express-session');

const createSessionConfig = require('./config/session');

const db = require('./data/database');

const errorHandlerMiddleware = require('./middlewares/error-handler');
const checkAuthStatusmiddleware = require('./middlewares/check-auth');
const addCsrfTokenMiddleware = require('./middlewares/csrf_token');

const authRoutes = require('./routes/auth.routes');
const baseRoutes = require('./routes/base.routes');
const productsRoutes = require('./routes/products.routes');
const adminRoutes = require('./routes/admin.routes')
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'));

app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));

const sessionConfig = createSessionConfig();
app.use(expressSession(sessionConfig));

app.use(csrf());

app.use(addCsrfTokenMiddleware);
app.use(checkAuthStatusmiddleware);

app.use(authRoutes);
app.use(baseRoutes);
app.use(productsRoutes);
app.use('/admin',adminRoutes)

app.use(errorHandlerMiddleware);

db.connectToDatabase()
.then(function(){
    app.listen(3000);
})
.catch(function(error){
    console.log("failed to connect to database!");
    console.log(error);
});