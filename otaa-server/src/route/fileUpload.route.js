const controller = require("../controller/fileupload.controller");
const Path = `/fileupload`;

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // app.post(`${Path}/upload`,[authJwt.verifyToken],controller.Upload);
  app.post(`${Path}/upload`, controller.Upload);
};
