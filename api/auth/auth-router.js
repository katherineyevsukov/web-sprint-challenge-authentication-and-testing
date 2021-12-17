const router = require("express").Router();
const bcrypt = require("bcryptjs");
const {
  validateRequestBody,
  checkUsernameAvailable,
  checkUsernameExists,
} = require("./auth-middleware");
const { BCRYPT_ROUNDS } = require("../../config");
const Users = require("./../users/users-model");
const { tokenBuilder } = require("./auth-helpers");

router.post(
  "/register",
  validateRequestBody,
  checkUsernameAvailable,
  async (req, res) => {
    let user = req.body;
    const hash = bcrypt.hashSync(user.password, BCRYPT_ROUNDS);

    user.password = hash;

    try {
      const newUser = await Users.add(user);
      res.status(201).json(newUser);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/login",
  validateRequestBody,
  checkUsernameExists,
  (req, res, next) => {
    if (bcrypt.compareSync(req.body.password, req.userFromDb.password)) {
      const token = tokenBuilder(req.userFromDb);

      res.status(200).json({ message: `welcome, ${req.body.username}`, token });
    } else {
      next({ status: 401, message: "invalid credentials" });
    }
  }
);

module.exports = router;
