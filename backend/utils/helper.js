const User = require("../models/User");

async function updateUserInterests(userId, cat) {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  const updatedInterests = [...new Set([...user.interests, ...cat])];

  if (updatedInterests.length > 5) {
    updatedInterests.splice(0, updatedInterests.length - 5);
  }

  user.interests = updatedInterests;
  await user.save();
}

module.exports = { updateUserInterests };
