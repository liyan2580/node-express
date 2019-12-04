// 用户认证的中间件
const auth = (req, res, next) => {
    if (req.session.userInfo) {
      // 有登录，想去哪就去哪
  
      // 提供一个 req.userInfo 用来保存当前的 req.session.userInfo
      req.userInfo = req.session.userInfo;
      next();
    } else {
      // 乖乖的去登录页面
      res.redirect(`/login?redirect=${req.originalUrl}`);
    }
  };
  
  module.exports = auth;
  



// //用户认证的中间件
// const auth = (req, res, next) => {
//     if (req.session.userInfo) {
//         //提供一个req.userInfo 用来保存当前的req.session.userInfo
//        req.userInfo = req.session.userInfo;
//         next()
//     } else {
//         res.redirect(`/login?redirect=${req.originalUrl}`);
//     };
// }

// module.exports = auth;