const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Species = require("./models/Species");
require("dotenv").config();

const app = express();

// View engine and middleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Connect to MongoDB
const mongoURI = process.env.MONGO_URI;
console.log("MONGO_URI is:", mongoURI);

mongoose
  .connect(mongoURI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Home/Search Route
app.get("/", async (req, res) => {
  const query = req.query.query || "";
  const searchBy = req.query.searchBy || "name";
  const isValidQuery = /^[\w\s]+$/.test(query);

  let searchFilter = {};
  let speciesList = [];

  try {
    if (query && isValidQuery) {
      const regex = { $regex: `^.*${query}.*$`, $options: "i" }; // case-insensitive

      if (searchBy === "name") {
        searchFilter.name = regex;
      } else if (searchBy === "threatLevel") {
        searchFilter.threatLevel = regex;
      } else if (searchBy === "keyword") {
        searchFilter = {
          $or: [
            { name: regex },
            { threatLevel: regex },
            { scientificName: regex },
            { habitat: regex },
            { description: regex }
          ]
        };
      }

      speciesList = await Species.find(searchFilter);
      res.render("index", { speciesList, query, searchBy, error: null });
    } else if (query && !isValidQuery) {
      return res.render("index", {
        speciesList: [],
        query,
        searchBy,
        error: "❌ Invalid search. Please use only letters and numbers."
      });
    } else {
      speciesList = await Species.find();
      res.render("index", { speciesList, query: "", searchBy: "name", error: null });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching species.");
  }
});

// GET: Add form
app.get("/add", (req, res) => {
  res.render("add", { errorMessage: null });
});

// POST: Add new species
app.post("/add", async (req, res) => {
  try {
    const { name, scientificName, threatLevel, habitat, description } = req.body;

    // Basic validation
    if (!name || !scientificName || !threatLevel || !habitat || !description) {
      return res.render("add", {
        errorMessage: "⚠️ All fields are required. Please fill them in."
      });
    }

    // Check for duplicates
    const existing = await Species.findOne({
      $or: [
        { name: new RegExp(`^${name}$`, "i") },
        { scientificName: new RegExp(`^${scientificName}$`, "i") }
      ]
    });

    if (existing) {
      return res.render("add", {
        errorMessage: "❌ Species already exists. Please enter a new one."
      });
    }

    const newSpecies = new Species(req.body);
    await newSpecies.save();
    res.redirect("/");
  } catch (err) {
    res.render("add", {
      errorMessage: "❌ Something went wrong. Please try again."
    });
  }
});

// GET: Details
app.get("/details/:id", async (req, res) => {
  try {
    const species = await Species.findById(req.params.id);
    if (!species) return res.status(404).send("Species not found");
    res.render("details", { species });
  } catch (err) {
    res.status(500).send("Error loading species details");
  }
});

// GET: Edit form
app.get("/edit/:id", async (req, res) => {
  try {
    const species = await Species.findById(req.params.id);
    if (!species) return res.status(404).send("Species not found");
    res.render("edit", { species });
  } catch (err) {
    res.status(500).send("Error loading edit form");
  }
});

// POST: Update species
app.post("/edit/:id", async (req, res) => {
  try {
    await Species.findByIdAndUpdate(req.params.id, req.body);
    res.redirect("/");
  } catch (err) {
    res.status(500).send("Error updating species");
  }
});

// GET: Delete confirmation
app.get("/delete/:id", async (req, res) => {
  try {
    const species = await Species.findById(req.params.id);
    if (!species) return res.status(404).send("Species not found");
    res.render("delete", { species });
  } catch (err) {
    res.status(500).send("Error loading delete page");
  }
});

// POST: Delete species
app.post("/delete/:id", async (req, res) => {
  try {
    await Species.findByIdAndDelete(req.params.id);
    res.redirect("/");
  } catch (err) {
    res.status(500).send("Error deleting species");
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
