const request = require('request');
var q=require('q');

class sendEmail extends Helper{
    sendEmail(email,content){
        var postdata={"email":email,"content":content}
        request.post({
          headers: {
            'Content-Type': 'application/json'
          },
          url:  'http://104.225.156.192:2222/test/sendEmail',
          body: JSON.stringify(postdata)
        }, function(error, response, body){
          console.log(body)
      });
    }

    async MonitorList(){
      var defer=q.defer();
      request.post({
          headers: {
            'Content-Type': 'application/json'
          },
          url:  'http://104.225.156.192:2222/test/getmonitor',
          body: JSON.stringify({})
        }, function(error, response, body){
          // console.log(response.body)
          return defer.resolve(response.body);
      });
      return defer.promise;
    }

    async track(data){
      var defer=q.defer();
      request.post({
          headers: {
            'Content-Type': 'application/json'
          },
          url:  'http://104.225.156.192:2222/test/track',
          body: JSON.stringify(data)
        }, function(error, response, body){
          // console.log(response.body)
          return defer.resolve(response.body);
      });
      return defer.promise;
    }
}

module.exports = sendEmail;