const Asset = require("./../model/asset.model");
const appError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { exec } = require("child_process");

exports.getAllAssets = catchAsync(async (req, res, next) => {
  const document = await Asset.find();
  if (!document) {
    return next(appError("No Document fount", 404));
  }
  res.status(200).json({ status: "success", data: document });
});

exports.createAsset = catchAsync(async (req, res, next) => {
  // console.log("response", req.body);
  // const document = await Asset.create(req.body);
  // res.status(200).json({
  //   status: "success",
  //   data: document,
  // });

  //integration
  //call powershell script and MaintainanceID
  exec(
    `./src/scripts/testScript.ps1`,
    { shell: "powershell.exe" },
    (error, stdout, stderr) => {
      if (error) {
        console.log("error occured", error + "stderr" + stderr.message);
        logger.error(stderr.message);
        // return result.status(500).send({ message: stderr.message });
      } else {
        console.log("success result", stdout);
        // return res.status(200).send();
      }
    }
  );
});

//Import PythonShell module.
// const { PythonShell } = require("python-shell");

// sample for python
// //Router to handle the incoming request.
// app.get("/", (req, res, next)=>{
//     //Here are the option object in which arguments can be passed for the python_test.js.
//     let options = {
//         mode: 'text',
//         pythonOptions: ['-u'], // get print results in real-time
//           scriptPath: 'path/to/my/scripts', //If you are having python_test.py script in same folder, then it's optional.
//         args: ['shubhamk314'] //An argument which can be accessed in the script using sys.argv[1]
//     };

//     PythonShell.run('python_test.py', options, function (err, result){
//           if (err) throw err;
//           // result is an array consisting of messages collected
//           //during execution of script.
//           console.log('result: ', result.toString());
//           res.send(result.toString())
//     });
// });

// sample 2
// app.get('/', (req, res) => {

//   const { spawn } = require('child_process');
//   const pyProg = spawn('python', ['./../pypy.py']);

//   pyProg.stdout.on('data', function(data) {

//       console.log(data.toString());
//       res.write(data);
//       res.end('end');
//   });
// })
