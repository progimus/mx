const express = require('express');
const app = express();
const fs = require('fs');
const https = require('https');
const path = require('path');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/more_expensive');

const Product = mongoose.model(
  'Product',
  new Schema({
    amazonId: String,
    name: String,
    category: String,
    subcategory: String,
    price: Number,
    image: String,
    seller: String,
    amazonLink: String,
    affiliatesLink: String,
    locale: String
  })
);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/scripts', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/views/scripts.html'));
})

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/views/admin.html'));
});

app.get('/products/:id?', (req, res) => {
  const id = req.params.id;
  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.per_page) || 10;

  if (id) {
    Product.findById(id)
      .then(data => res.send(data))
      .catch(err => console.log(err));
  }

  if (req.query.rand) {
    const size = parseInt(req.query.size) || 100;

    Product.aggregate([{$sample: {size: size}}])
      .then(data => res.send(data))
      .catch(err => console.log(err));
  }

  Product.find({locale: req.query.locale})
    .skip((page - 1) * perPage)
    .limit(perPage)
    .then(data => res.send(data))
    .catch(err => console.log(err));
});

app.post('/products', (req, res) => {
  const product = new Product(req.body);

  product.save(err => {
    if (err) return res.status(500).send(err);

    return res.status(200).send(product);
  });
});

app.put('/products/:id', (req, res) => {
  Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    {new: true},
    (err, product) => {
      if (err) return res.status(500).send(err);

      return res.status(200).send(product);
    }
  );
});

app.delete('/products/:id', (req, res) => {
  Product.findByIdAndRemove(req.params.id, (err, product) => {
    if (err) return res.status(500).send(err);

    return res.status(200).send({
      message: "Product successfully deleted",
      id: product._id
    });
  });
});

if (process.env.NODE_ENV === 'production') {
  https.createServer({
    key: fs.readFileSync('/etc/letsencrypt/live/moreorlessexpensive.com-0001/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/moreorlessexpensive.com-0001/cert.pem'),
  }, app).listen(3000, () => console.log('Server running on port 3000.'))
} else {
  app.listen(3000, () => console.log('Server running on port 3000.'));
}