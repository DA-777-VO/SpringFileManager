import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, Share2, Download, Check } from 'lucide-react';
import axios from 'axios';
import '../MediaViewer.css';

const MediaViewer = () => {
  const [mediaList, setMediaList] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [scale, setScale] = useState(1);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCopied, setShowCopied] = useState(false);

  const imageFormats = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
  const videoFormats = ['.mp4', '.mov', '.avi', '.mkv', '.webm'];

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/files');
        const filteredMedia = response.data.filter(file => {
          const ext = file.slice(file.lastIndexOf('.')).toLowerCase();
          return imageFormats.includes(ext) || videoFormats.includes(ext);
        });
        setMediaList(filteredMedia);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMedia();
  }, []);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (selectedIndex === null) return;

      switch(e.key) {
        case 'Escape':
          closeViewer();
          break;
        case 'ArrowLeft':
          navigateMedia(-1);
          break;
        case 'ArrowRight':
          navigateMedia(1);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedIndex, mediaList]);

  const handleWheel = (e) => {
    if (selectedIndex === null || isVideo(mediaList[selectedIndex])) return;
    e.preventDefault();
    setScale(prev => e.deltaY > 0 ? Math.max(0.5, prev / 1.1) : Math.min(3, prev * 1.1));
  };

  const navigateMedia = (direction) => {
    setScale(1);
    setSelectedIndex(prev => {
      if (prev === null) return null;
      const newIndex = (prev + direction + mediaList.length) % mediaList.length;
      return newIndex;
    });
  };

  const closeViewer = () => {
    setSelectedIndex(null);
    setScale(1);
  };

  const isVideo = (filename) => {
    const ext = filename?.slice(filename.lastIndexOf('.')).toLowerCase();
    return videoFormats.includes(ext);
  };

  const handleDownload = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/files/download/${mediaList[selectedIndex]}`,
        { responseType: 'blob' }
      );
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', mediaList[selectedIndex]);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const handleShare = async () => {
    try {
      const fileUrl = `http://localhost:8080/api/files/download/${mediaList[selectedIndex]}`;
      await navigator.clipboard.writeText(fileUrl);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    } catch (error) {
      console.error('Error copying link:', error);
    }
  };

  if (loading) return <div className="loading">Загрузка медиа...</div>;
  if (error) return <div className="error">Ошибка: {error}</div>;
  if (mediaList.length === 0) return <div className="no-media">Медиафайлы не найдены</div>;

  return (
      <div className="media-viewer">
        <div className="media-grid">
        {mediaList.map((media, index) => (
              <div
                  key={index}
                  className="grid-item"
                  onClick={() => setSelectedIndex(index)}
              >
                 {isVideo(media) ? (
                     <div className="video-thumbnail">
                       <video>
                         <source
                             src={`http://localhost:8080/api/files/download/${media}`}
                             type={`video/${media.split('.').pop()}`}
                         />
                       </video>
                       <div className="play-icon">▶</div>
                     </div>
                 ) :
                    (
                    <img
                        src={`http://localhost:8080/api/files/download/${media}`}
                        alt={`Превью ${index + 1}`}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'placeholder.png';
                        }}
                    />
                )}
                <div className="media-type">
                  {isVideo(media) ? 'VIDEO' : 'IMAGE'}
                </div>
              </div>
          ))}
        </div>

        {selectedIndex !== null && (
            <div className="media-modal">
              <button className="close-button" onClick={closeViewer}>
                <X size={24} />
              </button>

              {!isVideo(mediaList[selectedIndex]) && (
                  <>
                    <button
                        className="nav-button prev"
                        onClick={() => navigateMedia(-1)}
                    >
                      <ChevronLeft size={36} />
                    </button>
                    <button
                        className="nav-button next"
                        onClick={() => navigateMedia(1)}
                    >
                      <ChevronRight size={36} />
                    </button>
                  </>
              )}

              <div className="modal-content" onWheel={handleWheel}>
                {isVideo(mediaList[selectedIndex]) ? (
                    <video controls autoPlay>
                      <source
                          src={`http://localhost:8080/api/files/download/${mediaList[selectedIndex]}`}
                          type={`video/${mediaList[selectedIndex].split('.').pop()}`}
                      />
                      Ваш браузер не поддерживает видео тег.
                    </video>
                ) : (
                    <img
                        src={`http://localhost:8080/api/files/download/${mediaList[selectedIndex]}`}
                        alt="Полный размер"
                        style={{ transform: `scale(${scale})` }}
                    />
                )}
              </div>

              <div className="media-info">
                <div className="media-info-content">
                  <div className="media-info-main">
                    <span className="filename">{mediaList[selectedIndex]}</span>
                    {!isVideo(mediaList[selectedIndex]) && (
                      <span className="scale">Масштаб: {Math.round(scale * 100)}%</span>
                    )}
                  </div>
                  <div className="action-buttons">
                    <button 
                      className="action-button"
                      onClick={handleShare}
                      title="Копировать ссылку"
                    >
                      {showCopied ? <Check size={20} /> : <Share2 size={20} />}
                    </button>
                    <button 
                      className="action-button"
                      onClick={handleDownload}
                      title="Скачать"
                    >
                      <Download size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
        )}
      </div>
  );
};

export default MediaViewer;
