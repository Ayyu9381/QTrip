import config from "../conf/index.js";

// Implementation of fetch call to fetch all reservations
async function fetchReservations() {
  try {
    const response = await fetch(
      `${config.backendEndpoint}/reservations`
    );

    if (!response.ok) {
      return null;
    }

    const reservations = await response.json();
    return reservations;
  } catch (error) {
    console.error("Error fetching reservations:", error);
    return null;
  }
}

// Function to add reservations to the table

function addReservationToTable(reservations) {
  const tableParent = document.getElementById("reservation-table-parent");
  const noReservationBanner = document.getElementById("no-reservation-banner");
  const table = document.getElementById("reservation-table");

  if (!reservations || reservations.length === 0) {
    if (tableParent) {
      tableParent.style.display = "none";
    }

    if (noReservationBanner) {
      noReservationBanner.style.display = "block";
    }

    return;
  }

  if (tableParent) {
    tableParent.style.display = "block";
  }

  if (noReservationBanner) {
    noReservationBanner.style.display = "none";
  }

  if (!table) {
    console.error("Reservation table element was not found.");
    return;
  }

  table.innerHTML = "";

  reservations.forEach((reservation) => {
    const row = document.createElement("tr");

    const bookingDate = new Date(reservation.date);
    const formattedDate = bookingDate.toLocaleDateString("en-IN");

    const bookingTime = new Date(
      reservation.time || reservation.createdAt || reservation.date
    );

    const formattedTime = new Date(
      reservation.time || reservation.createdAt || reservation.date
    )
      .toLocaleString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      })
      .replace(" at ", ", ");
    row.innerHTML = `
  <td>${reservation.id}</td>
  <td>${reservation.name || ""}</td>
  <td>${reservation.adventureName || ""}</td>
  <td>${reservation.person}</td>
  <td>${formattedDate}</td>
  <td>${reservation.price}</td>
  <td>${formattedTime}</td>
  <td>
    <div id="${reservation.id}">
      <a href="../detail/?adventure=${reservation.adventure}" class="btn btn-primary reservation-visit-button">Visit Adventure</a>
    </div>
  </td>
`;

    table.appendChild(row);
  });
}


export { fetchReservations, addReservationToTable };