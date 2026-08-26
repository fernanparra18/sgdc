# Clasificador de Subíndice — SGDE

App para clasificar autos judiciales (PDF) en su subíndice / clase de proceso,
usando Gemini, para apoyar la migración de OneDrive al SGDE (Alfresco).

## Antes de desplegar

1. Consigue una API key gratis en https://aistudio.google.com/apikey
2. NO la pegues en ningún archivo de este proyecto.
3. Al desplegar en Vercel, agrégala como variable de entorno llamada
   `GEMINI_API_KEY` (ver guía paso a paso que te dio Claude en el chat).

## Estructura

- `public/index.html` → la app que ve el usuario (subir PDF, ver resultado)
- `api/classify.js` → función backend que recibe el PDF y llama a Gemini
  usando la key guardada de forma segura en Vercel
