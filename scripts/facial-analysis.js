// Sistema de Análisis Facial y Toma de Medidas
class FacialAnalysis {
    constructor() {
        this.videoElement = null;
        this.canvasElement = null;
        this.stream = null;
        this.faceDetector = null;
        this.measurements = {
            dp: { od: 0, os: 0 }, // Distancia pupilar
            np: { od: 0, os: 0 }, // Distancia nasopupilar
            ph: { od: 0, os: 0 }, // Altura pupilar
            segmentHeight: 0
        };
        this.init();
    }

    async init() {
        await this.loadFaceDetectionModel();
        this.setupUI();
    }

    async loadFaceDetectionModel() {
        // Cargar modelo de detección facial
        try {
            // Aquí se integraría Face-API.js o MediaPipe Face Detection
            console.log('Modelo de detección facial inicializado');
        } catch (error) {
            console.error('Error cargando modelo facial:', error);
        }
    }

    setupUI() {
        // Configurar elementos de interfaz
        this.videoElement = document.getElementById('videoFace');
        this.canvasElement = document.getElementById('canvasFace');
        
        if (this.videoElement && this.canvasElement) {
            this.setupCamera();
        }
    }

    async setupCamera() {
        try {
            this.stream = await navigator.mediaDevices.getUserMedia({
                video: { 
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    facingMode: 'user'
                },
                audio: false
            });
            
            this.videoElement.srcObject = this.stream;
            await this.videoElement.play();
            
            this.startFaceDetection();
        } catch (error) {
            console.error('Error accediendo a la cámara:', error);
            alert('No se pudo acceder a la cámara. Por favor, verifique los permisos.');
        }
    }

    startFaceDetection() {
        // Iniciar detección facial
        requestAnimationFrame(this.detectFaces.bind(this));
    }

    async detectFaces() {
        if (!this.videoElement || !this.canvasElement) return;
        
        const ctx = this.canvasElement.getContext('2d');
        ctx.drawImage(this.videoElement, 0, 0, 
                     this.canvasElement.width, this.canvasElement.height);
        
        // Aquí iría la lógica de detección facial real
        // Por ahora, simularemos la detección
        
        this.simulateFaceDetection(ctx);
        
        requestAnimationFrame(this.detectFaces.bind(this));
    }

    simulateFaceDetection(ctx) {
        // Simulación de puntos faciales
        const width = this.canvasElement.width;
        const height = this.canvasElement.height;
        
        // Dibujar puntos simulados para ojos
        const leftEye = { x: width * 0.4, y: height * 0.5 };
        const rightEye = { x: width * 0.6, y: height * 0.5 };
        const nose = { x: width * 0.5, y: height * 0.6 };
        
        // Dibujar puntos
        ctx.fillStyle = '#ff7b25';
        ctx.beginPath();
        ctx.arc(leftEye.x, leftEye.y, 8, 0, Math.PI * 2);
        ctx.arc(rightEye.x, rightEye.y, 8, 0, Math.PI * 2);
        ctx.fill();
        
        // Dibujar líneas de medición
        ctx.strokeStyle = '#1f3c88';
        ctx.lineWidth = 2;
        
        // Distancia interpupilar
        ctx.beginPath();
        ctx.moveTo(leftEye.x, leftEye.y);
        ctx.lineTo(rightEye.x, rightEye.y);
        ctx.stroke();
        
        // Mostrar mediciones
        const dp = Math.sqrt(
            Math.pow(rightEye.x - leftEye.x, 2) + 
            Math.pow(rightEye.y - leftEye.y, 2)
        );
        
        // Convertir a milímetros (simulación)
        const dpMM = (dp / width * 180).toFixed(1);
        
        ctx.fillStyle = '#1f3c88';
        ctx.font = '16px Arial';
        ctx.fillText(`DP: ${dpMM} mm`, width * 0.5, height * 0.45);
        
        // Actualizar mediciones
        this.measurements.dp.od = dpMM / 2;
        this.measurements.dp.os = dpMM / 2;
        this.updateMeasurementsDisplay();
    }

    updateMeasurementsDisplay() {
        // Actualizar display de mediciones
        document.getElementById('dpOd').textContent = `${this.measurements.dp.od} mm`;
        document.getElementById('dpOs').textContent = `${this.measurements.dp.os} mm`;
        document.getElementById('dpTotal').textContent = 
            `${(this.measurements.dp.od + this.measurements.dp.os).toFixed(1)} mm`;
    }

    captureMeasurement(type, eye = 'both') {
        // Capturar medición actual
        const measurement = {
            type: type,
            eye: eye,
            value: eye === 'od' ? this.measurements.dp.od : 
                   eye === 'os' ? this.measurements.dp.os : 
                   this.measurements.dp.od + this.measurements.dp.os,
            timestamp: new Date().toISOString(),
            confidence: 0.95
        };
        
        this.saveMeasurement(measurement);
        return measurement;
    }

    saveMeasurement(measurement) {
        // Guardar medición en localStorage
        let measurements = JSON.parse(localStorage.getItem('facialMeasurements') || '[]');
        measurements.push(measurement);
        localStorage.setItem('facialMeasurements', JSON.stringify(measurements));
    }

    calculateFrameRecommendations(faceShape, measurements) {
        const recommendations = [];
        
        // Basado en distancia interpupilar
        const totalDP = measurements.dp.od + measurements.dp.os;
        
        if (totalDP < 60) {
            recommendations.push({
                type: 'Armazones pequeños',
                reason: 'DP total menor a 60mm',
                examples: ['Estilo wayfarer pequeño', 'Rectangulares estrechos']
            });
        } else if (totalDP > 70) {
            recommendations.push({
                type: 'Armazones grandes',
                reason: 'DP total mayor a 70mm',
                examples: ['Aviador grande', 'Rectangulares anchos']
            });
        } else {
            recommendations.push({
                type: 'Armazones medianos',
                reason: 'DP total estándar',
                examples: ['La mayoría de estilos']
            });
        }
        
        // Basado en forma de rostro
        const shapeRecs = aiAssistant.getFrameRecommendations(faceShape);
        recommendations.push({
            type: `Para rostro ${faceShape}`,
            reason: shapeRecs.reason,
            examples: shapeRecs.frames,
            avoid: shapeRecs.avoid
        });
        
        return recommendations;
    }

    async takePhoto() {
        if (!this.canvasElement) return;
        
        const photoCanvas = document.createElement('canvas');
        photoCanvas.width = this.canvasElement.width;
        photoCanvas.height = this.canvasElement.height;
        
        const ctx = photoCanvas.getContext('2d');
        ctx.drawImage(this.videoElement, 0, 0, 
                     photoCanvas.width, photoCanvas.height);
        
        // Agregar marca de agua
        ctx.fillStyle = 'rgba(31, 60, 136, 0.7)';
        ctx.font = '20px Arial';
        ctx.fillText('VisualOS IA - Análisis Facial', 20, photoCanvas.height - 30);
        
        return photoCanvas.toDataURL('image/png');
    }

    exportMeasurements() {
        const measurements = JSON.parse(localStorage.getItem('facialMeasurements') || '[]');
        const csv = this.convertToCSV(measurements);
        this.downloadCSV(csv, 'mediciones_faciales.csv');
    }

    convertToCSV(data) {
        const headers = ['Tipo', 'Ojo', 'Valor (mm)', 'Fecha', 'Confianza'];
        const rows = data.map(m => [
            m.type,
            m.eye,
            m.value,
            new Date(m.timestamp).toLocaleString(),
            m.confidence
        ]);
        
        return [headers, ...rows].map(row => row.join(',')).join('\n');
    }

    downloadCSV(content, filename) {
        const blob = new Blob([content], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }

    stopCamera() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }
    }
}

// Inicializar sistema de análisis facial
const facialAnalysis = new FacialAnalysis();
window.facialAnalysis = facialAnalysis;

// Funciones globales
function iniciarCamara() {
    facialAnalysis.setupCamera();
}

function detenerCamara() {
    facialAnalysis.stopCamera();
}

function capturarDP() {
    const measurement = facialAnalysis.captureMeasurement('DP', 'both');
    alert(`Distancia pupilar capturada: ${measurement.value} mm`);
}

function analizarFormaRostro() {
    if (!facialAnalysis.videoElement) {
        alert('Por favor, inicie la cámara primero.');
        return;
    }
    
    // Simular análisis de forma de rostro
    facialAnalysis.takePhoto().then(photoData => {
        aiAssistant.analyzeFaceShape(photoData).then(analysis => {
            const recommendations = facialAnalysis.calculateFrameRecommendations(
                analysis.shape, 
                facialAnalysis.measurements
            );
            
            mostrarResultadosAnalisis(analysis, recommendations);
        });
    });
}

function mostrarResultadosAnalisis(analysis, recommendations) {
    const resultadosDiv = document.getElementById('resultadosAnalisis');
    if (!resultadosDiv) return;
    
    let html = `
        <div class="resultado-analisis">
            <h3>Resultados del Análisis Facial</h3>
            
            <div class="resultado-seccion">
                <h4>Forma de Rostro</h4>
                <p><strong>Tipo:</strong> ${analysis.shape}</p>
                <p><strong>Confianza:</strong> ${(analysis.confidence * 100).toFixed(1)}%</p>
            </div>
            
            <div class="resultado-seccion">
                <h4>Mediciones</h4>
                <p><strong>Ancho de rostro:</strong> ${analysis.measurements?.faceWidth || 'N/A'}</p>
                <p><strong>Largo de rostro:</strong> ${analysis.measurements?.faceLength || 'N/A'}</p>
            </div>
            
            <div class="resultado-seccion">
                <h4>Recomendaciones de Armazón</h4>
    `;
    
    recommendations.forEach(rec => {
        html += `
            <div class="recomendacion">
                <h5>${rec.type}</h5>
                <p><em>${rec.reason}</em></p>
                <p><strong>Recomendados:</strong> ${rec.examples?.join(', ')}</p>
                ${rec.avoid ? `<p><strong>Evitar:</strong> ${rec.avoid}</p>` : ''}
            </div>
        `;
    });
    
    html += `
            </div>
            
            <div class="acciones-analisis">
                <button class="btn btn-primary" onclick="guardarAnalisis()">
                    <i class="fas fa-save"></i> Guardar Análisis
                </button>
                <button class="btn btn-secondary" onclick="exportarAnalisis()">
                    <i class="fas fa-download"></i> Exportar
                </button>
            </div>
        </div>
    `;
    
    resultadosDiv.innerHTML = html;
}

function guardarAnalisis() {
    // Guardar análisis en el historial del paciente
    alert('Análisis guardado en el historial del paciente');
}

function exportarAnalisis() {
    facialAnalysis.exportMeasurements();
}
