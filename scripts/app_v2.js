alert("JS cargado correctamente");
let pacientes = JSON.parse(localStorage.getItem("pacientes")) || [];
let pacienteActivo = null;


document.addEventListener("DOMContentLoaded", mostrarPacientes);


function mostrarPacientes() {
  const lista = document.getElementById("listaPacientes");
  if (!lista) return;

  lista.innerHTML = "";

  pacientes.forEach((paciente, index) => {
    const li = document.createElement("li");
    li.textContent = `${paciente.nombre} (${paciente.edad} años)`;
    li.onclick = () => abrirFichaPaciente(index);
    lista.appendChild(li);
  });
}

function agregarPaciente() {
  const nombre = document.getElementById("nombrePaciente").value;
  const edad = document.getElementById("edadPaciente").value;

  if (!nombre || !edad) {
    alert("Completa todos los campos");
    return;
  }

  const paciente = {
    nombre,
    edad,
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
  const paciente = pacientes[index];

  document.getElementById("detallePaciente").innerHTML =
    `<strong>Nombre:</strong> ${paciente.nombre}<br>
     <strong>Edad:</strong> ${paciente.edad} años`;

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
