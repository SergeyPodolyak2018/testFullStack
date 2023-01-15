const fs = require('node:fs');
const TARGET_PATH = './static1';
const LOGIN_FOLDER = './static1/login';
const MAIN_FOLDER = './static1/main';
const NOT_EXIST_FOLDER = './static1/404';
const SOURCE_MAIN_FOLDER = '../main/build';
const SOURCE_LOGIN_FOLDER = '../login/build';
console.log('copy started');
try {
  if (!fs.existsSync(TARGET_PATH)) {
    fs.unlinkSync(TARGET_PATH);
  }
  if (!fs.existsSync(TARGET_PATH)) {
    fs.mkdirSync(TARGET_PATH);
  }
  if (!fs.existsSync(LOGIN_FOLDER)) {
    fs.mkdirSync(LOGIN_FOLDER);
  }
  if (!fs.existsSync(MAIN_FOLDER)) {
    fs.mkdirSync(MAIN_FOLDER);
  }
  fs.cp(SOURCE_MAIN_FOLDER, MAIN_FOLDER, { recursive: true }, (err) => {
    if (err) {
      console.error(err);
    }
  });
  fs.cp(SOURCE_LOGIN_FOLDER, LOGIN_FOLDER, { recursive: true }, (err) => {
    if (err) {
      console.error(err);
    }
  });
} catch (err) {
  console.error(err);
}
