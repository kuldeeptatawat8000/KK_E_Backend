const express = require("express");
const {
  authRegister,
  authLogin,
  authTest,
  forgotPassword,
} = require("../controllers/authControllers");
const { requireSignIn, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

//Register Router --POST Method

router.post("/register", authRegister);
router.post("/login", authLogin);
router.get("/test", requireSignIn, isAdmin, authTest);
router.post("/forgot-password", forgotPassword);

//Protact Router auth

router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(201).send({ ok: true });
});

router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(201).send({ ok: true });
});

module.exports = router;
