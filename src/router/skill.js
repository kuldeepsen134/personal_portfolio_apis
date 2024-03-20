var router = require("express").Router();

const { skills } = require("../controller");
const { fileUploader } = require("../middleware/fileUpload");


module.exports = (app) => {

  router.post("/skills", fileUploader, skills.create);
  router.get("/skills", skills.find);
  
  router.get("/skills/:id", skills.findOne);




  app.use("/api", router);
};
