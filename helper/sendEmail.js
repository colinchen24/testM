const request = require('request');

class sendEmail extends Helper{
    sendEmail(email,content){
        var postdata={"email":email,"content":content}
        request.post({
          headers: {
            'Content-Type': 'application/json'
          },
          url:  'http://127.0.0.1:2222/test/sendEmail',
          body: JSON.stringify(postdata)
        }, function(error, response, body){
          console.log(body)
        });
      }
}

module.exports = sendEmail;