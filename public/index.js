const uploadForm = document.getElementById('upload-form');
const fileInput = document.getElementById('file-input');
const messageDiv = document.getElementById('message');
const fileList = document.getElementById('file-list');
const progressBar = document.getElementById('progress-bar');
const progressContainer = document.querySelector('.progress-container');

uploadForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const file = fileInput.files[0];
  const formData = new FormData();
  formData.append('file', file);

  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/upload');

  xhr.upload.addEventListener('progress', (event) => {
    if (event.lengthComputable) {
      const percent = (event.loaded / event.total) * 100;
      progressBar.style.width = percent + '%';

      if (percent === 100) {
        setTimeout(() => {
          progressContainer.style.display = 'none';
        }, 1000); // Espera 1 segundo antes de ocultar la barra de progreso
      }else{
        progressContainer.style.display = 'block';
      }
    }
  });

  xhr.onreadystatechange = () => {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        messageDiv.textContent = '¡Archivo cargado exitosamente!';
        updateFileList(); // Actualiza la lista de archivos
        uploadForm.reset();
      } else {
        messageDiv.textContent = '¡Error al cargar el archivo!';
      }
    }
  };

  xhr.send(formData);
});

function deleteFile(fileName) {
  fetch(`/delete?file=${encodeURIComponent(fileName)}`, {
    method: 'DELETE'
  })
  .then(response => {
    if (response.ok) {
      updateFileList();
      messageDiv.textContent = '¡Archivo eliminado con éxito!';
      messageDiv.classList.remove('error');
      messageDiv.classList.add('success');
      setTimeout(() => {
        messageDiv.textContent = "";
      }, 6000);
    } else {
      console.error('Error al eliminar el archivo');
    }
  })
  .catch(error => console.error(error));
}

function updateFileList() {
  fetch('/files')
    .then(response => response.json())
    .then(data => {
      fileList.innerHTML = '';
      data.forEach(fileName => {
        const listItem = document.createElement('li');

        const fileExtension = fileName.split('.').pop().toLowerCase();
        const isImageFile = ['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension);

        if (isImageFile) {
          const image = document.createElement('img');
          image.src = `/files/${encodeURIComponent(fileName)}`;
          image.alt = 'Vista previa';
          listItem.appendChild(image);
        }

        const fileNameElement = document.createElement('span');
        fileNameElement.textContent = fileName;
        listItem.appendChild(fileNameElement);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Eliminar';
        deleteButton.classList.add('delete-button');
        deleteButton.setAttribute('data-file', fileName);

        deleteButton.addEventListener('click', () => {
          deleteFile(fileName);
        });

        listItem.appendChild(deleteButton);

        const downloadLink = document.createElement('a');
        downloadLink.textContent = 'Descargar';
        downloadLink.href = `/download/${encodeURIComponent(fileName)}`;
        downloadLink.setAttribute('download', fileName);
        listItem.appendChild(downloadLink);

        fileList.appendChild(listItem);
      });
    })
    .catch(error => console.error(error));
}




document.addEventListener('DOMContentLoaded', () => {
  updateFileList();
});
