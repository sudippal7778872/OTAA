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

    const result = await PythonShell.run("read_pk.py", options);
    // results is an array consisting of messages collected during execution
    // console.log("results: %j", result);
    console.log("came here with result exe",result)
    return result;
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
    console.log("came here with result",result)
    // results is an array consisting of messages collected during execution
    // console.log("results: %j", result);
    return result;
  } catch (err) {
    console.log("error occured");
  }
};

exports.createAsset = catchAsync(async (req, res, next) => {
  // console.log("response", req.body);
  const { userId, fileNamePath } = req.body;
  console.log("user is ",userId)
  const result = await executeScript(userId, fileNamePath);

  // console.log("here result is",result)
  const document = await Asset.insertMany(result[0]);
  return res.status(200).json({
    status: "success",
    data: document,
  });
});

exports.getAssetsForDashboard = catchAsync(async (req, res, next) => {
  const userId = req.params.id;
  if (Object.keys(req.query).length !== 0) {
    if (req.query.pageSize != undefined && req.query.pageSize != "") {
      pageSize = parseInt(req.query.pageSize) || 25;
    }
    if (req.query.pageNumber != undefined && req.query.pageNumber != "") {
      pageNumber = parseInt(req.query.pageNumber) || 1;
    }
  }
  let skip = (pageNumber - 1) * pageSize;
  const allAssets = await Asset.find({ userId: userId });
  const document = await Asset.find({ userId: userId })
    .skip(skip)
    .limit(pageSize);
  if (!document) {
    return next(appError("No Document found", 404));
  }
  return res
    .status(200)
    .json({ status: "success", data: document, total: allAssets.length });
});

// testing///////////////////////////////////
exports.executeScriptTest = async () => {
  try {
    console.log("function started", getTime());
    const scriptPaths = [
      "./src/scripts/PsScript1.ps1",
      "./src/scripts/PsScript2.ps1",
      "./src/scripts/PsScript3.ps1",
    ];

    function runPowerShellScript(scriptPath) {
      console.log(`psscript ${scriptPath} start at ${getTime()}`);
      const childProcess = spawn("powershell.exe", [
        "-File",
        scriptPath,
        "Hi Sudip",
        "Hello",
      ]);

      childProcess.stdout.on("data", (data) => {
        console.log("spawned: " + childProcess.pid);
        console.log(`Script Output (${scriptPath}): ${data.toString()}`);
      });

      childProcess.stderr.on("data", (data) => {
        console.error(`Script Error (${scriptPath}): ${data.toString()}`);
      });

      childProcess.on("close", (code) => {
        console.log(`Script (${scriptPath}) exited with code ${code}`);
        console.log(`psscript ${scriptPath} end at ${getTime()}`);
      });
    }

    //calling
    scriptPaths.forEach((scriptPath) => {
      runPowerShellScript(scriptPath);
    });

    console.log("function ended", getTime());
  } catch (err) {
    console.log("error occured in testing", err);
  }
};

/////// testing with argument/////////////////////
exports.executeScriptTestWithArgument = async () => {
  try {
    console.log("function started", getTime());
    const scripts = [
      {
        scriptPath: "./src/scripts/PsScript1.ps1",
        arguments: ["HiSudip", "HowAreyou?"],
      },
      {
        scriptPath: "./src/scripts/PsScript2.ps1",
        arguments: ["HiSuman", " hello"],
      },
      {
        scriptPath: "./src/scripts/PsScript3.ps1",
        arguments: ["HiJonti", "Whatsup?"],
      },
    ];

    function runPowerShellScript(script) {
      console.log(`psscript ${script.scriptPath} start at ${getTime()}`);
      const scriptInfo = [script.scriptPath, ...script.arguments];
      const childProcess = spawn("powershell.exe", scriptInfo);

      childProcess.stdout.on("data", (data) => {
        console.log("spawned: " + childProcess.pid);
        console.log(`Script Output (${script.scriptPath}): ${data.toString()}`);
      });

      childProcess.stderr.on("data", (data) => {
        console.error(
          `Script Error (${script.scriptPath}): ${data.toString()}`
        );
      });

      childProcess.on("close", (code) => {
        console.log(`Script (${script.scriptPath}) exited with code ${code}`);
        console.log(`psscript ${script.scriptPath} end at ${getTime()}`);
      });
    }

    //calling
    scripts.forEach((script) => {
      runPowerShellScript(script);
    });

    console.log("function ended", getTime());
  } catch (err) {
    console.log("error occured in testing", err);
  }
};

///////////

function getTime() {
  const date = new Date();
  let H = date.getHours();
  let M = date.getMinutes();
  let S = date.getSeconds();
  return `${H}:${M}:${S}`;
}
