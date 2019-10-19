const request = require('request');
var q=require('q');

class sendEmail extends Helper{
    sendEmail(email,content){
        var postdata={"email":email,"content":content}
        request.post({
          headers: {
            'Content-Type': 'application/json'
          },
          url:  'http://176.122.147.10:2222/test/sendEmail',
          body: JSON.stringify(postdata)
        }, function(error, response, body){
          console.log(body)
      });
    }

    async MonitorList(body){
      var defer=q.defer();
      request.post({
          headers: {
            'Content-Type': 'application/json'
          },
          url:  'http://176.122.147.10:2222/test/getmonitor',
          body: JSON.stringify(body)
        }, function(error, response, body){
          // console.log(response.body)
          if(!response){
            return defer.resolve([]);  
          }else{
            return defer.resolve(response.body);  
          }
          
      });
      return defer.promise;
    }

    async track(data){
      var defer=q.defer();
      request.post({
          headers: {
            'Content-Type': 'application/json'
          },
          url:  'http://176.122.147.10:2222/test/track',
          body: JSON.stringify(data)
        }, function(error, response, body){
          // console.log(response.body)
          if(!response){
            return defer.resolve([]);  
          }else{
            return defer.resolve(response.body);  
          }
      });
      return defer.promise;
    }
}

module.exports = sendEmail;