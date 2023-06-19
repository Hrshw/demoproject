// controllers/authController.js
const { User } = require("../mngoserver/modal/schema");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// Middleware to extract user from access token
const extractUserFromToken = async (req, res, next) => {
  try {
    // Extract the access token from the request cookies
    const accessToken = req.cookies.access_token;

    if (!accessToken) {
      // Handle case where access token is not provided
      return res.status(401).json({ message: 'Access token not provided' });
    }

    // Verify and decode the access token
    const decodedToken = await jwt.verify(accessToken, 'thisismysecretaekey');

    // Set the user ID on the request object
    req.userId = decodedToken.id;

    // Call the next middleware
    next();
  } catch (error) {
    console.error('Error extracting user:', error);
    res.status(500).json({ message: 'Error extracting user' });
  }
};

const signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new User({ name, email, password: hashedPassword });

    // Save the user to the database
    const savedUser = await user.save();

    // Generate an access token
    const accessToken = generateAccessToken(savedUser._id);

    // Return the access token in the response
    res.json({
      message: 'User created successfully',
      meta: {
        access_token: accessToken
      }
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Error creating user' });
  }
};

const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user with the provided email
    const user = await User.findOne({ email });

    if (!user) {
      // User not found
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Compare the password with the stored hash
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      // Incorrect password
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Generate an access token
    const accessToken = generateAccessToken(user._id);

    // Set the access token as a cookie in the response
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      // Add any other cookie options as needed
    });

    // Return the access token in the response
    res.json({
      message: 'Sign in successful',
      meta: {
        access_token: accessToken
      }
    });
  } catch (error) {
    console.error('Error signing in:', error);
    res.status(500).json({ message: 'Error signing in' });
  }
};

const getMe = async (req, res) => {
  try {
    // Get the user ID from the request object
    const userId = req.userId;
    console.log('User ID:', userId);

    // Check if userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ message: 'Invalid user ID' });
      return ;
    }

    // Find the user by ID
    const user = await User.findById(userId).select('-password');

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Return the user details in the response
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Error fetching user' });
  }
};


const generateAccessToken = (userId) => {
  // Generate the token using JWT
  return jwt.sign({ id: userId }, 'thisismysecretaekey', {
    expiresIn: '24h'
  });
};




module.exports = {
  signUp,
  signIn,
  getMe,
  extractUserFromToken,
};

