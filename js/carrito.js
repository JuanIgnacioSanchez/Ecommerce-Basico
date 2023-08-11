document.addEventListener("DOMContentLoaded", () => {
  const numeroContadorCarrito = document.querySelector(".contadorCarrito");
  const carritoLSnumero = JSON.parse(localStorage.getItem("carrito"));
  const carritoLS = JSON.parse(localStorage.getItem("carrito"));
  const containerCarrito = document.querySelector("#containerCarrito");
  const btnVaciarCarrito = document.querySelector("#vaciarCarrito");
  const btnFinalizarCompra = document.querySelector("#finalizarCompra");
  const cartelCarritoVacio = document.querySelector(".sec-carrito-vacio");
  const sectionBotones = document.querySelector(".btns-comprar-vaciar");
  const totalCarrito = document.querySelector("#totalCarrito");

  /* Funcion para manipular el contador de cantidad de productos en el carrito */
  function contadorCarrito() {
    const cantidadCarrito = carritoLS.reduce(
      (acc, producto) => acc + producto.cantidad,
      0
    );
    numeroContadorCarrito.innerHTML = cantidadCarrito;
  }
  carritoLSnumero && contadorCarrito();

  /* Funcion para mostrar carrito modificando el DOM*/
  function tableHtml(producto) {
    return `<tr>
  <td class="nombre-producto">${producto.nombre}</td>
  <td class="cantidad-producto"><button type="button" class="bnt-modificar-cantidad btnBajarCantidad" id="${
    producto.id
  }">▼</button>${
      producto.cantidad
    }<button type="button" class="bnt-modificar-cantidad btnSubirCantidad" id="${
      producto.id
    }">▲</button></td>
  <td class="precio-producto">$${producto.precio}</td>
  <td class="quitar-producto"><button class="quitarProducto" type="button" id="${parseInt(
    producto.id
  )}">❌</button></td>
</tr>`;
  }

  function generarFilasCarrito(carrito) {
    containerCarrito.innerHTML = "";
    carrito.forEach((producto) => {
      containerCarrito.innerHTML += tableHtml(producto);
    });
  }
  carritoLS && generarFilasCarrito(carritoLS);

  /* Función para disminuir la cantidad de un producto en el carrito */
  function disminuirCantidad(event) {
    const btn = event.target;
    const productoId = parseInt(btn.id);
    const index = carritoLS.findIndex(
      (item) => parseInt(item.id) === productoId
    );

    if (index !== -1 && carritoLS[index].cantidad > 1) {
      carritoLS[index].cantidad -= 1;
      localStorage.setItem("carrito", JSON.stringify(carritoLS));
      generarFilasCarrito(carritoLS);
      contadorCarrito();
      mostrarTotalCarrito();
    }
  }

  /* Función para aumentar la cantidad de un producto en el carrito */
  function aumentarCantidad(event) {
    const btn = event.target;
    const productoId = parseInt(btn.id);
    const index = carritoLS.findIndex(
      (item) => parseInt(item.id) === productoId
    );

    if (index !== -1) {
      carritoLS[index].cantidad += 1;
      localStorage.setItem("carrito", JSON.stringify(carritoLS));
      generarFilasCarrito(carritoLS);
      contadorCarrito();
      mostrarTotalCarrito();
    }
  }

  /* Agregar eventos a los botones de bajar cantidad y subir cantidad using event delegation */
  containerCarrito.addEventListener("click", (event) => {
    if (event.target.classList.contains("btnBajarCantidad")) {
      disminuirCantidad(event);
    } else if (event.target.classList.contains("btnSubirCantidad")) {
      aumentarCantidad(event);
    }
  });

  /* Funcion para eliminar productos del carrito */
  function eliminarProducto(event) {
    const btn = event.target;
    const productoId = parseInt(btn.id);
    const index = carritoLS.findIndex(
      (item) => parseInt(item.id) === productoId
    );

    if (btn.id === String(productoId)) {
      Toastify({
        text: `Has eliminado ${carritoLS[
          index
        ].nombre.toLowerCase()} del carrito`,
        duration: 2500,
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
        close: true,
      }).showToast();
      carritoLS.splice(index, 1);
      localStorage.setItem("carrito", JSON.stringify(carritoLS));
      generarFilasCarrito(carritoLS);
      contadorCarrito();
      cartelesAparecerDesaparecer();
      mostrarTotalCarrito();
    }
  }
  containerCarrito.addEventListener("click", (event) => {
    if (event.target.classList.contains("quitarProducto")) {
      eliminarProducto(event);
    }
  });

  /* Funcion para sumar el total de los productos en carrito */
  function sumarTotalCarrito(array) {
    const total = array.reduce(
      (acc, producto) => acc + producto.precio * producto.cantidad,
      0
    );
    return total;
  }

  /* Funcion para modificar el DOM y mostrar el total del carrito */
  function mostrarTotalCarrito() {
    totalCarrito.innerHTML = "";
    totalCarrito.innerHTML += sumarTotalCarrito(carritoLS);
  }

  carritoLS && mostrarTotalCarrito();

  /* Funcion para vaciar el carrito */
  function vaciarCarrito() {
    btnVaciarCarrito.addEventListener("click", () => {
      Swal.fire({
        title: "¿Desea vaciar el carrito?",
        text: "¡No podrás revertir esto!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Vaciar carrito",
      }).then((result) => {
        if (result.isConfirmed) {
          carritoLS.length = 0;
          localStorage.removeItem("carrito");
          generarFilasCarrito(carritoLS);
          contadorCarrito();
          mostrarTotalCarrito();
          Swal.fire({
            icon: "success",
            title: "¡El carrito se ha vaciado!",
          });
          cartelesAparecerDesaparecer();
        }
      });
    });
  }
  carritoLS && vaciarCarrito();

  /* Funcion para finalizar la compra */
  function finalizarCompra() {
    btnFinalizarCompra.addEventListener("click", () => {
      Swal.fire({
        title: "¿Desea finalizar su compra?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Finalizar compra",
      }).then((result) => {
        if (result.isConfirmed) {
          carritoLS.length = 0;
          localStorage.removeItem("carrito");
          generarFilasCarrito(carritoLS);
          contadorCarrito();
          mostrarTotalCarrito();
          Swal.fire({
            icon: "success",
            title: "¡Su compra ha se ha realizado con éxito!",
          });
          cartelesAparecerDesaparecer();
        }
      });
    });
  }
  carritoLS && finalizarCompra();

  /* Funcion para ocultar o mostrar cartel de carrito vacío */
  function cartelesAparecerDesaparecer() {
    if (carritoLS && carritoLS.length > 0) {
      cartelCarritoVacio.classList.add("desaparecer-cartel-carrito-vacio");
      cartelCarritoVacio.classList.remove("sec-carrito-vacio");
      sectionBotones.classList.add("btns-comprar-vaciar");
      sectionBotones.classList.remove("desaparecer-section-btns");
    } else {
      cartelCarritoVacio.classList.add("sec-carrito-vacio");
      cartelCarritoVacio.classList.remove("desaparecer-cartel-carrito-vacio");
      sectionBotones.classList.add("desaparecer-section-btns");
      sectionBotones.classList.remove("btns-comprar-vaciar");
    }
  }
  cartelesAparecerDesaparecer();
});
