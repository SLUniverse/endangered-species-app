const express = require('express');
const router = express.Router();
const Species = require('../models/Species');

// List species and handle search
router.get('/', async (req, res) => {
    const { query, searchBy } = req.query;
    let filter = {};

    if (query) {
        if (searchBy === 'name') {
            filter.name = { $regex: query, $options: 'i' };
        } else if (searchBy === 'threatLevel') {
            filter.threatLevel = { $regex: query, $options: 'i' };
        } else {
            filter.$or = [
                { name: { $regex: query, $options: 'i' } },
                { scientificName: { $regex: query, $options: 'i' } },
                { habitat: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } },
                { threatLevel: { $regex: query, $options: 'i' } }
            ];
        }
    }

    try {
        const species = await Species.find(filter);
        res.render('index', { species: species, query: query, searchBy: searchBy });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Add form
router.get('/add', (req, res) => {
    res.render('add', { errorMessage: null }); // Pass errorMessage as null initially
});

// Add handler
router.post('/add', async (req, res) => {
    const { name, scientificName, threatLevel, habitat, description } = req.body;

    try {
        // Check if species already exists
        const existingSpecies = await Species.findOne({ name, scientificName });

        if (existingSpecies) {
            // Species already exists, render the add form with an error message
            return res.status(400).render('add', {
                errorMessage: 'Species already exists in the database.'
            });
        }

        // Species does not exist, create a new one
        const newSpecies = new Species({
            name,
            scientificName,
            threatLevel,
            habitat,
            description
        });

        await newSpecies.save();
        res.redirect('/'); // Redirect to the main page after successful addition
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while adding the species.'); // Handle server errors
    }
});

// Edit form
router.get('/edit/:id', async (req, res) => {
    const species = await Species.findById(req.params.id);
    res.render('edit', { species });
});

// Edit handler
router.post('/edit/:id', async (req, res) => {
    const { name, scientificName, threatLevel, habitat, description } = req.body;
    await Species.findByIdAndUpdate(req.params.id, {
        name, scientificName, threatLevel, habitat, description
    });
    res.redirect('/');
});

// Optional delete confirmation page
router.get('/delete/:id', async (req, res) => {
    const species = await Species.findById(req.params.id);
    res.render('delete', { species });
});

// Delete handler
router.post('/delete/:id', async (req, res) => {
    await Species.findByIdAndDelete(req.params.id);
    res.redirect('/');
});

// View details
router.get('/details/:id', async (req, res) => {
    const species = await Species.findById(req.params.id);
    res.render('details', { species });
});

// Favicon.ico fix
router.get('/favicon.ico', (req, res) => res.status(204));

module.exports = router;
