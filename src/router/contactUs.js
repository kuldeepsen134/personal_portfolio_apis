const { contactUs } = require("../controller");

var router = require("express").Router();



module.exports = (app) => {

  router.post("/contact-us",  contactUs.create);

  app.use("/api", router);
};
