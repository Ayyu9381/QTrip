import config from "../conf/index.js";

// Extract city from query params
function getCityFromURL(search) {
  const params = new URLSearchParams(search);
  return params.get("city");
}

// Fetch adventures for the given city
async function fetchAdventures(city) {
  try {
    const response = await fetch(
      `${config.backendEndpoint}/adventures?city=${encodeURIComponent(city)}`
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

// Add adventures to the DOM
function addAdventureToDOM(adventures) {
  const container = document.getElementById("data");

  adventures.forEach((adventure) => {
    const cardCol = document.createElement("div");
    cardCol.className = "col-6 col-lg-3 mb-3";

    cardCol.innerHTML = `
      <a href="detail/?adventure=${adventure.id}" id="${adventure.id}">
        <div class="activity-card">
          <div class="category-banner">${adventure.category}</div>
          <img
            class="img-responsive"
            src="${adventure.image}"
            alt="${adventure.name}"
          />
          <div class="activity-card-text text-md-center w-100 mt-3 px-2">
            <div class="d-block d-md-flex justify-content-between flex-wrap pl-3 pr-3">
              <h5 class="text-left">${adventure.name}</h5>
              <p>₹${adventure.costPerHead}</p>
            </div>

            <div class="d-block d-md-flex justify-content-between flex-wrap pl-3 pr-3">
              <h5 class="text-left">Duration</h5>
              <p>${adventure.duration} Hours</p>
            </div>
          </div>
        </div>
      </a>
    `;

    container.appendChild(cardCol);
  });
}

// Filter adventures by duration
function filterByDuration(list, low, high) {
  return list.filter((adventure) => {
      return adventure.duration >= low &&
             adventure.duration <= high;
  });
}

// Filter adventures by category
function filterByCategory(list, categoryList) {
  if (!categoryList || categoryList.length === 0) {
    return list;
  }

  return list.filter((adventure) =>
    categoryList.includes(adventure.category)
  );
}

// Apply duration and category filters
function filterFunction(list, filters) {
  let filteredList = list;

  // Apply duration filter
  if (filters.duration) {
    const durationRange = filters.duration.split("-");

    const low = Number(durationRange[0]);
    const high = Number(durationRange[1]);

    filteredList = filterByDuration(filteredList, low, high);
  }

  // Apply category filter
  if (filters.category && filters.category.length > 0) {
    filteredList = filterByCategory(
      filteredList,
      filters.category
    );
  }

  return filteredList;
}

// Save filters to localStorage
function saveFiltersToLocalStorage(filters) {
  try {
    localStorage.setItem("filters", JSON.stringify(filters));
    return true;
  } catch (error) {
    return false;
  }
}

// Retrieve filters from localStorage
function getFiltersFromLocalStorage() {
  try {
    const filters = localStorage.getItem("filters");

    return filters ? JSON.parse(filters) : null;
  } catch (error) {
    return null;
  }
}

// Update duration dropdown and category filter pills
function generateFilterPillsAndUpdateDOM(filters) {
  // Update duration dropdown if duration filter exists
  const durationFilter = document.getElementById("duration-select");

  if (durationFilter && filters.duration) {
    durationFilter.value = filters.duration;
  }

  // Get category pills container
  const categoryContainer = document.getElementById("category-list");

  if (categoryContainer) {
    // Clear existing pills
    categoryContainer.innerHTML = "";

    // Create a pill for every selected category
    (filters.category || []).forEach((category) => {
      const pill = document.createElement("div");

      // CSS class provided in styles.css
      pill.className = "category-filter";

      pill.innerHTML = `
        <span>${category}</span>
        <button
          type="button"
          aria-label="Remove ${category} filter"
        >
          ×
        </button>
      `;

      // Optional: remove individual category filter
      pill.querySelector("button").addEventListener("click", () => {
        const updatedCategories = filters.category.filter(
          (item) => item !== category
        );

        filters.category = updatedCategories;

        // Save updated filters
        saveFiltersToLocalStorage(filters);

        // Update pills
        generateFilterPillsAndUpdateDOM(filters);
      });

      categoryContainer.appendChild(pill);
    });
  }
}

export {
  getCityFromURL,
  fetchAdventures,
  addAdventureToDOM,
  filterByDuration,
  filterByCategory,
  filterFunction,
  saveFiltersToLocalStorage,
  getFiltersFromLocalStorage,
  generateFilterPillsAndUpdateDOM,
};