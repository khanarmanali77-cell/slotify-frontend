const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");

router.get("/me", auth, (req, res) => {
  res.json({
    success: true,
    message: "Protected route working",
    userId: req.user.id
  });
});

module.exports = router;
