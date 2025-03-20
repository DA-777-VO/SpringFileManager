import { useEffect, useState } from 'react';
import axios from 'axios';
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';
import successSound from "../success-sound.mp3";
import '../FileUploader.css';

const FileUploader = () => {
  const [selectedFile, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [audio] = useState(new Audio(successSound));

  useEffect(() => {
    audio.preload = 'auto';
    audio.volume = 0.5;
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [audio]);

  const playSuccessSound = async () => {
    try {
      await audio.play();
    } catch (error) {
      console.warn('Не удалось воспроизвести звук:', error);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setFile(file);
      setError(null);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      setError(null);
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
        setTimeout(() => {
          setSuccess(false);
          setFile(null);
        }, 3000);
      }

    } catch (error) {
      if (error.response) {
        setError(error.response.data.message);
      } else if (error.request) {
        setError('Не удалось соединиться с сервером');
      } else {
        setError('Ошибка при отправке файла: ' + error.message);
      }
    } finally {
      setProgress(0);
    }
  };

  return (
    <div className="upload-container">
      <div
        className={`upload-area ${isDragging ? 'dragging' : ''} ${selectedFile ? 'has-file' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          onChange={handleFileSelect}
          id="file-input"
          className="file-input"
        />
        <label htmlFor="file-input" className="upload-label">
          {selectedFile ? (
            <div className="selected-file">
              <span className="file-name">{selectedFile.name}</span>
              <span className="file-size">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </span>
            </div>
          ) : (
            <>
              <Upload size={48} className="upload-icon" />
              <span className="upload-text">
                Перетащите файл сюда или нажмите для выбора
              </span>
              <span className="upload-hint">
                Поддерживаются все типы файлов
              </span>
            </>
          )}
        </label>
      </div>

      {progress > 0 && (
        <div className="progress-container">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="progress-text">{progress}%</span>
        </div>
      )}

      <button
        className={`upload-button ${selectedFile ? 'active' : ''}`}
        onClick={handleUpload}
        disabled={!selectedFile}
      >
        {progress > 0 ? 'Загрузка...' : 'Загрузить файл'}
      </button>

      {error && (
        <div className="error-message">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="success-message">
          <CheckCircle size={20} />
          <span>Файл успешно загружен!</span>
        </div>
      )}
    </div>
  );
};

export default FileUploader;