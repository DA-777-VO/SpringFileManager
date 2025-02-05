// import React, { useState } from 'react';
// import axios from 'axios';
//
// const FileUploader = ({ onUpload }) => {
//   const [selectedFile, setFile] = useState(null);
//   const [progress, setProgress] = useState(0);
//
//   const handleUpload = async () => {
//     const formData = new FormData();
//     formData.append('file', selectedFile);
//
//     try {
//       await axios.post('http://localhost:8080/api/files/upload', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//         onUploadProgress: (progressEvent) => {
//           const percent = Math.round(
//               (progressEvent.loaded * 100) / progressEvent.total
//           );
//           setProgress(percent);
//         }
//       });
//       onUpload();
//       alert('Файл успешно загружен!');
//     } catch (error) {
//       alert('Ошибка загрузки: ' + error.message);
//     } finally {
//       setProgress(0);
//     }
//   };
//
//   return (
//       <div className="uploader">
//         <h2>Загрузка файлов</h2>
//         <input
//             type="file"
//             onChange={(e) => setFile(e.target.files[0])}
//         />
//         <button onClick={handleUpload} disabled={!selectedFile}>
//           {progress > 0 ? `Загрузка... ${progress}%` : 'Начать загрузку'}
//         </button>
//       </div>
//   );
// };
//
// export default FileUploader;

import React, {useEffect, useState} from 'react';
import axios from 'axios';
import successSound from "../success-sound.mp3";

const FileUploader = () => {
  const [selectedFile, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [progress, setProgress] = useState(0);
  


const [audio] = useState(new Audio(successSound));

  // Настройка звука при инициализации компонента
  useEffect(() => {
    audio.preload = 'auto'; // Предзагрузка звука
    audio.volume = 0.5; // Громкость 50%

    // Очистка при размонтировании компонента
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [audio]);

  // Функция воспроизведения звука
  const playSuccessSound = async () => {
    try {
      await audio.play();
    } catch (error) {
      console.warn('Не удалось воспроизвести звук:', error);
    }
  };

  const handleUpload = async () => {
    setError(null);
    setSuccess(false);

    if (!selectedFile) {
      setError('Пожалуйста, выберите файл');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post(
          'http://localhost:8080/api/files/upload',
          formData,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
            validateStatus: (status) =>
                status === 200 || status === 409 || status === 400,
            onUploadProgress: (progressEvent) => {
              const percent = Math.round(
                  (progressEvent.loaded * 100) / progressEvent.total
              );
              setProgress(percent);
            }
          }
      );

      if (response.status === 409) {
        setError(`Файл "${selectedFile.name}" уже существует`);
        return;
      }

      if (response.status === 200) {
        setSuccess(true);
        playSuccessSound();
        setTimeout(() => setSuccess(false), 3000);
      }

    } catch (error) {
      if (error.response) {
        // Сервер ответил с кодом 4xx/5xx
        setError(error.response.data.message);
      } else if (error.request) {
        // Запрос был сделан, но нет ответа
        setError('Не удалось соединиться с сервером');
      } else {
        // Ошибка в настройке запроса
        setError('Ошибка при отправке файла: ' + error.message);
      }
    } finally {
      setProgress(0);
    }
  };

  return (
      <div className="upload-container">
        <input
            type="file"
            onChange={(e) => {
              setFile(e.target.files[0]);
              setError(null);
            }}
        />

        <button onClick={handleUpload} disabled={!selectedFile}>
          Загрузить
        </button>

        {progress > 0 && (
            <div className="progress-bar">
              <div style={{ width: `${progress}%` }}>{progress}%</div>
            </div>
        )}

        {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
        )}

        {success && (
            <div className="success-message">
              ✅ Файл успешно загружен!
            </div>
        )}
      </div>
  );
};

export default FileUploader;