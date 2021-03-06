const request = require('request');
const axios = require('axios');

const spyController = {};

spyController.report = (req, res, next) => {
  console.log('request body is ', req.body);
  console.log('request cookies are', req.cookies);
  next();
}

spyController.reply = (req, res, next) => {
  res.json('hi from spy')
}

spyController.redirect = (req, res, next) => {
  let url = ''
  //if request is local, concat origin url with suffix
  if (req.body.url[0] === '/') {
    url = req.headers.origin + req.body.url;
  } else {
    url = req.body.url;
  }
  console.log('request headers are', req.headers);
  //if req contains cookies, send them with the headers to the destination
  if (req.headers.cookie) {
  	req.body.options.headers.cookie = req.headers.cookie;
  }
  console.log('new request will be sent with these headers', req.body.options.headers);

  //configure axios request
  requestConfig = {
    url: url,
    method: req.body.options.method,
    headers: req.body.options.headers,
    withCredentials: true
  }
  //if data is present, include in new request
  if (req.body.data) {
    data = JSON.parse(req.body.data)
    requestConfig.data = data;
  }
  //make request
  axios(requestConfig)
    .then(response => {
      console.log('response header is ', response.headers);
      //set all headers from response to destination in response to client
      for (let header in response.headers) {
      	res.set(header, response.headers[header])
      }
      //send response
      res.json(response.data)
      console.log('\n \n \n \n \n \n \n \n \n \n');
    })
    .catch(error => console.log(error))
}
module.exports = spyController;