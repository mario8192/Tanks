const express = require("express");
const bodyParser = require('body-parser');
const path = require('path')

const app = express();
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname, "/src")))

app.get('/', function(req, res) {
    res.render("index")
})

app.listen(3000)