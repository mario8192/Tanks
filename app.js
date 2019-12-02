const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
//const ai = require("./src/ai.js");

const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: false, limit: "50mb" }));
app.use(express.static(path.join(__dirname, "/src")));

let jason = null;

app.post("/", function(req, res) {
  //console.log(req.body.qtable);

  //const fs = require("./src/qtable.json");
  try {
    fs.writeFileSync("./src/qtable.json", req.body.qtable);
    console.error("save success");
  } catch (err) {
    console.error("error");
  }
});

fs.readFile("./src/qtable.json", "utf8", (err, jsonString) => {
  if (err) {
    console.log("Error reading file from disk:", err);
    return;
  }
  try {
    jason = JSON.parse(jsonString);
    //console.log(jason);
    app.get("/", function(req, res) {
      //res.render("index", { jason: jason });
      ai.loadQtableFromJSON(jason); // doesn't work right now
    });
    console.error("load success");
  } catch (err) {
    console.log("Error parsing JSON string:", err);
  }
});

app.listen(3000);
