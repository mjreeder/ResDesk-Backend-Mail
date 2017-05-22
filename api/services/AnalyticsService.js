var responseFormater = require('../../helpers/format-response.js');

var getAllMail = function(callback){
  Email.find().exec(function (err, records) {
    callback(responseFormater.success("All sent emails", records));

  });

}
module.exports = {
  "getAllMail": getAllMail
}
