import config from "../conf/index.js";

//Implementation to extract adventure ID from query params

function getAdventureIdFromURL(search) {
  const params = new URLSearchParams(search);
  return params.get("adventure");
}

//Implementation of fetch call with a paramterized input based on adventure ID

async function fetchAdventureDetails(adventureId) {
  try {
    const endpoint = config.backendEndpoint.replace(/\/+$/, "");
    const response = await fetch(
      `${endpoint}/adventures/detail?adventure=${encodeURIComponent(adventureId)}`
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    return null;
  }
}


//Implementation of DOM manipulation to add adventure details to DOM
function addAdventureDetailsToDOM(adventure) {
  // 1. Get the HTML elements using their IDs
  const adventureName = document.getElementById("adventure-name");
  const adventureSubtitle = document.getElementById("adventure-subtitle");
  const adventureContent = document.getElementById("adventure-content");
  const photoGallery = document.getElementById("photo-gallery");

  // 2. Insert the adventure details
  adventureName.textContent = adventure.name;
  adventureSubtitle.textContent = adventure.subtitle;
  adventureContent.textContent = adventure.content;

  // 3. Add each image to the photo gallery
  photoGallery.innerHTML = "";

  adventure.images.forEach((image) => {
    // Create a div for each image
    const imageDiv = document.createElement("div");

    // Create the image element
    const img = document.createElement("img");
    img.src = image;
    img.className = "activity-card-image";
    img.alt = adventure.name;

    // Place the image inside the div
    imageDiv.appendChild(img);

    // Add the div to the gallery
    photoGallery.appendChild(imageDiv);
  });
}

//Implementation of bootstrap gallery component

function addBootstrapPhotoGallery(images) {
  const photoGallery = document.getElementById("photo-gallery");

  photoGallery.innerHTML = `
    <div id="carouselExampleIndicators" class="carousel slide" data-bs-ride="carousel">
      <div class="carousel-inner"></div>

      <button
        class="carousel-control-prev"
        type="button"
        data-bs-target="#carouselExampleIndicators"
        data-bs-slide="prev"
      >
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>

      <button
        class="carousel-control-next"
        type="button"
        data-bs-target="#carouselExampleIndicators"
        data-bs-slide="next"
      >
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>
  `;

  const carouselInner = photoGallery.querySelector(".carousel-inner");

  images.forEach((image, index) => {
    const carouselItem = document.createElement("div");

    carouselItem.classList.add("carousel-item");

    if (index === 0) {
      carouselItem.classList.add("active");
    }

    const img = document.createElement("img");
    img.src = image;
    img.classList.add("d-block", "w-100", "activity-card-image");
    img.alt = "Adventure image";

    carouselItem.appendChild(img);
    carouselInner.appendChild(carouselItem);
  });
}


//Implementation of conditional rendering of DOM based on availability

function conditionalRenderingOfReservationPanel(adventure) {
  const soldOutPanel = document.getElementById("reservation-panel-sold-out");
  const availablePanel = document.getElementById("reservation-panel-available");

  if (adventure.available) {
    soldOutPanel.style.display = "none";
    availablePanel.style.display = "block";

    document.getElementById("reservation-person-cost").innerHTML =
      String(adventure.costPerHead);
  } else {
    availablePanel.style.display = "none";
    soldOutPanel.style.display = "block";
  }
}


//Implementation of reservation cost calculation based on persons
function calculateReservationCostAndUpdateDOM(adventure, persons) {
  const totalCost = adventure.costPerHead * persons;

  document.getElementById("reservation-cost").innerHTML = String(totalCost);
}

//Implementation of reservation form submission

function captureFormSubmit(adventure) {
  const form = document.getElementById("myForm");

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = form.elements.namedItem("name").value;
    const date = form.elements.namedItem("date").value;
    const persons = form.elements.namedItem("person").value;

    try {
      const endpoint = config.backendEndpoint.replace(/\/+$/, "");
      const response = await fetch(
        `${endpoint}/reservations/new`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name,
            date: date,
            person: persons,
            adventure: adventure.id,
          }),
        }
      );

      if (response.ok) {
        alert("Success!");
        window.location.reload();
      } else {
        alert("Failed!");
      }
    } catch (error) {
      console.error("Reservation request failed:", error);
      alert("Failed!");
    }
  });
}
//Implementation of success banner after reservation

function showBannerIfAlreadyReserved(adventure) {
  const banner = document.getElementById("reserved-banner");

  if (adventure.reserved) {
    banner.style.display = "block";
  } else {
    banner.style.display = "none";
  }
}


export {
  getAdventureIdFromURL,
  fetchAdventureDetails,
  addAdventureDetailsToDOM,
  addBootstrapPhotoGallery,
  conditionalRenderingOfReservationPanel,
  captureFormSubmit,
  calculateReservationCostAndUpdateDOM,
  showBannerIfAlreadyReserved,
};
