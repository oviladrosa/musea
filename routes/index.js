const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.render('index')
})

// router.get('/museums', (req, res) => {
//   res.render('museums', {museums: result});
// })

module.exports = router