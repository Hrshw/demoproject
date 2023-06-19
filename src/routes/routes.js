// routes.js
const express = require('express');
const router = express.Router();

// Import the controller
const authController = require('../controllers/authController');
// Import the necessary controllers
const communityController = require('../controllers/comunityController');

// Routes for authentication
router.post('/v1/auth/signup', authController.signUp);
router.post('/v1/auth/signin', authController.signIn);
router.get('/v1/auth/me', authController.extractUserFromToken, authController.getMe);

// Routes for community-related endpoints
router.post('/v1/community', communityController.createCommunity);
router.get('/v1/community', communityController.getAllCommunities);
router.get('/v1/community/:id/members', communityController.getCommunityMembers);
router.get('/v1/community/me/owner', communityController.getOwnedCommunities);
router.get('/v1/community/me/member', communityController.getJoinedCommunities);

module.exports = router;
