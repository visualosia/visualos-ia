alert("CARGÓ app_v2.js");
let pacientes = JSON.parse(localStorage.getItem("pacientes")) || [];
let pacienteActivo = null;
];

function mostrarPacientes() {
  let lista = document.getElementById("listaPacientes");
  lista.innerHTML = "";

  pacientes.forEach((paciente, index) => {
    let li = document.createElement("li");
    li.innerText = paciente.nombre + " (" + paciente.edad + " años)";
    li.onclick = () => abrirFichaPaciente(index);
    lista.appendChild(li);
  });
}

function agregarPaciente() {
  let nombre = document.getElementById("nombrePaciente").value;
  let edad = document.getElementById("edadPaciente").value;

  if (!nombre || !edad) {
    alert("Completa todos los campos");
    return;
  }

  let paciente = {
    nombre: nombre,
    edad: edad,
    motivo: "",
    observaciones: ""
  };

  pacientes.push(paciente);
  localStorage.setItem("pacientes", JSON.stringify(pacientes));

  mostrarPacientes();

  document.getElementById("nombrePaciente").value = "";
  document.getElementById("edadPaciente").value = "";
}

function abrirFichaPaciente(index) {
  pacienteActivo = index;
  let paciente = pacientes[index];

  document.getElementById("detallePaciente").innerHTML =
    "<strong>Nombre:</strong> " + paciente.nombre + "<br>" +
    "<strong>Edad:</strong> " + paciente.edad + " años";

  document.getElementById("motivoConsulta").value = paciente.motivo;
  document.getElementById("observaciones").value = paciente.observaciones;

  document.getElementById("fichaPaciente").style.display = "block";
}
function guardarFicha() {
  if (pacienteActivo === null) return;

  pacientes[pacienteActivo].motivo =
    document.getElementById("motivoConsulta").value;

  pacientes[pacienteActivo].observaciones =
    document.getElementById("observaciones").value;

  localStorage.setItem("pacientes", JSON.stringify(pacientes));
  alert("Ficha guardada correctamente");
}
document.addEventListener("DOMContentLoaded", mostrarPacientes);
