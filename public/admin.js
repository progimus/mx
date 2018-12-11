window.addEventListener('DOMContentLoaded', () => {
  update();
  
  document.querySelector('#previous')
    .addEventListener('click', handlePrevious);

  document.querySelector('#next')
    .addEventListener('click', handleNext);

  document.querySelector('.modal #save')
    .addEventListener('click', handleModalSave);

  document.querySelector('.modal #cancel')
    .addEventListener('click', handleClose);
  
  document.querySelectorAll('.modal .link')
    .forEach(elem => elem.addEventListener('click', handleLink));
});

const handlePrevious = event => {
  const page = document.querySelector('#page');

  page.value = Number.parseInt(page.value) - 1;

  update();
}

const handleNext = event => {
  const page = document.querySelector('#page');

  page.value = Number.parseInt(page.value) + 1;

  update();
}

const update = event => {
  const perPage = document.querySelector('select');
  const page = document.querySelector('#page');

  axios.get(`http://localhost:3000/products?page=${page.value || 1}&per_page=${perPage.value || 1}`)
    .then(response => display(response.data))
    .catch(error => console.log(error));
}


const display = data => {
  if (!data.length) return;

  const tbody = document.querySelector('tbody');

  for (let child of [...tbody.children]) {
    tbody.removeChild(child);
  }

  for (let field of data) {
    const {_id:id, name, price, image} = field;
    const tr = document.createElement('tr');

    const tdId = document.createElement('td');
    tdId.textContent = id;
    tdId.setAttribute('id', 'id');
    tr.appendChild(tdId);

    const tdName = document.createElement('td');
    const inputName = document.createElement('input');
    inputName.setAttribute('type', 'text')
    inputName.setAttribute('id', 'name');
    inputName.setAttribute('value', name);
    inputName.classList.add('form-control');
    tdName.appendChild(inputName);
    tr.appendChild(tdName);

    const tdPrice = document.createElement('td');
    const inputPrice = document.createElement('input');
    inputPrice.setAttribute('type', 'text')
    inputPrice.setAttribute('id', 'price');
    inputPrice.setAttribute('value', price);
    inputPrice.classList.add('form-control');
    tdPrice.appendChild(inputPrice);
    tr.appendChild(tdPrice);

    const tdImage = document.createElement('td');
    const imgImage = document.createElement('img');
    imgImage.setAttribute('id', 'image');
    imgImage.setAttribute('src', image);
    tdImage.appendChild(imgImage);
    tr.appendChild(tdImage);

    const tdButtons = document.createElement('td');
    const btnGroup = document.createElement('div');
    const edit = document.createElement('button');
    const save = document.createElement('button');
    const remove = document.createElement('button');
    btnGroup.classList.add('btn-group');
    edit.innerHTML = '<i class="material-icons">edit</i>';
    edit.setAttribute('type', 'button');
    edit.classList.add('btn', 'btn-secondary');
    edit.addEventListener('click', () => handleEdit(field));
    save.innerHTML = '<i class="material-icons">save</i>';
    save.setAttribute('type', 'button');
    save.classList.add('btn', 'btn-success');
    save.addEventListener('click', handleTableSave);
    remove.innerHTML = '<i class="material-icons">delete</i>';
    remove.setAttribute('type', 'button');
    remove.classList.add('btn', 'btn-danger', 'material_icons');
    remove.addEventListener('click', handleRemove);
    btnGroup.appendChild(edit);
    btnGroup.appendChild(save);
    btnGroup.appendChild(remove);
    tdButtons.appendChild(btnGroup);
    tr.appendChild(tdButtons);

    tbody.appendChild(tr);
  }
}

const handleTableSave = event => {
  const tr = event.target.parentNode.parentNode.parentNode;
  tr.querySelector('#id')

  axios.put(`http://localhost:3000/products/${tr.querySelector('#id').textContent}`,{
    name: tr.querySelector('#name').value,
    price: tr.querySelector('#price').value
  })
  .then(response => console.log(response))
  .catch(error => console.log(error));
}

const handleModalSave = event => {
  const modal = document.querySelector('.modal');
  axios.put(`http://localhost:3000/products/${modal.querySelector('#id').textContent}`,{
    name: modal.querySelector('#name').value,
    price: modal.querySelector('#price').value,
    image: modal.querySelector('#image').src,
    links: {
      amazon: modal.querySelector('#amazon').value,
      affiliates: modal.querySelector('#affiliates').value
    }
  })
  .then(response => console.log(response))
  .catch(error => console.log(error));
}

const handleRemove = event => {
  const tr = event.target.parentNode.parentNode;

  axios.delete(`http://localhost:3000/products/${tr.querySelector('#id').value}`)
    .then(response => tr.parentNode.removeChild(tr))
    .catch(error => console.log(error));
}

const handleEdit = ({_id: id, name, price, image, /* links */ link}) => {
  const modal = document.querySelector('.modal');
  
  modal.querySelector('#id').textContent = id;
  modal.querySelector('#name').value = name;
  modal.querySelector('#price').value = price;
  modal.querySelector('img#image').src = image;
  modal.querySelector('input#image').value = image;
  modal.querySelector('#amazon').value = link/* link.amazon */;
  /* modal.querySelector('#affiliates').value = links.affiliates; */

  modal.style.display = 'block';
}

const handleClose = event => {
  document.querySelector('.modal').style.display = 'none';
}

const handleLink = event => {
  const link = event.target.parentNode.previousElementSibling.value;

  window.open(link, '_blank');
}