const IPFS = require('ipfs-api');
const OrbitDB = require('orbit-db');
const uuid = require('uuid/v4');
const ipfsOptions = {
  EXPERIMENTAL: {
    pubsub: true
  },
  relay: {enabled: true, hop: {enabled: true, active: true}},
  host: 'localhost',
  port: '5001'
};

// Create IPFS instance
const ipfs = new IPFS(ipfsOptions);
const orbitdb = new OrbitDB(ipfs);
let db = null; 
async function loadDB() {
	//db = await orbitdb.docs('todo1');
	try {
		db = await orbitdb.create('todo2','docstore',{
			write: ['*']
		});
	}	
	catch(e) {
		console.log(e);
		db = await orbitdb.open('/orbitdb/QmQvUq6dZa1gR9KZn18diAsnSD6C4xsvdkbZvmq8MeL7rG/todo2')
	}
	// load the local store of the data
	db.events.on('ready', () => {
		console.log('database is ready.')
	});

	db.events.on('replicate.progress', (address, hash, entry, progress, have) => {
		console.log('replication is in progress');
	});

	db.events.on('replicated', (address) => {
		console.log('Replication done.');
	})

	console.log(db.address.toString());
	//orbitdb.open(db.address.toString());
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

