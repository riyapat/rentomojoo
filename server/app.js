const express = require('express');
const cookieParser = require('cookie-parser');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');


const app = express()

// Import Schemas
const Users = require('./models/userSchema');
const Post = require('./models/postSchema');
const Contacts = require('./models/contactSchema');

// connect to db
require('./db/connection')

// Import Middlewares
const authenticate = require('./middleware/auth');
const { default: axios } = require('axios');

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(cors())

const port = process.env.PORT || 8001;

app.get('/request', async (req, res) => {
    try {
        const response = await axios.get('https://amazon.com')
        console.log(response.data)
        res.write(response.data)
    } catch (error) {
        console.log('error', error)
    }
})

app.post('/api/register', async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        if( !username || !email || !password ){
            res.status(400).send('Cannot be empty')
        }

        const isExist = await Users.findOne({email, username});
        if(isExist){
            res.status(400).send('User already exist')
        }else{
            const user = new Users({
                username,
                email,
            })
            bcryptjs.hash(password, 10, (err, hashedPassword) => {
                if(err) next(err);
                user.set('password', hashedPassword)
                user.save((error) => {
                    if(error) next(error);
                    return res.status(200).send('Successfully Registered')
                })
            })
        }
    } catch(error){
        res.status(500).send('Server Error')
        console.log(error, 'error');
    }
})

app.post('/api/login', async(req, res) => {
    const { email, password } = req.body

    if(!email, !password){
        res.status(400).send('Cannot be empty')
    }
    const user = await Users.findOne({$or: [{ email }, { username: email }]});  
    if(!user){
        res.status(401).send('User or password is invalid')
    }else{
        const validate = await bcryptjs.compare(password, user.password)
        if(!validate){
            res.status(401).send('User or password is invalid')
        }else{
            const payload = {
                id: user._id,
                username: user.username
            }
            const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'THIS_IS_THE_SECRET_KEY_OF_JWT';
            jwt.sign(
                payload,
                JWT_SECRET_KEY,
                { expiresIn: 86400 },
                async (err, token) => {
                    if(err) res.json({message: err})
                    await Users.updateOne({ _id: user._id }, {
                        $set: { token }
                    })
                    user.save()
                    return res.status(200).json({ user, token })
                }
            )
        }
    }
})

app.post('/api/new-post', authenticate,  async (req, res) => {
    try {
        const { caption, desc, url } = req.body;
        const { user } = req
        if(!caption || !desc || !url){
            res.status(400).send('Please fill all the fields')
        }
        const createPost = new Post({
            caption,
            description: desc,
            image: url,
            user: user
        })
        await createPost.save()
        res.status(200).send('Create Post Successfully')
    } catch (error) {
        res.status(500).send('Error' + error)
    }
})

app.get('/api/profile', authenticate, async(req, res) => {
    try {
        const { user } = req;
        const posts = await Post.find({ user: user._id })
        res.status(200).json({posts, user})
        
    } catch (error) {
        res.status(500).send(error)
    }
})

app.get('/api/people', authenticate, async(req, res) => {
    try {
        const { username } = req.query;
        const { user: follower } = req
        const [ user ] = await Users.find({ username })
        const posts = await Post.find({ user: user._id })
        const [isFollowed] = await Contacts.find({ follower: follower._id, followed: user._id  })
        const userDetail = {
            id: user._id,
            username: user.username,
            email: user.email
        }
        res.status(200).json({posts, userDetail, isFollowed: !!isFollowed})
        
    } catch (error) {
        res.status(500).send(error)
    }
})

app.get('/api/posts', authenticate, async(req, res) => {
    try {
        const { user } = req;
        const posts = await Post.find().populate('user', '_id username email').sort({ '_id': -1 })
        res.status(200).json({posts, user})
        
    } catch (error) {
        res.status(500).send(error)
    }
})

app.post('/api/follow', authenticate, async(req, res) => {
    try {
        const { id } = req.body;
        const { user } = req;
        if(!id) return res.status(400).send('id cannot be empty')
        
        const [followedUser] = await Users.find({ _id: id })

        const followUser = new Contacts({
            follower: user,
            followed: followedUser
        })

        await followUser.save()
        res.status(200).json({ isFollowed: true })

    } catch (error) {
        console.log(error, 'error');
        res.status(500).send(error)
    }
})

app.post('/api/unfollow', authenticate, async(req, res) => {
    try {
        const { id } = req.body;
        const { user } = req;
        if(!id) return res.status(400).send('id cannot be empty')
        
        await Contacts.deleteOne({ follower: user._id, followed: id })
        res.status(200).json({ isFollowed: false })

    } catch (error) {
        console.log(error, 'error');
        res.status(500).send(error)
    }
})

app.put('/api/like', authenticate, async(req, res) => {
    try {
        const { id } = req.body;
        const { user } = req;
        if(!id) return res.status(400).send('id cannot be empty')

        const updatedPost = await Post.findOneAndUpdate({ _id: id }, {
            $push: { likes: user._id }
        }, { returnDocument: "after" }).populate('user', '_id username email')

        res.status(200).json({ updatedPost })

    } catch (error) {
        console.log(error, 'error');
        res.status(500).send(error)
    }
})

app.put('/api/unlike', authenticate, async(req, res) => {
    try {
        const { id } = req.body;
        const { user } = req;
        if(!id) return res.status(400).send('id cannot be empty')

        const updatedPost = await Post.findOneAndUpdate({ _id: id }, {
            $pull: { likes: user._id }
        }, { returnDocument: "after" }).populate('user', '_id username email')

        res.status(200).json({ updatedPost })

    } catch (error) {
        console.log(error, 'error');
        res.status(500).send(error)
    }
})

app.listen(port, ()=> {
    console.log('Server is running');
})