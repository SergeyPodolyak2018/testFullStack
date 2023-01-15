'use strict';

const Session = require('./session.js');


const CONTENT_TYPES = {
  'application/x-www-form-urlencoded': (data)=>formDataParser(data),
  'application/json': (data)=>JSON.parse(data)
};

const UNIX_EPOCH = 'Thu, 01 Jan 1970 00:00:00 GMT';
const COOKIE_EXPIRE = 'Fri, 01 Jan 2100 00:00:00 GMT';
const COOKIE_DELETE = `=deleted; Expires=${UNIX_EPOCH}; Path=/; Domain=`;

const parseHost = (host) => {
  if (!host) return 'no-host-name-in-http-headers';
  const portOffset = host.indexOf(':');
  if (portOffset > -1) host = host.substr(0, portOffset);
  return host;
};
const formDataParser = (str)=>{
  const data = {};
  str.split('&').map(element=>{
    const tempAr = element.split('=');
    data[tempAr[0]] = tempAr[1];
  });
  return data;
}


const receiveArgs = async (req) => {
  const buffers = [];
  for await (const chunk of req) buffers.push(chunk);
  const data = Buffer.concat(buffers).toString();

  if(CONTENT_TYPES[req.headers['content-type']] ){
    return CONTENT_TYPES[req.headers['content-type']](data);
  }
  return data;
};

class Client {
  constructor(req, res) {
    this.req = req;
    this.res = res;
    this.host = parseHost(req.headers.host);
    this.token = undefined;
    this.session = null;
    this.cookie = {};
    this.preparedCookie = [];
    this.parseCookie();
    this.body = null;
  }

  static async getInstance(req, res) {
    const client = new Client(req, res);
    client.body = await receiveArgs(req);
    await Session.restore(client);
    return client;
  }

  parseCookie() {
    const { req } = this;
    const { cookie } = req.headers;
    if (!cookie) return;
    const items = cookie.split(';');
    for (const item of items) {
      const parts = item.split('=');
      const key = parts[0].trim();
      const val = parts[1] || '';
      this.cookie[key] = val.trim();
    }
  }

  setCookie(name, val, httpOnly = false) {
    const { host } = this;
    const expires = `expires=${COOKIE_EXPIRE}`;
    let cookie = `${name}=${val}; ${expires}; Path=/; Domain=${host}`;
    if (httpOnly) cookie += '; HttpOnly';
    this.preparedCookie.push(cookie);
  }

  deleteCookie(name) {
    this.preparedCookie.push(name + COOKIE_DELETE + this.host);
  }

  sendCookie() {
    const { res, preparedCookie } = this;
    if (preparedCookie.length && !res.headersSent) {
      res.setHeader('Set-Cookie', preparedCookie);
    }
  }
}

module.exports = Client;
