const BASE_URL = "https://api.openf1.org/v1/drivers";

// Obtener la lista de pilotos (GET)
const productList = async () => {
  try {
    const response = await fetch(BASE_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener la lista de pilotos:", error);
    throw error;
  }
};

export const servicesProducts = {
  productList
};
