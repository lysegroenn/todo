const postsDAO = require('../dao/postsDAO');
const User = require('./users.controller').User;

const SecretKey = process.env.SECRET_KEY;


module.exports = {
    fetchAll: async (req, res) => {
		try {
			console.log('Got GET request')
			const posts = await postsDAO.fetchAll()
			res.status(200).json(posts)
		} catch (e) {
			res.status(500).json({msg: "Server Error."})
		}
	},
	
	addPost: async (req, res) => {
		try {
			console.log('Got PUT request.')
			const title = "New Post"
			let response = await postsDAO.addPost(title)
			res.status(201).json({msg: "Post created."})
		} catch(e) {
			res.status(500).json({msg: "Server Error."})
			console.log(e)
		}

	},

	removePost: async (req, res) => {
		try {
			const _id = req.body._id;
			console.log(`Got Remove Post request with id ${_id}.`)

			let response = await postsDAO.removePost(_id)
			res.status(202).json({msg: `Successfully removed post.`})
			} catch(e) {
			console.log(e);
			res.status(500).json({msg: "Server Error"})
		}
	},

	addSub: async (req, res) => {
		try {
			let _id = req.body._id;
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
			let data = await postsDAO.removeSub(_id, ind)

			res.status(202).json(data)
		} catch (e) {
			console.log(e)
			res.status(500).json({msg: "Server Error"})
		}
	},

	getUserPosts: async (req, res) => {
		try {
			console.log(`Got getUserPosts request`)
			const userJwt = req.get("Authorization").slice("Bearer ".length)
			const user = await User.decoded(userJwt)
			var { error } = user
			if (error) {
				res.status(401).json({ error })
				return
			} 

			const userPostsResponse = await postsDAO.getUserPosts(user)
			//console.log(userPostsResponse)
			res.json({ status: "success", posts: userPostsResponse})

		} catch (e) {
			res.status(500).json({ e: e + " hej" })
		}
	},

	addUserPost: async (req, res) => {
		try {
			let { title } = req.body
			const userJwt = req.get("Authorization").slice("Bearer ".length)
			const user = await User.decoded(userJwt)
		
			var { error } = user
			if (error) {
				res.status(401).json({ error })
				return
			}

			const addResult = await postsDAO.addUserPost(user, title)
			res.status(201).json({status: "success"})

		} catch (e) {
			res.status(500).json({ e })
			console.error(e)
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