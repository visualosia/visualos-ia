class AuthSystem {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadOpticas();
    }

    setupEventListeners() {
        // Formulario de login
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Formulario de registro
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }
    }

    loadOpticas() {
        const select = document.getElementById('opticName');
        if (!select) return;

        const opticas = JSON.parse(localStorage.getItem('opticas') || '[]');
        
        select.innerHTML = '<option value="">Seleccione su óptica</option>';
        opticas.forEach(optica => {
            const option = document.createElement('option');
            option.value = optica.id;
            option.textContent = `${optica.nombre} - ${optica.direccion}`;
            select.appendChild(option);
        });
    }

    async handleLogin(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const data = {
            username: formData.get('username'),
            password: formData.get('password'),
            opticaId: formData.get('opticName')
        };

        // Validaciones
        if (!data.username || !data.password || !data.opticaId) {
            this.showError('Por favor complete todos los campos');
            return;
        }

        const btn = e.target.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verificando...';
        btn.disabled = true;

        try {
            const response = await api.request(api.endpoints.login, 'POST', data);
            
            if (response.success) {
                // Guardar sesión
                localStorage.setItem('authToken', response.token);
                localStorage.setItem('userData', JSON.stringify(response.user));
                localStorage.setItem('opticaData', JSON.stringify(response.optica));
                
                // Redirigir al dashboard
                window.location.href = 'pages/dashboard.html';
            } else {
                this.showError(response.message);
            }
        } catch (error) {
            this.showError('Error de conexión. Intente nuevamente.');
        } finally {
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const data = {
            opticaNombre: formData.get('opticaNombre'),
            opticaDireccion: formData.get('opticaDireccion'),
            opticaTelefono: formData.get('opticaTelefono'),
            opticaEmail: formData.get('opticaEmail'),
            username: formData.get('username'),
            password: formData.get('password'),
            confirmPassword: formData.get('confirmPassword'),
            nombre: formData.get('nombre'),
            email: formData.get('email')
        };

        // Validaciones
        if (data.password !== data.confirmPassword) {
            this.showError('Las contraseñas no coinciden');
            return;
        }

        if (data.password.length < 6) {
            this.showError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        const btn = e.target.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registrando...';
        btn.disabled = true;

        try {
            const response = await api.request(api.endpoints.register, 'POST', data);
            
            if (response.success) {
                this.showSuccess('Óptica registrada exitosamente');
                
                // Auto-login después de registro
                setTimeout(() => {
                    localStorage.setItem('authToken', 'mock-token-' + Date.now());
                    localStorage.setItem('userData', JSON.stringify(response.user));
                    localStorage.setItem('opticaData', JSON.stringify(response.optica));
                    window.location.href = 'pages/dashboard.html';
                }, 2000);
            } else {
                this.showError(response.message);
            }
        } catch (error) {
            this.showError('Error en el registro. Intente nuevamente.');
        } finally {
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
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
        }, 5000);
    }

    togglePassword() {
        const passwordInput = document.getElementById('password');
        const toggleBtn = document.querySelector('.toggle-password i');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            toggleBtn.className = 'fas fa-eye-slash';
        } else {
            passwordInput.type = 'password';
            toggleBtn.className = 'fas fa-eye';
        }
    }
}

// Inicializar sistema de autenticación
const authSystem = new AuthSystem();
window.authSystem = authSystem;
