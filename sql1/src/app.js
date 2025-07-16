const express = require('express');
const bodyParser = require('body-parser');
const connectMysql = require('./db/connection.js');
const dayjs = require('dayjs');

const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
    const connection = await connectMysql.connection();
    const requestedSession = parseInt(req.query.session ?? 1);
    let assignments = [];

    try {
        const [rows] = await connection.execute(
            'SELECT * FROM assignments WHERE session = ?',
            [requestedSession]
        );
        assignments = rows;
    } catch (err) {
        console.log(err);
    }

    res.render('index', { assigments: assignments });
});

app.get('/form', (req, res) => {
    res.render('form', { assignment: null });
});

app.post('/submit-form', async (req, res) => {
    const connection = await connectMysql.connection();
    const { name, link, session } = req.body;
    const now = dayjs().format('YYYY-MM-DD HH:mm:ss');

    try {
        await connection.execute(
            'INSERT INTO assignments (name, link, submitted_at, session) VALUES (?, ?, ?, ?)',
            [name, link, now, session]
        );
    } catch (err) {
        console.log(err);
    }

    res.redirect('/?session=' + session);
});

app.get('/edit/:id', async (req, res) => {
    const connection = await connectMysql.connection();
    const id = req.params.id;

    try {
        const [rows] = await connection.execute('SELECT * FROM assignments WHERE id = ?', [id]);
        if (rows.length > 0) {
            res.render('form', { assignment: rows[0] });
        } else {
            res.status(404).send('Assignment not found');
        }
    } catch (err) {
        console.log(err);
        res.status(500).send('Error loading assignment');
    }
});

app.post('/update-assignment', async (req, res) => {
    const connection = await connectMysql.connection();
    const { id, name, link, session } = req.body;

    try {
        await connection.execute(
            'UPDATE assignments SET name = ?, link = ?, session = ? WHERE id = ?',
            [name, link, session, id]
        );
        res.redirect('/?session=' + session);
    } catch (err) {
        console.log(err);
        res.status(500).send('Update failed');
    }
});

app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});
