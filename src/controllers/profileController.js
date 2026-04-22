const Profile = require('../models/profileModel');

const profileController = {
  async upsert(req, res) {
    try {
      const userId = req.user.id;
      const data = await Profile.upsert(userId, req.body);

      res.json({
        message: 'Profile saved',
        data,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  async get(req, res) {
    try {
      const userId = req.user.id;
      const profile = await Profile.findByUserId(userId);

      res.json(profile);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  async remove(req, res) {
    try {
      const userId = req.user.id;
      await Profile.delete(userId);

      res.json({ message: 'Profile deleted' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};

module.exports = profileController;