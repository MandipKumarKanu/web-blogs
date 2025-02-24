const User = require("../models/User");

async function updateUserInterests(userId, tags) {
  await User.findByIdAndUpdate(userId, {
    $addToSet: { interests: { $each: tags } },
  });
}

module.exports = { updateUserInterests };
