const Asset = require("./../model/asset.model");
const appError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { exec } = require("child_process");
// const { spawn } = require('child_process');
const { PythonShell } = require('python-shell');

exports.getAllAssets = catchAsync(async (req, res, next) => {
  const document = await Asset.find();
  if (!document) {
    return next(appError("No Document fount", 404));
  }
  res.status(200).json({ status: "success", data: document });
});

const executeScript = async (userId, fileNamePath) => {
  try{
    let options = {
      mode: 'json',
      pythonPath: '/bin/python3',
      pythonOptions: ['-u'], // get print results in real-time
      scriptPath: './src/scripts/',
      args: [fileNamePath, userId]
    };
  
    const result  = await PythonShell.run('read_pk.py', options)
      // results is an array consisting of messages collected during execution
      // console.log('results: %j', result);
      return result;
  }catch(err){
    console.log("error occured");
  }
}

exports.createAsset = catchAsync(async (req, res, next) => {
  // console.log("response", req.body);
  const { userId, fileNamePath } = req.body;
  const result =  await executeScript(userId, fileNamePath );
  // console.log("here result is",result)
  const document = await Asset.insertMany(result[0]);
  return res.status(200).json({
    status: "success",
    data: document,
  });
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
