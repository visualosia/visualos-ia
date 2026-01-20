// Módulo principal de la aplicación VisualOS IA
class VisualOS {
    constructor() {
        this.currentUser = null;
        this.currentOptica = null;
        this.pacientes = [];
        this.init();
    }

    init() {
        this.checkAuth();
        this.loadData();
        this.setupEventListeners();
    }

    checkAuth() {
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('userData');
        
        if (token && userData) {
            this.currentUser = JSON.parse(userData);
            this.currentOptica = JSON.parse(localStorage.getItem('opticaData'));
            this.redirectToDashboard();
        }
    }

    redirectToDashboard() {
        if (window.location.pathname.includes('login.html') || 
            window.location.pathname === '/') {
            window.location.href = 'pages/dashboard.html';
        }
    }

    loadData() {
        // Cargar datos del localStorage
        const pacientesData = localStorage.getItem('pacientes');
        if (pacientesData) {
            this.pacientes = JSON.parse(pacientesData);
        }
    }

    setupEventListeners() {
        // Eventos globales
        document.addEventListener('DOMContentLoaded', () => {
            this.updateUI();
        });
    }

    updateUI() {
        // Actualizar interfaz según estado de autenticación
        const authButtons = document.querySelector('.auth-buttons');
        if (authButtons && this.currentUser) {
            authButtons.innerHTML = `
                <div class="user-menu">
                    <span>${this.currentUser.nombre}</span>
                    <button onclick="app.logout()" class="btn btn-outline">Cerrar Sesión</button>
                </div>
            `;
        }
    }

    async login(username, password, opticaId) {
        try {
            // Simulación de API
            const response = await this.mockLoginAPI(username, password, opticaId);
            
            if (response.success) {
                this.currentUser = response.user;
                this.currentOptica = response.optica;
                
                // Guardar en localStorage
                localStorage.setItem('authToken', response.token);
                localStorage.setItem('userData', JSON.stringify(response.user));
                localStorage.setItem('opticaData', JSON.stringify(response.optica));
                
                // Redirigir al dashboard
                window.location.href = 'pages/dashboard.html';
                
                return { success: true };
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            console.error('Error en login:', error);
            return { success: false, message: error.message };
        }
    }

    async mockLoginAPI(username, password, opticaId) {
        // Simulación de respuesta del servidor
        return new Promise((resolve) => {
            setTimeout(() => {
                // Validación básica
                if (username && password && opticaId) {
                    resolve({
                        success: true,
                        token: 'mock-jwt-token-' + Date.now(),
                        user: {
                            id: 1,
                            nombre: username,
                            email: username + '@optica.com',
                            rol: 'admin',
                            opticaId: opticaId
                        },
                        optica: {
                            id: opticaId,
                            nombre: 'Óptica ' + opticaId,
                            direccion: 'Dirección de muestra',
                            telefono: '+1234567890'
                        }
                    });
                } else {
                    resolve({
                        success: false,
                        message: 'Credenciales inválidas'
                    });
                }
            }, 1000);
        });
    }

    logout() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        localStorage.removeItem('opticaData');
        this.currentUser = null;
        this.currentOptica = null;
        window.location.href = '../index.html';
    }

    // Métodos para manejar pacientes
    agregarPaciente(paciente) {
        paciente.id = Date.now(); // ID único
        paciente.fechaCreacion = new Date().toISOString();
        paciente.opticaId = this.currentOptica?.id;
        paciente.usuarioId = this.currentUser?.id;
        
        this.pacientes.push(paciente);
        this.guardarPacientes();
        return paciente;
    }

    actualizarPaciente(id, datos) {
        const index = this.pacientes.findIndex(p => p.id === id);
        if (index !== -1) {
            this.pacientes[index] = { ...this.pacientes[index], ...datos };
            this.guardarPacientes();
            return true;
        }
        return false;
    }

    eliminarPaciente(id) {
        this.pacientes = this.pacientes.filter(p => p.id !== id);
        this.guardarPacientes();
    }

    obtenerPaciente(id) {
        return this.pacientes.find(p => p.id === id);
    }

    obtenerPacientesPorOptica() {
        if (!this.currentOptica) return [];
        return this.pacientes.filter(p => p.opticaId === this.currentOptica.id);
    }

    guardarPacientes() {
        localStorage.setItem('pacientes', JSON.stringify(this.pacientes));
    }

    // Estadísticas
    obtenerEstadisticas() {
        const pacientesOptica = this.obtenerPacientesPorOptica();
        
        return {
            totalPacientes: pacientesOptica.length,
            pacientesUltimoMes: this.calcularPacientesUltimoMes(),
            promedioEdad: this.calcularPromedioEdad(),
            distribucionDiagnosticos: this.obtenerDistribucionDiagnosticos(),
            ingresosTotales: this.calcularIngresosTotales()
        };
    }

    calcularPacientesUltimoMes() {
        const unMesAtras = new Date();
        unMesAtras.setMonth(unMesAtras.getMonth() - 1);
        
        return this.obtenerPacientesPorOptica().filter(p => {
            const fecha = new Date(p.fechaCreacion);
            return fecha > unMesAtras;
        }).length;
    }

    calcularPromedioEdad() {
        const pacientes = this.obtenerPacientesPorOptica();
        if (pacientes.length === 0) return 0;
        
        const sumaEdades = pacientes.reduce((sum, p) => sum + (parseInt(p.edad) || 0), 0);
        return Math.round(sumaEdades / pacientes.length);
    }

    obtenerDistribucionDiagnosticos() {
        const pacientes = this.obtenerPacientesPorOptica();
        const distribucion = {};
        
        pacientes.forEach(p => {
            const diagnostico = p.diagnostico || 'Sin diagnóstico';
            distribucion[diagnostico] = (distribucion[diagnostico] || 0) + 1;
        });
        
        return distribucion;
    }

    calcularIngresosTotales() {
        const pacientes = this.obtenerPacientesPorOptica();
        return pacientes.reduce((total, p) => total + (parseFloat(p.montoTotal) || 0), 0);
    }
}

// Inicializar aplicación global
const app = new VisualOS();
window.app = app;

// Exportar para módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { VisualOS };
}
