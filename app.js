const express = require("express");
const bodyParser = require('body-parser');
const path = require('path')
const fs = require('fs')

const app = express();
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({extended:false, limit: '50mb'}))
app.use(express.static(path.join(__dirname, "/src")))

var jason = null 


app.post('/', function(req, res)    {
    console.log(req.body.qtable)
})

fs.readFile('./src/qtable.json', 'utf8', (err, jsonString) => {
    if (err) {
        console.log("Error reading file from disk:", err)
        return
    }
    try {
        jason = JSON.parse(jsonString)
        console.log(jason)
        app.get('/', function(req, res) {
            res.render("index", {"jason":jason})
        })
} catch(err) {
        console.log('Error parsing JSON string:', err)
    }
})

app.listen(3000)