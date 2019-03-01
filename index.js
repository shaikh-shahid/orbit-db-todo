const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();
const db = require('./db');

// add the middleware
app.use(bodyParser.json());
app.use(express.static('static'));
// routers

router.get('/',(req,res) => {
	// serve the HTML page
	res.sendFile('index.html');
});

router.get('/todo',async (req,res) => {
	// get all tods
	let todos = await db.getAllTodo();
	res.json(todos);
});

router.post('/todo',async (req,res) => {
	// add the todo
	console.log('asdassasd',req.body)
	let todos = await db.addTodo(req.body.text);
        res.json(todos);
});

router.put('/todo', async (req,res) => {
	// edit the todo
	let todos = await db.editTodo(req.body);
	res.json(todos);
});

router.delete('/todo',async (req,res) => {
	let response = await db.deleteTodo(req.body.id);
	res.json(response)
	// delete the todo
});

app.use('/', router);
app.listen(process.env.PORT || 3000);
console.log('Listening on '+(process.env.PORT || 3000)+' port');
