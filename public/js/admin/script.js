window.addEventListener('DOMContentLoaded', () => {
  update();

  document.querySelector('#filter')
    .addEventListener('click', update);

  document.querySelector('#perPage')
    .addEventListener('change', handlePerPage);

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

  document.querySelector('#upload')
    .addEventListener('click', handleUpload);

});

const handlePerPage = event => {
  document.querySelector('#page').value = 1;

  update();
}

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
  const locale = document.querySelector('#locale');
  const perPage = document.querySelector('#perPage');
  const page = document.querySelector('#page');

  axios.get(`${API_URL}/products?locale=${locale.value}&page=${page.value || 1}&per_page=${perPage.value || 1}`)
    .then(response => display(response.data))
    .catch(error => console.log(error));
}

const display = data => {
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
    const progress = document.createElement('div');
    const progressBar = document.createElement('div');
    const smallCounter = document.createElement('small');
    const length = name.length;
    const percentage = length * 100 / MAX_NAME_LENGTH;
    inputName.setAttribute('type', 'text')
    inputName.setAttribute('id', 'name');
    inputName.setAttribute('value', name);
    inputName.classList.add('form-control');
    inputName.addEventListener('change', handleTableSave);
    inputName.addEventListener('input', handleInputName);
    progress.classList.add('mt-2');
    progress.style.height = '3px';
    progress.classList.add('progress');
    progressBar.classList.add('progress-bar');
    progressBar.style.width = `${percentage}%`;
    if (length > MAX_NAME_LENGTH) { progressBar.classList.add('bg-danger'); }
    progress.appendChild(progressBar);
    smallCounter.classList.add('d-block', 'text-right', 'text-muted');
    smallCounter.textContent = `${name.length} / ${MAX_NAME_LENGTH}`;
    tdName.appendChild(inputName);
    tdName.appendChild(progress);
    tdName.appendChild(smallCounter);
    tr.appendChild(tdName);

    const tdPrice = document.createElement('td');
    const inputPrice = document.createElement('input');
    inputPrice.setAttribute('type', 'text')
    inputPrice.setAttribute('id', 'price');
    inputPrice.setAttribute('value', price);
    inputPrice.classList.add('form-control');
    inputPrice.addEventListener('change', handleTableSave);
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

const handleInputName = event => {
  const input = event.target;
  const progress = input.nextElementSibling;
  const progressBar = progress.firstElementChild;
  const smallCounter = progress.nextElementSibling;

  const length = input.value.length;
  const percentage = length * 100 / MAX_NAME_LENGTH;
  
  progressBar.style.width = `${percentage}%`;

  length > MAX_NAME_LENGTH
    ? progressBar.classList.add('bg-danger')
    : progressBar.classList.remove('bg-danger');

  smallCounter.textContent = `${length} / ${MAX_NAME_LENGTH}`;
};

const handleTableSave = event => {
  const tr = event.target.closest('tr');

  axios.put(`${API_URL}/products/${tr.querySelector('#id').textContent}`, {
    name: tr.querySelector('#name').value,
    price: tr.querySelector('#price').value
  })
  .then(response => console.log(response))
  .catch(error => console.log(error));
}

const handleModalSave = event => {
  const modal = document.querySelector('.modal');
  axios.put(`${API_URL}/products/${modal.querySelector('#id').textContent}`, {
    name: modal.querySelector('#name').value,
    price: modal.querySelector('#price').value,
    image: modal.querySelector('#image').value,
    amazonLink: modal.querySelector('#amazon').value,
    affiliatesLink: modal.querySelector('#affiliates').value
  })
  .then(response => console.log(response))
  .catch(error => console.log(error));
}

const handleRemove = event => {
  const tr = event.target.closest('tr');

  axios.delete(`${API_URL}/products/${tr.querySelector('#id').textContent}`)
    .then(response => tr.parentNode.removeChild(tr))
    .catch(error => console.log(error));
}

const handleEdit = ({_id: id, name, price, image, amazonLink, affiliatesLink}) => {
  const modal = document.querySelector('.modal');
  
  modal.querySelector('#id').textContent = id;
  modal.querySelector('#name').value = name;
  modal.querySelector('#price').value = price;
  modal.querySelector('img#image').src = image;
  modal.querySelector('input#image').value = image;
  modal.querySelector('#amazon').value = amazonLink;
  modal.querySelector('#affiliates').value = affiliatesLink;

  modal.style.display = 'block';
}

const handleClose = event => {
  document.querySelector('.modal').style.display = 'none';
}

const handleLink = event => {
  const link = event.target.parentNode.previousElementSibling.value;

  window.open(link, '_blank');
}

const handleUpload = async event => {
  const file = document.querySelector('input[type="file"]').files[0]

  const products = await readJSON(file);
  
  products.forEach(product => delete product._id);

  $('#upload.modal').modal('show');

  Promise
    .all(products.map(product => axios.post(`${API_URL}/products`, product)))
    .finally(() => {
      update();

      $('#upload.modal').modal('hide');
    });
}

const readJSON = json => new Promise((resolve, reject) => {
  const reader = new FileReader;

  reader.onload = event => resolve(JSON.parse(event.target.result))

  reader.readAsText(json, 'UTF-8');
});