const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');


const app = express();
const upload = multer({ dest: 'documents/' });

app.use(express.static('public'));

app.post('/upload', upload.single('file'), (req, res) => {
  if (!fs.existsSync('documents')) {
    fs.mkdirSync('documents');
  }

  if (req.file) {
    res.sendStatus(200);
  } else {
    res.sendStatus(500);
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
