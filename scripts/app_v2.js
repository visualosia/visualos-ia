let pacientes = [
  { nombre: "Juan Pérez", edad: 45 },
  { nombre: "María López", edad: 32 },
  { nombre: "Carlos Hernández", edad: 60 }
];

function mostrarPacientes() {
  let contenedor = document.getElementById("listaPacientes");
  if (!contenedor) return;

  contenedor.innerHTML = "";

  pacientes.forEach(function(paciente, index) {
    let div = document.createElement("div");
    div.innerHTML = paciente.nombre + " - " + paciente.edad + " años";
    div.style.cursor = "pointer";

    div.onclick = function () {
      abrirFichaPaciente(index);
    };

    contenedor.appendChild(div);
  });
}

function nuevoPaciente() {
  let form = document.getElementById("formPaciente");
  if (form) {
    form.style.display = "block";
  }
}

function guardarPaciente() {
  let nombre = document.getElementById("nombrePaciente").value;
  let edad = document.getElementById("edadPaciente").value;

  if (nombre === "" || edad === "") {
    alert("Completa todos los campos");
    return;
  }

  pacientes.push({
    nombre: nombre,
    edad: edad
  });

  mostrarPacientes();
  document.getElementById("formPaciente").style.display = "none";
}

mostrarPacientes();

function abrirFichaPaciente(index) {
  let paciente = pacientes[index];

  let ficha = document.getElementById("fichaPaciente");
  let detalle = document.getElementById("detallePaciente");

  detalle.innerHTML =
    "<strong>Nombre:</strong> " + paciente.nombre + "<br>" +
    "<strong>Edad:</strong> " + paciente.edad + " años";

  ficha.style.display = "block";
}
