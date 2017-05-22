var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var url = require('url');

var config = require('../../config/env/development.js');

var responseFormater = require('../../helpers/format-response.js');
var emailRegex = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/

var smtpTransport = nodemailer.createTransport((smtpTransport({
  service: 'gmail',
  secureConnection: true,
  port: 465,
  auth: {
    user: config.sender_email,
    pass: config.sender_email_password
  }
})));

var sendMail = function(requestBody, callback) {
  if (validParams(requestBody)) {
    var mailOpts = getMailOptions(requestBody);
    smtpTransport.sendMail(mailOpts, function(error, response) {
      if (!error) {
        insertEmailIntoDB(mailOpts);
        callback(responseFormater.success("Emails sent", response));
        return;
      } else {
        callback(responseFormater.fail("Internal Server Error", error, 500))
        return;
      }
    });
  } else {
    callback(responseFormater.fail("Invalid email format", null, 404));
    return;
  }
}

var validParams = function(requestBody) {
  if (requestBody.subject && requestBody.message && requestBody.service) {
    return validEmailParams(requestBody);
  } else {
    return false
  }
}

var validEmailParams = function(requestBody) {
  var emailsAreValid = true;
  for (var i = 0; i < requestBody.emails.length; i++) {
    if (!emailRegex.test(requestBody.emails[i].email)) {
      emailsAreValid = false;
    }
  }
  return emailsAreValid;
}

var getMailOptions = function(requestBody) {
  var mailList = getMailList(requestBody);
  mailOpts = {
    to: mailList,
    subject: requestBody.subject,
    from: requestBody.service,
    sender: config.sender_email,
    text: requestBody.message
  };

  return mailOpts;
}

var getMailList = function(requestBody) {
  var mailList = "";
  for (var i = 0; i < requestBody.emails.length; i++) {
    if (i == (requestBody.emails.length - 1)) {
      mailList = mailList + requestBody.emails[i].email;
    } else {
      mailList = mailList + requestBody.emails[i].email + ",";
    }
  }
  return mailList;
}

var insertEmailIntoDB = function(mailOpts) {
  Email.create(mailOpts).exec(function(err, mailOpts) {
    if (err) {
      return res.serverError(err);
    }

    sails.log('mail\'s id is:', mailOpts.id);
  });
}

module.exports = {
  "sendMail": sendMail,
  "validParams": validParams,
  "getMailOptions": getMailOptions
}
