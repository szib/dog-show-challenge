const URL = 'http://localhost:3000/dogs';

const dogTable = document.querySelector('#table-body');
const dogForm = document.querySelector('#dog-form');

const api = (url, options = {}) => fetch(url, options)
  .then((response) => {
    if (response.ok) {
      return response.json();
    }
    return Promise.reject(response.json());
  });


const renderDog = (dog) => {
  const row = document.createElement('tr');

  const [nameEl, breedEl, sexEl] = Array.from([1, 2, 3], x => document.createElement('td'));
  nameEl.innerText = dog.name;
  breedEl.innerText = dog.breed;
  sexEl.innerText = dog.sex;
  const editEl = document.createElement('button');
  editEl.innerText = 'Edit dog';

  row.append(nameEl, breedEl, sexEl, editEl);
  return row;
};

const renderDogs = (dogs) => {
  dogTable.innerHTML = '';
  dogs.forEach((dog) => {
    dogTable.appendChild(renderDog(dog));
  });
};

document.addEventListener('DOMContentLoaded', () => {
  api(URL)
    .then(renderDogs);
});
