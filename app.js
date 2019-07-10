var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
//配置html的模板引擎用的
const exphbs = require('express-handlebars');
//compressin是用来开启gzip的，可以加快文件加载速度
var compression = require('compression')
//首页
var index = require('./routes/index');

//生成一个express实例 app。
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//设置模板引擎为html
app.engine('html', exphbs({
  layoutsDir: '',
  defaultLayout: '',
  extname: '.html'
}));
app.set('view engine', 'html');

//尽量在其他中间件前使用compression
app.use(compression());
//过滤
app.use(compression({ filter: shouldCompress }));
function shouldCompress(req, res) {
  if (req.headers['x-no-compression']) {
    // 这里就过滤掉了请求头包含'x-no-compression'
    return false
  }
  return compression.filter(req, res)
}

//加载日志中间件
app.use(logger('dev'));
//加载解析json中间件
app.use(express.json());
//加载解析urlencoded请求体的中间件。
app.use(express.urlencoded({ extended: false }));
//加载解析cookie的中间件。
app.use(cookieParser());
//设置public文件夹为存放静态文件的目录。
app.use(express.static(path.join(__dirname, 'public')));
//路由控制器
app.use('/', [index]);

//捕获404错误，并转发到错误处理器
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

//开发环境下的错误处理器，将错误信息渲染error模版并显示到浏览器中。
// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  console.log('我是错误', err.status);
  if (err.status == 404) {
    res.redirect('/');
  } else {
    res.render('error', { err: err });
  }
});

module.exports = app;
