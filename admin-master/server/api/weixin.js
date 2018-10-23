const { Router } = require('express')
const axios = require('axios');

const router = Router()

/* GET users listing. */
router.post('/login', function (req, res, next) {

  const host = (req.app.get('trust proxy') && req.header('X-Forwarded-Host')) || req.header('Host');
  // console.log('Host: ', host); // => smart.localhost:8000
  // console.log('req.baseUrl: ', req.baseUrl); // => /master/api

  axios.post(`${req.protocol}://${host}${req.baseUrl}/naf/login`, req.body)
    .then((response) => {
      // console.log(response);
      if(response.status === 200){
        const ret = response.data;
        if(ret.errcode === 0){
          const { userinfo, token } = ret;
          req.session.authUser = userinfo;
          req.session.access_token = token;
          res.json({ errcode: 0, errmsg: 'ok', userinfo, token })
        } else {
          res.json(ret);
        }
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
