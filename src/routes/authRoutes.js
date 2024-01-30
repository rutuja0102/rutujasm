const express = require("express");
const router = express.Router();
const Users = require("../../database/models").user;
const Joi = require("joi");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const AWS = require("aws-sdk");

const usernameSchema = Joi.string().min(5).alphanum();
const passwordSchema = Joi.string()
  .min(8)
  .regex(/^(?=.*[0-9])(?=.*[!@#$%^&*])/)
  .required();
const confirmPasswordSchema = Joi.string()
  .valid(Joi.ref("password"))
  .valid(Joi.ref("newPassword"))
  .required()
  .messages({
    "any.only": "password must be the same",
  });

const emailSchema = Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  });

router.post("/signup", async (req, res) => {
  const schema = Joi.object({
    username: usernameSchema,
    password: passwordSchema,
    confirmPassword: confirmPasswordSchema,
    email: emailSchema
  });

  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    const errorMessages = error.details.map((err) => err.message);
    return res.status(400).json({ errors: errorMessages });
  }

  const { username, password, email } = req.body;

  try {
    const existingUser = await Users.findOne({ where: { username } });

    if (existingUser) {
      return res.status(409).send("User already exists");
    }

    const hash = await bcrypt.hash(password, 10);

    await Users.create({ username, password: hash, email});

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

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_SES_REGION,
});

const ses = new AWS.SES({
  apiVersion: "2010-12-01",
  region: process.env.AWS_SES_REGION,
});

const transporter = nodemailer.createTransport({
  SES: { ses, aws: AWS },
});

router.post("/initiate-reset-password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await Users.findOne({ where: { email } });

    if (!email) {
      return res.status(404).send("User not found");
    }

    const verifyLink = `https://example.com/verify-email/${encodeURIComponent(email)}`;

    const mailOptions = {
      from: "rutujam390@gmail.com",
      to: email,
      subject: "Verify Your Email and Reset Password",
      text:
        "Click the link to verify your email and reset your password: " +
        verifyLink,
      html: `
    <p>Dear User,</p>
    <p>Thank you for registering. Please click the link below to verify your email and reset your password:</p>
    <p><a href="${verifyLink}">Verify and Reset Password</a></p>
  `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ error: "Failed to send reset email" });
      }

      console.log(`Reset email sent: ${info.response}`);
      return res.status(200).json({ message: "Reset email sent successfully" });
    });
  } catch (error) {
    console.error("Error in initiate-reset-password:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/reset-password", async (req, res) => {
  const { email, newPassword, confirmNewPassword } = req.body;

  const schema = Joi.object({
    email: emailSchema,
    newPassword: passwordSchema,
    confirmNewPassword: confirmPasswordSchema,
  });

  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    const errorMessages = error.details.map((err) => err.message);
    return res.status(400).json({ errors: errorMessages });
  }

  try {
    const user = await Users.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await Users.update({ password: hashedPassword }, { where: { email } });

    return res.status(202).send("Password reset successfully");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal server error");
  }
});

module.exports = router;