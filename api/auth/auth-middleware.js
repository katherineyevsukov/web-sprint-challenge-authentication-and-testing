const Users = require("../users/users-model");

function validateRequestBody(req, res, next) {
  if (
    !req.body.username ||
    !req.body.username.trim() ||
    !req.body.password ||
    !req.body.password.trim()
  ) {
    return next({ status: 400, message: "username and password required" });
  }

  next();
}

async function checkUsernameAvailable(req, res, next) {
  try {
    const user = await Users.findBy({ username: req.body.username });
    !user ? next() : res.status(400).json({ message: "username taken" });
  } catch (err) {
    next(err);
  }
}

async function checkUsernameExists(req, res, next) {
  try {
    const user = await Users.findBy({ username: req.body.username });
    !user
      ? res.status(401).json({ message: "invalid credentials" })
      : (req.userFromDb = user);
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  validateRequestBody,
  checkUsernameAvailable,
  checkUsernameExists,
};
