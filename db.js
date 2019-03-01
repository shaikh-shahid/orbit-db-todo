const IPFS = require('ipfs-api');
const OrbitDB = require('orbit-db');
const uuid = require('uuid/v4');
const ipfsOptions = {
  EXPERIMENTAL: {
    pubsub: true
  }
};

// Create IPFS instance
const ipfs = new IPFS('localhost','5001');
const orbitdb = new OrbitDB(ipfs);
let db = null; 
async function loadDB() {
	db = await orbitdb.docs('todo');
	// load the local store of the data
	db.events.on('ready', () => {
		console.log('database is ready.')
	});
	db.load();
}
loadDB();

function getAllTodo() {
	return new Promise((resolve, reject) => {
		try {
			let todos = db.get('');
			resolve(todos);
		}
		catch(e) {
			reject(e);
		}
	});
}

function addTodo(data) {
	return new Promise(async (resolve, reject) => {
		try {
			// generate random ID
	                let id = uuid();
			let hash = await db.put({_id: id, text: data, status: 'PENDING'});
			let todoData = db.get(id);
			resolve(todoData);
		}
		catch(e) {
			reject(e);
		}
	});

}

function editTodo(data) {
	return new Promise(async (resolve, reject) => {
                try {
                        // generate random ID
                        let id = data.id;
			let todoData = db.get(id);
                        let hash = await db.put({_id: id, text: todoData[0].text, status: data.status});
			let updatedTodo = db.get(id);
                        resolve(updatedTodo);
                }
                catch(e) {
                        reject(e);
                }
        });
}

function deleteTodo(id) {
	return new Promise(async (resolve, reject) => {
                try {
                        // generate random ID
                        let hash = await db.del(id);
                        resolve(hash);
                }
                catch(e) {
                        reject(e);
                }
        });
}

module.exports = {
	getAllTodo: getAllTodo,
	addTodo: addTodo,
	editTodo: editTodo,
	deleteTodo: deleteTodo
}

