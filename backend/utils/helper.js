const User = require("../models/User");

async function updateUserInterests(userId, tags) {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  const updatedInterests = [...new Set([...user.interests, ...tags])];

  if (updatedInterests.length > 3) {
    updatedInterests.splice(0, updatedInterests.length - 3);
  }

  user.interests = updatedInterests;
  await user.save();
}

module.exports = { updateUserInterests };
