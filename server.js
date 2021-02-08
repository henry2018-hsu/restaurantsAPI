/*********************************************************************************
* WEB422 – Assignment 1
* I declare that this assignment is my own work in accordance with Seneca Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
* Name: ____Lin Xu_____ Student ID: ___056326143_ Date: ____Jan. 20, 2021__
* Heroku Link: ___https://calm-journey-61101.herokuapp.com
*
********************************************************************************/ 
// ################################################################################
// Web service setup

const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
const app = express();
const HTTP_PORT = process.env.PORT || 8080;
// Or use some other port number that you like better

// Add support for incoming JSON entities
app.use(bodyParser.json());
// Add support for CORS
app.use(cors());

app.use(express.json());



// ################################################################################
// Data model and persistent store setup

const RestaurantDB = require("./modules/restaurantDB.js");
const db = new RestaurantDB("mongodb+srv://dbUser:potus%4020170620@cluster0.hcwpz.mongodb.net/sample_restaurants?retryWrites=true&w=majority");
db.initialize().then(()=>{
  app.listen(HTTP_PORT, ()=>{
  console.log(`server listening on: ${HTTP_PORT}`);
  });
 }).catch((err)=>{
  console.log(err);
 });

 // ################################################################################
// Request handlers for data entities (listeners)
app.get("/",  (req, res) => {
  res.status(200).json( {message: "API Listening"}); 
});
// Get all
app.get("/api/restaurants/?",  (req, res) => {
  // Call the RestaurantDB method
  console.log(req.query);
  let o =  db.getAllRestaurants(req.query.page, req.query.perPage, req.query.borough);
  // Return the appropriate result
  o.then((restaurant) => {
    if(!restaurant) {
        console.log("No restaurant could be found");
    } else {
      res.status(200).json(restaurant);
      console.log(new Date(), 'Get all');
    }
  })
    .catch((err) => {
      console.log(err);
      res.status(404).json(null); 
    });
});

// Get one
app.get("/api/restaurants/:id",  (req, res) => {
  // Call the RestaurantDB method
  let o =  db.getRestaurantById(req.params.id);
  o.then((restaurant) => {
    if(!restaurant) {
        console.log("No restaurant could be found");
    } else {
      res.status(200).json(restaurant);
    }    
  })
    .catch((err) => {
      console.log(err);
      res.status(404).json(err); 
    });
});

// Add new
app.post("/api/restaurants", async (req, res) => {
  // Call the RestaurantDB method
  // MUST return HTTP 201
  let o = await db.addNewRestaurant(req.body);
  o ? res.status(201).json(o) : res.status(404).json({ "message": "Add new restaurant error" });
});

// Edit existing
app.put("/api/restaurants/:id", async (req, res) => {
  // Make sure that the URL parameter matches the body value
  // This code is customized for the expected shape of the body object
  
  if (req.params.id != req.body._id) {
    res.status(404).json({ "message": "RestaurantId not match" });
  }
  else {
    // Call the theater method
    let o = await db.updateRestaurantById(req.body, req.params.id);
    // Return the appropriate result
    o ? res.status(200).json(o) : res.status(404).json({ "message": "Edit existing restaurant error" });
    
  }
});

// Delete item
app.delete("/api/restaurants/:id", async (req, res) => {
  // Call the RestaurantDB method
  let o = await db.deleteRestaurantById(req.params.id);
  o ? res.status(204).json(o) : res.status(404).json({ "message": "Delete existing restaurant error" });
});



// ################################################################################
// Tell the app to start listening for requests

// app.listen(HTTP_PORT, () => { console.log("Ready to handle requests on port " + HTTP_PORT) });

