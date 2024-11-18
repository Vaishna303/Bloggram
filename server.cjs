require('dotenv').config();

const express = require('express');
const fs = require('fs');
const mongoose = require('mongoose');
const app = express();

const bodyParser = require('body-parser');
//const cors = require('cors');
const cors = require('cors');
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  credentials: true, 
}));

const multer = require('multer');
const path = require('path');

app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(express.static(path.join(__dirname, 'dist')));


const storage = multer.diskStorage({
  destination: function (req, file, cb) { cb(null, 'uploads/');},
  filename: function (req, file, cb) { cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));}
});
const upload = multer({ storage: storage });

const PORT = process.env.PORT || 3002;
const MONGODB_URI = process.env.MONGODB_URI;
//const MONGODB_URI = 'mongodb://127.0.0.1:27017/Bloggram';
mongoose.connect(MONGODB_URI);

const db = mongoose.connection;
db.on('connected', () => console.log('connected'));
db.on('open', () => console.log('open'));
db.on('disconnected', () => console.log('disconnected'));
db.on('reconnected', () => console.log('reconnected'));  
db.on('disconnecting', () => console.log('disconnecting'));
db.on('close', () => console.log('close'));
db.on('error', (err) => { console.error('MongoDB connection error:', err); });

const CommentSchema = new mongoose.Schema({
  text: String,
  by:String,
  createdAt: { type: Date, default: Date.now }
});

const BlogSchema = new mongoose.Schema({
  img: String,
  title: String,
  subtitle: String,
  category: String,
  content: String,
  hashtag: [String],
  likes: { type: Number, default: 0 },
  shares: { type: Number, default: 0 },
  comments: [CommentSchema],
  createdAt: { type: Date, default: Date.now }
});

const NameModel = mongoose.model('User', {
  username: String,
  mail: String,
  phone: String,
  password: String,
  question : String,
  answer : String,
  posts : [BlogSchema],
  createdAt: { type: Date, default: Date.now }
});

//Get All Blogs
app.get('/api/getAllBlogs', async (req, res) => {
  try {
    const allUsers = await NameModel.find({});
    const formattedBlogs = allUsers.reduce((acc, user) => {
      const userBlogs = user.posts.map(blog => {
        return {
          author: user.username,
          img: blog.img,
          title: blog.title,
          subtitle: blog.subtitle,
          category : blog.category,
          content: blog.content,
          hashtag: blog.hashtag,
          likes: blog.likes,
          shares: blog.shares,
          comments: blog.comments,
          createdAt: blog.createdAt
        };
      });
      return acc.concat(userBlogs);
    }, []);
    res.status(200).json(formattedBlogs);
  } catch (error) {
    console.error('Error retrieving blogs from MongoDB:', error);
    res.status(500).send('Internal Server Error\n');
  }
});

//User SignUp
// app.post('/api/signup', (req, res) => {
//   console.log('Received request:', req.body);
//   const { username, mail, phone, password, question, answer } = req.body;

//   const newName = new NameModel({ username, mail, phone, password, question, answer });
//   newName.save()
//     .then(() => {
//       console.log('Data saved successfully');
//       res.status(200).send('Successfully signin');
//     })
//     .catch((err) => {
//       console.error('Error saving data to MongoDB:', err);
//       res.status(500).send('Internal Server Error\n');
//     });
// });

app.post('/api/signup', async (req, res) => {
  console.log('Received request:', req.body);
  const { username, mail, phone, password, question, answer } = req.body;

  try {
    // Check if the email already exists
    const existingUser = await NameModel.findOne({ mail });
    if (existingUser) {
      console.error('EEmail already registered :', mail);
      return res.status(400).send('Email is already registered.');
    }

    // If not, create a new user
    const newName = new NameModel({ username, mail, phone, password, question, answer });
    await newName.save();

    console.log('Data saved successfully');
    res.status(200).send('Successfully signed up');
  } catch (err) {
    console.error('Error saving data to MongoDB:', err);
    res.status(500).send('Internal Server Error');
  }
});

//User SignIn
// app.post('/api/signIn', async (req, res) => {
//   try {
//     const { mail, password } = req.body;
//     const user = await NameModel.findOne({ mail, password});
//     if (user) {
//       res.status(200).send({ message: 'User exists', user});
//     } else {
//       console.log('User Does not exist');
//       res.status(404).send({ message: 'User not found', user });
//     }
//   } catch (error) {
//     console.error('Error checking user:', error);
//     res.status(500).send('Internal Server Error\n');
//   }
// });

app.post('/api/signIn', async (req, res) => {
  try {
    const { mail, password } = req.body;
    const user = await NameModel.findOne({ mail }); // Check if email exists

    if (!user) {
      // Case: Email is not registered
      return res.status(404).send({ message: 'Email not registered' });
    }

    if (user.password !== password) {
      // Case: Password is incorrect
      return res.status(401).send({ message: 'Incorrect password' });
    }

    // Case: Valid email and password
    res.status(200).send({ message: 'User signed in successfully', user });
  } catch (error) {
    console.error('Error checking user:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

//Add Blog
app.post('/api/addBlog', upload.single('img'), async (req, res) => {
  try {
   // console.log(req.file);
    const { author, title, subtitle, category, hashtag, content } = req.body;
    const img = req.file.path;
    const authorData = await NameModel.findOne({ username: author });
    if (!authorData) {
      return res.status(404).send('Author not found');
    }
    const newBlog = {
      title: title, subtitle: subtitle, hashtag: hashtag, img: img, content: content, category: category, createdAt: new Date()
    };
    authorData.posts.push(newBlog);
    await authorData.save();

    res.status(200).send('Blog saved successfully');
  } catch (error) {
    console.error('Error saving blog to MongoDB:', error);
    res.status(500).send('Internal Server Error\n');
  }
});

//Edit Blog
app.put('/api/editBlog/:author/:createdAt', upload.single('img'), async (req, res) => {
  try {
    const { author, createdAt } = req.params;
    const { title, subtitle, content, category, created, hashtag} = req.body;    
    const img = req.file ? req.file.path : '';
    const user = await NameModel.findOne({ username:author});
    if (!user) {
      console.log("user doesn't exist...");
      res.status(404).send('User not found');
      return;
    }   
    const blogIndex = user.posts.findIndex(blog => blog.createdAt.toString() === new Date(createdAt).toString());  
    if (blogIndex === -1) {
      console.log("blog doesn't exist");
      res.status(404).send('Blog not found');
      return;
    }

    user.posts[blogIndex].title = title;
    user.posts[blogIndex].subtitle = subtitle;
    user.posts[blogIndex].content = content;
    user.posts[blogIndex].category = category;
    user.posts[blogIndex].createdAt = new Date();
    user.posts[blogIndex].img = img;

    user.posts[blogIndex].hashtag = hashtag;

    await user.save();
    console.log('Blog updated successfully');
    res.status(200).json(user.posts[blogIndex]);
  } catch (error) {
    console.error('Error updating blog:', error);
    res.status(500).send('Internal Server Error');
  }
});
//Delete Blog
app.delete('/api/deleteBlog/:username/:createdAt', async (req, res) => {
  try {
    const { username, createdAt } = req.params;
  const user = await NameModel.findOne({ username });
  if (!user) {
    console.log("User not found");
    return res.status(404).send('User not found');
  }
  else 
  console.log("USER FOUND");
 
  const post = user.posts.findIndex(post => post.createdAt.toString() === new Date(createdAt).toString());
  if (post==-1) {
    console.log("Post not found");
    return res.status(404).send('Post not found');
  }
  else
  console.log("Post found"+post);

  if (post.img) {
    fs.unlink(post.img, (err) => {
      if (err) {
        console.error('Error deleting image:', err);
      } else {
        console.log('Image deleted successfully');
      }
    });
  }


  user.posts.splice(post, 1);
     await user.save();
    res.json({ message: 'BackEnd - Blog post deleted successfully' });
  } catch (error) {
    console.error('Backend - Error deleting blog post:', error);
    res.status(500).json({ message: 'Backend- Internal server error' });
  }
});
//Get Specific Blog
app.get('/api/getBlog/:author/:createdAt', async (req, res) => {
  try {
    const { author, createdAt } = req.params;
    const blog = await NameModel.findOne({ username: author, 'posts.createdAt': createdAt }, { 'posts.$': 1 });
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.status(200).json(blog.posts[0]);
  } catch (error) {
    console.error('Error fetching blog details:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.get('/api/getBlog/:author', async (req, res) => {
  try {
    const { author} = req.params;
    const user = await NameModel.findOne({ username: author});
    if (!user) {
      return res.status(404).json({ message: 'User Not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching blog details:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

//Get all blogs of a specific blogger
app.get('/api/getUserBlogs/:userId', async (req, res) => {
  try {
    const userBlogs = await NameModel.findOne({username : req.params.userId});
    if (!userBlogs) {
      console.log("Not found")
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(userBlogs.posts);
  } catch (error) {
    console.error('Error retrieving user blogs:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.get('/api/getUserDetails/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const user = await NameModel.findOne({ username });
    if (!user) {
      console.log("USer doesn't exist");
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
//Get user details using mail
app.get('/api/getUserDetails', async (req, res) => {
  try {
    const { mail } = req.query;
    console.log(mail);
    const user = await NameModel.findOne({ mail:mail });
    if (!user) {
      console.log("USer doesn't exist");
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
//Update User Details
app.put('/api/updateUserDetails/:author', async (req, res) => {
  try {
    const { author } = req.params;
    const { username, mail, phone, password, question, answer } = req.body;

    // Find the user by author (username) and update their details
    const updatedUser = await NameModel.findOneAndUpdate({ username: author }, { username, mail, phone, password, question, answer}, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
  console.log("SAVED");
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
//Like a blog
app.post('/api/likeBlog/:author/:createdAt', async (req, res) => {
  try {
    const { author, createdAt } = req.params;
    const user = await NameModel.findOne({ username: author });
    if (!user) {
      console.log("User not found");
      return res.status(404).send('User not found');
    }
  
    const post = user.posts.find(post => post.createdAt.toString() === new Date(createdAt).toString());
    if (!post) {
      console.log("Post not found");
      return res.status(404).send('Post not found');
    }
    else
    console.log("Post found");
    post.likes += 1;
    await user.save();
    res.status(200).send('Post liked successfully');
  } catch (error) {
    console.error('Error liking post:', error);
    res.status(500).send('Internal Server Error');
  }
});
//Edit Profile
app.get('/api/:author/EditProfile', async (req, res) => {
  try {
    const { username, mail, phone, password } = req.params;
    const user = await NameModel.findOne({ username: author});
    if (!user) {
      return res.status(404).json({ message: 'User Not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching blog details:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
//Share a blog
app.post('/api/shareBlog/:author/:createdAt', async (req, res) => {
  try {
    const { author, createdAt } = req.params;
    const user = await NameModel.findOne({ username: author });
    if (!user) {
      console.log("User not found");
      return res.status(404).send('User not found');
    }
    const post = user.posts.find(post => post.createdAt.toString() === new Date(createdAt).toString());
    if (!post) {
      console.log("Post not found");
      return res.status(404).send('Post not found');
    }
    post.shares += 1;
    await user.save();
    res.status(200).send('Post liked successfully');
  } catch (error) {
    console.error('Error liking post:', error);
    res.status(500).send('Internal Server Error');
  }
});
//Add comment to a blog
app.post('/api/addComment/:author/:createdAt', async (req, res) => {
  try {
    const nm = "REAH";
    const { author, createdAt } = req.params;
    const { user, text } = req.body;
    const blog = await NameModel.findOneAndUpdate(
      { username: author, 'posts.createdAt': createdAt },
      { $push: { 'posts.$.comments': { text, by:user } } },
      { new: true }
    );
    if (!blog) {
      return res.status(404).send('Blog not found');
    }
    res.status(200).send('Comment added successfully');
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html')); // Serve index.html for all other routes
  });

app.listen(PORT, () => {
  console.log(`\nServer is running on http://localhost:${PORT} \n`);
  
});
