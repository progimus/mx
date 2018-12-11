window.addEventListener('DOMContentLoaded', () => {

})

let elememts, last, current, products;

window.addEventListener('DOMContentLoaded', event => {
  const [left, right, aux] = [...document.querySelectorAll('.left, .right, .aux')];
  elements = {
    left: {
      container: left,
      image: left.querySelector('img'),
      name: left.querySelector('.name'),
      price: left.querySelector('.price'),
      less: left.querySelector('.less'),
      more: left.querySelector('.more')
    },
    right: {
      container: right,
      image: right.querySelector('img'),
      name: right.querySelector('.name'),
      price: right.querySelector('.price'),
      less: right.querySelector('.less'),
      more: right.querySelector('.more')
    },
    aux: {
      container: aux,
      image: aux.querySelector('img'),
      name: aux.querySelector('.name'),
      price: aux.querySelector('.price'),
      less: aux.querySelector('.less'),
      more: aux.querySelector('.more')
    },
    buttons: {
      less: document.querySelectorAll('.less'),
      more: document.querySelectorAll('.more')
    },
    circle: document.querySelector('.circle')
  };

  for (let button of elements.buttons.less) button.addEventListener('click', event => check('less'))
  for (let button of elements.buttons.more) button.addEventListener('click', event => check('more'))

  start()
});

const getProducts = () => new Promise((resolve, reject) => {
  axios.get('http://localhost:3000/products?rand=true&size=1500')
    .then(response => resolve(response.data));
});

const start = async () => {
  products = await getProducts();
  elements.right.price.style.display = 'none';

  last = products.shift();
  current = products[0];

  elements.left.image.src = last.image;
  elements.left.name.textContent = last.name;
  elements.left.price.textContent = `${last.price} $`;
  elements.right.image.src = current.image;
  elements.right.name.textContent = current.name;
  /* next(); */
}

const next = async () => {
  last = products.shift();
  if (products.length === 0) products = await getProducts();
  current = products[0];

  elements.left.container.classList.remove('left');
  elements.right.container.classList.remove('right');
  elements.aux.container.classList.remove('aux');
  elements.right.container.classList.add('left');
  elements.aux.container.classList.add('right');

  elements.left.image.src = last.image;
  elements.left.name.textContent = last.name;
  elements.left.price.textContent = `${last.price} $`;
  elements.right.image.src = current.image;
  elements.right.name.textContent = current.name;
}

const check = async response => {
  elements.right.less.style.display = 'none';
  elements.right.more.style.display = 'none';
  elements.right.price.style.display = 'block';

  const price = current.price;

  for (let i = price * .5; i < price; i += price * .01) {
    elements.right.price.textContent = i.toFixed(2);
    await sleep(3);
  }

  elements.right.price.textContent = price.toFixed(2);

  if (
    (response === 'more' && current.price > last.price) ||
    (response === 'less' && current.price < last.price)
  ) {
    elements.circle.textContent = '💚';
    /* elements.circle.classList.remove('fa-times', 'versus')
    elements.circle.classList.add('fa', 'fa-check') */

    return next();
  }
  
  return lose();
}

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const lose = () => alert('Has perdido capullo');

/* right -> bounceIn
left -> bounceTo
aux -> bounceOut */