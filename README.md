# Gincana tecnológica

Microapp para registrar participantes, responder 10 retos y ver el marcador en vivo.

## Rutas

- `/`: registro de participantes por nombre.
- `/estacion/1` a `/estacion/10`: una pregunta de selección múltiple por estación; cada participante puede puntuar una sola vez en cada estación.
- `/admin`: marcador ordenado por puntaje. La contraseña inicial es `admin`.

## Firebase

La app usa el proyecto configurado en `firebase.js` y guarda documentos en la colección `usuarios` con estos campos:

- `nombre`: nombre del participante.
- `puntaje`: puntaje acumulado.
- `estacionesCompletadas`: números de las estaciones ya respondidas.

Activa Cloud Firestore en el proyecto antes de usar la app. Las reglas de Firestore deben permitir las lecturas y escrituras que requiere la app; el acceso directo desde el navegador no es apropiado para datos sensibles.

**Importante:** esta es una app para una actividad supervisada, no un sistema seguro de competición. El registro, las respuestas y la contraseña `admin` se manejan en el navegador; una contraseña puesta en el cliente no protege el panel ni impide manipular puntos. Para un evento donde eso importe, implementa autenticación y validación de respuestas en un servidor antes de publicar.

## Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).
