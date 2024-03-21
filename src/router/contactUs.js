const { contactUs } = require("../controller");

var router = require("express").Router();



module.exports = (app) => {

  router.post("/contact-us",  contactUs.create);
  router.get("/contact-us",  contactUs.find);


  app.use("/api", router);
};
