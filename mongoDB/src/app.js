const express = require('express');
const bodyParser = require('body-parser');
const { connectMongo } = require('./db/connection.js');
const {
  createAssignment,
  getAssignments,
  getAssignmentById,
  updateAssignment,
  deleteAssignment
} = require('./db/assignment.model.js');
const dayjs = require('dayjs');

const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
    await connectMongo();
    const requestedSession = parseInt(req.query.session ?? 1);
    let assignments = [];
    try {
        assignments = await getAssignments({ session: requestedSession });
        assignments.sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at));
    } catch (err) {
        console.log(err);
    }
    res.render('index', { assigments: assignments });
});

app.get('/form', (req, res) => {
    res.render('form', { assignment: null });
});

app.post('/submit-form', async (req, res) => {
    await connectMongo();
    const { name, link, session } = req.body;
    try {
        await createAssignment({ name, link, session: parseInt(session) });
    } catch (err) {
        console.log(err);
    }
    res.redirect('/?session=' + session);
});

app.get('/edit/:id', async (req, res) => {
    await connectMongo();
    const id = req.params.id;
    try {
        const assignment = await getAssignmentById(id);
        if (assignment) {
            res.render('form', { assignment });
        } else {
            res.status(404).send('Assignment not found');
        }
    } catch (err) {
        console.log(err);
        res.status(500).send('Error loading assignment');
    }
});

app.post('/update-assignment', async (req, res) => {
    await connectMongo();
    const { id, name, link, session } = req.body;
    try {
        await updateAssignment(id, { name, link, session: parseInt(session) });
        res.redirect('/?session=' + session);
    } catch (err) {
        console.log(err);
        res.status(500).send('Update failed');
    }
});

// Delete assignment
app.post('/delete/:id', async (req, res) => {
    await connectMongo();
    const id = req.params.id;
    // Try to get session from referrer or default to 1
    let session = 1;
    try {
        if (req.headers.referer) {
            const url = new URL(req.headers.referer);
            const sessionParam = url.searchParams.get('session');
            if (sessionParam) session = sessionParam;
        }
    } catch {}
    try {
        await deleteAssignment(id);
        res.redirect('/?session=' + session);
    } catch (err) {
        console.log(err);
        res.status(500).send('Delete failed');
    }
});

app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});
