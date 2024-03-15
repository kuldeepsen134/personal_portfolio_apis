const express = require('express')
const app = express();
const path = require('path');

require('dotenv').config();

const cors = require('cors')
const bodyParser = require('body-parser');


const { PORT } = require('./src/config/config');


const buildPath = path.join(__dirname, './client/build')

app.use(express.static(buildPath))



app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(cors({
    origin: ['http://localhost:3000', 'http://192.168.0.23:3000'],
    credentials: true,
    methods: ['POST', 'PUT','PATCH', 'GET', 'DELETE'],
    preflightContinue: false,
    optionsSuccessStatus:204
  }));



require('./src/router/user')(app);
require('./src/router/auth')(app);
require('./src/router/media')(app);
require('./src/router/project')(app);
require('./src/router/experience')(app);

require('./src/router/skill')(app);
require('./src/router/blog')(app);
require('./src/router/gallery')(app);


// gets the static files from the build folder
app.get('*', (req, res) => {
  // res.sendFile(path.join(buildPath, 'index.html'))
  res.send({
    message:'welcone'
  })
})



app.listen(PORT, () => console.log(`Server is running port on :${PORT}`))