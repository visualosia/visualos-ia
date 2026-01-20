class ConfiguracionSystem {
    constructor() {
        this.config = {};
        this.init();
    }

    init() {
        this.cargarConfiguracion();
        this.setupEventListeners();
        this.renderizarConfiguracion();
    }

    cargarConfiguracion() {
        this.config = JSON.parse(localStorage.getItem('configuracionSistema') || '{}');
        
        // Configuración por defecto
        const defaults = {
            tema: 'claro',
            notificaciones: true,
            backupAutomatico: true,
            intervaloBackup: 24,
            formatoFecha: 'DD/MM/YYYY',
            unidades: 'metrico',
            mostrarTutorial: false,
            idioma: 'es',
            moneda: 'MXN',
            impuestos: {
                iva: 16,
                otros: 0
            }
        };
        
        this.config = { ...defaults, ...this.config };
    }

    setupEventListeners() {
        const form = document.getElementById('configForm');
        if (form) {
            form.addEventListener('submit', (e) => this.guardarConfiguracion(e));
        }
        
        // Cambio de tema
        const temaSelect = document.getElementById('tema');
        if (temaSelect) {
            temaSelect.addEventListener('change', (e) => this.cambiarTema(e.target.value));
        }
    }

    renderizarConfiguracion() {
        this.llenarFormulario();
        this.renderizarUsuarios();
        this.renderizarBackups();
    }

    llenarFormulario() {
        Object.keys(this.config).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                if (element.type === 'checkbox') {
                    element.checked = this.config[key];
                } else if (element.type === 'number') {
                    element.value = this.config[key];
                } else {
                    element.value = this.config[key];
                }
            }
        });
    }

    async guardarConfiguracion(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const nuevaConfig = {};
        
        // Recopilar datos del formulario
        formData.forEach((value, key) => {
            if (key === 'iva' || key === 'otrosImpuestos' || key === 'intervaloBackup') {
                nuevaConfig[key] = parseFloat(value);
            } else if (key === 'notificaciones' || key === 'backupAutomatico' || key === 'mostrarTutorial') {
                nuevaConfig[key] = value === 'on';
            } else {
                nuevaConfig[key] = value;
            }
        });
        
        // Guardar configuración
        this.config = { ...this.config, ...nuevaConfig };
        localStorage.setItem('configuracionSistema', JSON.stringify(this.config));
        
        // Aplicar cambios inmediatos
        this.aplicarConfiguracion();
        
        this.mostrarNotificacion('Configuración guardada exitosamente', 'success');
    }

    aplicarConfiguracion() {
        // Aplicar tema
        this.cambiarTema(this.config.tema);
        
        // Aplicar formato de fecha
        this.aplicarFormatoFecha();
        
        // Aplicar idioma
        this.aplicarIdioma();
    }

    cambiarTema(tema) {
        document.body.classList.remove('tema-claro', 'tema-oscuro', 'tema-azul');
        document.body.classList.add(`tema-${tema}`);
        
        // Guardar preferencia
        this.config.tema = tema;
        localStorage.setItem('configuracionSistema', JSON.stringify(this.config));
    }

    aplicarFormatoFecha() {
        // Implementar lógica de formato de fecha
        console.log('Formato de fecha aplicado:', this.config.formatoFecha);
    }

    aplicarIdioma() {
        // Implementar internacionalización
        console.log('Idioma aplicado:', this.config.idioma);
    }

    renderizarUsuarios() {
        const container = document.getElementById('listaUsuarios');
        if (!container) return;

        const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
        const usuariosOptica = usuarios.filter(u => u.opticaId === app.currentOptica?.id);
        
        if (usuariosOptica.length === 0) {
            container.innerHTML = '<p>No hay usuarios registrados</p>';
            return;
        }

        let html = '<div class="usuarios-grid">';
        
        usuariosOptica.forEach(usuario => {
            html += `
                <div class="usuario-card">
                    <div class="usuario-header">
                        <div class="usuario-avatar">
                            ${usuario.nombre.charAt(0).toUpperCase()}
                        </div>
                        <div class="usuario-info">
                            <h5>${usuario.nombre}</h5>
                            <small>${usuario.email}</small>
                        </div>
                    </div>
                    <div class="usuario-details">
                        <span class="badge rol-${usuario.rol}">${usuario.rol}</span>
                        <span>Usuario: ${usuario.username}</span>
                    </div>
                    <div class="usuario-actions">
                        <button class="btn-icon" onclick="editarUsuario(${usuario.id})" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon btn-danger" onclick="eliminarUsuario(${usuario.id})" title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        container.innerHTML = html;
    }

    renderizarBackups() {
        const container = document.getElementById('listaBackups');
        if (!container) return;

        const backups = JSON.parse(localStorage.getItem('backups') || '[]');
        
        if (backups.length === 0) {
            container.innerHTML = '<p>No hay backups disponibles</p>';
            return;
        }

        let html = '<div class="backups-list">';
        
        backups.forEach(backup => {
            const fecha = new Date(backup.fecha).toLocaleString();
            const sizeMB = (backup.size / 1024 / 1024).toFixed(2);
            
            html += `
                <div class="backup-item">
                    <div class="backup-info">
                        <h5>Backup ${backup.id}</h5>
                        <p>${fecha} • ${sizeMB} MB</p>
                        <small>${backup.descripcion || 'Backup automático'}</small>
                    </div>
                    <div class="backup-actions">
                        <button class="btn btn-sm btn-outline" onclick="restaurarBackup('${backup.id}')">
                            <i class="fas fa-undo"></i> Restaurar
                        </button>
                        <button class="btn btn-sm btn-secondary" onclick="descargarBackup('${backup.id}')">
                            <i class="fas fa-download"></i> Descargar
                        </button>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        container.innerHTML = html;
    }

    async crearBackup() {
        try {
            const backupData = {
                pacientes: JSON.parse(localStorage.getItem('pacientes') || '[]'),
                historias: JSON.parse(localStorage.getItem('historiasClinicas') || '[]'),
                mediciones: JSON.parse(localStorage.getItem('facialMeasurements') || '[]'),
                pedidos: JSON.parse(localStorage.getItem('pedidos') || '[]'),
                usuarios: JSON.parse(localStorage.getItem('usuarios') || '[]'),
                configuracion: JSON.parse(localStorage.getItem('configuracionSistema') || '{}')
            };
            
            const backup = {
                id: 'backup-' + Date.now(),
                fecha: new Date().toISOString(),
                data: backupData,
                size: JSON.stringify(backupData).length,
                descripcion: 'Backup manual'
            };
            
            let backups = JSON.parse(localStorage.getItem('backups') || '[]');
            backups.push(backup);
            localStorage.setItem('backups', JSON.stringify(backups));
            
            this.mostrarNotificacion('Backup creado exitosamente', 'success');
            this.renderizarBackups();
            
            return backup;
        } catch (error) {
            this.mostrarNotificacion('Error creando backup', 'error');
            console.error(error);
        }
    }

    restaurarBackup(backupId) {
        if (!confirm('¿Está seguro de restaurar este backup? Se perderán los datos actuales.')) {
            return;
        }
        
        const backups = JSON.parse(localStorage.getItem('backups') || '[]');
        const backup = backups.find(b => b.id === backupId);
        
        if (!backup) {
            this.mostrarNotificacion('Backup no encontrado', 'error');
            return;
        }
        
        // Restaurar datos
        localStorage.setItem('pacientes', JSON.stringify(backup.data.pacientes));
        localStorage.setItem('historiasClinicas', JSON.stringify(backup.data.historias));
        localStorage.setItem('facialMeasurements', JSON.stringify(backup.data.mediciones));
        localStorage.setItem('pedidos', JSON.stringify(backup.data.pedidos));
        localStorage.setItem('usuarios', JSON.stringify(backup.data.usuarios));
        localStorage.setItem('configuracionSistema', JSON.stringify(backup.data.configuracion));
        
        this.mostrarNotificacion('Backup restaurado exitosamente. La página se recargará.', 'success');
        
        setTimeout(() => {
            location.reload();
        }, 2000);
    }

    exportarDatos() {
        const data = {
            pacientes: JSON.parse(localStorage.getItem('pacientes') || '[]'),
            historias: JSON.parse(localStorage.getItem('historiasClinicas') || '[]'),
            pedidos: JSON.parse(localStorage.getItem('pedidos') || '[]'),
            fechaExportacion: new Date().toISOString(),
            version: '1.0',
            optica: app.currentOptica
        };
        
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `visualos-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
        
        this.mostrarNotificacion('Datos exportados exitosamente', 'success');
    }

    importarDatos(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                if (!confirm(`¿Importar ${data.pacientes?.length || 0} pacientes y ${data.pedidos?.length || 0} pedidos?`)) {
                    return;
                }
                
                // Fusionar datos
                if (data.pacientes) {
                    const pacientesActuales = JSON.parse(localStorage.getItem('pacientes') || '[]');
                    const nuevosPacientes = data.pacientes.filter(np => 
                        !pacientesActuales.some(pa => pa.id === np.id)
                    );
                    localStorage.setItem('pacientes', JSON.stringify([...pacientesActuales, ...nuevosPacientes]));
                }
                
                if (data.pedidos) {
                    const pedidosActuales = JSON.parse(localStorage.getItem('pedidos') || '[]');
                    const nuevosPedidos = data.pedidos.filter(np => 
                        !pedidosActuales.some(pa => pa.id === np.id)
                    );
                    localStorage.setItem('pedidos', JSON.stringify([...pedidosActuales, ...nuevosPedidos]));
                }
                
                this.mostrarNotificacion('Datos importados exitosamente', 'success');
                location.reload();
            } catch (error) {
                this.mostrarNotificacion('Error importando datos: Archivo inválido', 'error');
            }
        };
        
        reader.readAsText(file);
    }

    mostrarNotificacion(mensaje, tipo) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${tipo}`;
        notification.innerHTML = `
            <i class="fas fa-${tipo === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
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

// Inicializar sistema de configuración
const configSystem = new ConfiguracionSystem();
window.configSystem = configSystem;

// Funciones globales
function crearBackup() {
    configSystem.crearBackup();
}

function exportarDatos() {
    configSystem.exportarDatos();
}

function importarDatos() {
    document.getElementById('importFile').click();
}

function seleccionarImport() {
    document.getElementById('importFile').click();
}
