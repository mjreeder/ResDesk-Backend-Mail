/**
 * AnalyticsController
 *
 * @description :: Server-side logic for managing analytics
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
'use strict'
var analyticsService = require('../services/AnalyticsService.js')
module.exports = {

  /**
   * `AnalyticsController.allMail()`
   */
  allMail: function (req, res) {
		analyticsService.getAllMail(function(response){
      res.status(response.status).json(response);
    });
  }
};
