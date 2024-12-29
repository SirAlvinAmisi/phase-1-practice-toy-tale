let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyCollection = document.getElementById("toy-collection");
  const toyForm = document.querySelector(".add-toy-form");

  // Show/hide the add toy form
  addBtn.addEventListener("click", () => {
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  // Fetch and display all toys
  function fetchToys() {
    fetch("http://localhost:3000/toys")
      .then((response) => response.json())
      .then((toys) => {
        toys.forEach((toy) => renderToyCard(toy));
      });
  }

  // Render a single toy card
  function renderToyCard(toy) {
    const toyCard = document.createElement("div");
    toyCard.className = "card";
    toyCard.innerHTML = `
      <h2>${toy.name}</h2>
      <img src="${toy.image}" class="toy-avatar" />
      <p>${toy.likes} Likes</p>
      <button class="like-btn" id="${toy.id}">Like ❤️</button>
    `;
    toyCollection.appendChild(toyCard);
  }

  // Handle form submission to add a new toy
  toyForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const image = e.target.image.value;

    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name: name,
        image: image,
        likes: 0,
      }),
    })
      .then((response) => response.json())
      .then((newToy) => {
        renderToyCard(newToy); // Add the new toy to the DOM
        toyForm.reset(); // Clear the form
      });
  });

  // Handle click events on the "Like" button
  document.addEventListener("click", (e) => {
    if (e.target.className === "like-btn") {
      const toyId = e.target.id;
      const likesElement = e.target.previousElementSibling;
      const currentLikes = parseInt(likesElement.innerText);

      fetch(`http://localhost:3000/toys/${toyId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          likes: currentLikes + 1,
        }),
      })
        .then((response) => response.json())
        .then((updatedToy) => {
          likesElement.innerText = `${updatedToy.likes} Likes`;
        });
    }
  });

  // Fetch and display toys on page load
  fetchToys();
});
