require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const port = process.env.VITE_PORT;

// Use CORS middleware
app.use(cors());

app.get("/foodie/getAll", async (req, res) => {
  const { latitude, longitude, keyword, radius, key } = req.query;
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=restaurant&keyword=${encodeURIComponent(
    keyword
  )}&key=${key}`;
  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching data from Google Maps API");
  }
});

app.get("/foodie/getRestaurant", async (req, res) => {
  const { place_id, key } = req.query;
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&key=${key}`;
  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching data from Google Maps API");
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
