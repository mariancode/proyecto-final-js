// //==============================CREACIÓN DE ELEMENTOS===========================================================
class Rompecabeza {
  constructor(id, edad, piezas, tema, categoria, precio, img, cantidad) {
    this.id = parseInt(id);
    this.edad = edad;
    this.piezas = piezas;
    this.tema = tema.toUpperCase();
    this.categoria = categoria;
    this.precio = parseFloat(precio);
    this.img = img;
    this.cantidad = cantidad || 1;
  }
  agregarCantidad() {
    this.cantidad++;
  }
  ticketCompra(carrito) {
    this.carrito = carrito;
  }
  subTotal() {
    let resultado = this.precio * this.cantidad;
    let resultado1 = resultado.toFixed(2);
    return resultado1;
  }
  addCantidad(valor) {
    this.cantidad += valor;
  }
}

const productos = [];
const carrito = [];

//================================================DATA.JSON==========================================================
fetch("data.json")
  .then((respuesta) => respuesta.json())
  .then((data) => {
    for (const literal of data) {
      productos.push(
        new Rompecabeza(
          literal.id,
          literal.edad,
          literal.piezas,
          literal.tema,
          literal.categoria,
          literal.precio,
          literal.img,
          literal.cantidad
        )
      );
    }
    productosHTML(productos);
    filtroHTML(productos);
  })
  .catch((mensaje) => console.error(mensaje));

//===========================================MUESTRA PRODUCTOS EN HTML========================================================
//Obtengo desde el DOM la interfaz donde se mostrarán los productos
let productosRender = document.getElementById("colProducto");
//Obtengo desde el DOM los productos seleccionados con el botón de compra
let productoSeleccionado = document.getElementById("productoSeleccionado");
//Obtengo desde el DOM los filtros
let opcionPorFiltro = document.getElementById("opcionPorFiltro");
//Carrito
const cantidadCarrito = document.getElementById("cantidad");
const productosCarrito = document.getElementById("productosCarrito");
//Boton confirmar
const confirmar = document.getElementById("confirmar");
//Total carrito
const totalCarritoInterfaz = document.getElementById("totalCarrito");
//Boton enviar correo elecrónico
const emailBtn = document.getElementById("emailBtn");

const divTema = document.getElementById("divTema");
const divEdad = document.getElementById("divEdad");
const divPrecio = document.getElementById("divPrecio");
const divPiezas = document.getElementById("divPiezas");

//============================================================================================================

// LLamo a las funciones que generan la interfaz de  productos vitrina y de los distintos filtros de productos
productosHTML(productos);
filtroHTML(productos);

//función que genera la interfaz de productos

function productosHTML(productos) {
  productosRender.innerHTML = "";
  for (const producto of productos) {
    //Crear elemento con div
    let divProducto = document.createElement("div");
    //paso 2 - asigno valor
    divProducto.classList.add("col");
    divProducto.innerHTML = `<div class="card shadow p-3 mb-5 bg-white rounded">
    <img src="${producto.img}" class="card-img-top" alt="imagen rompecabeza">
    <div class="card-body">
      <h5 class="card-title">${producto.tema}</h5>
      <p class="card-text"> $${producto.precio}</p>
      <button id="${producto.id}" class="botonCompra btn btn-success"> Comprar <i class="fa-solid fa-cart-shopping"></i></button>
    </div>
    `;
    //paso 3 - asigno un padre
    productosRender.append(divProducto);
  }
  eventoBoton();
}

//=====================================FILTROS DE COMPRA================================================================

//función para generar la interfaz dinámica del select
function selectCategoria(lista, clave) {
  let newSelect = document.createElement("select");

  newSelect.innerHTML =
    "<option>" + lista.join("</option><option>") + "</option>";
  opcionPorFiltro.append(newSelect);
  newSelect.addEventListener("change", function () {
    //realizo la opcionPorFiltro
    const filtrados = productos.filter(
      (producto) => producto[clave] == this.value
    );
    productosHTML(filtrados);
  });
}

//Función para generar filtros por tema, precio y edad

function filtroHTML(productos) {
  opcionPorFiltro.innerHTML = "";
  //filtro por tema
  opcionPorFiltro.append(divTema);
  const porTema = productos.map((producto) => producto.tema);
  selectCategoria(ordenAlfabetico(porTema), "tema");
  //filtro por precio
  opcionPorFiltro.append(divPrecio);
  const porPrecio = productos.map((producto) => producto.precio);
  selectCategoria(arraySinDuplicados(ordenPrecio(porPrecio)), "precio");
  //filtro por edad
  opcionPorFiltro.append(divEdad);
  const porEdad = productos.map((producto) => producto.edad);
  selectCategoria(arraySinDuplicados(ordenEdad(porEdad)), "edad");
  //filtro por piezas
  opcionPorFiltro.append(divPiezas);
  const porPiezas = productos.map((producto) => producto.piezas);
  selectCategoria(arraySinDuplicados(ordenPiezas(porPiezas)), "piezas");
}

//función que genera arrays sin datos duplicados
function arraySinDuplicados(lista) {
  let unicos = [];
  lista.forEach((producto) => {
    if (!unicos.includes(producto)) {
      unicos.push(producto);
    }
  });
  return unicos;
}

//función orden alfabético
function ordenAlfabetico() {
  productos.sort((a, b) => {
    if (a.tema > b.tema) {
      return 1;
    }
    if (a.tema < b.tema) {
      return -1;
    }
    return 0;
  });

  const tema = productos.map((tema) => tema.tema);
  return tema;
}

//función orden precio menor a mayor
function ordenPrecio() {
  productos.sort(
    (rompecabeza1, rompecabeza2) => rompecabeza1.precio - rompecabeza2.precio
  );
  const precio = productos.map((producto) => producto.precio);
  return precio;
}
//función orden edad menor a mayor
function ordenEdad() {
  productos.sort(
    (rompecabeza1, rompecabeza2) => rompecabeza1.edad - rompecabeza2.edad
  );
  const edad = productos.map((producto) => producto.edad);
  return edad;
}

//función orden piezas menor a mayor
function ordenPiezas() {
  productos.sort(
    (rompecabeza1, rompecabeza2) => rompecabeza1.piezas - rompecabeza2.piezas
  );
  const ordenMenorMayor = productos.map((producto) => producto.piezas);
  return ordenMenorMayor;
}
//===============================================BOTÓN COMPRA=========================================================

function eventoBoton() {
  let botones = document.getElementsByClassName(`botonCompra`);
  for (const boton of botones) {
    boton.addEventListener("click", function () {
      let botonSeleccionado = carrito.find(
        (producto) => producto.id == this.id
      );
      if (botonSeleccionado) {
        botonSeleccionado.agregarCantidad();
      } else {
        botonSeleccionado = productos.find(
          (producto) => producto.id == this.id
        );
        carrito.push(botonSeleccionado);
      }
      localStorage.setItem("carrito", JSON.stringify(carrito));

      carritoHTML(carrito);
      totalCarrito();
      //Toastify
      Toastify({
        text: `Se ha agregado: ${botonSeleccionado.tema}`,

        gravity: "bottom",
        position: "right",
        stopOnFocus: true,
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
        },

        duration: 3000,
      }).showToast();
    });
  }
}
//===========================================BUSCADOR DE PRODUCTOS=================================================
const buscador = document.getElementById("buscador");

buscador.addEventListener("input", function () {
  const productoBuscado = productos.filter((producto) =>
    producto.tema.includes(this.value.toUpperCase())
  );
  console.log(productoBuscado);
  productosHTML(productoBuscado);
});

//===============================================CARRITO============================================================
//Modal Carrito
function carritoHTML(lista) {
  cantidadCarrito.innerHTML = lista.length;
  productosCarrito.innerHTML = "";
  for (const producto of lista) {
    let prod = document.createElement("div");
    prod.innerHTML = `<span class="badge bg-success">Rompecabeza:</span> ${
      producto.tema
    }<hr>
                <img src="${producto.img}" class="img-carrito"><br>
                <span class="">Precio: $ ${producto.precio}</span> <br>
                <span class="">Cantidad: ${producto.cantidad}</span><br>
                <span class="badge bg-dark">Subtotal: $${producto.subTotal()}</span>
                <a id="${
                  producto.id
                }" class="btn btn-success btn-add fa-solid fa-circle-plus "></a>
                <a id="${
                  producto.id
                }" class="btn btn-success btn-sub fa-solid fa-circle-minus "></a>
                <a id="${
                  producto.id
                }" class="btn btn-success btn-delete fa-solid fa-trash-can "></a>`;
    console.log(prod);
    productosCarrito.append(prod);
  }
  document
    .querySelectorAll(".btn-delete")
    .forEach((boton) => (boton.onclick = eliminarCarrito));
  document
    .querySelectorAll(".btn-add")
    .forEach((boton) => (boton.onclick = addCarrito));
  document
    .querySelectorAll(".btn-sub")
    .forEach((boton) => (boton.onclick = subCarrito));

  totalCarrito();
}

//Funciones Carrito
function eliminarCarrito(e) {
  let posicion = carrito.findIndex((producto) => producto.id == e.target.id);

  carrito.splice(posicion, 1);

  carritoHTML(carrito);

  localStorage.setItem("Carrito", JSON.stringify(carrito));
}

function addCarrito() {
  let producto = carrito.find((p) => p.id == this.id);

  producto.addCantidad(1);

  this.parentNode.children[6].innerHTML = "Cantidad: " + producto.cantidad;
  this.parentNode.children[8].innerHTML = "Subtotal: " + producto.subTotal();

  totalCarrito();
  localStorage.setItem("Carrito", JSON.stringify(carrito));
}
function subCarrito() {
  let producto = carrito.find((p) => p.id == this.id);

  if (producto.cantidad > 1) {
    producto.addCantidad(-1);

    this.parentNode.children[6].innerHTML = "Cantidad: " + producto.cantidad;
    this.parentNode.children[8].innerHTML = "Subtotal: " + producto.subTotal();

    totalCarrito();
    localStorage.setItem("Carrito", JSON.stringify(carrito));
  }
}

function totalCarrito() {
  let total = carrito.reduce(
    (totalCompra, actual) => (totalCompra += actual.subTotal()),
    ""
  );
  totalCarritoInterfaz.innerHTML = "Total: $" + total;

  if (total > 150) {
    //Toastify
    Toastify({
      text: `🙌 Tienes el envío gratis`,

      gravity: "top",
      position: "right",
      stopOnFocus: true,
      close: true,
      style: {
        background:
          "linear-gradient(to right, rgb(255, 95, 109), rgb(255, 195, 113)",
      },

      duration: 3000,
    }).showToast();
  }

  return total;
}

//funcion vaciar localstorage y array carrito
function vaciarCarrito() {
  localStorage.clear();
  carrito.splice(0, carrito.length);
  carritoHTML(carrito);
  totalCarritoInterfaz.innerHTML = "Total: $" + 0;
}

//===============================================COMPRA==========================================================

confirmar.onclick = () => {
  //spinner
  productosCarrito.innerHTML = ` <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>`;
  //fetch
  fetch("https://apis.datos.gob.ar/georef/api/provincias")
    .then((respuesta) => {
      return respuesta.json();
    })
    .then((datos) => {
      console.log(datos);

      productosCarrito.innerHTML = `<h3>Información del Envio</h3>
                              <select id="provFiltro"></select> 
                              <select id="munFiltro"></select>
                              <button id="btnEnvio" class="btn text-dark btn-warning">Confirmar dirección de envío ✅</button>`;

      const provFiltro = document.getElementById("provFiltro");

      for (const provincia of datos.provincias) {
        provFiltro.innerHTML += `<option value="${provincia.id}">${provincia.nombre}</option>`;
      }

      provFiltro.onchange = () => {
        let idProvincia = provFiltro.value;
        console.log(idProvincia);

        let rutaBusqueda = `https://apis.datos.gob.ar/georef/api/municipios?provincia=${idProvincia}&campos=id,nombre&max=100`;
        fetch(rutaBusqueda)
          .then((respuesta) => respuesta.json())
          .then((datos) => {
            console.log(datos);

            let munFiltro = document.getElementById("munFiltro");
            for (const municipio of datos.municipios) {
              munFiltro.innerHTML += `<option value="${municipio.id}">${municipio.nombre}</option>`;
            }

            document.getElementById("btnEnvio").onclick = () => {
              console.log(
                "ENVIAR A " +
                  munFiltro.value +
                  " EN  PROVINCIA ID " +
                  idProvincia
              );
              fetch("https://jsonplaceholder.typicode.com/posts", {
                method: "POST",
                body: JSON.stringify({
                  carrito: carrito,
                  idProvincia: idProvincia,
                  idMunicipio: munFiltro.value,
                }),
                headers: {
                  "Content-type": "application/json; charset=UTF-8",
                },
              })
                .then((respuesta) => respuesta.json())
                .then((data) => {
                  Swal.fire({
                    title: "Dirección confirmada",
                    text: "",
                    icon: "success",
                    showCancelButton: true,
                    confirmButtonColor: "green",
                    cancelButtonColor: "gray",
                    confirmButtonText: "Comprar",
                  }).then((result) => {
                    if (result.isConfirmed) {
                      Swal.fire(
                        "Compra Confirmada",
                        "PEDIDO N° " + data.id,
                        "success"
                      );
                    }
                  });

                  vaciarCarrito();
                })
                .catch((mensaje) => {
                  console.log(mensaje);
                });
            };
          });
      };
    });
};

//=================================================NEWSLETTER========================================================

//Creo una clase para agregar a los suscriptores
class Suscriptor {
  constructor(nombre, email) {
    this.nombre = nombre;
    this.email = email;
  }
}

const suscriptores = [];

//Obtengo desde el DOM el lugar donde se generará la interfaz de la lista de suscriptores

let registroSuscriptores = document.getElementById("registroSuscriptores");
registroSuscriptores.onsubmit = (e) => {
  e.preventDefault();
  let hijos = registroSuscriptores.children;
  // console.log(hijos);
  suscriptores.push(new Suscriptor(hijos[1].value, hijos[2].value));
  e.target.reset();
  localStorage.setItem("listaSuscriptores", JSON.stringify(suscriptores));
  console.log = localStorage.getItem("listaSuscriptores");
};

document.getElementById("emailBtn").addEventListener("click", () => {
  const nombre = document.getElementById("nombre").value;
  const email = document.getElementById("email").value;
  if (nombre != "" && email != "") {
    Swal.fire({
      title: "Aquí tienes tu código: ROMPECABEZA22",
      color: "#f44611 ",
      imageUrl: "img/giphy.gif",
      imageWidth: 400,
      imageHeight: 200,
    });
  }
});

//==============================================================================================================
