const category = '';
const subcategory = '';
const search = '';
const seller = '';
const quantity = 20;

const init = async () => {
  /* script('https://cdnjs.cloudflare.com/ajax/libs/axios/0.18.0/axios.min.js'); */
  
  await scroll(quantity);
  
  const trs = [...document.querySelectorAll('tr.search-result-item')].slice(0, quantity);

  for (let i in trs) {
    await display(trs[i], i);
  }
  
  const products = getProducts();
  
  save(products);
}

const script = src => {
  const script = document.createElement('script');
  script.setAttribute('src', src);
  document.body.appendChild(script);
}

const scroll = quantity => new Promise((resolve, reject) => {
  quantity += 20;
  const interval = setInterval(() => {
    const div = document.querySelector('div.ac-card-content.ac-overflow-auto.search-result-body');
    const products = div.querySelectorAll('tr.search-result-item');

    if (products.length >= quantity) {
      window.clearInterval(interval);

      return resolve();
    }

    div.scrollTop = div.scrollHeight;
  }, 100);
});

const display = (tr, i) => new Promise((resolve, reject) => {
  i = parseInt(i);
  const interval = setInterval(() => {
    tr.querySelector('input.a-button-input').click();
    if (document.querySelectorAll('textarea.ac-ad-code-area').length === i + 1) {
      window.clearInterval(interval);
      return resolve()
    }
  }, 100)
});

const getProducts = () => {
  const products = [];
  const trs = [...document.querySelectorAll('tr.search-result-item')].slice(0, quantity);
  const textareas = document.querySelectorAll('textarea');
  const category = document.querySelector('input[name="category"]').value;
  const subcategory = document.querySelector('input[name="subcategory"]').value;

  for (let i in trs) {
    const tr = trs[i];

    if (!tr.querySelector('.ac-product-price:last-child')) continue;
    
    products.push({
      amazonId: tr.querySelector('.product-name a')
        .href
        .match(/product\/(.*)?\?/)[1],
      name: tr.querySelector('.product-name a').textContent,
      category: category,
      subcategory: subcategory,
      price: parseFloat(
        tr.querySelector('.ac-product-price:last-child')
          .textContent
          .replace(/\./g, '')
          .replace(/,/g, '.')
          .replace('€', '')
      ),
      image: tr.querySelector('.product-image > img').src,
      links: {
        amazon: tr.querySelector('.product-name a').href.replace(/\?.*$/, ''),
        affiliates: textareas.item(i).value
      }
    });
  }

  return products;
}

const save = products => {
    const link = document.createElement('a');
    const content = JSON.stringify(products);
    link.id = 'download1234';
    link.appendChild(document.createTextNode('asdasdasd'));
    link.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    link.setAttribute('download', `products.json`);
    document.body.appendChild(link);
    link.click();
}

init();