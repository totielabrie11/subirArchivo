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
    } else {
      messageDiv.textContent = '¡Error al cargar el archivo!';
      messageDiv.classList.remove('success');
      messageDiv.classList.add('error');
    }
  })
  .catch(error => {
    messageDiv.textContent = '¡Error en la solicitud!';
    messageDiv.classList.remove('success');
    messageDiv.classList.add('error');
    console.error(error);
  });
});