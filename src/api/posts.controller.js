const postsDAO = require('../dao/postsDAO');
const User = require('./users.controller').User;

const SecretKey = process.env.SECRET_KEY;


module.exports = {
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
			res.json({ success: true, posts: userPostsResponse})

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
			res.status(201).json({success: true})

		} catch (e) {
			res.status(500).json({ e })
			console.error(e)
		}
	},

	removeUserPost: async (req, res) => {
		try {
			let { _id } = req.body
			const userJwt = req.get("Authorization").slice("Bearer ".length)
			const user = await User.decoded(userJwt)
		
			var { error } = user
			if (error) {
				res.status(401).json({ error })
				return
			}

			const removeResult = await postsDAO.removeUserPost(user, _id)
			res.status(200).json({success: true})

		} catch (e) {
			res.status(500).json({ e })
			console.error(e)
		}
	},

	addUserSub: async (req, res) => {
		try {
			const { _id } = req.body
			const userJwt = req.get("Authorization").slice("Bearer ".length)
			const user = await User.decoded(userJwt)
		
			var { error } = user
			if (error) {
				res.status(401).json({ error })
				return
			}

			const addSubResult = await postsDAO.addUserSub(user, _id)
			res.status(201).json({success: true})
	
		} catch (e) {
			res.status(500).json(e)
			console.log(e)
		}
	},

	removeUserSub: async (req, res) => {
		try {
			const { _id, ind } = req.body
			const userJwt = req.get("Authorization").slice("Bearer ".length)
			const user = await User.decoded(userJwt)
			
			var { error } = user
			if (error) {
				res,status(401).json( {error })
				return
			}

			const removeSUbResult = await postsDAO.removeUserSub(_id, ind)
			res.status(202).json({success: true})

		} catch (e) {
			res.status(500).json(e)
			console.log(e)
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