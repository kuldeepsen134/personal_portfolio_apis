const express = require('express')
const app = express();

require('dotenv').config();

const cors = require('cors')
const bodyParser = require('body-parser');


const { PORT } = require('./app/config/config');



app.use(cors({
    origin: ['http://localhost:3000', 'http://192.168.0.23:3000'],
    credentials: true,
    methods: ['POST', 'PUT', 'GET', 'DELETE'],
    preflightContinue: false,
    optionsSuccessStatus:204
  }));
  



app.use(bodyParser.json())

const { authJWT } = require('./app/middleware/auth');
const { handleError } = require('./app/utils/helper');
// app.use(authJWT);


require('./app/router/user')(app);
require('./app/router/auth')(app);
require('./app/router/media')(app);
require('./app/router/project')(app);
require('./app/router/experience')(app);

require('./app/router/skill')(app);
require('./app/router/blog')(app);
require('./app/router/gallery')(app);


app.get('*', (req, res) => handleError('Hunnn smart!', 400, res,));



app.listen(PORT, () => console.log(`Server is running port on :${PORT}`))