const express = require("express");
const mongoose = require("mongoose");
const orderRoutes = require("./routes/order.routes");

const app = express();
const port = 8000;
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json());

app.use("/orders", orderRoutes);
app.get("/about", (req, res) => {
  res.render("about", { title: "About" });
});

//"strictQuery",true means store in DB what is specified in the model
mongoose.set("strictQuery", true);
const connectToDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/order");
    console.log("Connected to Mongo DB");
  } catch (err) {
    console.log(err);
  }
};

connectToDB();
app.listen(port, () => console.log(`Server running on port: ${port}`));
