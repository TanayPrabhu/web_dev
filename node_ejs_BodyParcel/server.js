const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Load JSON data once
const skills = JSON.parse(fs.readFileSync('./data/skills.json')).skills;
const allProjects = JSON.parse(fs.readFileSync('./data/projects.json')).projects;

// Home route with optional category query
app.get('/', (req, res) => {
  const query = Object.keys(req.query)[0]; // e.g., ?web -> 'web'

  if (query) {
    const projects = allProjects.filter(p => p.category === query);
    const title = query.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    return res.render('category', { categoryTitle: title, projects });
  }

  res.render('index', { skills });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
