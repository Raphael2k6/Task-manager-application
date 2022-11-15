const express = require("express");
const auth = require("../middleware/auth");
const User = require("../models/user");
const multer = require("multer");
const router = new express.Router();
const sharp = require("sharp");
const {
  sendWelcomeEmail,
  sendCancellationEmail,
} = require("../emails/accounts");

const upload = multer({
  // dest: 'avatar', // file folder destination, remove the dest to prevent multer from saving in the folder
  limits: {
    fileSize: 1000000, //define file size limit
  },
  fileFilter(req, file, cb) {
    // if (!file.originalname.endsWith('.pdf')) {
    //     return cb(new Error('Please upload a PDF'))
    // }
    // to check for multiple file types, a regular expression is good
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Please upload an image"));
    }
    cb(undefined, true);
  },
});

router.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    sendWelcomeEmail(user.email, user.name);
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }

  //alternative way without the async await syntax
  // user.save().then(() => {
  //     res.status(201).send(user)
  // }).catch((e) => {
  //     res.status(400).send(e)
  // })
});

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    // res.send({user: user.getPublicProfile() , token}); //manual way of hiding private data, getPublicProfile() has to be called in every route handler
    res.send({ user, token });
  } catch (error) {
    res.status(400).send();
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    //logout everyone except the current logged in user
    // req.user.tokens = [req.token];
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

router.post("/users/logoutAllExceptCurrentUser", auth, async (req, res) => {
  try {
    req.user.tokens = [req.token];
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

// Get all the users signed up iin the applicatiion
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send();
  }
});

// Get the current user logged in
router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

router.patch("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body); //returns an array of the keys in the object
  const allowedUpdates = ["name", "email", "password", "age"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  ); //loop through the updates array, check if each item includes the allowed updates

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates" });
  }

  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();

    res.send(req.user);
  } catch (error) {
    res.status(400).send(error);
  }
});

//deleting user
router.delete("/users/me", auth, async (req, res) => {
  try {
    await req.user.remove();
    sendCancellationEmail(req.user.email, req.user.name)
    res.send(req.user);
  } catch (error) {
    res.status(500).send(error);
  }
});

//upload avatar
router.post(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

//delete avatar
router.delete("/users/me/avatar", auth, async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.send(req.user);
});

//get avatar
router.get("/users/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || !user.avatar) {
      throw new Error();
    }
    res.set("content-type", "image/png");
    res.send(user.avatar);
  } catch (error) {
    res.status(404).send();
  }
});

module.exports = router;
