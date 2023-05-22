const uploadForm = document.getElementById('upload-form');
const fileInput = document.getElementById('file-input');
const messageDiv = document.getElementById('message');

uploadForm.addEventListener('submit', (event) => {
  event.preventDefault(); // Evitar la acción por defecto del formulario

  const file = fileInput.files[0]; // Obtener el archivo seleccionado
  
  const formData = new FormData();
  formData.append('file', file);

  fetch('/upload', {
    method: 'POST',
    body: formData
  })
  .then(response => {
    if (response.ok) {
      messageDiv.textContent = '¡Archivo cargado exitosamente!';
      messageDiv.classList.remove('error');
      messageDiv.classList.add('success');
      setTimeout(() => {
        messageDiv.textContent = ""
        
      }, 6000);
    } else {
      messageDiv.textContent = '¡Error al cargar el archivo!';
      messageDiv.classList.remove('success');
      messageDiv.classList.add('error');
      setTimeout(() => {
        messageDiv.textContent = ""
        
      }, 6000);
    }
  })
  .catch(error => {
    messageDiv.textContent = '¡Error en la solicitud!';
    messageDiv.classList.remove('success');
    messageDiv.classList.add('error');
    console.error(error);
  });
});


const fileList = document.getElementById('file-list');
  
function updateFileList() {
  fetch('/files')
    .then(response => response.json())
    .then(data => {
      fileList.innerHTML = '';
      data.forEach(file => {
        const listItem = document.createElement('li');
        listItem.textContent = file;
        fileList.appendChild(listItem);
      });
    })
    .catch(error => console.error(error));
}

document.addEventListener('DOMContentLoaded', () => {
  updateFileList();
});


uploadForm.addEventListener('submit', event => {
  event.preventDefault();
  const formData = new FormData(uploadForm);

  fetch('/upload', {
    method: 'POST',
    body: formData
  })
    .then(response => {
      if (response.ok) {
        updateFileList();
        uploadForm.reset();
      } else {
        console.error('Error en la carga del archivo');
      }
    })
    .catch(error => console.error(error));
});