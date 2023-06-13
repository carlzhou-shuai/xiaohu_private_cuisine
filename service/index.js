
var express = require('express');
const fs = require('fs');
const path = require('path');
var indexRouter = require('./routes/index');
var app = express();
app.use(require('cors')())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/', indexRouter);

// 设置静态文件目录
const folderPath = path.join(__dirname, 'uploads');
app.use(express.static(folderPath));

// 访问图片
app.get('/uploads/:image', (req, res) => {
  const imageName = req.params.image;
  const imagePath = path.join(folderPath, imageName);
  if (fs.existsSync(imagePath)) {
    res.sendFile(imagePath);
  } else {
    res.status(404).send('File not found!');
  }
});

app.listen(3005, () => {
  console.log('localhost:3005');
})
