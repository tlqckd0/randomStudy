var express = require('express');
var router = express.Router();
/* GET home page. */
router.get('/', (req, res, next)=> {
  res.render('index', { title: 'Matching System' });
});

router.get('/chat/:roomCode/:userName',(req,res,next)=>{
  const {roomCode, userName} = req.params;
  res.render('chatRoom',{title:roomCode,userName});
})

module.exports = router;
