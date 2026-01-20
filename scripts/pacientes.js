// Sistema completo de gestión de pacientes
class SistemaPacientes {
    constructor() {
        this.pacienteActual = null;
        this.init();
    }

    init() {
        this.cargarPacientes();
        this.setupEventListeners();
        this.renderizarListaPacientes();
    }

    cargarPacientes() {
        const pacientesData = localStorage.getItem('pacientes');
        this.pacientes = pacientesData ? JSON.parse(pacientesData) : [];
    }

    setupEventListeners() {
        // Buscador de pacientes
        const buscador = document.getElementById('buscadorPacientes');
        if (buscador) {
            buscador.addEventListener('input', (e) => {
                this.buscarPacientes(e.target.value);
            });
        }

        // Filtros
        document.querySelectorAll('.filtro-paciente').forEach(filtro => {
            filtro.addEventListener('change', (e) => {
                this.aplicarFiltros();
            });
        });

        // Exportar datos
        const btnExportar = document.getElementById('btnExportar');
        if (btnExportar) {
            btnExportar.addEventListener('click', () => this.exportarPacientes());
        }
    }

    renderizarListaPacientes() {
        const lista = document.getElementById('listaPacientes');
        if (!lista) return;

        const pacientesOptica = app.obtenerPacientesPorOptica();
        
        if (pacientesOptica.length === 0) {
            lista.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-users"></i>
                    <h3>No hay pacientes registrados</h3>
                    <p>Comienza agregando tu primer paciente</p>
                    <button onclick="mostrarFormularioPaciente()" class="btn btn-primary">
                        <i class="fas fa-plus"></i> Nuevo Paciente
                    </button>
                </div>
            `;
            return;
        }

        let html = `
            <div class="pacientes-header">
                <h3>Pacientes (${pacientesOptica.length})</h3>
                <div class="pacientes-actions">
                    <input type="text" id="buscadorPacientes" placeholder="Buscar pacientes..." class="form-control">
                    <button onclick="mostrarFormularioPaciente()" class="btn btn-primary">
                        <i class="fas fa-plus"></i> Nuevo
                    </button>
                </div>
            </div>
            <div class="pacientes-grid">
        `;

        pacientesOptica.forEach(paciente => {
            html += this.crearTarjetaPaciente(paciente);
        });

        html += '</div>';
        lista.innerHTML = html;
    }

    crearTarjetaPaciente(paciente) {
        const fecha = new Date(paciente.fechaCreacion).toLocaleDateString();
        const edad = paciente.edad || 'N/A';
        const diagnostico = paciente.diagnostico || 'Sin diagnóstico';
        
        return `
            <div class="tarjeta-paciente" onclick="abrirHistoriaClinica(${paciente.id})">
                <div class="tarjeta-header">
                    <div class="avatar-paciente" style="background-color: ${this.generarColor(paciente.nombre)}">
                        ${paciente.nombre.charAt(0).toUpperCase()}
                    </div>
                    <div class="paciente-info">
                        <h4>${paciente.nombre}</h4>
                        <p><i class="fas fa-birthday-cake"></i> ${edad} años</p>
                    </div>
                    <div class="paciente-acciones">
                        <button onclick="event.stopPropagation(); editarPaciente(${paciente.id})" 
                                class="btn-icon" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="event.stopPropagation(); eliminarPaciente(${paciente.id})" 
                                class="btn-icon btn-danger" title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="tarjeta-body">
                    <div class="paciente-detalle">
                        <span><i class="fas fa-stethoscope"></i> ${diagnostico}</span>
                        <span><i class="fas fa-calendar"></i> ${fecha}</span>
                    </div>
                    <div class="paciente-tags">
                        ${this.generarTags(paciente)}
                    </div>
                </div>
            </div>
        `;
    }

    generarColor(nombre) {
        const colores = [
            '#1f3c88', '#2a4da3', '#ff7b25', '#28a745', '#17a2b8',
            '#6f42c1', '#e83e8c', '#fd7e14', '#20c997'
        ];
        const index = nombre.charCodeAt(0) % colores.length;
        return colores[index];
    }

    generarTags(paciente) {
        const tags = [];
        if (paciente.urgente) tags.push('<span class="tag tag-urgente">Urgente</span>');
        if (paciente.recetaActiva) tags.push('<span class="tag tag-receta">Receta Activa</span>');
        if (paciente.proximoControl) tags.push('<span class="tag tag-control">Control Pendiente</span>');
        return tags.join('');
    }

    buscarPacientes(termino) {
        const pacientesOptica = app.obtenerPacientesPorOptica();
        const filtrados = pacientesOptica.filter(paciente => {
            return paciente.nombre.toLowerCase().includes(termino.toLowerCase()) ||
                   (paciente.cedula && paciente.cedula.includes(termino)) ||
                   (paciente.telefono && paciente.telefono.includes(termino));
        });
        
        this.renderizarPacientesFiltrados(filtrados);
    }

    renderizarPacientesFiltrados(pacientes) {
        const container = document.querySelector('.pacientes-grid');
        if (!container) return;

        if (pacientes.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-search"></i>
                    <h3>No se encontraron pacientes</h3>
                    <p>Intenta con otro término de búsqueda</p>
                </div>
            `;
            return;
        }

        container.innerHTML = pacientes.map(p => this.crearTarjetaPaciente(p)).join('');
    }

    aplicarFiltros() {
        // Implementar filtros avanzados
        console.log('Aplicando filtros...');
    }

    exportarPacientes() {
        const pacientesOptica = app.obtenerPacientesPorOptica();
        const csv = this.convertirACSV(pacientesOptica);
        this.descargarArchivo(csv, 'pacientes_export.csv', 'text/csv');
    }

    convertirACSV(pacientes) {
        const headers = ['Nombre', 'Edad', 'Cédula', 'Teléfono', 'Diagnóstico', 'Fecha Creación'];
        const rows = pacientes.map(p => [
            `"${p.nombre}"`,
            p.edad,
            p.cedula || '',
            p.telefono || '',
            `"${p.diagnostico || ''}"`,
            new Date(p.fechaCreacion).toLocaleDateString()
        ]);
        
        return [headers, ...rows].map(row => row.join(',')).join('\n');
    }

    descargarArchivo(content, filename, contentType) {
        const blob = new Blob([content], { type: contentType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }

    // Funciones públicas
    mostrarFormularioPaciente(paciente = null) {
        this.pacienteActual = paciente;
        const modal = document.getElementById('modalPaciente');
        if (!modal) return;

        if (paciente) {
            // Modo edición
            document.getElementById('modalTitle').textContent = 'Editar Paciente';
            document.getElementById('pacienteId').value = paciente.id;
            document.getElementById('nombrePaciente').value = paciente.nombre;
            document.getElementById('edadPaciente').value = paciente.edad;
            document.getElementById('cedulaPaciente').value = paciente.cedula || '';
            document.getElementById('telefonoPaciente').value = paciente.telefono || '';
            document.getElementById('emailPaciente').value = paciente.email || '';
            document.getElementById('direccionPaciente').value = paciente.direccion || '';
        } else {
            // Modo nuevo
            document.getElementById('modalTitle').textContent = 'Nuevo Paciente';
            document.getElementById('formPaciente').reset();
        }

        modal.style.display = 'block';
    }

    guardarPaciente(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const pacienteData = {
            nombre: formData.get('nombre'),
            edad: formData.get('edad'),
            cedula: formData.get('cedula'),
            telefono: formData.get('telefono'),
            email: formData.get('email'),
            direccion: formData.get('direccion')
        };

        const pacienteId = formData.get('pacienteId');
        
        if (pacienteId) {
            // Actualizar paciente existente
            app.actualizarPaciente(parseInt(pacienteId), pacienteData);
            this.mostrarNotificacion('Paciente actualizado correctamente', 'success');
        } else {
            // Crear nuevo paciente
            app.agregarPaciente(pacienteData);
            this.mostrarNotificacion('Paciente agregado correctamente', 'success');
        }

        this.cerrarModal();
        this.renderizarListaPacientes();
    }

    eliminarPaciente(id) {
        if (confirm('¿Estás seguro de eliminar este paciente? Esta acción no se puede deshacer.')) {
            app.eliminarPaciente(id);
            this.renderizarListaPacientes();
            this.mostrarNotificacion('Paciente eliminado', 'warning');
        }
    }

    abrirHistoriaClinica(id) {
        window.location.href = `historia-clinica.html?id=${id}`;
    }

    cerrarModal() {
        const modal = document.getElementById('modalPaciente');
        if (modal) modal.style.display = 'none';
    }

    mostrarNotificacion(mensaje, tipo = 'info') {
        // Implementar sistema de notificaciones
        const notification = document.createElement('div');
        notification.className = `notification notification-${tipo}`;
        notification.innerHTML = `
            <i class="fas fa-${tipo === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${mensaje}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Inicializar sistema de pacientes
const sistemaPacientes = new SistemaPacientes();
window.sistemaPacientes = sistemaPacientes;

// Funciones globales
function mostrarFormularioPaciente(paciente = null) {
    sistemaPacientes.mostrarFormularioPaciente(paciente);
}

function editarPaciente(id) {
    const paciente = app.obtenerPaciente(id);
    if (paciente) {
        sistemaPacientes.mostrarFormularioPaciente(paciente);
    }
}

function eliminarPaciente(id) {
    sistemaPacientes.eliminarPaciente(id);
}

function abrirHistoriaClinica(id) {
    sistemaPacientes.abrirHistoriaClinica(id);
}

// Cerrar modal al hacer clic fuera
window.onclick = function(event) {
    const modal = document.getElementById('modalPaciente');
    if (modal && event.target === modal) {
        sistemaPacientes.cerrarModal();
    }
};
