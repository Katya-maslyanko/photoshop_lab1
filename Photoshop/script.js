window.addEventListener('load', function() {
    var fileInput = document.getElementById('fileInput'); 
    var urlInput = document.getElementById('urlInput'); 
    var submitBtn = document.getElementById('submitBtn'); 
    var removeBtn = document.getElementById('removeBtn'); 
    var canvas = document.getElementById('canvas'); 
    var context = canvas.getContext('2d'); // Контекст рисования на холсте
    var infoContainer = document.getElementById('infoContainer'); // Контейнер для информации
    var colorInfo = document.getElementById('colorInfo'); // Элемент для отображения информации о цвете
    var positionInfo = document.getElementById('positionInfo'); // Элемент для отображения информации о позиции
    var sizeInfo = document.getElementById('sizeInfo'); // Элемент для отображения информации о размере
    
    var currentImage = null; // Переменная для хранения текущего изображения
  
    // Функция для отрисовки изображения на холсте canvas
    function drawImageOnCanvas(image) {
      var desiredWidth = 600; 
      var desiredHeight = 460; 
      
      var imageAspectRatio = image.width / image.height;
      var canvasAspectRatio = desiredWidth / desiredHeight;
    
      if (imageAspectRatio > canvasAspectRatio) { // Если соотношение сторон изображения больше, обрезаем по ширине
        var scale = desiredHeight / image.height;
        var scaledWidth = image.width * scale;
        var offsetX = Math.floor((scaledWidth - desiredWidth) / 2);
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, -offsetX, 0, scaledWidth, desiredHeight);
      } else { // Иначе обрезаем по высоте
        var scale = desiredWidth / image.width;
        var scaledHeight = image.height * scale;
        var offsetY = Math.floor((scaledHeight - desiredHeight) / 2);
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, -offsetY, desiredWidth, scaledHeight);
      }
    }
    
  
    // Функция для отображения информации о изображении
    function showImageInfo() {
      infoContainer.style.display = 'block'; 
      removeBtn.style.display = 'block'; 
    }
  
    // Функция для скрытия информации о изображении
    function hideImageInfo() {
      infoContainer.style.display = 'none'; 
      removeBtn.style.display = 'none'; 
    }
  
    // Функция для обновления информации о изображении
    function updateImageInfo(mouseX, mouseY, width, height, pixelData, imageWidth, imageHeight) {
      var color = 'rgb(' + pixelData[0] + ', ' + pixelData[1] + ', ' + pixelData[2] + ')'; // Форматирование цвета
  
      colorInfo.textContent = 'RGB: ' + color; 
      positionInfo.textContent = 'X: ' + mouseX + ', Y: ' + mouseY; 
      sizeInfo.textContent = 'Ширина: ' + width + ', Высота: ' + height; 
      sizeInfo.textContent += ' | ' + 'Реальный размер: ' + imageWidth + 'x' + imageHeight; 
    }
  
    // Обработчик события клика на кнопку "Отправить" отслеживает были загружены файлы или нет
    submitBtn.addEventListener('click', function() {
      if (currentImage) {
        return; // Прерывание выполнения, если уже загружено изображение
      }
      
      var img = new Image();
  
      if (fileInput.files && fileInput.files[0]) { // Если загружен файл
        var reader = new FileReader();
        reader.onload = function(e) {
          img.addEventListener('load', function() {
            drawOnCanvas(img); 
            showImageInfo(); 
            updateImageInfo(0, 0, canvas.width, canvas.height, [], img.width, img.height); // Обновление информации о изображении
          });
          img.src = e.target.result; // Установка пути к файлу
        }
        reader.readAsDataURL(fileInput.files[0]); // Чтение данных файла
      } else if (urlInput.value) { // Если указан URL
        img.crossOrigin = "Anonymous"; 
        img.addEventListener('load', function() {
          drawOnCanvas(img); 
          showImageInfo(); 
          updateImageInfo(0, 0, canvas.width, canvas.height, [], img.width, img.height); // Обновление информации о изображении
        });
        img.src = urlInput.value; // Установка пути к изображению
      }
    }); 

    // Обработчик события клика на кнопку "Удалить"
    removeBtn.addEventListener('click', function() {
      if (currentImage) {
        currentImage.removeEventListener('load', drawOnCanvas);
        currentImage = null;
      }
  
      fileInput.value = ''; 
      urlInput.value = '';
      context.clearRect(0, 0, canvas.width, canvas.height); // Очистка холста
      hideImageInfo(); // Скрытие информации о изображении
    });
  
    // Функция для загрузки изображения на холст и отображения информации
    function drawOnCanvas(image) {
      drawImageOnCanvas(image); 
      currentImage = image; 
    }   
  
    // Обработчик события перемещения указателя мыши по холсту
    canvas.addEventListener('mousemove', function(e) {
      var rect = canvas.getBoundingClientRect(); // Получение координат холста относительно окна
      var mouseX = e.clientX - rect.left; 
      var mouseY = e.clientY - rect.top; 
      var width = canvas.width; 
      var height = canvas.height; 
      var pixelData = context.getImageData(mouseX, mouseY, 1, 1).data; // Получение данных о пикселе
  
      updateImageInfo(mouseX, mouseY, width, height, pixelData, currentImage.width, currentImage.height); // Обновление информации о изображении
    });
  });