const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const getAfilliatesLink = tr => new Promise((resolve, reject) => {
  tr.querySelector('input.a-button-input').click()
  setTimeout(() =>  {
    resolve(document.querySelector('textarea.ac-ad-code-area').textContent)
  }, 2000);
});

const getProducts = async () => {
  const trs = document.querySelectorAll('tr.search-result-item').item(0);
  for (let tr of [trs]) {
    products.push({
      _id: tr.querySelector('.product-name a')
        .href
        .match(/product\/(.*)?\?/)[1],
      name: tr.querySelector('.product-name a').textContent,
      price: parseFloat(
        tr.querySelector('.ac-product-price:last-child')
          .textContent
          .replace(/\./g, '')
          .replace(/,/g, '.')
          .replace('€', '')
      ),
      image: tr.querySelector('.product-image > img').src,
      seller: tr.querySelector('.ac-product-merchant > span')
        .textContent
        .replace('por ', ''),
      links: {
        amazon: tr.querySelector('.product-name a').href,
        afilliates: await getAfilliatesLink(tr)
      }
    });
  }
  console.table(products);
}

const products = [];
getProducts();

// Scroll the porducts list to the bottom
const scrollTo = max => {
  const div = document.querySelector('div.ac-card-content.ac-overflow-auto.search-result-body');
  const interval = setInterval(() => {
    div.scrollTop = div.scrollHeight;
  }, 100);
}

const addScript = src => {
  const script = document.createElement('script');

  script.setAttribute('src', src);

  document.body.appendChild(script);
}

const save = products => {
  return Promise.all(products.map(product => axios.post('localhost:3000/products/', product)));
}

const category = '';
const subcategory = '';
const search = '';
const seller = '';

(() => {
  console.log()
})();

/* https://afiliados.amazon.es/home/quicklinks/adtextlink?asin=B01N1KQGXZ&linkCode=as2&longurl=https://www.amazon.es/gp/product/B01N1KQGXZ/ref=as_li_tl?ie=UTF8&tag=moreorlessexp-21&camp=3638&creative=24630&linkCode=as2&creativeASIN=B01N1KQGXZ&linkId={{link_id}}
https://afiliados.amazon.es/home/quicklinks/adtextlink?
asin=B01LYWPQUN
linkCode=as2
longurl=https://www.amazon.es/gp/product/B01LYWPQUN/ref=as_li_tl?ie=UTF8&tag=moreorlessexp-21&camp=3638&creative=24630&linkCode=as2&creativeASIN=B01LYWPQUN&linkId={{link_id}}

"asin": "B07DM69ZJ4",
"linkcode": "as2", */