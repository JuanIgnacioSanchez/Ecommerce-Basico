/* Creamos variables necesarias para nuestro archivo js */
const galeriaProductos = document.querySelector("#galeriaProductos");
const urlProductos = "./js/productos.json";
const numeroContadorCarrito = document.querySelector(".contadorCarrito");
const productos = [];
const carritoLS = localStorage.getItem("carrito");
const carritoLSnumero = JSON.parse(localStorage.getItem("carrito"));
let carrito = [];
const inputSearch = document.querySelector("input#inputSearch");

/* Condicional para completar el carrito recuperando datos del LS */
carritoLS ? (carrito = JSON.parse(carritoLS)) : (carrito = []);

/* Convertimos nuestra llista de productos en cards y las metemos en el array productos */
fetch(urlProductos)
  .then((response) => response.json())
  .then((data) => {
    data.forEach((producto) => {
      productos.push(producto);
      const card = document.createElement("div");
      card.classList.add("card-product");
      card.innerHTML = `<img class="img-product" src="${producto.imagen}" alt="Buzo Hoodie"/>
        <h3 class="titlte-product">${producto.nombre}</h3>
        <p class="precio-product">$${producto.precio}</p>
        <button
            class="input-product button button-outline"
            id="${producto.id}"
        >Agregar al carrito
        </button>`;
      galeriaProductos.append(card);

      agregarProductoAlCarrito();
    });
    buscarProductos();
  });

/* Agregamos productos al carrito con una función */
function agregarProductoAlCarrito() {
  const btnsAgregarAlCarrito = document.querySelectorAll(
    "button.button.button-outline"
  );

  btnsAgregarAlCarrito.forEach((btn) =>
    btn.addEventListener("click", agregarAlCarrito)
  );
}
agregarProductoAlCarrito();

/* Configuracion de botones para agregar productos al carrito */
function agregarAlCarrito(e) {
  const idBtn = parseInt(e.target.id);
  const subirProductoAlCarrito = productos.find(
    (producto) => producto.id === idBtn
  );

  if (carrito.some((producto) => producto.id === idBtn)) {
    const index = carrito.findIndex((producto) => producto.id === idBtn);
    carrito[index].cantidad++;
    Toastify({
      text: `Has agregado ${subirProductoAlCarrito.nombre.toLowerCase()} al carrito`,
      duration: 2500,
      style: {
        background: "linear-gradient(to right, #00b09b, #96c93d)",
      },
      destination: "../pages/carrito.html",
      close: true,
    }).showToast();
  } else {
    subirProductoAlCarrito.cantidad = 1;
    carrito.push(subirProductoAlCarrito);
    Toastify({
      text: `Has agregado ${subirProductoAlCarrito.nombre.toLowerCase()} al carrito`,
      duration: 2500,
      style: {
        background: "linear-gradient(to right, #00b09b, #96c93d)",
      },
      destination: "../pages/carrito.html",
      close: true,
    }).showToast();
  }

  contadorCarrito();
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

/* Funcion para manipular el contador de cantidad de productos en el carrito */
function contadorCarrito() {
  const cantidadCarrito = carrito.reduce(
    (acc, producto) => acc + producto.cantidad,
    0
  );
  numeroContadorCarrito.innerHTML = cantidadCarrito;
}

/* Funcion para buscar productos (momentaneamente media innecesaria) */
function buscarProductos() {
  inputSearch.addEventListener("input", () => {
    const productoBuscado = productos.filter((producto) =>
      producto.nombre.toLowerCase().includes(inputSearch.value.toLowerCase())
    );
    generarCardsBuscadas(productoBuscado);

    if (productoBuscado.length === 0) {
    }
  });
}

function generarCardsBuscadas(array) {
  galeriaProductos.innerHTML = "";
  array.forEach((producto) => {
    const card = document.createElement("div");
    card.classList.add("card-product");
    card.innerHTML = `<img class="img-product" src="${producto.imagen}" alt="Buzo Hoodie"/>
      <h3 class="titlte-product">${producto.nombre}</h3>
      <p class="precio-product">$${producto.precio}</p>
      <button
          class="input-product button button-outline"
          id="${producto.id}"
      >Agregar al carrito
      </button>`;
    galeriaProductos.appendChild(card);
  });
}

// Llamamos a la función buscarProductos después de cargar todo el contenido
document.addEventListener("DOMContentLoaded", function () {
  buscarProductos();
});

carritoLSnumero && contadorCarrito();
