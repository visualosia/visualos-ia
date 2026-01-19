function saludar() {
  alert("VisualOS IA activo");
}
let pacientes = [
  { nombre: "Juan Pérez", edad: 45 },
  { nombre: "María López", edad: 32 },
  { nombre: "Carlos Hernández", edad: 60 }
];
}
  if (!contenedor) return;

  pacientes.forEach(function(paciente) {
    let div = document.createElement("div");
    div.innerHTML = paciente.nombre + " - " + paciente.edad + " años";
    contenedor.appendChild(div);
  });
}

mostrarPacientes();

function nuevoPaciente() {
  console.log("CLICK NUEVO PACIENTE");
  let form = document.getElementById("formPaciente");
  form.style.display = "block";
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

  document.getElementById("listaPacientes").innerHTML = "";
  mostrarPacientes();

  document.getElementById("formPaciente").style.display = "none";
}
