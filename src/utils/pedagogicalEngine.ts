// Engine pedagógico resiliente de apoyo para FracTutor
// Provee asistencia socrática inmediata y matemáticamente precisa
// para estudiantes de 12 a 15 años cuando no hay conexión externa o durante alta demanda.

export interface PedagogicalAnalysisResult {
  text: string;
  isFallback: boolean;
  modelUsed: string;
  topicDetected?: string;
}

// Calcula el Máximo Común Divisor (MCD / GCD)
export function getGCD(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x;
}

// Limpia formatos LaTeX residuales
export function sanitizeMathText(rawText: string): string {
  if (!rawText) return rawText;
  let text = rawText;
  text = text.replace(/\\?\$?\\frac\{([^{}]+)\}\{([^{}]+)\}\$?/g, '$1/$2');
  text = text.replace(/\$([^$]+)\$/g, '$1');
  text = text.replace(/\\times/g, '×').replace(/\\cdot/g, '·');
  return text;
}

// Analizador y generador pedagógico experto
export function generatePedagogicalResponse(
  studentMessage: string,
  history: Array<{ role: string; text: string }> = [],
  contextTopic?: string
): PedagogicalAnalysisResult {
  const msg = (studentMessage || '').trim().toLowerCase();

  // 1. Detección de operaciones directas entre dos fracciones (ej. 1/2 + 1/3, 3/4 - 1/2, 2/3 * 4/5, 3/4 / 2/3)
  const operationMatch = msg.match(/(\d+)\s*\/\s*(\d+)\s*([+\-*x×÷/]|mas|más|menos|por|entre)\s*(\d+)\s*\/\s*(\d+)/i);
  if (operationMatch) {
    const num1 = parseInt(operationMatch[1], 10);
    const den1 = parseInt(operationMatch[2], 10);
    const opRaw = operationMatch[3].toLowerCase();
    const num2 = parseInt(operationMatch[4], 10);
    const den2 = parseInt(operationMatch[5], 10);

    if (den1 > 0 && den2 > 0) {
      if (opRaw === '+' || opRaw === 'mas' || opRaw === 'más') {
        if (den1 === den2) {
          const sumNum = num1 + num2;
          return {
            text: `¡Veo tu ejercicio: ${num1}/${den1} + ${num2}/${den2}!
Como ambos denominadores son iguales (${den1}), ¡las rebanadas ya tienen el mismo tamaño!
• Regla de oro: El denominador se queda igual (${den1}).
• Solo sumamos los números de arriba: ${num1} + ${num2} = ${sumNum}.
El resultado preliminar es ${sumNum}/${den1}. ¿Crees que se pueda simplificar dividiendo ambos números?`,
            isFallback: true,
            modelUsed: 'motor-pedagogico-resiliente',
            topicDetected: 'suma_mismo_denominador'
          };
        } else {
          const commonDen = den1 * den2;
          const equivNum1 = num1 * den2;
          const equivNum2 = num2 * den1;
          const totalNum = equivNum1 + equivNum2;
          return {
            text: `¡Gran ejercicio de suma con diferente denominador: ${num1}/${den1} + ${num2}/${den2}!
Paso 1: Como las rebanadas no son del mismo tamaño (${den1} y ${den2}), buscamos un denominador común. Por ejemplo, multiplicando los números de abajo: ${den1} × ${den2} = ${commonDen}.
Paso 2: Buscamos fracciones equivalentes:
• ${num1}/${den1} equivale a ${equivNum1}/${commonDen} (multiplicando por ${den2} arriba y abajo).
• ${num2}/${den2} equivale a ${equivNum2}/${commonDen} (multiplicando por ${den1} arriba y abajo).
Paso 3: Ahora que las rebanadas son iguales, solo sumamos arriba: ${equivNum1} + ${equivNum2} = ${totalNum}.
Nos queda ${totalNum}/${commonDen}. ¿Qué te parece este paso a paso?`,
            isFallback: true,
            modelUsed: 'motor-pedagogico-resiliente',
            topicDetected: 'suma_distinto_denominador'
          };
        }
      }

      if (opRaw === '-' || opRaw === 'menos') {
        if (den1 === den2) {
          const diffNum = num1 - num2;
          return {
            text: `Para restar ${num1}/${den1} - ${num2}/${den2}:
Como los denominadores son idénticos (${den1}), las partes son del mismo tamaño.
• Conservamos el denominador: ${den1}.
• Restamos solo los numeradores: ${num1} - ${num2} = ${diffNum}.
El resultado es ${diffNum}/${den1}. ¿Se puede simplificar en tu cuaderno?`,
            isFallback: true,
            modelUsed: 'motor-pedagogico-resiliente',
            topicDetected: 'resta_mismo_denominador'
          };
        } else {
          const commonDen = den1 * den2;
          const equivNum1 = num1 * den2;
          const equivNum2 = num2 * den1;
          const diffNum = equivNum1 - equivNum2;
          return {
            text: `Para la resta con diferente denominador (${num1}/${den1} - ${num2}/${den2}):
Paso 1: Buscamos un denominador común. Multiplicamos abajo: ${den1} × ${den2} = ${commonDen}.
Paso 2: Llevamos a fracciones equivalentes:
• ${num1}/${den1} se convierte en ${equivNum1}/${commonDen}.
• ${num2}/${den2} se convierte en ${equivNum2}/${commonDen}.
Paso 3: Ahora solo restamos arriba: ${equivNum1} - ${equivNum2} = ${diffNum}.
Obtenemos ${diffNum}/${commonDen}. ¿Te hace sentido visualmente?`,
            isFallback: true,
            modelUsed: 'motor-pedagogico-resiliente',
            topicDetected: 'resta_distinto_denominador'
          };
        }
      }

      if (opRaw === '*' || opRaw === 'x' || opRaw === '×' || opRaw === 'por') {
        const prodNum = num1 * num2;
        const prodDen = den1 * den2;
        const gcd = getGCD(prodNum, prodDen);
        return {
          text: `¡Multiplicar fracciones es súper directo: ${num1}/${den1} × ${num2}/${den2}!
Multiplicamos en línea recta:
• Arriba: ${num1} × ${num2} = ${prodNum}
• Abajo: ${den1} × ${den2} = ${prodDen}
Nos da ${prodNum}/${prodDen}.${gcd > 1 ? ` Y si dividimos ambos entre ${gcd}, simplifica a ${prodNum / gcd}/${prodDen / gcd}.` : ' ¡Ya está en su forma irreductible!'}
¿Quieres probar con otro ejemplo?`,
          isFallback: true,
          modelUsed: 'motor-pedagogico-resiliente',
          topicDetected: 'multiplicacion'
        };
      }

      if (opRaw === '÷' || opRaw === 'entre') {
        const divNum = num1 * den2;
        const divDen = den1 * num2;
        return {
          text: `Para dividir fracciones (${num1}/${den1} ÷ ${num2}/${den2}), usamos el método de multiplicar cruzado o invertir la segunda fracción:
• El ${num1} de arriba multiplica al ${den2} de abajo = ${divNum}.
• El ${den1} de abajo multiplica al ${num2} de arriba = ${divDen}.
El resultado es ${divNum}/${divDen}.
¿Notas por qué dividir es equivalente a multiplicar por el inverso?`,
          isFallback: true,
          modelUsed: 'motor-pedagogico-resiliente',
          topicDetected: 'division'
        };
      }
    }
  }

  // 2. Detección de simplificación de una fracción específica (ej. "simplificar 12/18", "4/8")
  const singleFracMatch = msg.match(/(simplif|reduc|achic).*?(\d+)\s*\/\s*(\d+)/i) ||
                          msg.match(/(\d+)\s*\/\s*(\d+).*?(simplif|reduc|forma más simple)/i);
  if (singleFracMatch) {
    const rawMatch = msg.match(/(\d+)\s*\/\s*(\d+)/);
    if (rawMatch) {
      const num = parseInt(rawMatch[1], 10);
      const den = parseInt(rawMatch[2], 10);
      if (den > 0) {
        const gcd = getGCD(num, den);
        if (gcd > 1) {
          const simNum = num / gcd;
          const simDen = den / gcd;
          return {
            text: `¡Vamos a simplificar ${num}/${den}!
Simplificar significa encontrar una fracción equivalente con números más pequeños, dividiendo arriba y abajo por el mismo divisor.
• ¿Notaste que ambos números (${num} y ${den}) se pueden dividir exactamente entre ${gcd}?
• Si dividimos ${num} ÷ ${gcd} = ${simNum}, y ${den} ÷ ${gcd} = ${simDen}.
¡La fracción simplificada es ${simNum}/${simDen}!
¿Quieres que revisemos cómo encontrar el divisor común?`,
            isFallback: true,
            modelUsed: 'motor-pedagogico-resiliente',
            topicDetected: 'simplificacion'
          };
        } else {
          return {
            text: `Revisemos ${num}/${den}:
El número de arriba (${num}) y el de abajo (${den}) no tienen divisores comunes mayores a 1 (son primos entre sí).
Eso significa que ${num}/${den} ya está en su forma irreductible (la más simple posible). ¡Buen ojo!`,
            isFallback: true,
            modelUsed: 'motor-pedagogico-resiliente',
            topicDetected: 'simplificacion_irreductible'
          };
        }
      }
    }
  }

  // 3. Comparación de dos fracciones
  if (
    msg.includes('compar') ||
    msg.includes('mayor') ||
    msg.includes('menor') ||
    msg.includes('cual es mas grande') ||
    msg.includes('cuál es más grande')
  ) {
    const twoFracs = msg.match(/(\d+)\s*\/\s*(\d+).*?(\d+)\s*\/\s*(\d+)/);
    if (twoFracs) {
      const a = parseInt(twoFracs[1], 10);
      const b = parseInt(twoFracs[2], 10);
      const c = parseInt(twoFracs[3], 10);
      const d = parseInt(twoFracs[4], 10);
      const cross1 = a * d;
      const cross2 = c * b;
      const winner = cross1 > cross2 ? `${a}/${b} es mayor` : cross1 < cross2 ? `${c}/${d} es mayor` : 'ambas son exactamente iguales';
      return {
        text: `Para comparar ${a}/${b} con ${c}/${d}, el truco del producto cruzado es infalible:
1. Multiplica el numerador de la primera por el denominador de la segunda: ${a} × ${d} = ${cross1}.
2. Multiplica el numerador de la segunda por el denominador de la primera: ${c} × ${b} = ${cross2}.
Como comparamos ${cross1} con ${cross2}, concluimos que ${winner}.
¿Tiene sentido cómo el producto cruzado compara rebanadas equivalentes?`,
        isFallback: true,
        modelUsed: 'motor-pedagogico-resiliente',
        topicDetected: 'comparacion'
      };
    }
    return {
      text: `Para comparar dos fracciones y saber cuál es mayor:
1. Puedes multiplicar en cruz: el numerador de la primera por el denominador de la segunda, y viceversa.
2. O convertirlas a un denominador común para ver cuál tiene más rebanadas arriba.
¿Qué fracciones quieres comparar?`,
      isFallback: true,
      modelUsed: 'motor-pedagogico-resiliente',
      topicDetected: 'comparacion_general'
    };
  }

  // 4. Fracciones equivalentes
  if (msg.includes('equivalent') || msg.includes('iguales') || msg.includes('amplific')) {
    return {
      text: `Dos fracciones son equivalentes cuando representan la misma cantidad de pizza o chocolate, aunque se escriban con números distintos.
Por ejemplo: 1/2 = 2/4 = 4/8 (¡todas son exactamente la mitad!).
• Para amplificar: multiplica numerador y denominador por el mismo número (ej: 2/3 × 2/2 = 4/6).
• Para simplificar: divide numerador y denominador entre el mismo número (ej: 6/9 ÷ 3/3 = 2/3).
¿Qué fracción quieres convertir en equivalente?`,
      isFallback: true,
      modelUsed: 'motor-pedagogico-resiliente',
      topicDetected: 'equivalencia'
    };
  }

  // 5. Concepto de Numerador y Denominador / Símbolos
  if (
    msg.includes('símbolo') ||
    msg.includes('simbolo') ||
    msg.includes('numerador') ||
    msg.includes('denominador') ||
    msg.includes('arriba') ||
    msg.includes('abajo') ||
    msg.includes('que significa') ||
    msg.includes('qué significa')
  ) {
    return {
      text: `¡Pensemos en una fracción (como 3/4) de forma muy visual!:
• El número de abajo (Denominador): es el tamaño del corte. Te dice en cuántas partes iguales dividiste todo el pastel (aquí en 4 trozos).
• El número de arriba (Numerador): es la cuenta. Te dice cuántos trozos tomaste en tu plato (aquí 3 trozos).
Por eso, mientras más grande sea el número de abajo (como 1/10 vs 1/2), ¡más pequeño es cada pedazo individual!
¿Te queda más claro así?`,
      isFallback: true,
      modelUsed: 'motor-pedagogico-resiliente',
      topicDetected: 'concepto_base'
    };
  }

  // 6. Por qué no se suman los denominadores
  if (
    msg.includes('por que no se suman') ||
    msg.includes('por qué no se suman') ||
    msg.includes('sumar abajo') ||
    msg.includes('sumar los de abajo')
  ) {
    return {
      text: `¡Esta es la duda más importante de toda secundaria!
Imagina que tienes 1 rebanada de una pizza de 4 partes (1/4), y tomas otra rebanada de la misma pizza (1/4).
Si sumaras abajo (1+1)/(4+4) te daría 2/8 (¡que es una pizza cortada en 8 partes, o sea más pequeña!).
En realidad, tienes 2 rebanadas de tamaño cuarto: 2/4.
El denominador solo nombra el tamaño del corte, ¡por eso no cambia al sumar! ¿Tiene sentido?`,
      isFallback: true,
      modelUsed: 'motor-pedagogico-resiliente',
      topicDetected: 'por_que_no_sumar_denominadores'
    };
  }

  // 7. Números mixtos e impropias
  if (msg.includes('mixto') || msg.includes('improp') || msg.includes('propia') || msg.includes('entero')) {
    return {
      text: `¡Los números mixtos combinan unidades enteras con una fracción!:
• Fracción propia: El numerador es menor que el denominador (ej. 3/4). Es menos de 1 unidad.
• Fracción impropia: El numerador es mayor o igual al denominador (ej. 7/4). Tienes más de 1 unidad completa.
Para convertir 7/4 a número mixto: divide 7 entre 4. Cabe 1 vez completa y sobran 3 partes. Así que se escribe como 1 y 3/4.
¿Quieres que convirtamos alguna fracción que tengas en tu cuaderno?`,
      isFallback: true,
      modelUsed: 'motor-pedagogico-resiliente',
      topicDetected: 'mixtos_e_impropias'
    };
  }

  // 8. Recta numérica
  if (msg.includes('recta') || msg.includes('ubicar') || msg.includes('grafic')) {
    return {
      text: `Para ubicar una fracción en la recta numérica (por ejemplo 3/5):
1. Dibuja el tramo de 0 a 1.
2. Divídelo en tantas partes iguales como indique el denominador (aquí en 5 partes iguales).
3. Avanza dando saltitos desde el 0 según el numerador (3 saltitos hacia la derecha).
¡Justo en el tercer salto está ubicada tu fracción 3/5!
¿Qué fracción necesitas ubicar en la recta?`,
      isFallback: true,
      modelUsed: 'motor-pedagogico-resiliente',
      topicDetected: 'recta_numerica'
    };
  }

  // 9. Mínimo Común Múltiplo (MCM)
  if (msg.includes('mcm') || msg.includes('minimo comun') || msg.includes('mínimo común')) {
    return {
      text: `El Mínimo Común Múltiplo (MCM) nos ayuda a encontrar el denominador común más pequeño.
Por ejemplo, para 4 y 6:
• Múltiplos de 4: 4, 8, 12, 16, 20...
• Múltiplos de 6: 6, 12, 18, 24...
El primer número que coincide en ambas listas es el 12. ¡Ese es el MCM!
Usar 12 hace que las operaciones sean mucho más fáciles y sin números gigantes. ¿De qué números necesitas el MCM?`,
      isFallback: true,
      modelUsed: 'motor-pedagogico-resiliente',
      topicDetected: 'mcm'
    };
  }

  // 10. Apoyo emocional y reducción de ansiedad
  if (
    msg.includes('no puedo') ||
    msg.includes('dificil') ||
    msg.includes('difícil') ||
    msg.includes('no entiendo nada') ||
    msg.includes('me rindo') ||
    msg.includes('miedo') ||
    msg.includes('tonto') ||
    msg.includes('ansiedad') ||
    msg.includes('frustr')
  ) {
    return {
      text: `¡Respira profundo, estudiante estrella!
Las fracciones son el tema donde la mayoría de los estudiantes de secundaria sienten tropiezos, porque nuestro cerebro está acostumbrado a contar números enteros (1, 2, 3...) y de repente las fracciones dividen las cosas en pedazos.
Aquí no hay notas malas ni prisas. Equivocarse es la forma exacta en la que el cerebro crea nuevas conexiones.
Dime qué ejercicio tienes enfrente y lo resolvemos como si fuera una pizza o una barra de chocolate. ¿Cuál es?`,
      isFallback: true,
      modelUsed: 'motor-pedagogico-resiliente',
      topicDetected: 'apoyo_emocional'
    };
  }

  // 11. Saludos o comprobación de conexión
  if (
    msg.includes('hola') ||
    msg.includes('estas ahi') ||
    msg.includes('estás ahí') ||
    msg.includes('buenas') ||
    msg.includes('que tal') ||
    msg.includes('qué tal')
  ) {
    return {
      text: `¡Hola! Aquí estoy listo y conectado con respaldo continuo para acompañarte en tu aprendizaje.
¿Qué ejercicio o concepto de fracciones te gustaría que practiquemos hoy?`,
      isFallback: true,
      modelUsed: 'motor-pedagogico-resiliente',
      topicDetected: 'saludo'
    };
  }

  // Respuesta contextual socrática por defecto
  return {
    text: `¡Qué buena pregunta! Para ayudarte a razonarlo sin darte la respuesta de golpe:
Pensemos en el problema como una pizza o una barra de chocolate dividida en partes iguales.
• ¿Cuáles son los números de arriba (numeradores) y los de abajo (denominadores)?
• ¿Crees que las partes son del mismo tamaño o necesitamos encontrar un tamaño común primero?
Dime tu primera idea y la construimos juntos.`,
    isFallback: true,
    modelUsed: 'motor-pedagogico-resiliente',
    topicDetected: 'socratico_general'
  };
}
