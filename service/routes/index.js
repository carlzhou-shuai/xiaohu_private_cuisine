var express = require('express');
var router = express.Router();
const db = require('../mySql')
const multer = require('multer');
/**
 *正确返回
 *@params result
 *@returns obj
*/
const handleOKResponse = (result) => {
  return {
    msg: 'success',
    code: 200,
    data: result
  }
}
/**
 *报错处理
 *@params err
 *@returns obj
*/
const handleErrorResponse = (err) => {
  return {
    msg: err,
    code: 1000,
    data: null
  }
}

/**
 *添加菜单
 *@params 
 *@returns 
*/
router.post('/api/addMenu', function (req, res, next) {
  const { name, description, image, price } = req.body
  db.query('INSERT INTO products (name, description, image, price) VALUES (?, ?, ?, ?)', [name, description, image, price], (err, result, fields) => {
    err ? res.json(handleErrorResponse(err)) : res.json(handleOKResponse({}))
  })
});

// 使用 Multer 中间件处理文件上传
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'service/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

/**
 *上传图片
 *@params 
 *@returns 
*/
router.post('/api/upload', upload.single('file'), function (req, res, next) {
  const file = req.file;
  if (!file) {
    return res.status(400).send('No files were uploaded.');
  }

  const { originalname, mimetype, size } = file;
  const url = req.protocol + '://' + req.get('host') + '/uploads/' + file.filename;
  // 保存文件信息到 MySQL 数据库
  const sql = 'INSERT INTO file (name, url, mimetype, size) VALUES (?, ?, ?, ?)';
  db.query(sql, [originalname, url, mimetype, size], function (err, results) {
    err ? res.json(handleErrorResponse(err)) : res.json(handleOKResponse({ url, name: file.originalname }))
  });
});


/**
 *查询菜单
 *@params 
 *@returns 
*/
router.get('/api/getMenu', function (req, res, next) {
  db.query('select * from products', (err, result, fields) => {
    err ? res.json(handleErrorResponse(err)) : res.json(handleOKResponse(result))
  })
});

/**
 *查询订单 状态为doing 和 finish
 *@params 
 *@returns 
*/
router.post('/api/getOrder', function (req, res, next) {
  const { status } = req.body
  db.query('SELECT o.*,p.* FROM orders o INNER JOIN products p ON o.productID = p.productID WHERE o.status = ?', [status], (err, result, fields) => {
    err ? res.json(handleErrorResponse(err)) : res.json(handleOKResponse(result))
  })
});

/**
 *添加到购物车
 *@params productID
 *@returns 
*/
router.post('/api/addCart', function (req, res, next) {
  const { productID } = req.body
  //查询订单有没有productID相同并且status为ready的订单
  db.query('SELECT * FROM orders where productID=? and status = "ready"', [productID], (err, result, fields) => {
    if (err) {
      res.json(handleErrorResponse(err))
      return
    }
    if (result.length > 0) {
      //有，告诉已经存在购物车
      res.json(handleErrorResponse('购物车中已存在'))
    } else {
      //无，添加一条 productID 状态为ready 数量为1  的订单记录
      const sql = 'INSERT INTO orders (productID, quantity, status) VALUES (?, ?, ?)';
      db.query(sql, [productID, 1, 'ready'], function (err, results) {
        err ? res.json(handleErrorResponse(err)) : res.json(handleOKResponse())
      });
    }
  })

});

/**
 *查询购物车
 *@params 
 *@returns 
*/
router.get('/api/getCart', function (req, res, next) {
  // 查询 status 为 ready的订单
  db.query('SELECT o.*,p.* FROM orders o INNER JOIN products p ON o.productID = p.productID WHERE o.status = "ready"', (err, result, fields) => {
    err ? res.json(handleErrorResponse(err)) : res.json(handleOKResponse(result))
  })
});

/**
 *更新购物车数量
 *@params 
 *@returns 
*/
router.post('/api/updateCart', function (req, res, next) {
  const { quantity, orderID } = req.body
  // 查询 status 为 ready的订单
  db.query('UPDATE orders SET quantity = ? WHERE orderid = ?', [quantity, orderID], (err, result, fields) => {
    err ? res.json(handleErrorResponse(err)) : res.json(handleOKResponse())
  })
});

/**
 *删除购物车商品
 *@params  {orderIDs： []}
 *@returns 
*/
router.post('/api/deleteCart', function (req, res, next) {
  const { orderIDs } = req.body
  // 查询 status 为 ready的订单
  db.query('DELETE FROM orders WHERE orderID in (?)', [orderIDs], (err, result, fields) => {
    err ? res.json(handleErrorResponse(err)) : res.json(handleOKResponse())
  })
});

/**
 *下单 || 预定
 *@params  orderIDs [] orderDate date
 *@returns 
*/
router.post('/api/startOrder', function (req, res, next) {
  const { orderIDs, orderDate } = req.body

  // 查询 status 为 ready的订单
  db.query('UPDATE orders SET status = "doing" , orderDate =? WHERE orderID in (?)', [orderDate, orderIDs], (err, result, fields) => {
    err ? res.json(handleErrorResponse(err)) : res.json(handleOKResponse())
  })
});

/**
 * setFinish
 *@params 
 *@returns 
*/
router.post('/api/setFinish', function (req, res, next) {
  const { orderIDs } = req.body
  db.query('UPDATE orders SET status = "finish"  WHERE orderID in (?)', [orderIDs], (err, result, fields) => {
    err ? res.json(handleErrorResponse(err)) : res.json(handleOKResponse())
  })
});
module.exports = router;
