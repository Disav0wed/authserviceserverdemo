const express = require('express')
const bodyParser = require('body-parser')
const PORT = process.env.PORT || 5000



// For make network calls
const request = require('request-promise');



// Initialize Express and create endpoint
express()
  .use(bodyParser.json()) // Parse json in request body
  .use(bodyParser.urlencoded({
    extended: true
  }))
  .post('/verifyHuaweiToken', (req, res) => {
     if (req.body.id_token === undefined) {
         // idToken is not find
         const ret = {
           error_message: 'id_token not found',
         };
         return res.status(400).send(ret);
       }


       // Verify idToken
       return verifyHuaweiToken(req.body)
         .then((response) => {
           return res.status(200).send(response);
         }).catch((err) => {
           return res.status(400).send(err);
         });
   })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));


// Verify idToken on Huawei Server
function verifyHuaweiToken(body) {
  return request({
    method: 'GET',
    uri: 'https://oauth-login.cloud.huawei.com/oauth2/v3/tokeninfo?id_token=' + body.id_token,
    json: true
  }).then((response) => {
    // Token invalid. Throw an error and stop process
    if(response.error !== undefined){
      return Promise.reject(new Error('Something went wrong'));
    }

    // Get user
    return response;
  })
}