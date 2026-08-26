// Esta función corre en el servidor de Vercel, NUNCA en el navegador del usuario.
// Por eso la API key de Gemini queda protegida (se lee de una variable de entorno).

const LISTADO = {
  "Área Civil y Familia": [
    "EXPEDIENTES DE PROCESOS JUDICIALES CIVILES DE REVISION",
    "EXPEDIENTES DE PROCESOS JUDICIALES CONTENCIOSOS DE MAYOR CUANTIA JURISDICCION CIVIL",
    "EXPEDIENTES DE PROCESOS JUDICIALES CONTENCIOSOS DE MAYOR CUANTIA JURISDICCION CIVIL FAMILIA",
    "EXPEDIENTES DE PROCESOS JUDICIALES CONTENCIOSOS DE MINIMA Y MENOR CUANTIA JURISDICCION CIVIL",
    "EXPEDIENTES DE PROCESOS JUDICIALES CONTENCIOSOS DE MINIMA Y MENOR CUANTIA JURISDICCION FAMILIA",
    "EXPEDIENTES DE PROCESOS JUDICIALES DE CELEBRACION DE MATRIMONIO",
    "EXPEDIENTES DE PROCESOS JUDICIALES DE FAMILIA",
    "EXPEDIENTES DE PROCESOS JUDICIALES DE JURISDICCION VOLUNTARIA",
    "EXPEDIENTES DE PROCESOS JUDICIALES DE REORGANIZACION Y/O LIQUIDATORIOS",
    "EXPEDIENTES DE PROCESOS JUDICIALES DE RESTITUCION DE TIERRAS",
    "EXPEDIENTES DE PROCESOS JUDICIALES DECLARATIVOS",
    "EXPEDIENTES DE PROCESOS JUDICIALES DECLARATIVOS DE ACCION DE PROTECCION AL CONSUMIDOR",
    "EXPEDIENTES DE PROCESOS JUDICIALES DECLARATIVOS ESPECIALES",
    "EXPEDIENTES DE PROCESOS JUDICIALES DECLARATIVOS VERBALES",
    "EXPEDIENTES DE PROCESOS JUDICIALES DECLARATIVOS VERBALES SUMARIOS",
    "EXPEDIENTES DE PROCESOS JUDICIALES EJECUTIVOS",
    "EXPEDIENTES DE PROCESOS JUDICIALES EJECUTIVOS DE MAYOR CUANTIA JURISDICCION CIVIL",
    "EXPEDIENTES DE PROCESOS JUDICIALES EJECUTIVOS DE MINIMA Y MENOR CUANTIA JURISDICCION CIVIL",
    "EXPEDIENTES DE PROCESOS JUDICIALES EJECUTIVOS JURISDICCION FAMILIA",
    "SOLICITUDES DE APREHENSION Y ENTREGA EN GARANTIAS MOBILIARIAS",
  ],
  "Área Constitucional y Acciones Especiales": [
    "ACCIONES CONSTITUCIONALES DE CUMPLIMIENTO",
    "ACCIONES CONSTITUCIONALES DE GRUPO",
    "ACCIONES CONSTITUCIONALES DE HABEAS CORPUS",
    "ACCIONES CONSTITUCIONALES DE PERDIDA DE INVESTIDURA",
    "ACCIONES CONSTITUCIONALES DE PERDIDA DE INVESTIDURA DE CONGRESISTAS",
    "ACCIONES CONSTITUCIONALES DE TUTELA",
    "ACCIONES CONSTITUCIONALES POPULARES",
    "INCIDENTES DE DESACATO",
    "SOLICITUDES DE NULIDAD DE SENTENCIAS DE TUTELA",
  ],
  "Área Laboral": [
    "EXPEDIENTES DE PROCESOS JUDICIALES LABORALES CONTENCIOSOS DE MAYOR CUANTIA",
    "EXPEDIENTES DE PROCESOS JUDICIALES LABORALES DE CONFLICTO DE COMPETENCIA",
    "EXPEDIENTES DE PROCESOS JUDICIALES LABORALES DE MINIMA CUANTIA",
    "EXPEDIENTES DE PROCESOS JUDICIALES LABORALES DE PAGOS POR CONSIGNACION",
    "EXPEDIENTES DE PROCESOS JUDICIALES LABORALES DE REVISION",
    "EXPEDIENTES DE PROCESOS JUDICIALES LABORALES DE UNICA INSTANCIA",
    "EXPEDIENTES DE PROCESOS JUDICIALES LABORALES EJECUTIVOS",
    "EXPEDIENTES DE PROCESOS JUDICIALES LABORALES ESPECIALES DE ACOSO LABORAL",
    "EXPEDIENTES DE PROCESOS JUDICIALES LABORALES ESPECIALES DE CALIFICACION DE LA SUSPENSION O PARO COLECTIVO DEL TRABAJO",
    "EXPEDIENTES DE PROCESOS JUDICIALES LABORALES ESPECIALES DE DISOLUCION Y LIQUIDACION DE SINDICATOS",
    "EXPEDIENTES DE PROCESOS JUDICIALES LABORALES ESPECIALES DE FUERO SINDICAL",
    "EXPEDIENTES DE PROCESOS JUDICIALES LABORALES ORDINARIOS",
    "EXPEDIENTES DE PROCESOS JUDICIALES LABORALES ORDINARIOS CONTRA SEDES DIPLOMATICAS",
    "EXPEDIENTES DE PROCESOS JUDICIALES LABORALES SUMARIOS",
  ],
  "Área Contencioso Administrativo": [
    "MEDIO DE CONTROL ACCIONES DE LESIVIDAD",
    "MEDIO DE CONTROL ACCIONES DE REPARACION DIRECTA",
    "MEDIO DE CONTROL ACCIONES DE REPETICION",
    "MEDIO DE CONTROL AUTOMATICO DE LEGALIDAD DE FALLOS CON RESPONSABILIDAD FISCAL",
    "MEDIO DE CONTROL DE CONTROVERSIAS CONTRACTUALES",
    "MEDIO DE CONTROL DE NULIDAD",
    "MEDIO DE CONTROL DE NULIDAD DE ADJUDICACION DE BALDIOS",
    "MEDIO DE CONTROL DE NULIDAD Y RESTABLECIMIENTO DEL DERECHO",
    "MEDIO DE CONTROL EXEQUIBILIDAD ACUERDOS MUNICIPALES",
    "MEDIO DE CONTROL INMEDIATO DE LEGALIDAD",
    "MEDIO DE CONTROL NULIDAD ELECTORAL",
    "MEDIO DE CONTROL NULIDAD POR INCONSTITUCIONALIDAD",
  ],
  "Área Penal y Disciplinario": [
    "EXPEDIENTES DE PROCESOS JUDICIALES PENALES DE REVISION",
    "EXPEDIENTES DE PROCESOS JUDICIALES PENALES LEY 1098 DE 2006 SRPA SISTEMA DE RESPONSABILIDAD PENAL PARA ADOLESCENTES",
    "EXPEDIENTES DE PROCESOS JUDICIALES PENALES LEY 1826 DE 2017",
    "EXPEDIENTES DE PROCESOS JUDICIALES PENALES LEY 600 DE 2000",
    "EXPEDIENTES DE PROCESOS JUDICIALES PENALES LEY 906 DE 2004",
    "PROCESOS DISCIPLINARIOS CONTRA ABOGADOS",
    "PROCESOS DISCIPLINARIOS CONTRA FISCALES",
    "PROCESOS DISCIPLINARIOS CONTRA FUNCIONARIOS Y EMPLEADOS JUDICIALES",
  ],
  "Trámites Varios y Solicitudes": [
    "CONCILIACIONES EXTRAJUDICIALES",
    "PRUEBAS EXTRAPROCESALES",
    "SOLICITUDES DE AMPARO DE POBREZA",
    "SOLICITUDES DE DESPACHO COMISORIO",
  ],
};

const FLAT_LIST = Object.entries(LISTADO)
  .map(([area, items]) => `${area}:\n${items.map((i) => `- ${i}`).join("\n")}`)
  .join("\n\n");

const SYSTEM_PROMPT = `Eres un asistente experto en clasificación de expedientes judiciales de la Rama Judicial de Colombia, apoyando la migración de procesos al Sistema de Gestión Documental Electrónica (SGDE - Alfresco).

Tu tarea: leer el auto judicial (admisorio u otro) adjunto en PDF y determinar a cuál SUBÍNDICE (clase de proceso) pertenece, eligiendo EXCLUSIVAMENTE una opción del siguiente listado oficial, agrupado por área:

${FLAT_LIST}

Analiza el contenido del auto: tipo de acción o medio de control, jurisdicción, cuantía si se menciona, ley aplicable, y cualquier otro elemento que permita identificar la clase de proceso.

Responde ÚNICAMENTE con un objeto JSON válido, sin texto adicional, sin markdown, con esta forma exacta:
{
  "area": "nombre exacto del área",
  "subindice": "nombre exacto del subíndice tal como aparece en el listado",
  "confianza": "alta" | "media" | "baja",
  "explicacion": "explicación breve (2-4 frases) de por qué se eligió ese subíndice, citando los elementos del auto que lo sustentan",
  "alternativa": "si la confianza es media o baja, nombre de un segundo subíndice posible; si no aplica, cadena vacía"
}`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const { base64Pdf } = req.body;
    if (!base64Pdf) {
      return res.status(400).json({ error: "Falta el archivo PDF (base64Pdf)." });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Falta configurar GEMINI_API_KEY en Vercel." });
    }

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [
            {
              role: "user",
              parts: [
                { inline_data: { mime_type: "application/pdf", data: base64Pdf } },
                { text: "Clasifica este auto judicial según las instrucciones. Responde solo con el JSON." },
              ],
            },
          ],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.2,
          },
        }),
      }
    );

    const data = await geminiRes.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message || "Error de la API de Gemini." });
    }

    const textBlock = data.candidates?.[0]?.content?.parts?.find((p) => p.text)?.text;
    if (!textBlock) {
      return res.status(500).json({ error: "No se recibió respuesta del modelo." });
    }

    const clean = textBlock.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    return res.status(200).json(parsed);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message || "Error interno del servidor." });
  }
}
