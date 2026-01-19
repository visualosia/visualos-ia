let pacientes = JSON.parse(localStorage.getItem("pacientes"))  || []; 
let pacienteActivo = null; 
let pacientes = [
  { nombre: "Juan Pérez", edad: 45 },
  { nombre: "María López", edad: 32 },
  { nombre: "Carlos Hernández", edad: 60 }
];

function mostrarPacientes() {
  localStorage.setItem("pacientes", JSON.stringify(pacientes));
  let contenedor = document.getElementById("listaPacientes");
  if (!contenedor) return;

  contenedor.innerHTML = "";

  pacientes.forEach(function(paciente, index) {
    localStorage.setItem("pacientes", JSON.stringify(pacientes));
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
  localStorage.setItem("pacientes", JSON.stringify(pacientes));
  let form = document.getElementById("formPaciente");
  if (form) {
    form.style.display = "block";
  }
}

function guardarPaciente() {
  localStorage.setItem("pacientes", JSON.stringify(pacientes));
  let nombre = document.getElementById("nombrePaciente").value;
  let edad = document.getElementById("edadPaciente").value;

  if (nombre === "" || edad === "") {
    alert("Completa todos los campos");
    return;
  }

let paciente = {
  nombre: nombre,
  edad: edad,
  motivo: "",
  observaciones: ""
};

  mostrarPacientes();
  document.getElementById("formPaciente").style.display = "none";
}

mostrarPacientes();

function abrirFichaPaciente(index) {
  localStorage.setItem("pacientes", JSON.stringify(pacientes));
  pacienteActivo = index;
  let paciente = pacientes[index];

  let ficha = document.getElementById("fichaPaciente");
  let detalle = document.getElementById("detallePaciente");

  detalle.innerHTML =
    "<strong>Nombre:</strong> " + paciente.nombre + "<br>" +
    "<strong>Edad:</strong> " + paciente.edad + " años";

  document.getElementById("motivoConsulta").value = paciente.motivo;
  document.getElementById("observaciones").value = paciente.observaciones;

  ficha.style.display = "block";
}

function guardarFicha() {
  localStorage.setItem("pacientes", JSON.stringify(pacientes));
  if (pacienteActivo === null) return;

  pacientes[pacienteActivo].motivo =
    localStorage.setItem("pacientes", JSON.stringify(pacientes));
    document.getElementById("motivoConsulta").value;

  pacientes[pacienteActivo].observaciones =
    localStorage.setItem("pacientes", JSON.stringify(pacientes));
    document.getElementById("observaciones").value;

  alert("Ficha guardada correctamente");
}
