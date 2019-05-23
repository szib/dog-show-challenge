const URL = 'http://localhost:3000/dogs';

const dogTable = document.querySelector('#table-body');
const dogForm = document.querySelector('#dog-form');

let dogs = [];

const api = (url, options = {}) => fetch(url, options)
  .then((response) => {
    if (response.ok) {
      return response.json();
    }
    return Promise.reject(response.json());
  });

const patchDog = (newDog) => {
  const options = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newDog),
  };
  return api(dogForm.action, options);
};

const enableForm = () => {
  dogForm.querySelectorAll('input').forEach((element) => {
    element.removeAttribute('disabled');
  });
};

const disableForm = () => {
  dogForm.querySelectorAll('input').forEach((element) => {
    element.setAttribute('disabled', true);
  });
};

const handleSubmit = (e) => {
  e.preventDefault();
  const newDog = {
    name: dogForm.name.value,
    breed: dogForm.breed.value,
    sex: dogForm.sex.value,
  };

  patchDog(newDog)
    .then((dog) => {
      dogForm.reset();
      delete dogForm.action;
      disableForm();
      return dog;
    })
    .then(dog => renderDog(dog, 'update'));
};

const populateForm = (dog) => {
  dogForm.name.value = dog.name;
  dogForm.breed.value = dog.breed;
  dogForm.sex.value = dog.sex;
  dogForm.action = `${URL}/${dog.id}`;
  enableForm();
};

const renderDog = (dog, update = false) => {
  let row;
  if (update) {
    row = dogTable.querySelector(`[data-dog-id='${dog.id}']`);
    row.innerHTML = '';
  } else {
    row = document.createElement('tr');
    row.dataset.dogId = dog.id;
  }

  const [nameEl, breedEl, sexEl] = Array.from([1, 2, 3], x => document.createElement('td'));
  nameEl.innerText = dog.name;
  breedEl.innerText = dog.breed;
  sexEl.innerText = dog.sex;

  const editEl = document.createElement('button');
  editEl.innerText = 'Edit dog';
  editEl.addEventListener('click', () => {
    populateForm(dog);
    dogForm.addEventListener('submit', handleSubmit);
  });

  row.append(nameEl, breedEl, sexEl, editEl);
  return row;
};

const saveDogs = (fetchedDogs) => {
  dogs = fetchedDogs;
  return fetchedDogs;
};

const renderDogs = () => {
  dogTable.innerHTML = '';
  dogs.forEach((dog) => {
    dogTable.appendChild(renderDog(dog));
  });
};

document.addEventListener('DOMContentLoaded', () => {
  disableForm();
  api(URL)
    .then(saveDogs)
    .then(renderDogs);
});
