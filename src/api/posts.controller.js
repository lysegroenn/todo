//const mongo = require('../dao/dbMongo');
const postsDAO = require('../dao/postsDAO');

module.exports = {
    fetchAll: (req, res) => {
		console.log("Got GET request.")
        mongo.connect()
        .then(client => postsDAO.fetchAll(client))
        .then(data => res.status(200).json(data))
        //.then(json => res.status(200).json(json))
        .catch(err => res.status(500).json({msg: "Server Error."}))
	},
	
	addPost: (req, res) => {
		try {
			console.log('Got PUT request.')
			let title = "New Post"
			mongo.connect()
			.then(client => postsDAO.addPost(title))
			.then(data => res.status(201).json({msg: "Post created."}))
			.catch(err => {
				console.log(err);
				res.status(500).json({msg: "Server Error."})
			})
		} catch(e) {
			console.log(e)
		}

	},

	removePost: (req, res) => {
		try {
			_id = req.body._id;
			console.log(`Got Remove Post request with id ${_id}.`)
			mongo.connect()
			.then(client => postsDAO.removePost(_id))
			.then(data => res.status(202).json(data))
			.catch(err => {
				console.log(err)
				res.status(500).json({msg: "Server Error"})
			})
		} catch(e) {
			console.log(e);
		}
	},

	addSub: async (req, res) => {
		try {
			let _id = req.body._id;
			let client = await mongo.connect()
			let data = await postsDAO.addSub(_id)
			res.status(201).json(data);
			 
		} catch (e) {
			console.log(e)
			res.status(500).json({msg: "Server Error"})
		}
	},

	removeSub: async (req, res) => {
		try {
			let { _id, ind } = req.body;
			let client = await mongo.connect()
			let data = await postsDAO.removeSub(_id, ind)

			res.status(202).json(data)
		} catch (e) {
			console.log(e)
			res.status(500).json({msg: "Server Error"})
		}
	}
}


/*
router.get('/posts/', (req, res, next) => {
	try {
		console.log('got posts request')
		mongo.connect()
		.then(client => GV.getPosts(client))
		.then(data => {
			res.status(200).json(data)
			console.log(data[0].items.length)
			mongo.close(client)})
		.catch(err => { 
			res.status(500).json({msg: "Sever Error."})
			console.log(err)
		})
	} catch {
		next(e);
	}
})

router.get('/posts/:id/', (req, res) => {
	try {
		id = req.params.id;
		mongo.connect()
		.then(client => GV.getOnePost(client, id))
		.then(data => res.status(200).json(data))
		.catch(err => res.status(500).json({msg: err}))
	} catch(e) {
		//next(e);
		
	}
})

router.put('/posts/', (req, res, next) => {
	try {
		const id = req.body._id;
		console.log(`got PUT request with id: ${id}.`)
		mongo.connect()
		.then(client => GV.addSub(client, id))
		.then(data => {
			res.status(200).json(data)
			mongo.close(client)})
		.catch(err => res.status(500).json({msg: err}))
	} catch(e) {
		next(e);
	}
})

router.delete('/posts/', (req, res, next) => {
	try {
		const id = req.body._id;
		const ind = req.body.ind;
		console.log(`got DELETE request with id: ${id} and index: ${ind}.`)
		mongo.connect()
		.then(client => GV.removeSub(client, id, ind))
		.then(data => {
			res.status(200).json(data)
			mongo.close(client)})
		.catch(err => res.status(500).json({msg: err}))
	} catch(e) {
		next(e)
	}
})

router.post('/posts/', (req,res, next) => {
	try {
		const title = req.body.title && title !== null ? 
		mongo.connect()
		.then(client => GV.addPost(client, title))
		.then(data => res.status(201).json({msg: data}))
		.catch(err => res.status(500).json({msg: err}))
		: res.status(401).json({msg: "Please enter a valid title."})
	} catch(err) {
		next(err);
	}
})
*/