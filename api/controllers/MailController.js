/**
 * MailController
 *
 * @description :: Server-side logic for managing mails
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

'use strict';
var util = require('util');
var nodemailer = require('nodemailer');
var mailService = require('../services/MailService.js');



module.exports = {

  create: function(req, res) {
    var body = {
      'subject': req.param('subject'),
      'service': req.param('service'),
      'message': req.param('message'),
      'emails': req.param('emails')
    };
    mailService.sendMail(body, function(response) {
      res.status(response.status).json(response);
    });
  }
};
