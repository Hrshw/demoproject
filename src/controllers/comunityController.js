const { Community, Member } = require("../mngoserver/modal/schema");
const mongoose = require('mongoose');

// Create a community
const createCommunity = async (req, res) => {
  try {
    const { name } = req.body;
    const slug = generateSlug(name);
    const ownerId = req.userId;

    // Create the community
    const community = new Community({
      name,
      slug,
      owner: ownerId,
      created_at: new Date(),
      updated_at: new Date()
    });

    // Save the community to the database
    const savedCommunity = await community.save();

    // Add the owner as the first member with the role Community Admin
    const member = new Member({
      community: savedCommunity.id,
      user: ownerId,
      role: 'Community Admin',
      joined_at: new Date()
    });

    // Save the member to the database
    await member.save();

    res.json({
      message: 'Community created successfully',
      data: savedCommunity
    });
  } catch (error) {
    console.error('Error creating community:', error);
    res.status(500).json({ message: 'Error creating community' });
  }
};

// Get all communities
const getAllCommunities = async (req, res) => {
  try {
    const communities = await Community.find();
    res.json(communities);
  } catch (error) {
    console.error('Error fetching communities:', error);
    res.status(500).json({ message: 'Error fetching communities' });
  }
};

// Get all members of a community
const getCommunityMembers = async (req, res) => {
  try {
    const communityId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(communityId)) {
      res.status(400).json({ message: 'Invalid community ID' });
      return;
    }

    const members = await Member.find({ community: communityId }).populate('user', 'id name');
    res.json(members);
  } catch (error) {
    console.error('Error fetching community members:', error);
    res.status(500).json({ message: 'Error fetching community members' });
  }
};

// Get communities owned by the user
const getOwnedCommunities = async (req, res) => {
  try {
    const ownerId = req.userId;

    const communities = await Community.find({ owner: ownerId });
    res.json(communities);
  } catch (error) {
    console.error('Error fetching owned communities:', error);
    res.status(500).json({ message: 'Error fetching owned communities' });
  }
};

// Get communities joined by the user
const getJoinedCommunities = async (req, res) => {
  try {
    const memberId = req.userId;

    const communities = await Member.find({ user: memberId }).populate('community', 'id name').populate('user', 'id name');
    res.json(communities);
  } catch (error) {
    console.error('Error fetching joined communities:', error);
    res.status(500).json({ message: 'Error fetching joined communities' });
  }
};

// Helper function to generate slug from name
const generateSlug = (name) => {
  // Generate the slug from the name (e.g., convert to lowercase and replace spaces with dashes)
  return name.toLowerCase().replace(/\s+/g, '-');
};

module.exports = {
  createCommunity,
  getAllCommunities,
  getCommunityMembers,
  getOwnedCommunities,
  getJoinedCommunities
};
