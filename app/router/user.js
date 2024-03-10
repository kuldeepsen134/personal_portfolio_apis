var router = require("express").Router();

const { users } = require("../controller");
const { fileUploader } = require("../middleware/fileUpload");


module.exports = (app) => {

  router.post("/users",fileUploader, users.create);

  router.get("/users", users.find);
  router.get("/users/:id", users.findOne);
  router.patch("/users/profile",fileUploader, users.updateProfile);

  app.use("/api", router);
};
