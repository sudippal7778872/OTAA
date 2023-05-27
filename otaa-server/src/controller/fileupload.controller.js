// const db = require("../model");
// const Attachment = db.attachment;
// const logger = require("../logger");
const fs = require("fs");
const helper = require("../utils/helper");

exports.Upload = (req, res) => {
  try {
    // const newpath = __dirname + "/files/";
    const newpath = "./appdata/";
    const file = req.files.file;
    const fileNamePrefix = file.name.replace(".pcap", "");
    const filename = helper.getUniqueFileName(fileNamePrefix);
    var isFileValid = true;

    if (!fs.existsSync(newpath)) {
      fs.mkdirSync(newpath);
    }

    //rename file name with uniqie name
    //encrypt file
    file.mv(`${newpath}${filename}`, (err) => {
      if (err) {
        return res.status(500).send({ message: "File upload failed" });
      }

      //verify file
      // const excelfile = reader.readFile(`${newpath}${filename}`);
      // const sheets = excelfile.SheetNames;

      // for (let i = 0; i < sheets.length; i++) {
      // const temp = reader.utils.sheet_to_json(
      //   excelfile.Sheets[excelfile.SheetNames[i]],
      //   {
      //     raw: false,
      //   }
      // );

      //rename file name with uniqie name
      //encrypt file
      file.mv(`${newpath}${filename}`, (err) => {
        if (err) {
          return res.status(500).send({ message: "File upload failed" });
        }
        //code to save the details in db
        //   Attachment.create({
        //     OrignalFileName: filename,
        //     FilePath: newpath,
        //     UploadedSuccessfully: 1,
        //   })
        //     .then((result) => {
        return res
          .status(200)
          .json({ status: "success", fileName: `${newpath}${filename}` });
        //     })
        //     .catch((err) => {
        //       console.log(err);
        //     });
      });
      //}
    });
  } catch (err) {
    logger.error("Error in file Upload function");
    logger.error(err.message);
    res.status(500).send({
      message: err.message,
    });
  }
};

exports.Test = (req, res) => {
  console.log("working correct");
  return res.status(200).json({ status: "success" });
};
