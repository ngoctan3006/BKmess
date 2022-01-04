var express = require('express');
var router = express.Router();
let ioAPI = require('../common/io')
let moment = require('moment')


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'BKMess' });
});

router.post('/messenger', function(req, res, next){
  let {username, password} = req.body
  res.render('chat', { title: 'BKMess', username, userList:ioAPI.userList, moment });
})

module.exports = router;
