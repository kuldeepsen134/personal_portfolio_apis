const express = require('express')
const app = express();
require('dotenv').config();

const cors = require('cors')
const bodyParser = require('body-parser');

const { PORT } = require('./src/config/config');


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(cors({
  origin: ['http://localhost:3000', 'http://192.168.0.23:3000', 'https://kuldeepsen.onrender.com', 'https://kuldeepsen.netlify.app', 'https://'],
  credentials: true,
  methods: ['POST', 'PUT', 'PATCH', 'GET', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));



require('./src/router/user')(app);
require('./src/router/auth')(app);
require('./src/router/media')(app);
require('./src/router/project')(app);
require('./src/router/experience')(app);
require('./src/router/education')(app);


require('./src/router/skill')(app);
require('./src/router/blog')(app);
require('./src/router/gallery')(app);
require('./src/router/contactUs')(app);



// gets the static files from the build folder
app.get('*', (req, res) => {
  res.status(400).send({
    message: 'Hunn smart!',
    error: true
  })
})



app.listen(PORT, () => console.log(`Server is running port on :${PORT}`))