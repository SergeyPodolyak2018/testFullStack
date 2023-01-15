const path = require('node:path');
const fs = require('node:fs');
const Session = require('./session.js');
const DB = require('./db.js');



const MIME_TYPES = {
  default: 'application/octet-stream',
  html: 'text/html; charset=UTF-8',
  js: 'application/javascript; charset=UTF-8',
  json: 'application/json',
  css: 'text/css',
  png: 'image/png',
  jpg: 'image/jpg',
  gif: 'image/gif',
  ico: 'image/x-icon',
  svg: 'image/svg+xml',
};

const STATIC_PATH = path.join(process.cwd(), './static1');
const STATIC_PATH_MAIN = '/main';
const STATIC_PATH_LOGIN = '/login';

const toBool = [() => true, () => false];

const staticRout = async (client)=>{
  const file = await prepareFile(client.req.url, client.req.headers.referer);
  const statusCode = file.found ? 200 : 404;
  const mimeType = MIME_TYPES[file.ext] || MIME_TYPES.default;
  client.res.writeHead(statusCode, { 'Content-Type': mimeType });
  const data = file.data;
  const dataFunc = (data) => () => data;
  return dataFunc(data);
}

const prepareFile = async (url,referer) => {
  const paths = [STATIC_PATH];
  if (url.endsWith('/') || url.endsWith('/index.html') || url.endsWith('/users')) paths.push('/main/index.html');
  if (url.endsWith('/login.html')) paths.push('/login/index.html');
  if (url.endsWith('/favicon.ico')){
    if(referer.endsWith('/login.html')) paths.push(STATIC_PATH_LOGIN, url);
    if(referer.endsWith('/index.html')) paths.push(STATIC_PATH_MAIN, url);
  }
  if (url.startsWith('/static')){
    if(referer.endsWith('/')) paths.push(STATIC_PATH_MAIN, url);
    if(referer.endsWith('/users')) paths.push(STATIC_PATH_MAIN, url);
    if(referer.endsWith('/login.html')) paths.push(STATIC_PATH_LOGIN, url);
    if(referer.endsWith('/index.html')) paths.push(STATIC_PATH_MAIN, url);
  }
  const filePath = path.join(...paths);
  console.log(filePath);
  const pathTraversal = !filePath.startsWith(STATIC_PATH);
  const exists = await fs.promises.access(filePath).then(...toBool);
  const found = !pathTraversal && exists;
  const streamPath = found ? filePath : STATIC_PATH + '/404.html';
  const ext = path.extname(streamPath).substring(1).toLowerCase();
  const data = await fs.promises.readFile(streamPath);
  return { found, ext, data };
};

const routing = {
  '/': async (client) => {
    return staticRout(client);
  },
  '/api/login': async (client) => {
    const user = await DB.getUser(client.body.name);
    if(user.password && user.password === client.body.password){
      Session.start(client);
      client.res.statusCode = 303;
      client.res.setHeader('Location', '/');
      return {status:0};
    }
    client.res.statusCode = 401;
    return {status:1};
  },
  '/api/logout': async (client) => {
    Session.delete(client);
    client.res.statusCode = 303;
    client.res.setHeader('Location', '/login.html');
    return {status:0};
  }
};

module.exports = routing;
