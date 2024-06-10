const socket = io();
const containerCardsProducts = document.querySelector(
  "#containerCards_products"
);

const products = [];
socket.emit("getProducts", null);

socket.on("products", (data) => {
  renderProducts(data.docs);
});

const renderProducts = (products) => {
  let plantilla = "";
  products.forEach(
    ({
      code,
      description,
      _id,
      price,
      status,
      category,
      stock,
      thumbnails,
      title,
    }) => {
      plantilla += `<div class="col">
      <div class="card" style="width: 18rem;">
        ${
          thumbnails.length > 0
            ? '<img src="/images/products/' +
              thumbnails[0] +
              '" class="bd-placeholder-img card-img-top img-fluid ratio-4x3" alt="...">'
            : `<svg
          class="bd-placeholder-img card-img-top"
          role="img"
          aria-label="Marcador de posición: Cap de imagen"
          focusable="false"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Marcador de posición</title>
          <rect width="100%" height="100%" fill="#868e96"></rect><text
            x="50%"
            y="50%"
            fill="#dee2e6"
            dy=".3em"
          >Sin imagen previa</text>
        </svg>`
        }
        

        <div class="card-body">
          <h5 class="card-title"> ${title}</h5>
          <p>Id:${_id}</p>
          <p class="card-text">${description}</p>
          <p class="card-text"><span>Price: $${price}</span>
            <span>Stock: ${stock}</span></p>
            
          <p class="card-text">category: ${category}</p>
          <p class="card-text">${code}</p>

        </div>
      </div>
    </div>`;
    }
  );
  containerCardsProducts.innerHTML = plantilla;
};


document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#formAddProducts");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (validateFormNotEmpty(form)) {
      const formData = new FormData(form);

      // Crear un objeto para almacenar los datos del formulario
      const formDataObject = {};

    
      // Obtener todas las promesas de lectura de archivos
      const filesPromises = [];
      for (const [key, value] of formData.entries()) {
        
    if (key === "status") {
          // Convertir el valor booleano a un valor string ('true' o 'false')
          formDataObject[key] = value == "on" ? true : false;
        } else if (key === "price") {
          // Convertir a valor numerico
          formDataObject[key] = parseFloat(value);
        } else if (key === "stock") {
          // Convertir a valor numerico
          formDataObject[key] = parseInt(value);
        } else {
          formDataObject[key] = value;
        }
      }

      formDataObject.thumbnails = formData.getAll("thumbnails");

         


      // Emitir al socket después de completar el procesamiento
      await socket.emit("addNewProduct", formDataObject);

      Swal.fire({
        title: "Se registró un nuevo Producto",
        text: `El nombre del producto es ${formDataObject.title}`,
        icon: "success",
        toast: true,
      });
      form.reset();
    } else {
      Swal.fire({
        title: "Error",
        text: `Todos los campos son obligatorios`,
        icon: "error",
        toast: true,
      });
    }
  });
});

function validateFormNotEmpty(form) {
  // Obtener todos los campos del formulario
  const formFields = form.querySelectorAll("input, select, textarea");

  // Verificar que ningún campo esté vacío
  for (const field of formFields) {
    if (!field.value.trim()) {
      return false; // Devuelve falso si encuentra algún campo vacío
    }
  }

  return true;
}

socket.on("error", (data) => {
  Swal.fire({
    title: "Error procesando guardando el Producto",
    text: `${data}`,
    icon: "error",
    toast: true,
  });
});
