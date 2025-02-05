// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
//
// const FileList = ({ refresh, onDelete }) => {
//   const [files, setFiles] = useState([]);
//
//   useEffect(() => {
//     const fetchFiles = async () => {
//       try {
//         const response = await axios.get('http://localhost:8080/api/files');
//         setFiles(response.data);
//       } catch (error) {
//         console.error('Ошибка загрузки списка файлов:', error);
//       }
//     };
//     fetchFiles();
//   }, [refresh]);
//
//   const handleDelete = async (filename) => {
//     try {
//       await axios.delete(`http://localhost:8080/api/files/${filename}`);
//       onDelete();
//       alert('Файл удалён!');
//     } catch (error) {
//       alert('Ошибка удаления: ' + error.message);
//     }
//   };
//
//   const handleDownload = async (filename) => {
//     try {
//       const response = await axios.get(`http://localhost:8080/api/files/download/${filename}`, {
//         responseType: 'blob', // Важно для скачивания файлов
//       });
//
//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', filename);
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//     } catch (error) {
//       alert('Ошибка скачивания файла: ' + error.message);
//     }
//   };
//
//   return (
//       <div className="file-list">
//         <h2>Список файлов</h2>
//         <ul>
//           {files.map((file) => (
//               <li key={file}>
//                 <a
//                     href={`http://localhost:8080/api/files/download/${file}`}
//                     download
//                 >
//                   {file}
//                 </a>
//                 <button onClick={() => handleDownload(file)}>Скачать</button>
//                 <button onClick={() => handleDelete(file)}>Удалить</button>
//               </li>
//           ))}
//         </ul>
//       </div>
//   );
// };
//
// export default FileList;


import React, { useEffect, useState } from 'react';
import { Trash2, Download, Image, FileText, Music, Video, Archive, Code, File } from 'lucide-react';
import axios from "axios";
import '../FileList.css';

const FileList = ({ refresh, onDelete }) => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/files');
        const filesWithMeta = await Promise.all(
            response.data.map(async (file) => {
              const metaResponse = await axios.get(`http://localhost:8080/api/files/metadata/${file}`);
              return {
                name: file,
                ...metaResponse.data
              };
            })
        );
        setFiles(filesWithMeta);
      } catch (error) {
        console.error('Error loading files:', error);
      }
    };
    fetchFiles();
  }, [refresh]);

  const getFileIcon = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    switch (ext) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <Image className="file-icon" />;
      case 'mp3':
      case 'wav':
        return <Music className="file-icon" />;
      case 'mp4':
      case 'avi':
        return <Video className="file-icon" />;
      case 'zip':
      case 'rar':
        return <Archive className="file-icon" />;
      case 'js':
      case 'py':
      case 'java':
        return <Code className="file-icon" />;
      case 'txt':
      case 'doc':
      case 'pdf':
        return <FileText className="file-icon" />;
      default:
        return <File className="file-icon" />;
    }
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleDelete = async (filename) => {
    try {
      await axios.delete(`http://localhost:8080/api/files/${filename}`);
      onDelete();
    } catch (error) {
      alert('Error deleting: ' + error.message);
    }
  };

  const handleDownload = async (filename) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/files/download/${filename}`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert('Error downloading: ' + error.message);
    }
  };

  return (
      <div className="file-grid-container">
        <h2>Files</h2>
        <div className="file-grid">
          {files.map((file) => (
              <div key={file.name} className="file-card">
                <div className="file-icon-container">
                  {getFileIcon(file.name)}
                </div>
                <div className="file-info">
                  <span className="file-name">{file.name}</span>
                  <span className="file-meta">{formatSize(file.size)}</span>
                  <span className="file-meta">{formatDate(file.uploadDate)}</span>
                </div>
                <div className="file-actions">
                  <button
                      className="action-button download"
                      onClick={() => handleDownload(file.name)}
                  >
                    <Download size={16} />
                  </button>
                  <button
                      className="action-button delete"
                      onClick={() => handleDelete(file.name)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
          ))}
        </div>
      </div>
  );
};

export default FileList;