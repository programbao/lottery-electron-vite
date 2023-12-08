const fs = require("fs");
const path = require("path");
const xlsx = require("node-xlsx").default;
const isBuild = process.env.NODE_ENV !== 'development';
let cwd = path.join(__dirname,  `${isBuild ? '../../../../' : '../../'}assets/json`);
if (!fs.existsSync(cwd)) {
  fs.mkdirSync(cwd);
}

/**
 * 读取缓存的数据内容
 */
function loadTempData(normalDataPathStr, errorDataPathStr) {
  let pros = [];
  pros.push(
    new Promise((resolve, reject) => {
      fs.readFile(path.join(cwd, normalDataPathStr), "utf8", (err, data) => {
        if (err) {
          resolve({});
          return;
        }
        resolve(JSON.parse(data));
      });
    })
  );
  if (errorDataPathStr) {
    pros.push(
      new Promise((resolve, reject) => {
        fs.readFile(path.join(cwd, errorDataPathStr), "utf8", (err, data) => {
          if (err) {
            resolve([]);
            return;
          }
          console.log(data)
        });
      })
    );
  }

  return Promise.all(pros);
}

/**
 * 读取XML文件数据
 */
function loadXML(xmlPath) {
  let userData = []
 
  try {
    userData = xlsx.parse(xmlPath);
  } catch (error) {
    return {
      type: "error",
      msg: "找不到文件，文件丢失"
    }
  }
  xlsx.parse(xmlPath);
  let outData = [];
  let excelHeader = [];

  userData.forEach(item => {
    outData = item.data;
    excelHeader = outData.shift();
    return false;
  });
  const headerTemp = ["工号", "部门", "姓名"];
  const isCorrect = excelHeader.length > 0 && excelHeader.every((headerTxt, i) => headerTxt.includes(headerTemp[i]))
  if (!isCorrect) {
    return {
      type: "error",
      msg: "人员名单 表头不符合规范, 顺序名称是：工号、部门、姓名"
    }
  }
  outData = outData.filter(item => item.length > 0);
  return outData;
}
function sanitizeSheetName(name) {
  // 移除特殊字符
  return name.replace(/[:\\\/\?\*\[\]]/g, '');
}
/**
 * 写入excel
 * @param {Array} data
 * @param {string} name
 */
function writeXML(data, name) {
  name = sanitizeSheetName(name);
  let buffer = xlsx.build([
    {
      name: name,
      data: data
    }
  ]);
  let savePath = path.join(path.join(__dirname,  `${isBuild ? '../../../../' : '../../'}assets/xlsx_write`), name)
  return new Promise((resolve, reject) => {
    fs.writeFile(savePath, buffer, err => {
      if (err) {
        reject(err);
        return;
      }
      resolve(savePath);
    });
  });
}

/**
 * 写入文件
 * @param {*} data
 */
function saveDataFile(data, fileNameStr) {
  data = JSON.stringify(data, "", 2);

  if (!fs.existsSync(cwd)) {
    fs.mkdirSync(cwd);
  }

  return new Promise((resolve, reject) => {
    fs.writeFile(path.join(cwd, fileNameStr), data, err => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
      console.log("数据写入成功");
    });
  });
}

/**
 * 错误日志文件输出
 * @param {*} data
 */
function saveErrorDataFile(data) {
  data = JSON.stringify(data, "", 2);
  if (!fs.existsSync(cwd)) {
    fs.mkdirSync(cwd);
  }

  return new Promise((resolve, reject) => {
    fs.writeFile(path.join(cwd, "error.json"), data, err => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
      console.log("数据写入成功");
    });
  });
}

/**
 * 洗牌算法
 * @param {*} arr
 */
function shuffle(arr) {
  let i = arr.length;
  while (i) {
    let j = Math.floor(Math.random() * i--);
    let temp = arr[j];
    arr[j] = arr[i];
    arr[i] = temp;
  }
}

module.exports = {
  loadTempData,
  loadXML,
  shuffle,
  writeXML,
  saveDataFile,
  saveErrorDataFile
};
