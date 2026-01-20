class DashboardSystem {
    constructor() {
        this.stats = {};
        this.init();
    }

    init() {
        this.cargarDatos();
        this.calcularEstadisticas();
        this.renderizarDashboard();
        this.setupEventListeners();
    }

    cargarDatos() {
        this.pacientes = JSON.parse(localStorage.getItem('pacientes') || '[]');
        this.historias = JSON.parse(localStorage.getItem('historiasClinicas') || '[]');
        this.pedidos = JSON.parse(localStorage.getItem('pedidos') || '[]');
        this.mediciones = JSON.parse(localStorage.getItem('facialMeasurements') || '[]');
    }

    calcularEstadisticas() {
        const pacientesOptica = this.pacientes.filter(p => 
            p.opticaId === app.currentOptica?.id
        );
        
        const hoy = new Date();
        const unMesAtras = new Date(hoy);
        unMesAtras.setMonth(hoy.getMonth() - 1);
        
        // Pacientes del mes
        const pacientesMes = pacientesOptica.filter(p => {
            const fecha = new Date(p.fechaCreacion);
            return fecha >= unMesAtras;
        });
        
        // Edad promedio
        const edades = pacientesOptica.map(p => parseInt(p.edad) || 0).filter(edad => edad > 0);
        const edadPromedio = edades.length > 0 ? 
            Math.round(edades.reduce((a, b) => a + b, 0) / edades.length) : 0;
        
        // Diagnósticos comunes
        const diagnosticos = {};
        pacientesOptica.forEach(p => {
            const diag = p.diagnostico || 'Sin diagnóstico';
            diagnosticos[diag] = (diagnosticos[diag] || 0) + 1;
        });
        
        // Ventas del mes
        const ventasMes = this.pedidos.filter(p => {
            const fecha = new Date(p.fecha);
            return fecha >= unMesAtras && p.optica?.id === app.currentOptica?.id;
        }).reduce((total, pedido) => total + (pedido.total || 0), 0);
        
        this.stats = {
            totalPacientes: pacientesOptica.length,
            pacientesMes: pacientesMes.length,
            edadPromedio: edadPromedio,
            diagnosticos: diagnosticos,
            ventasMes: ventasMes,
            medicionesRealizadas: this.mediciones.length,
            historiasCompletas: this.historias.length
        };
    }

    renderizarDashboard() {
        this.renderizarStats();
        this.renderizarGraficos();
        this.renderizarActividadReciente();
    }

    renderizarStats() {
        const statsContainer = document.getElementById('statsGrid');
        if (!statsContainer) return;

        statsContainer.innerHTML = `
            <div class="stat-card">
                <div class="stat-icon" style="background: linear-gradient(135deg, #1f3c88, #2a4da3);">
                    <i class="fas fa-users"></i>
                </div>
                <div class="stat-info">
                    <h3>${this.stats.totalPacientes}</h3>
                    <p>Pacientes Totales</p>
                </div>
                <div class="stat-trend">
                    <span class="trend-up">+${this.stats.pacientesMes} este mes</span>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon" style="background: linear-gradient(135deg, #ff7b25, #ffa65e);">
                    <i class="fas fa-chart-line"></i>
                </div>
                <div class="stat-info">
                    <h3>$${this.stats.ventasMes.toFixed(2)}</h3>
                    <p>Ventas del Mes</p>
                </div>
                <div class="stat-trend">
                    <span class="trend-up">+15% vs mes anterior</span>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon" style="background: linear-gradient(135deg, #28a745, #20c997);">
                    <i class="fas fa-stethoscope"></i>
                </div>
                <div class="stat-info">
                    <h3>${this.stats.historiasCompletas}</h3>
                    <p>Historias Clínicas</p>
                </div>
                <div class="stat-trend">
                    <span class="trend-up">${Math.round((this.stats.historiasCompletas / this.stats.totalPacientes) * 100)}% completas</span>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon" style="background: linear-gradient(135deg, #6f42c1, #a370f7);">
                    <i class="fas fa-ruler-combined"></i>
                </div>
                <div class="stat-info">
                    <h3>${this.stats.medicionesRealizadas}</h3>
                    <p>Mediciones</p>
                </div>
                <div class="stat-trend">
                    <span class="trend-up">+${Math.round(this.stats.medicionesRealizadas / 30)} diarias</span>
                </div>
            </div>
        `;
    }

    renderizarGraficos() {
        this.renderizarGraficoDiagnosticos();
        this.renderizarGraficoEdades();
    }

    renderizarGraficoDiagnosticos() {
        const container = document.getElementById('chartDiagnosticos');
        if (!container || !this.stats.diagnosticos) return;

        const diagnosticos = Object.entries(this.stats.diagnosticos)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);
        
        if (diagnosticos.length === 0) {
            container.innerHTML = '<p class="text-center">No hay datos de diagnósticos</p>';
            return;
        }

        let html = '<h4>Diagnósticos Más Comunes</h4><div class="chart-bars">';
        
        diagnosticos.forEach(([diagnostico, cantidad]) => {
            const porcentaje = (cantidad / this.stats.totalPacientes) * 100;
            html += `
                <div class="chart-bar">
                    <div class="bar-label">${diagnostico}</div>
                    <div class="bar-container">
                        <div class="bar-fill" style="width: ${porcentaje}%"></div>
                    </div>
                    <div class="bar-value">${cantidad}</div>
                </div>
            `;
        });
        
        html += '</div>';
        container.innerHTML = html;
    }

    renderizarGraficoEdades() {
        const container = document.getElementById('chartEdades');
        if (!container) return;

        const pacientes = this.pacientes.filter(p => p.opticaId === app.currentOptica?.id);
        const gruposEdad = {
            '0-18': 0,
            '19-35': 0,
            '36-50': 0,
            '51-65': 0,
            '66+': 0
        };

        pacientes.forEach(paciente => {
            const edad = parseInt(paciente.edad);
            if (isNaN(edad)) return;

            if (edad <= 18) gruposEdad['0-18']++;
            else if (edad <= 35) gruposEdad['19-35']++;
            else if (edad <= 50) gruposEdad['36-50']++;
            else if (edad <= 65) gruposEdad['51-65']++;
            else gruposEdad['66+']++;
        });

        let html = '<h4>Distribución por Edad</h4><div class="chart-circles">';
        
        Object.entries(gruposEdad).forEach(([grupo, cantidad]) => {
            const porcentaje = pacientes.length > 0 ? (cantidad / pacientes.length) * 100 : 0;
            html += `
                <div class="circle-item">
                    <div class="circle-chart">
                        <svg width="60" height="60" viewBox="0 0 36 36">
                            <path d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="#e1e5eb"
                                stroke-width="3"/>
                            <path d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="#1f3c88"
                                stroke-width="3"
                                stroke-dasharray="${porcentaje}, 100"/>
                        </svg>
                        <span class="circle-value">${Math.round(porcentaje)}%</span>
                    </div>
                    <div class="circle-label">${grupo}</div>
                    <div class="circle-count">${cantidad}</div>
                </div>
            `;
        });
        
        html += '</div>';
        container.innerHTML = html;
    }

    renderizarActividadReciente() {
        const container = document.getElementById('actividadReciente');
        if (!container) return;

        // Combinar actividades de diferentes fuentes
        const actividades = [];
        
        // Pacientes recientes
        const pacientesRecientes = this.pacientes
            .filter(p => p.opticaId === app.currentOptica?.id)
            .sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion))
            .slice(0, 3)
            .map(p => ({
                tipo: 'paciente',
                icono: 'fas fa-user-plus',
                color: 'var(--primary-blue)',
                texto: `Nuevo paciente: ${p.nombre}`,
                fecha: p.fechaCreacion
            }));
        
        actividades.push(...pacientesRecientes);
        
        // Mediciones recientes
        const medicionesRecientes = this.mediciones
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, 2)
            .map(m => ({
                tipo: 'medicion',
                icono: 'fas fa-ruler-combined',
                color: 'var(--accent-orange)',
                texto: `Medición realizada: ${m.type}`,
                fecha: m.timestamp
            }));
        
        actividades.push(...medicionesRecientes);
        
        // Ordenar por fecha
        actividades.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        
        if (actividades.length === 0) {
            container.innerHTML = '<p class="text-center">No hay actividad reciente</p>';
            return;
        }

        let html = '<h4>Actividad Reciente</h4><div class="activity-list">';
        
        actividades.slice(0, 5).forEach(actividad => {
            const fecha = new Date(actividad.fecha).toLocaleString();
            html += `
                <div class="activity-item">
                    <div class="activity-icon" style="background-color: ${actividad.color}">
                        <i class="${actividad.icono}"></i>
                    </div>
                    <div class="activity-content">
                        <p>${actividad.texto}</p>
                        <small>${fecha}</small>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        container.innerHTML = html;
    }

    setupEventListeners() {
        // Botón de actualizar dashboard
        const btnActualizar = document.getElementById('actualizarDashboard');
        if (btnActualizar) {
            btnActualizar.addEventListener('click', () => {
                this.init();
                this.mostrarNotificacion('Dashboard actualizado', 'success');
            });
        }
    }

    mostrarNotificacion(mensaje, tipo) {
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

// Inicializar dashboard
const dashboard = new DashboardSystem();
window.dashboard = dashboard;
