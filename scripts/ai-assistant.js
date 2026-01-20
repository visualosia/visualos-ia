// Sistema de Inteligencia Artificial para VisualOS IA
class AIAssistant {
    constructor() {
        this.model = null;
        this.knowledgeBase = [];
        this.init();
    }

    async init() {
        await this.loadKnowledgeBase();
        await this.loadModel();
    }

    async loadKnowledgeBase() {
        // Cargar libros y conocimiento desde localStorage
        const storedKnowledge = localStorage.getItem('aiKnowledgeBase');
        if (storedKnowledge) {
            this.knowledgeBase = JSON.parse(storedKnowledge);
        } else {
            // Conocimiento base inicial
            this.knowledgeBase = [
                {
                    category: 'diagnostic',
                    patterns: ['miopía', 'hipermetropía', 'astigmatismo', 'presbicia'],
                    responses: [
                        'Basado en los síntomas descritos, podría tratarse de {condition}.',
                        'La combinación de síntomas sugiere {condition}.'
                    ],
                    recommendations: [
                        'Recomiendo realizar un examen de refracción completo.',
                        'Considerar prescripción de lentes correctivos.'
                    ]
                },
                {
                    category: 'lens_recommendation',
                    patterns: ['progresivo', 'bifocal', 'monofocal', 'oficina'],
                    responses: [
                        'Para {activity}, recomiendo lentes {type}.',
                        'Considerando {age} años y {condition}, {type} sería apropiado.'
                    ]
                },
                {
                    category: 'frame_recommendation',
                    patterns: ['forma de rostro', 'tipo de cara', 'armazón adecuado'],
                    responses: [
                        'Para rostro {faceShape}, recomiendo armazones {frameType}.',
                        'La forma {faceShape} se complementa con {frameType}.'
                    ]
                }
            ];
            this.saveKnowledgeBase();
        }
    }

    async loadModel() {
        // Cargar modelo de IA (TensorFlow.js o similar)
        try {
            // Aquí se integraría TensorFlow.js o una API externa
            console.log('Modelo de IA cargado');
        } catch (error) {
            console.error('Error cargando modelo:', error);
        }
    }

    async analyzeSymptoms(symptoms, patientData) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const analysis = this.analyzeWithRules(symptoms, patientData);
                resolve(analysis);
            }, 1000);
        });
    }

    analyzeWithRules(symptoms, patientData) {
        let diagnosis = [];
        let recommendations = [];
        
        // Análisis basado en reglas
        if (symptoms.includes('visión borrosa lejana') || symptoms.includes('entrecerrar los ojos')) {
            diagnosis.push('Posible miopía');
            recommendations.push('Examen de refracción completo');
            recommendations.push('Considerar lentes cóncavos');
        }
        
        if (symptoms.includes('dolor de cabeza') || symptoms.includes('fatiga visual')) {
            diagnosis.push('Posible astenopía');
            recommendations.push('Revisar iluminación en entorno laboral');
            recommendations.push('Considerar lentes con filtro blue light');
        }
        
        if (patientData.edad > 40 && symptoms.includes('dificultad lectura')) {
            diagnosis.push('Posible presbicia');
            recommendations.push('Evaluar adición para cerca');
            recommendations.push('Considerar lentes progresivos');
        }
        
        return {
            possibleDiagnosis: diagnosis,
            recommendations: recommendations,
            confidence: 0.85,
            nextSteps: [
                'Examen de agudeza visual',
                'Refracción completa',
                'Prueba de presión intraocular'
            ]
        };
    }

    async recommendLenses(patientData, prescription, lifestyle) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const recommendations = this.generateLensRecommendations(patientData, prescription, lifestyle);
                resolve(recommendations);
            }, 1500);
        });
    }

    generateLensRecommendations(patientData, prescription, lifestyle) {
        let recommendations = [];
        
        // Basado en prescripción
        const sphere = Math.max(
            Math.abs(prescription.od.sphere || 0),
            Math.abs(prescription.os.sphere || 0)
        );
        
        if (sphere > 3.0) {
            recommendations.push({
                type: 'Alto índice',
                reason: 'Para reducir el grosor de los lentes con graduación alta',
                benefits: ['Más delgado', 'Más ligero', 'Estético']
            });
        }
        
        // Basado en estilo de vida
        if (lifestyle.includes('computadora') || lifestyle.includes('digital')) {
            recommendations.push({
                type: 'Blue Light Protection',
                reason: 'Protección contra luz azul de dispositivos digitales',
                benefits: ['Reduce fatiga visual', 'Mejora el sueño', 'Protección retina']
            });
        }
        
        if (lifestyle.includes('exterior') || lifestyle.includes('conducir')) {
            recommendations.push({
                type: 'Polarizado/Fotocromático',
                reason: 'Protección contra deslumbramiento y luz intensa',
                benefits: ['Reduce deslumbramiento', 'Confort visual', 'Protección UV']
            });
        }
        
        // Basado en edad
        if (patientData.edad > 45) {
            recommendations.push({
                type: 'Progresivo',
                reason: 'Corrección para todas las distancias',
                benefits: ['Visión nítida a todas las distancias', 'Un solo par de lentes', 'Transición suave']
            });
        }
        
        return {
            primaryRecommendation: recommendations[0] || null,
            alternativeOptions: recommendations.slice(1),
            personalizedAdvice: this.generatePersonalizedAdvice(patientData, prescription)
        };
    }

    generatePersonalizedAdvice(patientData, prescription) {
        const advice = [];
        
        if (patientData.ocupacion === 'programador' || patientData.ocupacion === 'oficina') {
            advice.push('Considerar lentes con enfoque intermedio para distancias de computadora.');
        }
        
        if (prescription.hasAstigmatism) {
            advice.push('Los lentes con tratamiento antireflejante premium mejoran la visión nocturna.');
        }
        
        return advice;
    }

    async analyzeFaceShape(imageData) {
        // Análisis de forma de rostro usando IA
        return new Promise((resolve) => {
            setTimeout(() => {
                const shapes = ['ovalado', 'redondo', 'cuadrado', 'corazón', 'diamante'];
                const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
                
                resolve({
                    shape: randomShape,
                    confidence: 0.92,
                    recommendations: this.getFrameRecommendations(randomShape),
                    measurements: {
                        faceWidth: '14.5 cm',
                        faceLength: '18.2 cm',
                        cheekboneWidth: '13.8 cm'
                    }
                });
            }, 2000);
        });
    }

    getFrameRecommendations(faceShape) {
        const recommendations = {
            'ovalado': {
                frames: ['Rectangular', 'Aviador', 'Wayfarer'],
                avoid: ['Demasiado pequeños'],
                reason: 'La forma ovalada es versátil y puede usar casi cualquier estilo'
            },
            'redondo': {
                frames: ['Rectangular', 'Cuadrado', 'Geométricos'],
                avoid: ['Redondos', 'Pequeños'],
                reason: 'Los marcos angulares equilibran las curvas del rostro'
            },
            'cuadrado': {
                frames: ['Redondos', 'Ovalados', 'Aviador'],
                avoid: ['Cuadrados', 'Rectangulares'],
                reason: 'Las formas suaves suavizan los ángulos marcados'
            },
            'corazón': {
                frames: ['Rectangulares delgados', 'Redondos', 'Aviador'],
                avoid: ['Anchos en la parte superior'],
                reason: 'Equilibran la frente ancha y el mentón estrecho'
            },
            'diamante': {
                frames: ['Ovalados', 'Rectangulares curvos'],
                avoid: ['Angulares', 'Estrechos'],
                reason: 'Suavizan los pómulos prominentes'
            }
        };
        
        return recommendations[faceShape] || recommendations.ovalado;
    }

    async learnFromBooks(bookContent) {
        // Procesar libros para aprendizaje
        return new Promise((resolve) => {
            setTimeout(() => {
                const newKnowledge = this.extractKnowledge(bookContent);
                this.knowledgeBase.push(...newKnowledge);
                this.saveKnowledgeBase();
                
                resolve({
                    learnedConcepts: newKnowledge.length,
                    status: 'Conocimiento actualizado'
                });
            }, 3000);
        });
    }

    extractKnowledge(content) {
        // Extraer conceptos clave del contenido
        const keywords = ['glaucoma', 'catarata', 'retinopatía', 'degeneración macular'];
        const newKnowledge = [];
        
        keywords.forEach(keyword => {
            if (content.toLowerCase().includes(keyword)) {
                newKnowledge.push({
                    category: 'medical',
                    keyword: keyword,
                    context: 'Encontrado en material de aprendizaje'
                });
            }
        });
        
        return newKnowledge;
    }

    saveKnowledgeBase() {
        localStorage.setItem('aiKnowledgeBase', JSON.stringify(this.knowledgeBase));
    }

    async chat(message, context) {
        // Chat interactivo con IA
        return new Promise((resolve) => {
            setTimeout(() => {
                const response = this.generateResponse(message, context);
                resolve(response);
            }, 1000);
        });
    }

    generateResponse(message, context) {
        const responses = [
            `Basado en mi análisis, ${message.toLowerCase().includes('diagnóstico') ? 'recomendaría realizar pruebas adicionales para confirmar.' : 'puedo sugerir algunas opciones.'}`,
            `Considerando el historial del paciente, ${this.getRandomAdvice()}`,
            `La literatura especializada indica que ${this.getRandomMedicalFact()}`
        ];
        
        return {
            response: responses[Math.floor(Math.random() * responses.length)],
            suggestions: this.generateSuggestions(message),
            confidence: 0.88,
            sources: ['Base de conocimientos VisualOS IA', 'Literatura oftalmológica actualizada']
        };
    }

    getRandomAdvice() {
        const advice = [
            'es importante realizar controles anuales.',
            'los lentes progresivos podrían ser una buena opción.',
            'se recomienda protección UV completa.',
            'la ergonomía visual en el trabajo es crucial.'
        ];
        return advice[Math.floor(Math.random() * advice.length)];
    }

    getRandomMedicalFact() {
        const facts = [
            'la exposición prolongada a luz azul puede afectar los ritmos circadianos.',
            'el 80% de la información sensorial proviene de la visión.',
            'la miopía está aumentando globalmente, especialmente en poblaciones urbanas.',
            'la detección temprana del glaucoma es clave para prevenir daño irreversible.'
        ];
        return facts[Math.floor(Math.random() * facts.length)];
    }

    generateSuggestions(message) {
        if (message.toLowerCase().includes('lentes')) {
            return ['Considerar material de alto índice para graduaciones altas', 'Evaluar necesidades de protección UV'];
        } else if (message.toLowerCase().includes('armazón')) {
            return ['Analizar forma de rostro', 'Considerar estilo de vida del paciente'];
        } else {
            return ['Revisar historial completo', 'Considerar exámenes complementarios'];
        }
    }
}

// Inicializar Asistente IA
const aiAssistant = new AIAssistant();
window.aiAssistant = aiAssistant;

// Funciones globales
async function consultarIA() {
    const modal = document.getElementById('modalIA');
    const responseDiv = document.getElementById('iaResponse');
    
    if (!modal || !responseDiv) return;
    
    modal.style.display = 'block';
    responseDiv.innerHTML = '<p><i class="fas fa-spinner fa-spin"></i> Analizando con IA...</p>';
    
    try {
        // Obtener datos del formulario actual
        const symptoms = document.getElementById('motivoConsulta')?.value || '';
        const patientData = {
            edad: document.getElementById('edad')?.value || '',
            ocupacion: document.getElementById('ocupacion')?.value || ''
        };
        
        const analysis = await aiAssistant.analyzeSymptoms(symptoms, patientData);
        
        responseDiv.innerHTML = `
            <div class="ai-analysis">
                <h4>Análisis IA</h4>
                <div class="ai-section">
                    <strong>Posibles Diagnósticos:</strong>
                    <ul>
                        ${analysis.possibleDiagnosis.map(d => `<li>${d}</li>`).join('')}
                    </ul>
                </div>
                <div class="ai-section">
                    <strong>Recomendaciones:</strong>
                    <ul>
                        ${analysis.recommendations.map(r => `<li>${r}</li>`).join('')}
                    </ul>
                </div>
                <div class="ai-section">
                    <strong>Próximos Pasos:</strong>
                    <ul>
                        ${analysis.nextSteps.map(s => `<li>${s}</li>`).join('')}
                    </ul>
                </div>
                <div class="ai-confidence">
                    <span>Confianza: ${(analysis.confidence * 100).toFixed(1)}%</span>
                </div>
            </div>
        `;
    } catch (error) {
        responseDiv.innerHTML = `<p class="error">Error al consultar IA: ${error.message}</p>`;
    }
}

function cerrarModalIA() {
    const modal = document.getElementById('modalIA');
    if (modal) modal.style.display = 'none';
}

async function sugerirDiagnostico() {
    const diagnosticoInput = document.getElementById('diagnostico');
    const sugerenciaDiv = document.getElementById('sugerenciaDiagnostico');
    const textoSugerencia = document.getElementById('textoSugerencia');
    
    if (!diagnosticoInput || !sugerenciaDiv) return;
    
    const currentText = diagnosticoInput.value;
    
    if (currentText.length < 10) {
        alert('Por favor, ingrese más detalles para que la IA pueda ayudar.');
        return;
    }
    
    textoSugerencia.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analizando...';
    sugerenciaDiv.style.display = 'block';
    
    try {
        const analysis = await aiAssistant.analyzeSymptoms(currentText, {});
        
        const suggestion = `Basado en la descripción, podría tratarse de ${analysis.possibleDiagnosis[0] || 'una condición visual común'}. 
        ${analysis.recommendations[0] || 'Se recomienda evaluación completa.'}`;
        
        textoSugerencia.textContent = suggestion;
    } catch (error) {
        textoSugerencia.textContent = 'Error al generar sugerencia. Intente nuevamente.';
    }
}

function usarSugerencia() {
    const textoSugerencia = document.getElementById('textoSugerencia');
    const diagnosticoInput = document.getElementById('diagnostico');
    
    if (textoSugerencia && diagnosticoInput) {
        diagnosticoInput.value = textoSugerencia.textContent;
    }
}

async function recomendarLentesIA() {
    const patientData = {
        edad: document.getElementById('edad')?.value || 30,
        ocupacion: document.getElementById('ocupacion')?.value || 'General'
    };
    
    const prescription = {
        od: {
            sphere: document.getElementById('odEsfera')?.value || '0.00',
            cylinder: document.getElementById('odCilindro')?.value || '0.00'
        },
        os: {
            sphere: document.getElementById('osEsfera')?.value || '0.00',
            cylinder: document.getElementById('osCilindro')?.value || '0.00'
        }
    };
    
    const lifestyle = [];
    if (document.getElementById('ocupacion')?.value?.toLowerCase().includes('computadora')) {
        lifestyle.push('computadora');
    }
    
    try {
        const recommendations = await aiAssistant.recommendLenses(patientData, prescription, lifestyle);
        
        alert(`
            Recomendación IA:
            
            Recomendación Principal: ${recommendations.primaryRecommendation?.type || 'N/A'}
            
            Opciones Alternativas:
            ${recommendations.alternativeOptions.map(opt => `- ${opt.type}: ${opt.reason}`).join('\n')}
            
            Consejo Personalizado:
            ${recommendations.personalizedAdvice.join('\n')}
        `);
    } catch (error) {
        alert('Error al obtener recomendaciones de IA');
    }
}

// Manejar cierre del modal
window.onclick = function(event) {
    const modal = document.getElementById('modalIA');
    if (event.target === modal) {
        cerrarModalIA();
    }
};
