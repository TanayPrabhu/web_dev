const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  const skills = JSON.parse(fs.readFileSync('./data/skills.json')).skills;
  res.render('index', { skills });
});

app.get('/:category', (req, res) => {
  const category = req.params.category.toLowerCase();
  const validCategories = ['web', 'ai-ml', 'app-development'];

  if (!validCategories.includes(category)) {
    return res.status(404).send('<h1>404 Category Not Found</h1>');
  }

  const allProjects = JSON.parse(fs.readFileSync('./data/projects.json')).projects;
  const filteredProjects = allProjects.filter(p => p.category === category);
  const categoryTitle = category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  res.render('category', { categoryTitle, projects: filteredProjects });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
