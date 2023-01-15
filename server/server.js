'use strict';

const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const routing = require('./router.js');
const Client = require('./client.js');
const PORT = 8000;


const types = {
  object: JSON.stringify,
  string: (s) => s,
  number: (n) => n.toString(),
  undefined: () => 'not found',
  null:()=>false,
  function: (fn) => fn()

};


http.createServer(async (req, res) => {
  const client = await Client.getInstance(req, res);
  const { method, headers } = req;
  const url = req.url === '/' ? '/index.html' : req.url;
  const [first, second] = url.substring(1).split('/');
  let handler = null;

  console.log(`${first}  ${second}`);

  if(!client.session && second !== 'login' && first !== 'static' && first !== 'login.html' && first !== 'favicon.ico'){
    res.statusCode = 303;
    res.setHeader('Location', '/login.html');
    res.end();
    return;
  }

  if (first !== 'api') {
    handler = routing['/'];
  }else{
    handler = routing[url];
  }

  console.log(`${method} ${url} ${headers.cookie? headers.cookie: 'no cookie'}`);

  res.on('finish', () => {
    if (client.session) client.session.save();
  });

  if (!handler) {
    res.statusCode = 404;
    res.end('Not found 404');
    return;
  }
  handler(client).then((data) => {
    const type = typeof data;
    const serializer = types[type];
    const result = serializer(data);
    client.sendCookie();
    res.end(result);
  }, (err) => {
    res.statusCode = 500;
    res.end('Internal Server Error 500');
    console.log(err);
  });
}).listen(PORT);

console.log(`Server running at http://127.0.0.1:${PORT}/`);
