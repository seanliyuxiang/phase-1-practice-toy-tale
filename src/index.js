let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});

const BASE_URL = 'http://localhost:3000/toys';

const init = () => {
  // grab all necessary html elements
  const toyCollectionDiv = document.querySelector('#toy-collection');
  const createToyForm = document.querySelector('form.add-toy-form');

  // function to render a single toy card
  const renderToyCard = toyCardInfoObj => {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'card';
    cardDiv.innerHTML = `<h2>${toyCardInfoObj.name}</h2>
                         <img src="${toyCardInfoObj.image}" class="toy-avatar" />
                         <p>${toyCardInfoObj.likes} Likes </p>
                         <button class="like-btn" id="toy-id-${toyCardInfoObj.id}">Like &#10084;</button>`;
    toyCollectionDiv.appendChild(cardDiv);

    // function to increase likes on the DOM and also in db.json
    const increaseLikesHandler = (event) => {
      // grab, increment, and assign the new 'likesCount'
      let likesCount = parseInt(cardDiv.querySelector('p').innerText.replace(' Likes', ''));
      likesCount++;
      cardDiv.querySelector('p').innerText = `${likesCount} Likes`;

      const configObj = {
        method: "PATCH",
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({ likes: likesCount })
      };

      fetch(`${BASE_URL}/${toyCardInfoObj.id}`, configObj)
        .then(response => response.json())
        .then(json => console.log(json));
    };

    // grab the newly appended 'like' button
    const likeBtn = document.querySelector(`#toy-id-${toyCardInfoObj.id}`);
    // add event listener to 'like' button
    likeBtn.addEventListener('click', increaseLikesHandler);

  };

  // fetch data to show all toy cards
  // GET /toys
  fetch(BASE_URL)
    .then(response => response.json())
    .then(json => {
      json.forEach(renderToyCard);
    });

  // function to create a new toy
  const createToyHandler = (event) => {
    event.preventDefault();
    // capture user input fields
    const createToyName = event.target.children[1].value;
    const createToyImageURL = event.target.children[3].value;

    // data payload to be sent across the internet
    const formData = {
      name: createToyName,
      image: createToyImageURL,
      likes: 0
    };

    // 2nd argument to be passed into the fetch function
    const configObj = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(formData)
    };

    // POST /toys
    fetch(BASE_URL, configObj)
      .then(response => response.json())
      .then(json => {
        renderToyCard(json);
      });

    // clear out all user input fields
    createToyForm.reset();
  };

  createToyForm.addEventListener('submit', createToyHandler);

};

document.addEventListener('DOMContentLoaded', init);
