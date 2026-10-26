# PRD: App de Matemáticas con Tutor de IA para Adolescentes

## 1. Resumen ejecutivo

**Producto:** App móvil de matemáticas para estudiantes de 12 a 15 años que combina práctica basada en evidencia, un tutor personal de inteligencia artificial y un modelo de negocio freemium.

**Propuesta de valor:**
"Aprende matemáticas a tu ritmo, con un tutor cercano que te guía paso a paso, sin presión, sin comparaciones y sin castigar tus errores."

**Problema:**
Muchos adolescentes desarrollan ansiedad matemática por ritmos uniformes, evaluación punitiva, comparación social y falta de acompañamiento personalizado. Esto se asocia con menor rendimiento y evitación de la materia.

**Solución:**
Una app que ofrece:

- Selección de grado escolar.
- Práctica de recuperación, repetición espaciada e intercalada.
- Ejemplos resueltos con desvanecimiento gradual.
- Tutor de IA cercano, paciente y socrático.
- Feedback explicativo e inmediato.
- Modo básico offline y funciones avanzadas online.
- Plan gratuito con límites diarios y plan premium.

**Tema inicial del MVP:**
Fracciones: equivalencia, simplificación, comparación y suma/resta con igual denominador.

---

## 2. Investigación: hallazgos clave

### 2.1 Ansiedad matemática

- La ansiedad matemática se asocia de forma consistente con menor rendimiento.
- En PISA, los estudiantes con mayor ansiedad matemática obtuvieron peores resultados en la gran mayoría de los países.
- La comparación con compañeros, las calificaciones, la presión del tiempo y la exposición pública del error pueden aumentar la ansiedad.
- El apoyo docente y la evaluación formativa se asocian con menor ansiedad matemática.

**Nivel de evidencia:** alto para la asociación ansiedad–rendimiento; medio para la causalidad específica de cada factor escolar.

**Implicación de producto:**
La app no debe usar rankings, vidas, cronómetros punitivos, comparaciones públicas ni castigos por error.

### 2.2 Métodos con mayor evidencia

| Método | Evidencia | Uso en la app |
|---|---|---|
| Práctica de recuperación | Alta | El estudiante intenta antes de ver la solución |
| Repetición espaciada | Alta | Repaso al día siguiente, a los 3 días y a la semana |
| Práctica intercalada | Media-alta | Mezclar tipos de problemas después del dominio inicial |
| Feedback explicativo inmediato | Alta | Explicar el error y proponer el siguiente paso |
| Dominio progresivo | Media-alta | Avanzar por criterio, no por velocidad |
| Ejemplos resueltos con desvanecimiento | Media-alta | Ejemplo completo, luego pistas, luego problema independiente |
| Enfoque concreto–visual–abstracto | Media | Usar barras, pizzas, recta numérica y símbolos |
| Tutoría personalizada | Alta | Tutor de IA como acompañante, no como resolvedor |
| Releer, subrayar, resumir | Baja utilidad relativa | No como mecánica principal |
| Estilos de aprendizaje | No recomendado | No adaptar el contenido a "estilos" fijos |

**Fuentes principales:**
- Dunlosky et al., *Improving Students' Learning With Effective Learning Techniques* (2013).
- EEF Teaching & Learning Toolkit: Feedback, Mastery Learning, One-to-one Tuition.
- What Works Clearinghouse: *Teaching Strategies for Improving Algebra Knowledge*.
- OECD PISA: *Does Math Make You Anxious?* y *PISA 2022 Results*.
- UNESCO: *Guidance for Generative AI in Education and Research*.

### 2.3 Lo que no debe hacer la app

- No usar tablas de clasificación.
- No usar competencias entre estudiantes.
- No penalizar errores con vidas, rachas rotas o pérdida de progreso.
- No dar la respuesta completa antes de que el estudiante intente.
- No basar el diseño en "estilos de aprendizaje".
- No usar videos largos como requisito para aprender.
- No mostrar anuncios dirigidos a menores.

---

## 3. Usuarios objetivo

### Persona principal: estudiante

- **Edad:** 12 a 15 años.
- **Grados:** 7.º, 8.º y 9.º, o equivalente.
- **Necesidad:** entender matemáticas sin sentirse "malo para eso".
- **Dolor:** se bloquea, tiene miedo a preguntar, no recibe explicación personalizada.
- **Objetivo:** recuperar temas, hacer tareas, prepararse para evaluaciones y ganar confianza.

### Persona secundaria: familia o tutor

- Quiere saber si el estudiante está avanzando.
- Necesita un resumen simple de progreso.
- No desea anuncios, compras ocultas ni contenido inseguro.

### Persona terciaria: docente

- Quiere asignar o recomendar temas.
- Necesita ver dominio por destreza.
- Requiere informes simples y exportables.

---

## 4. Objetivos del producto

### Objetivos de aprendizaje

1. Mejorar el dominio de fracciones en estudiantes de 12 a 15 años.
2. Aumentar la retención a 3, 7 y 30 días.
3. Reducir la ansiedad matemática autopercibida.
4. Fomentar el intento antes de pedir la solución.
5. Crear un hábito de práctica breve y frecuente.

### Objetivos de negocio

1. Validar disposición a pagar por tutoría de IA.
2. Convertir entre 3% y 7% de usuarios activos gratuitos a premium.
3. Mantener un coste de IA controlado por usuario activo semanal.
4. Conseguir retención del 25% al día 30 en usuarios nuevos.
5. Lograr que al menos 60% de los usuarios completen el diagnóstico inicial.

---

## 5. MVP: alcance mínimo viable

### 5.1 Qué incluye el MVP

- Registro sencillo con edad, grado y objetivo.
- Selección de grado escolar: 7.º, 8.º y 9.º.
- Diagnóstico inicial breve de 8 a 12 preguntas.
- Un único tema: fracciones.
- 20 a 30 micro-lecciones.
- Banco local de ejercicios.
- Práctica de recuperación.
- Repetición espaciada.
- Práctica intercalada básica.
- Ejemplos resueltos con pistas graduales.
- Tutor de IA conversacional.
- Límites de IA para el plan gratuito.
- Modo offline para ejercicios y progreso.
- Panel simple para familia o docente.
- Suscripción premium.

### 5.2 Qué no incluye el MVP

- Álgebra completa.
- Geometría completa.
- Voz o llamadas con IA.
- Reconocimiento avanzado de escritura a mano.
- Juegos multijugador.
- Rankings o competencias.
- Chat social entre estudiantes.
- Contenido para primaria o bachillerato.
- Traducción a varios idiomas.
- Aplicación para iOS en la primera versión.

---

## 6. Funcionalidades principales

### 6.1 Onboarding y selección de grado

**Historia de usuario:**
Como estudiante, quiero elegir mi grado y nivel de confianza para recibir un plan adecuado a mi situación.

**Requisitos:**

- Selección de grado: 7.º, 8.º o 9.º.
- Selección de nivel: "me cuesta mucho", "regular", "bien", "quiero avanzar más".
- Selección de objetivo: recuperar, hacer tareas, prepararme para un examen o avanzar.
- Diagnóstico inicial breve.
- Generación de un plan inicial por destrezas.

**Criterios de aceptación:**

- El estudiante puede completar el onboarding en menos de 3 minutos.
- El sistema asigna un punto de partida según respuestas del diagnóstico.
- El estudiante puede cambiar su grado o nivel después.

### 6.2 Lecciones de fracciones

**Historia de usuario:**
Como estudiante, quiero aprender fracciones con ejemplos visuales y cortos para entender el concepto antes de practicar.

**Requisitos:**

- Lecciones de 3 a 6 minutos.
- Representaciones concretas, visuales y simbólicas.
- Ejemplos resueltos paso a paso.
- Pistas que se retiran gradualmente.
- Ejercicios sin límite de tiempo.
- Posibilidad de repetir una lección.

**Temas incluidos:**

1. Qué es una fracción.
2. Numerador y denominador.
3. Fracciones equivalentes.
4. Simplificación.
5. Comparación de fracciones.
6. Fracciones en la recta numérica.
7. Suma con igual denominador.
8. Resta con igual denominador.
9. Problemas contextualizados.
10. Repaso intercalado.

### 6.3 Práctica adaptativa

**Historia de usuario:**
Como estudiante, quiero practicar problemas que se ajusten a mi nivel para avanzar sin frustrarme.

**Requisitos:**

- Preguntas clasificadas por destreza y dificultad.
- Avance por dominio, no por tiempo.
- Repetición espaciada automática.
- Mezcla de problemas ya dominados con problemas nuevos.
- Reintento sin penalización.
- Registro de errores frecuentes.

**Criterios de aceptación:**

- El estudiante recibe al menos 2 preguntas de recuperación al día siguiente.
- El sistema reintroduce errores comunes después de 1, 3 y 7 días.
- El estudiante puede practicar sin conexión si descargó el tema.

### 6.4 Tutor de IA

**Historia de usuario:**
Como estudiante, quiero un tutor amable que me haga pensar y me explique cuando me equivoco, para no sentirme solo ante un problema difícil.

**Comportamiento del tutor:**

- Saluda de forma cercana y motivadora.
- Pregunta qué parte del problema resulta difícil.
- Pide un primer intento antes de explicar.
- Da pistas graduales.
- Explica el error concreto.
- Muestra ejemplos similares.
- Solo da la solución completa si el estudiante lo pide o tras varios intentos.
- Nunca humilla, compara ni usa lenguaje punitivo.
- No resuelve automáticamente la tarea.

**Ejemplo de flujo:**

1. Estudiante: "No entiendo 3/4 + 1/8."
2. Tutor: "Vamos paso a paso. ¿Crees que puedes sumar directamente los denominadores? ¿Por qué sí o por qué no?"
3. Estudiante: "No sé."
4. Tutor: "Está bien. 3/4 equivale a 6/8. ¿Qué harías ahora con 6/8 y 1/8?"
5. Si el estudiante sigue bloqueado, el tutor muestra una representación visual y luego la solución.

**Criterios de aceptación:**

- El tutor no entrega la respuesta completa en el primer mensaje.
- El tutor ofrece al menos una pista antes de la solución.
- El tutor explica el error identificado.
- El tutor mantiene un tono amable y seguro para menores.
- El tutor puede funcionar con conexión a internet.

### 6.5 Límites de IA

#### Plan gratuito

| Límite diario | Valor |
|---|---|
| Sesiones de tutoría | 2 |
| Mensajes por sesión | 10 |
| Total de mensajes diarios | 20 |
| Duración por sesión | 10 minutos |
| Soluciones paso a paso | 3 |
| Problemas generados por IA | 10 |
| Fotos de ejercicios | 2 |
| Pistas sin solución | Ilimitadas dentro de la sesión |
| Reinicio | Diario |

#### Plan premium

| Límite diario | Valor |
|---|---|
| Sesiones de tutoría | Ilimitadas o cuota alta |
| Mensajes por sesión | Hasta 30 |
| Total de mensajes diarios | Ilimitado o 100, según coste |
| Duración por sesión | 30 minutos |
| Soluciones paso a paso | Ilimitadas |
| Problemas generados por IA | 50 |
| Fotos de ejercicios | 20 |
| Historial | Completo y buscable |
| Modelo de IA | Modelo más capaz para razonamiento complejo |

### 6.6 Modo offline

**Historia de usuario:**
Como estudiante con poca conectividad, quiero descargar ejercicios y practicar sin internet para no depender de datos móviles.

**Requisitos:**

- Descarga de un tema completo.
- Ejercicios, ejemplos y pistas preescritas disponibles offline.
- Progreso guardado localmente.
- Sincronización automática al recuperar conexión.
- Preguntas de IA guardadas en cola para enviarse después.
- Tamaño de descarga bajo, idealmente menor a 100 MB por tema.

**Criterios de aceptación:**

- El estudiante puede completar una sesión de práctica sin internet.
- El progreso no se pierde al cerrar la app.
- Las dudas se envían al tutor cuando vuelve la conexión.

### 6.7 Progreso sin competencia

**Historia de usuario:**
Como estudiante, quiero ver mi progreso personal para sentir que avanzo sin compararme con otros.

**Requisitos:**

- Mapa de destrezas.
- Estado: "por aprender", "en práctica", "dominado".
- Racha opcional, nunca punitiva.
- Sin rankings.
- Sin medallas comparativas.
- Mensajes centrados en esfuerzo y estrategia.

**Ejemplo de mensaje:**
"Hoy recuperaste 3 problemas de fracciones equivalentes. Estás consolidando sumas con distinto denominador."

### 6.8 Panel para familia o docente

**Requisitos:**

- Resumen semanal.
- Temas dominados.
- Temas con dificultad.
- Tiempo de práctica.
- Recomendaciones simples.
- Opción de exportar informe en CSV o PDF.

---

## 7. Modelo de negocio

### Plan gratuito

- Acceso a un tema activo.
- Diagnóstico básico.
- Práctica de recuperación y repetición espaciada.
- 2 sesiones de tutor de IA al día.
- 3 explicaciones paso a paso al día.
- Modo offline para un tema.
- Sin anuncios.

### Plan premium

- Acceso a todos los temas y grados.
- Diagnóstico completo.
- Tutor de IA con mayor cuota.
- Historial completo de conversaciones.
- Informes avanzados.
- Más contenido offline.
- Voz y fotos, en fases posteriores.
- Sin anuncios.

### Plan escolar

- Licencias por estudiante o por aula.
- Panel docente.
- Asignación de temas.
- Informes de grupo.
- Cuota de IA por estudiante.

---

## 8. Requisitos no funcionales

| Requisito | Meta |
|---|---|
| Plataforma inicial | Android |
| Idioma | Español |
| Conectividad | Offline-first para práctica; IA requiere internet |
| Tamaño inicial de app | Menor a 100 MB |
| Dispositivos objetivo | Móviles Android de gama baja |
| Tiempo de carga de pantalla | Menor a 2 segundos |
| Privacidad | Sin datos sensibles; consentimiento adulto cuando corresponda |
| Seguridad de IA | Filtros de contenido y reporte de respuestas |
| Accesibilidad | Texto claro, contraste alto, botones grandes |
| Publicidad | Ninguna |

---

## 9. Arquitectura sugerida

### Frontend

- App Android nativa ligera o framework multiplataforma.
- Almacenamiento local para progreso y contenido descargado.
- Interfaz optimizada para pantallas pequeñas y dispositivos de gama baja.

### Backend

- API para autenticación, suscripciones, sincronización y tutor de IA.
- Base de datos para usuarios, progreso, suscripciones y contenido.
- Servicio de IA con control de tokens, límites y moderación.

### IA

- Modelo económico para conversación, pistas y retroalimentación.
- Modelo más capaz para explicaciones complejas en premium.
- Prompts con reglas pedagógicas estrictas.
- Filtro de contenido inapropiado.
- Registro mínimo de datos pedagógicos.

### Contenido

- Ejercicios en JSON.
- Explicaciones preescritas por tipo de error.
- Ilustraciones SVG ligeras.
- Sin video obligatorio.

---

## 10. Métricas de éxito

| Métrica | Meta inicial |
|---|---|
| Finalización del onboarding | 70% |
| Finalización del diagnóstico | 60% |
| Retención al día 7 | 30% |
| Retención al día 30 | 25% |
| Sesiones de práctica por semana | 3 o más |
| Mejora en prueba de fracciones | 20% o más |
| Retención de aprendizaje a 7 días | 70% o más |
| Conversión gratuita a premium | 3% a 7% |
| Ansiedad matemática autopercibida | Reducción medible |
| Coste de IA por usuario activo semanal | Definir tras piloto |

---

## 11. Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| La IA da respuestas directas | Prompt socrático; solución solo tras intento o petición |
| Coste alto de IA | Límites diarios, modelos económicos, caché de explicaciones |
| Contenido inapropiado | Filtros, reporte y revisión humana |
| Falta de conectividad | Contenido offline y cola de mensajes |
| Estudiantes abandonan | Sesiones cortas, metas pequeñas y progreso visible |
| Errores de la IA | Banco de ejercicios verificado y explicaciones preescritas |
| Preocupación de privacidad | Datos mínimos, consentimiento y transparencia |

---

## 12. Hoja de ruta

### Fase 1: MVP — 8 a 12 semanas

- Onboarding y selección de grado.
- Tema de fracciones.
- Práctica offline.
- Tutor de IA básico.
- Plan gratuito y premium.
- Panel simple para familia o docente.

### Fase 2: expansión — 3 a 6 meses

- Más temas: proporciones, porcentajes, ecuaciones lineales.
- Diagnóstico adaptativo más preciso.
- Voz y fotos.
- Informes avanzados.
- Plan escolar.

### Fase 3: escala — 6 a 12 meses

- Más grados y currículos.
- Comunidad de docentes.
- Contenido localizado por país.
- Recomendaciones automáticas de estudio.
- Integración con escuelas.

---

## 13. Definición de listo para lanzar

El MVP está listo cuando:

- [ ] El estudiante puede registrarse y elegir grado.
- [ ] Puede completar el diagnóstico inicial.
- [ ] Puede estudiar fracciones con ejemplos y práctica.
- [ ] Puede practicar sin conexión.
- [ ] Puede conversar con el tutor de IA dentro de los límites gratuitos.
- [ ] El tutor no entrega la solución antes de un intento.
- [ ] El progreso se guarda localmente y se sincroniza.
- [ ] El plan premium puede comprarse o activarse.
- [ ] No existen rankings, anuncios ni castigos por error.
- [ ] La app funciona en un móvil Android de gama baja.
- [ ] Se han probado al menos 20 estudiantes reales.

---

## 14. Referencias principales

- OECD, *Does Math Make You Anxious?*
  https://www.oecd.org/en/publications/does-math-make-you-anxious_5js6b2579tnx-en.html

- OECD, *PISA 2022 Results, Volume I*.
  https://www.oecd.org/en/publications/2023/12/pisa-2022-results-volume-i_76772a36/full-report/how-did-countries-perform-in-pisa_dc514907.html

- Dunlosky et al., *Improving Students' Learning With Effective Learning Techniques* (2013).
  https://journals.sagepub.com/stoken/rbtfl/Z10jaVH/60XQM/full

- EEF, *Feedback*.
  https://eef.dev/education-evidence/teaching-learning-toolkit/feedback

- EEF, *One to One Tuition*.
  https://educationendowmentfoundation.org.uk/education-evidence/teaching-learning-toolkit/one-to-one-tuition

- What Works Clearinghouse, *Teaching Strategies for Improving Algebra Knowledge in Middle and High School Students*.
  https://ies.ed.gov/ncee/wwc

- UNESCO, *Guidance for Generative AI in Education and Research*.
  https://www.unesco.org/en/articles/guidance-generative-ai-in-education-and-research

- Khan Academy, descargas y modo offline.
  https://en.khanacademy.org/downloads

- Brilliant, FAQ y disponibilidad offline.
  https://brilliant.org/faq/
