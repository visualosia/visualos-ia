class MockAPI {
    constructor() {
        this.endpoints = {
            login: '/api/auth/login',
            register: '/api/auth/register',
            pacientes: '/api/pacientes',
            historiaClinica: '/api/historia-clinica',
            mediciones: '/api/mediciones',
            productos: '/api/productos',
            pedidos: '/api/pedidos',
            estadisticas: '/api/estadisticas'
        };
    }

    async request(endpoint, method = 'GET', data = null) {
        // Simular delay de red
        await this.simulateNetworkDelay();
        
        switch (endpoint) {
            case this.endpoints.login:
                return this.handleLogin(data);
            case this.endpoints.register:
                return this.handleRegister(data);
            case this.endpoints.pacientes:
                return this.handlePacientes(method, data);
            case this.endpoints.historiaClinica:
                return this.handleHistoriaClinica(method, data);
            default:
                return { success: false, message: 'Endpoint no encontrado' };
        }
    }

    async simulateNetworkDelay() {
        return new Promise(resolve => setTimeout(resolve, 500));
    }

    handleLogin(data) {
        // Validar credenciales
        const users = JSON.parse(localStorage.getItem('usuarios') || '[]');
        const user = users.find(u => 
            u.username === data.username && 
            u.password === data.password
        );

        if (user) {
            return {
                success: true,
                token: 'mock-jwt-token-' + Date.now(),
                user: {
                    id: user.id,
                    nombre: user.nombre,
                    email: user.email,
                    rol: user.rol,
                    opticaId: user.opticaId
                },
                optica: JSON.parse(localStorage.getItem('opticas')).find(o => o.id === user.opticaId)
            };
        }

        return {
            success: false,
            message: 'Credenciales incorrectas'
        };
    }

    handleRegister(data) {
        // Generar IDs únicos
        const opticaId = Date.now();
        const userId = Date.now() + 1;

        // Guardar óptica
        const opticas = JSON.parse(localStorage.getItem('opticas') || '[]');
        const nuevaOptica = {
            id: opticaId,
            nombre: data.opticaNombre,
            direccion: data.opticaDireccion,
            telefono: data.opticaTelefono,
            email: data.opticaEmail,
            fechaRegistro: new Date().toISOString()
        };
        opticas.push(nuevaOptica);
        localStorage.setItem('opticas', JSON.stringify(opticas));

        // Guardar usuario admin
        const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
        const nuevoUsuario = {
            id: userId,
            username: data.username,
            password: data.password,
            nombre: data.nombre,
            email: data.email,
            rol: 'admin',
            opticaId: opticaId
        };
        usuarios.push(nuevoUsuario);
        localStorage.setItem('usuarios', JSON.stringify(usuarios));

        return {
            success: true,
            message: 'Óptica registrada exitosamente',
            optica: nuevaOptica,
            user: nuevoUsuario
        };
    }

    handlePacientes(method, data) {
        let pacientes = JSON.parse(localStorage.getItem('pacientes') || '[]');
        
        switch (method) {
            case 'GET':
                return { success: true, data: pacientes };
            
            case 'POST':
                const nuevoPaciente = {
                    ...data,
                    id: Date.now(),
                    fechaCreacion: new Date().toISOString()
                };
                pacientes.push(nuevoPaciente);
                localStorage.setItem('pacientes', JSON.stringify(pacientes));
                return { success: true, data: nuevoPaciente };
            
            case 'PUT':
                pacientes = pacientes.map(p => 
                    p.id === data.id ? { ...p, ...data } : p
                );
                localStorage.setItem('pacientes', JSON.stringify(pacientes));
                return { success: true, data };
            
            case 'DELETE':
                pacientes = pacientes.filter(p => p.id !== data.id);
                localStorage.setItem('pacientes', JSON.stringify(pacientes));
                return { success: true, message: 'Paciente eliminado' };
        }
    }

    handleHistoriaClinica(method, data) {
        let historias = JSON.parse(localStorage.getItem('historiasClinicas') || '[]');
        
        switch (method) {
            case 'GET':
                const historia = historias.find(h => h.pacienteId === data.pacienteId);
                return { success: true, data: historia || null };
            
            case 'POST':
            case 'PUT':
                const index = historias.findIndex(h => h.pacienteId === data.pacienteId);
                
                if (index !== -1) {
                    historias[index] = { ...historias[index], ...data };
                } else {
                    historias.push({
                        ...data,
                        id: Date.now(),
                        fechaActualizacion: new Date().toISOString()
                    });
                }
                
                localStorage.setItem('historiasClinicas', JSON.stringify(historias));
                return { success: true, data };
        }
    }
}

const api = new MockAPI();
window.api = api;
