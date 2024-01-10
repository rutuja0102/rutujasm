const express = require("express");
const router = express.Router();
const Users = require("../../database/models").user;
const Joi = require("joi");
const bcrypt = require("bcrypt");

const usernameSchema = Joi.string().min(5).alphanum();
const passwordSchema = Joi.string()
  .min(8)
  .regex(/^(?=.*[0-9])(?=.*[!@#$%^&*])/)
  .required();
const confirmPasswordSchema = Joi.string()
  .valid(Joi.ref("password"))
  .required()
  .messages({
    "any.only": "password must be the same",
  });

router.post("/signup", async (req, res) => {
  const schema = Joi.object({
    username: usernameSchema,
    password: passwordSchema,
    confirmPassword: confirmPasswordSchema,
  });

  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    const errorMessages = error.details.map((err) => err.message);
    return res.status(400).json({ errors: errorMessages });
  }

  const { username, password } = req.body;
  console.log(username);
  console.log(req.body);

  try {
    const existingUser = await Users.findOne({ where: { username } });

    if (existingUser) {
      return res.status(409).send("User already exists");
    }

    const hash = await bcrypt.hash(password, 10);

    await Users.create({ username, password: hash });

    return res.status(201).send("User registered successfully");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});

router.post("/signin", async (req, res) => {
  const schema = Joi.object({
    username: usernameSchema,
    password: passwordSchema,
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const { username, password } = req.body;

  try {
    const user = await Users.findOne({ where: { username } });

    if (!user) {
      return res.status(401).send("User not found");
    }

    const result = await bcrypt.compare(password, user.password);

    if (result) {
      return res.status(200).send("Login successful");
    } else {
      return res.status(401).send("Incorrect password");
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});

module.exports = router;