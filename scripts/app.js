function saludar() {
  alert("VisualOS IA activo");
}
let pacientes = [
  { nombre: "Juan Pérez", edad: 45 },
  { nombre: "María López", edad: 32 },
  { nombre: "Carlos Hernández", edad: 60 }
];
function mostrarPacientes() {
  let contenedor = document.getElementById("listaPacientes");

  if (!contenedor) return;

  pacientes.forEach(function(paciente) {
    let div = document.createElement("div");
    div.innerHTML = paciente.nombre + " - " + paciente.edad + " años";
    contenedor.appendChild(div);
  });
}

mostrarPacientes();

function nuevoPaciente() {
  alert("Aquí se abrirá el formulario de nuevo paciente");
}
