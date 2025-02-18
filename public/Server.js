const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public'))); // Servir archivos estáticos

// Credenciales y URL del M3U
const usuario = "kevinwhcrg";
const password = "OHJEY2LO3R";
const urlM3U = `http://cinehometvs.icu:8080/get.php?username=${usuario}&password=${password}&type=m3u_plus&output=ts`;

// Función para obtener canales desde la lista M3U
async function obtenerCanales() {
    try {
        const respuesta = await axios.get(urlM3U);
        const contenido = respuesta.data.split('\n');
        const canales = [];

        for (let i = 0; i < contenido.length; i++) {
            if (contenido[i].startsWith("#EXTINF")) {
                const nombreMatch = contenido[i].match(/,(.+)/);
                const urlStream = contenido[i + 1]?.trim();
                if (nombreMatch && urlStream?.startsWith("http")) {
                    canales.push({ name: nombreMatch[1], url: urlStream });
                }
            }
        }
        return canales;
    } catch (error) {
        console.error("Error al obtener canales:", error);
        return [];
    }
}

// Ruta principal para servir el HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta para buscar canales
app.get('/buscar', async (req, res) => {
    const consulta = req.query.q?.toLowerCase() || "";
    const canales = await obtenerCanales();
    const resultados = consulta
        ? canales.filter(c => c.name.toLowerCase().includes(consulta))
        : canales;
    res.json(resultados);
});

// Ruta para filtrar canales por categoría
app.get('/filtrar', async (req, res) => {
    const tipo = req.query.tipo?.toLowerCase() || "";
    let canales = await obtenerCanales();

    if (tipo === 'crtv') {
        canales = canales.filter(c => ["teletica", "canal 6", "futTV", "repretel"].some(keyword => c.name.toLowerCase().includes(keyword)));
    } else if (tipo === 'futbol') {
        canales = canales.filter(c => ["espn", "fox", "futbol"].some(keyword => c.name.toLowerCase().includes(keyword)));
    }

    res.json(canales);
});

// Ruta para reproducir un canal
app.post('/reproducir', (req, res) => {
    const { url } = req.body;
    res.json({ status: "reproduciendo", url });
});

// Ruta para descargar un stream (simulado)
app.post('/descargar', (req, res) => {
    const { url } = req.body;
    res.json({ status: "descargando", url });
});

// Iniciar el servidor
const PORT = 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor corriendo en http://0.0.0.0:${PORT}`);
});

