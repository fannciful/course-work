// server.js
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();
const PORT = process.env.PORT || 3000;
const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Database connection
const mongoURI = 'mongodb+srv://fannciful:mmmpppttt333@cluster0.zzi9hhl.mongodb.net/';

async function connectWithRetry() {
    try {
        await mongoose.connect(mongoURI);
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err.message);
    }
}

connectWithRetry();

app.use(express.static(path.join(__dirname, 'registration form', 'frontend')));
app.use('/css', express.static(path.join(__dirname,  'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

app.use(express.json()); //.
app.use(express.urlencoded({extended: false})); //.

app.get('/registrate', (req, res) => {
  res.sendFile(path.join(__dirname, 'registration form','frontend', 'registrate.html'));
});
app.get('/resetpsswd', (req, res) => {
    res.sendFile(path.join(__dirname, 'registration form', 'frontend', 'resetpsswd.html'));
});
app.get('/log', (req, res) => {
    res.sendFile(path.join(__dirname,'registration form','frontend', 'log.html'));
});
app.get('/forgotpsswd', (req, res) => {
    res.sendFile(path.join(__dirname,'registration form', 'frontend',  'forgotpsswd.html'));
});
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'registration form', 'frontend', 'log.html'));
});


// Define separate schemas for military and volunteer users
const militarySchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String
});

const volunteerSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String
});
// Define the Data model outside of the endpoint
const Data = mongoose.model('Data', new mongoose.Schema({
  type: String,
  option: String,
  quantity: Number,
  address: String,
}));




// Define models for military and volunteer users
const Military = mongoose.model('Military', militarySchema);
const Volunteer = mongoose.model('Volunteer', volunteerSchema);

app.post('/register', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password || !role) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (role !== 'military' && role !== 'volunteer') {
      return res.status(400).json({ error: 'Invalid role' });
    }

    let user;
    if (role === 'military') {
      user = new Military({ username, email, password });
    } else {
      user = new Volunteer({ username, email, password });
    }

    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
      return res.status(400).json({ error: 'Username, password, and role are required' });
    }

    let User;
    if (role === 'military') {
      User = Military;
    } else {
      User = Volunteer;
    }
    const user = await User.findOne({ username, password });
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    // Successful login
    res.status(200).json({ message: 'Login successful', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// Delete account endpoint
app.delete('/delete-account/:username', async (req, res) => {
  try {
    const { username } = req.params;

    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    let User;
    // Determine the appropriate model based on your setup (Military/Volunteer)
    // For example, assuming 'Military' model for this demonstration
    User = Military;

    // Find the user by username and delete the account
    const deletedUser = await User.findOneAndDelete({ username });

    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.post('/save-data', async (req, res) => {
  try {
      const { type, option, quantity, address } = req.body;

      const newData = new Data({ type, option, quantity, address });
      await newData.save();

      res.status(200).json({ message: 'Data saved successfully' });
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
  }
});


// Endpoint to fetch all requirements
app.get('/requirements', async (req, res) => {
  try {
      const allRequirements = await Data.find();
      res.status(200).json(allRequirements);
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/requirements', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'requirements.html'));
});


// Endpoint to delete a requirement
app.delete('/requirements/:id', async (req, res) => {
  try {
      const { id } = req.params;

      if (!id) {
          return res.status(400).json({ error: 'Requirement ID is required' });
      }

      // Delete the requirement based on the provided ID
      await Data.findByIdAndDelete(id);

      res.status(200).json({ message: 'Requirement deleted successfully' });
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
  }
});



app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
