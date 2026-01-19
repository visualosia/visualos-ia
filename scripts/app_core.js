let pacientes = JSON.parse(localStorage.getItem("pacientes")) || [];
let pacienteActivo = null;

function mostrarPacientes() {
  const lista = document.getElementById("listaPacientes");
  if (!lista) return;

  lista.innerHTML = "";

  pacientes.forEach((p, i) => {
    const div = document.createElement("div");
    div.className = "paciente-item";
    div.textContent = `${p.nombre} (${p.edad} años)`;
    div.onclick = () => abrirFichaPaciente(i);
    lista.appendChild(div);
  });
}

function guardarPaciente() {
  const nombre = document.getElementById("nombrePaciente").value;
  const edad = document.getElementById("edadPaciente").value;

  if (!nombre || !edad) {
    alert("Completa todos los campos");
    return;
  }

  pacientes.push({
    nombre,
    edad,
    historia: {
      motivo: "",
      observaciones: ""
    }
  });

  localStorage.setItem("pacientes", JSON.stringify(pacientes));
  mostrarPacientes();
}

function abrirFichaPaciente(index) {
  pacienteActivo = index;
  const p = pacientes[index];

  document.getElementById("detallePaciente").innerHTML =
    `<strong>${p.nombre}</strong> · ${p.edad} años`;

  document.getElementById("motivoConsulta").value = p.historia.motivo;
  document.getElementById("observaciones").value = p.historia.observaciones;

  document.getElementById("fichaPaciente").style.display = "block";
}

function guardarFicha() {
  if (pacienteActivo === null) return;

  pacientes[pacienteActivo].historia.motivo =
    document.getElementById("motivoConsulta").value;

  pacientes[pacienteActivo].historia.observaciones =
    document.getElementById("observaciones").value;

  localStorage.setItem("pacientes", JSON.stringify(pacientes));
  alert("Ficha guardada");
}

document.addEventListener("DOMContentLoaded", mostrarPacientes);
