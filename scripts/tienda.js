// Sistema de Tienda Online para VisualOS IA
class TiendaOnline {
    constructor() {
        this.productos = [];
        this.carrito = [];
        this.categorias = ['lentes-sol', 'lentes-graduacion', 'armazones', 'accesorios'];
        this.init();
    }

    init() {
        this.cargarProductos();
        this.cargarCarrito();
        this.setupEventListeners();
    }

    cargarProductos() {
        // Productos de ejemplo
        this.productos = [
            {
                id: 1,
                nombre: 'Lentes de Sol Aviador',
                categoria: 'lentes-sol',
                precio: 149.99,
                descripcion: 'Lentes de sol clásicos estilo aviador con protección UV400',
                imagen: 'https://via.placeholder.com/300x200/1f3c88/ffffff?text=Aviador',
                marca: 'Ray-Ban',
                colores: ['Dorado', 'Plateado', 'Negro'],
                stock: 15
            },
            {
                id: 2,
                nombre: 'Armazón Rectangular Premium',
                categoria: 'armazones',
                precio: 89.99,
                descripcion: 'Armazón rectangular de acetato de alta calidad',
                imagen: 'https://via.placeholder.com/300x200/ff7b25/ffffff?text=Rectangular',
                marca: 'Oakley',
                materiales: ['Acetato', 'Metal'],
                stock: 8
            },
            {
                id: 3,
                nombre: 'Lentes Progresivos',
                categoria: 'lentes-graduacion',
                precio: 299.99,
                descripcion: 'Lentes progresivos con tecnología Free-Form',
                imagen: 'https://via.placeholder.com/300x200/28a745/ffffff?text=Progresivos',
                marca: 'Essilor',
                tratamientos: ['Antireflejante', 'Blue Light', 'Antirrayaduras'],
                stock: 25
            },
            {
                id: 4,
                nombre: 'Estuche de Cuero',
                categoria: 'accesorios',
                precio: 24.99,
                descripcion: 'Estuche de cuero genuino para lentes',
                imagen: 'https://via.placeholder.com/300x200/6f42c1/ffffff?text=Estuche',
                marca: 'Generic',
                colores: ['Negro', 'Marrón', 'Azul'],
                stock: 50
            }
        ];
        
        localStorage.setItem('productosTienda', JSON.stringify(this.productos));
    }

    cargarCarrito() {
        const carritoGuardado = localStorage.getItem('carritoCompras');
        this.carrito = carritoGuardado ? JSON.parse(carritoGuardado) : [];
    }

    setupEventListeners() {
        // Buscador de productos
        const buscador = document.getElementById('buscadorProductos');
        if (buscador) {
            buscador.addEventListener('input', (e) => {
                this.buscarProductos(e.target.value);
            });
        }

        // Filtros de categoría
        document.querySelectorAll('.filtro-categoria').forEach(filtro => {
            filtro.addEventListener('click', (e) => {
                this.filtrarPorCategoria(e.target.dataset.categoria);
            });
        });
    }

    renderizarProductos(productos = this.productos) {
        const grid = document.getElementById('gridProductos');
        if (!grid) return;

        if (productos.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-search"></i>
                    <h3>No se encontraron productos</h3>
                    <p>Intenta con otros términos de búsqueda</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = productos.map(producto => this.crearTarjetaProducto(producto)).join('');
    }

    crearTarjetaProducto(producto) {
        return `
            <div class="producto-card" data-id="${producto.id}">
                <div class="producto-imagen">
                    <img src="${producto.imagen}" alt="${producto.nombre}">
                    ${producto.stock < 5 ? '<span class="badge-stock">¡Últimas unidades!</span>' : ''}
                </div>
                <div class="producto-info">
                    <div class="producto-header">
                        <h4>${producto.nombre}</h4>
                        <span class="producto-marca">${producto.marca}</span>
                    </div>
                    <p class="producto-descripcion">${producto.descripcion}</p>
                    
                    <div class="producto-detalles">
                        ${producto.colores ? `
                            <div class="detalle-item">
                                <strong>Colores:</strong> ${producto.colores.join(', ')}
                            </div>
                        ` : ''}
                        
                        ${producto.materiales ? `
                            <div class="detalle-item">
                                <strong>Materiales:</strong> ${producto.materiales.join(', ')}
                            </div>
                        ` : ''}
                        
                        ${producto.tratamientos ? `
                            <div class="detalle-item">
                                <strong>Tratamientos:</strong> ${producto.tratamientos.join(', ')}
                            </div>
                        ` : ''}
                    </div>
                    
                    <div class="producto-footer">
                        <div class="producto-precio">
                            <span class="precio-actual">$${producto.precio.toFixed(2)}</span>
                            ${producto.precioOriginal ? `
                                <span class="precio-original">$${producto.precioOriginal.toFixed(2)}</span>
                            ` : ''}
                        </div>
                        
                        <div class="producto-stock">
                            <i class="fas fa-box"></i> ${producto.stock} disponibles
                        </div>
                        
                        <button class="btn btn-primary btn-sm" onclick="tienda.agregarAlCarrito(${producto.id})">
                            <i class="fas fa-cart-plus"></i> Agregar
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    buscarProductos(termino) {
        const filtrados = this.productos.filter(producto => {
            return producto.nombre.toLowerCase().includes(termino.toLowerCase()) ||
                   producto.descripcion.toLowerCase().includes(termino.toLowerCase()) ||
                   producto.marca.toLowerCase().includes(termino.toLowerCase());
        });
        
        this.renderizarProductos(filtrados);
    }

    filtrarPorCategoria(categoria) {
        if (categoria === 'todos') {
            this.renderizarProductos();
            return;
        }
        
        const filtrados = this.productos.filter(p => p.categoria === categoria);
        this.renderizarProductos(filtrados);
    }

    agregarAlCarrito(productoId) {
        const producto = this.productos.find(p => p.id === productoId);
        
        if (!producto) {
            alert('Producto no encontrado');
            return;
        }

        if (producto.stock === 0) {
            alert('Producto agotado');
            return;
        }

        const itemCarrito = this.carrito.find(item => item.id === productoId);
        
        if (itemCarrito) {
            if (itemCarrito.cantidad >= producto.stock) {
                alert('No hay suficiente stock');
                return;
            }
            itemCarrito.cantidad += 1;
        } else {
            this.carrito.push({
                ...producto,
                cantidad: 1
            });
        }

        this.guardarCarrito();
        this.actualizarContadorCarrito();
        this.mostrarNotificacion(`${producto.nombre} agregado al carrito`, 'success');
    }

    eliminarDelCarrito(productoId) {
        this.carrito = this.carrito.filter(item => item.id !== productoId);
        this.guardarCarrito();
        this.actualizarContadorCarrito();
        this.mostrarNotificacion('Producto eliminado del carrito', 'warning');
    }

    actualizarCantidad(productoId, nuevaCantidad) {
        const item = this.carrito.find(item => item.id === productoId);
        const producto = this.productos.find(p => p.id === productoId);
        
        if (item && producto) {
            if (nuevaCantidad > producto.stock) {
                alert(`Solo hay ${producto.stock} unidades disponibles`);
                return;
            }
            
            if (nuevaCantidad < 1) {
                this.eliminarDelCarrito(productoId);
                return;
            }
            
            item.cantidad = nuevaCantidad;
            this.guardarCarrito();
            this.actualizarContadorCarrito();
        }
    }

    guardarCarrito() {
        localStorage.setItem('carritoCompras', JSON.stringify(this.carrito));
    }

    actualizarContadorCarrito() {
        const contador = document.getElementById('contadorCarrito');
        if (contador) {
            const totalItems = this.carrito.reduce((sum, item) => sum + item.cantidad, 0);
            contador.textContent = totalItems;
            contador.style.display = totalItems > 0 ? 'block' : 'none';
        }
    }

    calcularTotal() {
        return this.carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
    }

    renderizarCarrito() {
        const carritoContainer = document.getElementById('carritoContainer');
        if (!carritoContainer) return;

        if (this.carrito.length === 0) {
            carritoContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-shopping-cart"></i>
                    <h3>Tu carrito está vacío</h3>
                    <p>Agrega productos para continuar</p>
                </div>
            `;
            return;
        }

        let html = `
            <div class="carrito-header">
                <h3>Tu Carrito (${this.carrito.length} productos)</h3>
                <button class="btn btn-link" onclick="tienda.vaciarCarrito()">
                    <i class="fas fa-trash"></i> Vaciar carrito
                </button>
            </div>
            
            <div class="carrito-items">
        `;

        this.carrito.forEach(item => {
            html += this.crearItemCarrito(item);
        });

        html += `
            </div>
            
            <div class="carrito-resumen">
                <div class="resumen-detalle">
                    <div class="resumen-item">
                        <span>Subtotal:</span>
                        <span>$${this.calcularTotal().toFixed(2)}</span>
                    </div>
                    <div class="resumen-item">
                        <span>Envío:</span>
                        <span>$${(this.calcularTotal() > 100 ? 0 : 9.99).toFixed(2)}</span>
                    </div>
                    <div class="resumen-item total">
                        <strong>Total:</strong>
                        <strong>$${(this.calcularTotal() + (this.calcularTotal() > 100 ? 0 : 9.99)).toFixed(2)}</strong>
                    </div>
                </div>
                
                <div class="carrito-acciones">
                    <button class="btn btn-secondary" onclick="continuarComprando()">
                        <i class="fas fa-arrow-left"></i> Continuar comprando
                    </button>
                    <button class="btn btn-primary" onclick="tienda.procederPago()">
                        <i class="fas fa-lock"></i> Proceder al pago
                    </button>
                </div>
            </div>
        `;

        carritoContainer.innerHTML = html;
    }

    crearItemCarrito(item) {
        return `
            <div class="carrito-item" data-id="${item.id}">
                <div class="item-imagen">
                    <img src="${item.imagen}" alt="${item.nombre}">
                </div>
                
                <div class="item-info">
                    <div class="item-header">
                        <h4>${item.nombre}</h4>
                        <span class="item-marca">${item.marca}</span>
                    </div>
                    
                    <div class="item-controls">
                        <div class="cantidad-control">
                            <button class="btn-cantidad" onclick="tienda.actualizarCantidad(${item.id}, ${item.cantidad - 1})">
                                <i class="fas fa-minus"></i>
                            </button>
                            <input type="number" value="${item.cantidad}" min="1" max="${item.stock}" 
                                   onchange="tienda.actualizarCantidad(${item.id}, this.value)">
                            <button class="btn-cantidad" onclick="tienda.actualizarCantidad(${item.id}, ${item.cantidad + 1})">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                        
                        <div class="item-precio">
                            <span>$${(item.precio * item.cantidad).toFixed(2)}</span>
                            <small>$${item.precio.toFixed(2)} c/u</small>
                        </div>
                    </div>
                </div>
                
                <button class="btn-eliminar" onclick="tienda.eliminarDelCarrito(${item.id})" title="Eliminar">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
    }

    vaciarCarrito() {
        if (confirm('¿Estás seguro de vaciar el carrito?')) {
            this.carrito = [];
            this.guardarCarrito();
            this.actualizarContadorCarrito();
            this.renderizarCarrito();
        }
    }

    async procederPago() {
        // Verificar que el usuario esté autenticado
        if (!app.currentUser) {
            alert('Debe iniciar sesión para completar la compra');
            window.location.href = 'login.html?redirect=checkout';
            return;
        }

        // Verificar stock
        for (const item of this.carrito) {
            const producto = this.productos.find(p => p.id === item.id);
            if (!producto || producto.stock < item.cantidad) {
                alert(`No hay suficiente stock de ${item.nombre}`);
                return;
            }
        }

        // Redirigir a checkout
        window.location.href = 'checkout.html';
    }

    async procesarPedido(datosPago, direccionEnvio) {
        try {
            // Simular procesamiento de pedido
            const pedidoId = 'PED-' + Date.now();
            
            // Actualizar stock
            this.carrito.forEach(item => {
                const producto = this.productos.find(p => p.id === item.id);
                if (producto) {
                    producto.stock -= item.cantidad;
                }
            });
            
            // Guardar pedido
            const pedido = {
                id: pedidoId,
                fecha: new Date().toISOString(),
                usuario: app.currentUser,
                optica: app.currentOptica,
                productos: this.carrito,
                total: this.calcularTotal(),
                direccionEnvio: direccionEnvio,
                estado: 'procesando'
            };
            
            this.guardarPedido(pedido);
            
            // Vaciar carrito
            this.carrito = [];
            this.guardarCarrito();
            this.actualizarContadorCarrito();
            
            return {
                success: true,
                pedidoId: pedidoId,
                message: 'Pedido procesado correctamente'
            };
        } catch (error) {
            console.error('Error procesando pedido:', error);
            return {
                success: false,
                message: 'Error procesando el pedido'
            };
        }
    }

    guardarPedido(pedido) {
        let pedidos = JSON.parse(localStorage.getItem('pedidos') || '[]');
        pedidos.push(pedido);
        localStorage.setItem('pedidos', JSON.stringify(pedidos));
    }

    obtenerPedidosUsuario() {
        if (!app.currentUser) return [];
        
        const pedidos = JSON.parse(localStorage.getItem('pedidos') || '[]');
        return pedidos.filter(p => p.usuario.id === app.currentUser.id);
    }

    mostrarNotificacion(mensaje, tipo = 'info') {
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

    // Sistema de recomendaciones basado en prescripción
    recomendarProductosPorPrescripcion(prescripcion) {
        let recomendaciones = [];
        
        // Lentes de sol polarizados para altas graduaciones
        if (Math.abs(prescripcion.esfera) > 3.0) {
            recomendaciones.push({
                tipo: 'lentes-sol',
                recomendacion: 'Lentes de sol polarizados con alto índice',
                razon: 'Protección solar óptima con reducción de grosor',
                productos: this.productos.filter(p => 
                    p.categoria === 'lentes-sol' && 
                    p.nombre.toLowerCase().includes('polarizado')
                )
            });
        }
        
        // Lentes progresivos para presbicia
        if (prescripcion.adicion > 0) {
            recomendaciones.push({
                tipo: 'lentes-graduacion',
                recomendacion: 'Lentes progresivos premium',
                razon: 'Visión nítida a todas las distancias',
                productos: this.productos.filter(p => 
                    p.categoria === 'lentes-graduacion' && 
                    p.nombre.toLowerCase().includes('progresivo')
                )
            });
        }
        
        // Armazones livianos para graduaciones altas
        if (Math.abs(prescripcion.esfera) > 4.0) {
            recomendaciones.push({
                tipo: 'armazones',
                recomendacion: 'Armazones livianos de titanio',
                razon: 'Reducen peso total para mayor comodidad',
                productos: this.productos.filter(p => 
                    p.categoria === 'armazones' && 
                    p.descripcion.toLowerCase().includes('liviano')
                )
            });
        }
        
        return recomendaciones;
    }
}

// Inicializar tienda
const tienda = new TiendaOnline();
window.tienda = tienda;

// Funciones globales
function mostrarCarrito() {
    tienda.renderizarCarrito();
}

function continuarComprando() {
    // Regresar a la página de productos
    window.history.back();
}

// Inicializar contador del carrito al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    tienda.actualizarContadorCarrito();
    
    if (window.location.pathname.includes('tienda.html')) {
        tienda.renderizarProductos();
    }
    
    if (window.location.pathname.includes('carrito.html')) {
        tienda.renderizarCarrito();
    }
});
