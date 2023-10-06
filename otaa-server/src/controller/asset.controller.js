const Asset = require("./../model/asset.model");
const appError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { exec } = require("child_process");
const { spawn } = require("child_process");
const { PythonShell } = require("python-shell");

exports.getAllAssets = catchAsync(async (req, res, next) => {
  const document = await Asset.find();
  if (!document) {
    return next(appError("No Document found", 404));
  }
  res.status(200).json({ status: "success", data: document });
});

//execute assests script
const executeScript = async (userId, fileNamePath) => {
  try {
    let options = {
      mode: "json",
      pythonPath: "/bin/python3",
      pythonOptions: ["-u"], // get print results in real-time
      scriptPath: "./src/scripts/",
      args: [fileNamePath, userId],
    };

    const result = await PythonShell.run("read_pk_copy.py", options);
    console.log("it is here", result);
    return true;
  } catch (err) {
    console.log("error occured");
  }
};

// execute script for network
const executeNetworkScript = async (userId, fileNamePath) => {
  try {
    let options = {
      mode: "json",
      pythonPath: "/bin/python3",
      pythonOptions: ["-u"], // get print results in real-time
      scriptPath: "./src/scripts/",
      args: [fileNamePath, userId],
    };

    const result = await PythonShell.run("network_summary.py", options);
    console.log("came here with result", result);
    // results is an array consisting of messages collected during execution
    // console.log("results: %j", result);
    return result;
  } catch (err) {
    console.log("error occured");
  }
};

exports.createAsset = catchAsync(async (req, res, next) => {
  const { userId, fileNamePath } = req.body;
  console.log("user is ", userId);
  await executeScript(userId, fileNamePath);

  // console.log("here result is",result)
  // const document = await Asset.insertMany(result[0]);
  return res.status(200).json({
    status: "success",
  });
});

exports.parsePCAPFile = catchAsync(async (req, res, next) => {
  const { userId, fileNamePath } = req.body;
  await executeScriptTestWithArgument(userId, fileNamePath);
  return res.status(200).json({
    status: "success",
  });
});

exports.getAssetsForDashboard = catchAsync(async (req, res, next) => {
  const { userId, pagesize, pagenumber } = req.body;
  const document = await Asset.find({ userId: userId })
    .limit(pagesize)
    .skip(pagesize * pagenumber);

  const totalDocumentCount = await Asset.countDocuments({ userId: userId });
  if (!document) {
    return next(appError("No Document found", 404));
  }
  return res
    .status(200)
    .json({ status: "success", data: document, total: totalDocumentCount });
});

exports.deleteAssetsCollection = catchAsync(async (req, res, next) => {
  const result = await Asset.deleteMany();
  if (!result) {
    return next(appError("No Document found", 404));
  }
  return res.status(200).json({ status: "success", data: result });
});

// testing///////////////////////////////////
// exports.executeScriptTest = async () => {
//   try {
//     console.log("function started", getTime());
//     const scriptPaths = [
//       "./src/scripts/PsScript1.ps1",
//       "./src/scripts/PsScript2.ps1",
//       "./src/scripts/PsScript3.ps1",
//     ];

//     function runPowerShellScript(scriptPath) {
//       console.log(`psscript ${scriptPath} start at ${getTime()}`);
//       const childProcess = spawn("powershell.exe", [
//         "-File",
//         scriptPath,
//         "Hi Sudip",
//         "Hello",
//       ]);

//       childProcess.stdout.on("data", (data) => {
//         console.log("spawned: " + childProcess.pid);
//         console.log(`Script Output (${scriptPath}): ${data.toString()}`);
//       });

//       childProcess.stderr.on("data", (data) => {
//         console.error(`Script Error (${scriptPath}): ${data.toString()}`);
//       });

//       childProcess.on("close", (code) => {
//         console.log(`Script (${scriptPath}) exited with code ${code}`);
//         console.log(`psscript ${scriptPath} end at ${getTime()}`);
//       });
//     }

//     //calling
//     scriptPaths.forEach((scriptPath) => {
//       runPowerShellScript(scriptPath);
//     });

//     console.log("function ended", getTime());
//   } catch (err) {
//     console.log("error occured in testing", err);
//   }
// };

/////// testing with argument/////////////////////
const executeScriptTestWithArgument = async (userId, fileNamePath) => {
  try {
    const scripts = [
      {
        scriptPath: "./src/scripts/read_pk.py",
        arguments: [fileNamePath, userId],
      },
      {
        scriptPath: "./src/scripts/network_summary-ayan.py",
        arguments: [fileNamePath, userId],
      },
      {
        scriptPath: "./src/scripts/events2.py",
        arguments: [fileNamePath, userId],
      },
    ];

    function runScript(script) {
      // console.log(`psscript ${script.scriptPath} start at ${getTime()}`);
      const scriptInfo = [script.scriptPath, ...script.arguments];
      const childProcess = spawn("/bin/python3", scriptInfo);

      childProcess.stdout.on("data", (data) => {
        // console.log("spawned: " + childProcess.pid);
        console.log(`Script Output (${script.scriptPath}): ${data.toString()}`);
      });

      childProcess.stderr.on("data", (data) => {
        console.error(
          `Script Error (${script.scriptPath}): ${data.toString()}`
        );
      });

      childProcess.on("close", (code) => {
        console.log(`Script (${script.scriptPath}) exited with code ${code}`);
        // console.log(`psscript ${script.scriptPath} end at ${getTime()}`);
      });
    }

    //calling
    scripts.forEach((script) => {
      runScript(script);
    });

    // console.log("function ended", getTime());
  } catch (err) {
    console.log("error occured in testing", err);
  }
};

///////////
// function getTime() {
//   const date = new Date();
//   let H = date.getHours();
//   let M = date.getMinutes();
//   let S = date.getSeconds();
//   return `${H}:${M}:${S}`;
// }

//-------------------------------------------------------------
//get assets for assetSummary page
exports.getAssetById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  // console.log("id is", id)
  const document = await Asset.findById({ _id: id });
  // console.log("Document is", document)
  if (!document) {
    return next(appError("No Document found", 404));
  }
  res.status(200).json({ status: "success", data: document });
});
