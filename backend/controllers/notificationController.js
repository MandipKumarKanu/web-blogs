const express = require("express");
const Notification = require("../models/Notification");
const router = express.Router();

const getNotification = async (req, res) => {
  const { id } = req.para.user;
  try {
    const notifications = await Notification.find({ userId: id })
      .sort({ createAt: -1 })
      .limit(20);

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = getNotification