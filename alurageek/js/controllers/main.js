import { servicesProducts } from "../services/product-services.js";

const productsContainer = document.querySelector("[data-product]");
const form = document.querySelector("[data-form]");
const nameInput = document.querySelector("[data-name]");
const teamInput = document.querySelector("[data-price]");
const imageInput = document.querySelector("[data-image]");
const errorMessage = document.querySelector("[data-mensage]");

// Crea estructura HTML para ser renderizada dinámicamente con JS
function createCard({ first_name, last_name, team_name, headshot_url, driver_number }) {
  const card = document.createElement("div");
  card.classList.add("card");

  card.innerHTML = `
    <div class="img-container">
      <img src="${headshot_url}" alt="${first_name} ${last_name}">
    </div>
    <div class="card-container--info">
      <p>${first_name} ${last_name}</p>
      <div class="card-container--value">
        <p>${team_name}</p>
      </div>
      <button class="delete-button" data-driver="${driver_number}">
        <img src="./assets/trashIcon.svg" alt="Eliminar">
      </button>
    </div>
  `;

  // Asigna el evento de eliminación
  addDeleteEvent(card);

  return card;
}

// Agrega el evento de eliminación
function addDeleteEvent(card) {
  const deleteButton = card.querySelector(".delete-button");
  deleteButton.addEventListener("click", () => {
    deleteProduct(card); // Elimina la tarjeta del DOM
  });
}

// Eliminar producto del DOM (solo localmente)
const deleteProduct = (card) => {
  // Elimina la tarjeta del DOM
  productsContainer.removeChild(card);
  console.log("Piloto eliminado localmente del DOM.");
};

// Renderiza los productos en el DOM
const renderProducts = async () => {
  try {
    const listProducts = await servicesProducts.productList();
    if (!listProducts || listProducts.length === 0) {
      productsContainer.innerHTML = '<p>No hay pilotos disponibles</p>';
      return;
    }

    const uniqueNames = new Map(); // Mapa para rastrear nombres únicos con imagen
    productsContainer.innerHTML = ''; // Limpiar productos previos

    listProducts.forEach((product) => {
      const fullName = `${product.first_name} ${product.last_name}`;
      const hasImage = product.headshot_url && product.headshot_url.trim() !== "";

      if (hasImage && (!uniqueNames.has(fullName) || !uniqueNames.get(fullName).headshot_url)) {
        uniqueNames.set(fullName, product);
      }
    });

    uniqueNames.forEach((product) => {
      const productCard = createCard(product);
      productsContainer.appendChild(productCard);
    });
  } catch (err) {
    console.error("Error al renderizar pilotos:", err);
    productsContainer.innerHTML = '<p>Error al cargar pilotos</p>';
  }
};

// Manejador del evento submit para agregar un nuevo piloto
form.addEventListener("submit", (event) => {
  event.preventDefault();

  const nameValue = nameInput.value.trim();
  const teamValue = teamInput.value.trim();
  const imageValue = imageInput.value.trim();

  if (!nameValue || !teamValue || !imageValue) {
    errorMessage.textContent = "Todos los campos son obligatorios.";
    return;
  }

  const [first_name, last_name = ""] = nameValue.split(" ");
  const newPilot = {
    first_name,
    last_name,
    team_name: teamValue,
    headshot_url: imageValue,
  };

  errorMessage.textContent = "";

  const newCard = createCard(newPilot);
  productsContainer.appendChild(newCard);

  form.reset();
});

// Ejecuta la función de renderizado inicial
renderProducts();
