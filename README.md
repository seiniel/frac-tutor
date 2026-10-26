# FracTutor: PWA Educativa de Fracciones con Tutor Socrático de IA

**FracTutor** es una Aplicación Web Progresiva (PWA) de matemáticas diseñada específicamente para adolescentes de 12 a 15 años (7.º, 8.º y 9.º de secundaria), construida sobre principios pedagógicos basados en evidencia (*retrieval practice*, repetición espaciada, ejemplos con desvanecimiento gradual) y una filosofía de **cero ansiedad matemática** (sin pérdida de vidas, sin cronómetros punitivos ni tablas competitivas).

Incluye un **Tutor de IA Socrático** impulsado por Google Gemini Flash mediante un proxy seguro en Express, con cumplimiento estricto de **OWASP Top 10**, **OWASP ASVS (Nivel 1)** y **OWASP Top 10 for LLMs**.

---

## Características Principales

- **Diagnóstico Adaptativo Inicial**: 8 preguntas clave clasificadas por habilidades para ubicar al estudiante en su nivel de partida en menos de 3 minutos.
- **10 Micro-Lecciones Interactivas**: De 3 a 5 minutos cada una, con visualizadores SVG interactivos (barras de fracción táctiles, círculos de partes proporcionales y recta numérica deslizable).
- **Práctica con Desvanecimiento Gradual**: Ejemplos resueltos paso a paso, ejercicios semi-guiados y práctica independiente con pistas progresivas.
- **Repetición Espaciada**: Algoritmo pedagógico local que programa repasos a 1, 3 y 7 días según el desempeño del estudiante.
- **Tutor de IA Socrático y Seguro**:
  - Saluda cordialmente, no regala respuestas directas y formula preguntas orientadoras con analogías cotidianas.
  - Límites de uso saludables: 2 sesiones/día y 10 mensajes/sesión.
  - Mecanismo interactivo para reportar respuestas confusas o inapropiadas.
  - Modo offline con motor pedagógico local en caso de pérdida de conexión.
- **Soporte PWA 100% Instalable y Offline**: Funciona sin conexión mediante IndexedDB y Service Worker.
- **Modo Claro / Modo Oscuro**: Interruptor accesible y persistente en toda la interfaz.

---

## Seguridad y Privacidad (OWASP AppSec & LLM Top 10)

1. **Proxy Backend Aislado (`server.ts`)**: `GEMINI_API_KEY` se lee exclusivamente en el servidor. Nunca se compila ni se expone al cliente.
2. **Validación de Cuotas en Servidor**: Las 2 sesiones y 10 mensajes diarios se controlan en backend con respuesta `HTTP 429` ante abusos.
3. **Cero XSS / Sanitización Estricta**: Eliminación total de `dangerouslySetInnerHTML`. Saneamiento riguroso de caracteres matemáticos y renderizado React nativo.
4. **Protección contra Inyección de Prompts**: `systemInstruction` inmutable en backend, límite de 350 caracteres por mensaje y filtros heurísticos anti-jailbreak.
5. **Seguridad y Bienestar para Menores**: Filtros de moderación contra contenido ofensivo o recopilación de datos de contacto.
6. **Privacidad de Datos (COPPA / GDPR-K)**: Almacenamiento local mínimo en IndexedDB (alias y grado escolar). No se solicitan apellidos, emails, ubicaciones ni contraseñas.
7. **Cabeceras HTTP Defensivas**: Content-Security-Policy (CSP), `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin` y `Permissions-Policy` que desactiva cámara, micrófono y geolocalización.
8. **0 Vulnerabilidades en Dependencias**: Auditado y verificado con `npm audit`.

---

## Estructura del Proyecto

```text
├── server.ts             # Servidor Express (proxy Gemini API, cuotas, CSP, reportes)
├── src/
│   ├── components/       # Componentes React (lecciones, visualizadores SVG, tutor)
│   │   ├── fractions/    # FractionBar, FractionCircle, NumberLine, FadedExample
│   │   ├── tutor/        # AITutorDrawer, ReportDialog
│   │   └── ui/           # ThemeToggle, PWAInstallButton, botones accesibles
│   ├── data/             # Banco de lecciones y ejercicios curriculares (JSON)
│   ├── utils/            # Persistencia en IndexedDB, repetición espaciada y motor offline
│   ├── types/            # Definiciones de TypeScript
│   ├── App.tsx           # Aplicación principal y enrutador de vistas
│   └── main.tsx          # Punto de entrada de React 19
├── public/               # Favicon, manifest PWA e iconos SVG/PNG
├── vite.config.ts        # Configuración de Vite y vite-plugin-pwa
└── package.json          # Dependencias y scripts
```

---

## Requisitos Previos

- **Node.js** v20+ o v22+
- **npm** v10+

---

## Instalación y Configuración

1. **Clonar el repositorio:**
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd <CARPETA_DEL_PROYECTO>
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
   Copia el archivo de ejemplo:
   ```bash
   cp .env.example .env
   ```
   Edita `.env` y añade tu API key de Google Gemini:
   ```env
   GEMINI_API_KEY=tu_clave_de_gemini_aqui
   PORT=3000
   ```

---

## Scripts Disponibles

- **Desarrollo (Servidor Express + Vite HMR):**
  ```bash
  npm run dev
  ```
  Abre `http://localhost:3000` en tu navegador.

- **Compilar para producción:**
  ```bash
  npm run build
  ```

- **Iniciar en producción:**
  ```bash
  npm run start
  ```

- **Verificación de tipos (Linting):**
  ```bash
  npm run lint
  ```

- **Auditoría de seguridad de dependencias:**
  ```bash
  npm audit
  ```

---

## Cómo Subir este Proyecto a un Nuevo Repositorio de GitHub

Si deseas conectar y publicar este proyecto en tu cuenta de GitHub:

1. Crea un repositorio vacío en [GitHub](https://github.com/new) (por ejemplo `fractutor-pwa`). No marques "Initialize with README".
2. En tu terminal local, vincula el repositorio remoto y sube la rama `main`:
   ```bash
   git remote add origin https://github.com/TU_USUARIO/fractutor-pwa.git
   git branch -M main
   git push -u origin main
   ```

---

## Licencia

Distribuido bajo la licencia MIT. Uso educativo libre y seguro.
