# Endangered Species Web App

This is a full-stack Node.js + MongoDB application for managing a list of endangered species. It allows users to search, view, add, edit, and delete species entries, each with details such as scientific name, threat level, habitat, and description.

This project was created as part of the final practical assignment for the Node.js and MongoDB course.

---

## Key Features

- Search by name, threat level, or keyword (case-insensitive)
- View full species details
- Add new species with validation
- Edit existing species entries
- Confirm and delete species entries

---

## Technologies Used

- **Node.js** and **Express.js** – backend server
- **MongoDB** with **Mongoose** – database and schema management
- **EJS** – templating engine for rendering dynamic views
- **Bootstrap 5** – layout and UI styling
- **dotenv** – environment variable management

---

## 📁 Project Structure

```
endangered-species-app4/
├── app.js               # Main server logic
├── .env                 # MongoDB URI and port config (already included)
├── package.json         # Project dependencies
├── models/              # Mongoose schema (Species.js)
├── views/               # EJS templates (index, add, edit, delete, details)
├── public/styles.css    # Custom styles
└── data/species.json    # Example data (30 species)
```


 
---

## How to Run the Project

1. **Install dependencies**  
   In the terminal:
   ```bash
   npm install
   ```

2. **Start MongoDB locally**
   ```
   mongodb://localhost:27017/endangered_species
   ```

3. **Import sample data (optional)**
   ```
   mongoimport --db endangered_species --collection species --file data/species.json --jsonArray
   ```

4. **Start the app**
   ```
   npm start
   ```

## Open the app in your browser
```
Visit: [http://localhost:3000](http://localhost:3000)

```

## Notes
The app uses the MVC architecture.

Search input is validated server-side using a simple regex.

The .env file is already included and configured.

Form submissions are validated to prevent missing fields and duplicates.


