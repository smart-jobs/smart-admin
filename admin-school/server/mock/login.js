const { Router } = require('express')
const axios = require('axios');

const router = Router()

// Mock Admin Users
// const users = [
//   { username: 'admin', fullname: '系统管理员', password: '111111' },
//   { username: 'demo', fullname: '演示管理员', password: 'demo' },
// ]

/* GET users listing. */
router.post('/login', function (req, res, next) {

  axios.post(`http://localhost:3200/school/api/naf/login`, req.body)
    .then((response) => {
      // console.log(response);
      if(response.status === 200){
        const user = response.data.userinfo;
        req.session.authUser = user;
        res.json({ errcode: 0, errmsg: 'ok', userinfo: user })
      } else {
        console.error(`Http Code: ${response.status}`)
        res.json({ errcode: -1, errmsg: '登录失败' });
      }
    }).catch((error) => {
      console.error(error);
      res.json({ errcode: -1, errmsg: '登录失败' })
    });
  // let user = users.find(p=>p.username === req.body.username);
  // if (user && req.body.password === user.password) {
  //   req.session.authUser = user;
  //   return res.json({ errcode: 0, errmsg: 'ok', username: user.username })
  // }
  // res.json({ errcode: -1, errmsg: '用户名或者密码错误' })
})

/* GET user by ID. */
router.post('/logout', function (req, res, next) {
  delete req.session.authUser
  res.json({ errcode: 0, errmsg: 'ok' })
})

router.get('/userinfo', function (req, res) {
  if (req.session && req.session.authUser) {
    return res.json({ errcode: 0, errmsg: 'ok', userinfo: req.session.authUser })
  }
  res.json({ errcode: -1, errmsg: 'Not login' })
})

module.exports = router
