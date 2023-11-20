import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";

const app = express();
const port = 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));
const isAsleep = false;



app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});


app.post("/update", (req, res) => {
  // change state
  isAsleep = !isAsleep;
  console.log("asleep is" + isAsleep);
})

app.listen(port, () => {
  console.log(`listening on port ${port}`);
})


// TODO: create front end
// create back-end logic 
// create db layer, that contains state (also need to decide what i want to store and what i want to compute dynamically)