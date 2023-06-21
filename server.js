const express = require('express');
const fs = require('fs');
const { Readable } = require('stream');
const multer = require('multer');
const { exec } = require('child_process');

const app = express();
const upload = multer({ dest: 'documents/' });

const documentsDir = 'documents';

// Verificar y crear la carpeta "documents" si no existe
if (!fs.existsSync(documentsDir)) {
  fs.mkdirSync(documentsDir);
  console.log('Carpeta "documents" creada');
}

app.use(express.static('public'));

app.get('/files', (req, res) => {
  try {
    const files = fs.readdirSync(documentsDir);
    res.send(files);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener la lista de archivos');
  }
});

app.post('/upload', upload.single('file'), (req, res) => {
  try {
    const file = req.file;
    const filePath = `${documentsDir}/${file.originalname}`;

    // Mover el archivo subido a la carpeta "documents"
    fs.renameSync(file.path, filePath);

    const files = fs.readdirSync(documentsDir);
    res.send(files);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al cargar el archivo');
  }
});

app.delete('/delete', (req, res) => {
  try {
    const fileName = req.query.file;
    const filePath = `${documentsDir}/${fileName}`;

    // Eliminar el archivo del sistema de archivos
    fs.unlinkSync(filePath);

    const files = fs.readdirSync(documentsDir);
    res.send(files);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al eliminar el archivo');
  }
});


const port = 3000;
app.listen(port, () => {
  console.log(`Servidor iniciado en el puerto ${port}`);
  const url = `http://localhost:${port}`;
  switch (process.platform) {
    case 'darwin': // macOS
      exec(`open ${url}`);
      break;
    case 'win32': // Windows
      exec(`start ${url}`);
      break;
    case 'linux': // Linux
      exec(`xdg-open ${url}`);
      break;
    default:
      console.log(`Abre manualmente el navegador y visita: ${url}`);
  }
});
