// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import '../MediaViewer.css';
//
// const MediaViewer = () => {
//   const [mediaList, setMediaList] = useState([]);
//   const [selectedMedia, setSelectedMedia] = useState(null);
//   const [scale, setScale] = useState(1);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);
//
//   // Поддерживаемые форматы
//   const imageFormats = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
//   const videoFormats = ['.mp4', '.mov', '.avi', '.mkv', '.webm'];
//
//   useEffect(() => {
//     const fetchMedia = async () => {
//       try {
//         const response = await axios.get('http://localhost:8080/api/files');
//         const filteredMedia = response.data.filter(file => {
//           const ext = file.slice(file.lastIndexOf('.')).toLowerCase();
//           return imageFormats.includes(ext) || videoFormats.includes(ext);
//         });
//         setMediaList(filteredMedia);
//         setError(null);
//       } catch (error) {
//         setError(error.message);
//         console.error('Error loading media:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchMedia();
//   }, []);
//
//   useEffect(() => {
//     const handleKeyPress = (e) => {
//       if (e.key === 'Escape') {
//         setSelectedMedia(null);
//         setScale(1);
//       }
//     };
//
//     window.addEventListener('keydown', handleKeyPress);
//     return () => window.removeEventListener('keydown', handleKeyPress);
//   }, []);
//
//   const handleWheel = (e) => {
//     if (!selectedMedia || isVideo(selectedMedia)) return;
//
//     e.preventDefault();
//     e.deltaY > 0
//         ? setScale(prev => Math.max(0.5, prev / 1.1))
//         : setScale(prev => Math.min(3, prev * 1.1));
//   };
//
//   const handleMediaClick = (mediaName) => {
//     setSelectedMedia(mediaName);
//     setScale(1);
//   };
//
//   const handleOverlayClick = (e) => {
//     if (e.target === e.currentTarget) {
//       setSelectedMedia(null);
//       setScale(1);
//     }
//   };
//
//   const isVideo = (filename) => {
//     const ext = filename.slice(filename.lastIndexOf('.')).toLowerCase();
//     return videoFormats.includes(ext);
//   };
//
//   if (loading) return <div className="loading">Загрузка медиа...</div>;
//   if (error) return <div className="error">Ошибка: {error}</div>;
//   if (mediaList.length === 0) return <div className="no-media">Медиафайлы не найдены</div>;
//
//   return (
//       <div className="media-viewer">
//         <div className="media-grid">
//           {mediaList.map((media, index) => (
//               <div
//                   key={index}
//                   className="grid-item"
//                   onClick={() => handleMediaClick(media)}
//               >
//                 {isVideo(media) ? (
//                     <div className="video-thumbnail">
//                       <video>
//                         <source
//                             src={`http://localhost:8080/api/files/download/${media}`}
//                             type={`video/${media.split('.').pop()}`}
//                         />
//                       </video>
//                       <div className="play-icon">▶</div>
//                     </div>
//                 ) : (
//                     <img
//                         src={`http://localhost:8080/api/files/download/${media}`}
//                         alt={`Превью ${index + 1}`}
//                         onError={(e) => {
//                           e.target.onerror = null;
//                           e.target.src = 'placeholder.png';
//                         }}
//                     />
//                 )}
//                 <div className="media-type">
//                   {isVideo(media) ? 'VIDEO' : 'IMAGE'}
//                 </div>
//               </div>
//           ))}
//         </div>
//
//         {selectedMedia && (
//             <div className="media-modal" onClick={handleOverlayClick}>
//               <div className="modal-content" onWheel={handleWheel}>
//                 {isVideo(selectedMedia) ? (
//                     <video controls autoPlay>
//                       <source
//                           src={`http://localhost:8080/api/files/download/${selectedMedia}`}
//                           type={`video/${selectedMedia.split('.').pop()}`}
//                       />
//                       Ваш браузер не поддерживает видео тег.
//                     </video>
//                 ) : (
//                     <img
//                         src={`http://localhost:8080/api/files/download/${selectedMedia}`}
//                         alt="Полный размер"
//                         style={{ transform: `scale(${scale})` }}
//                     />
//                 )}
//
//                 <div className="media-info">
//                   <span>{selectedMedia}</span>
//                   {!isVideo(selectedMedia) && (
//                       <span>Масштаб: {Math.round(scale * 100)}%</span>
//                   )}
//                 </div>
//               </div>
//             </div>
//         )}
//       </div>
//   );
// };
//
// export default MediaViewer;

//
// import React, { useState, useEffect } from 'react';
// import { ChevronLeft, ChevronRight, X } from 'lucide-react';
// import axios from 'axios';
// import '../MediaViewer.css';
//
// const MediaViewer = () => {
//   const [mediaList, setMediaList] = useState([]);
//   const [selectedIndex, setSelectedIndex] = useState(null);
//   const [scale, setScale] = useState(1);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);
//
//   const imageFormats = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
//   const videoFormats = ['.mp4', '.mov', '.avi', '.mkv', '.webm'];
//
//   useEffect(() => {
//     const fetchMedia = async () => {
//       try {
//         const response = await axios.get('http://localhost:8080/api/files');
//         const filteredMedia = response.data.filter(file => {
//           const ext = file.slice(file.lastIndexOf('.')).toLowerCase();
//           return imageFormats.includes(ext) || videoFormats.includes(ext);
//         });
//         setMediaList(filteredMedia);
//       } catch (error) {
//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchMedia();
//   }, []);
//
//   useEffect(() => {
//     const handleKeyPress = (e) => {
//       if (selectedIndex === null) return;
//
//       switch(e.key) {
//         case 'Escape':
//           closeViewer();
//           break;
//         case 'ArrowLeft':
//           navigateMedia(-1);
//           break;
//         case 'ArrowRight':
//           navigateMedia(1);
//           break;
//       }
//     };
//
//     window.addEventListener('keydown', handleKeyPress);
//     return () => window.removeEventListener('keydown', handleKeyPress);
//   }, [selectedIndex, mediaList]);
//
//   const handleWheel = (e) => {
//     if (selectedIndex === null || isVideo(mediaList[selectedIndex])) return;
//     e.preventDefault();
//     setScale(prev => e.deltaY > 0 ? Math.max(0.5, prev / 1.1) : Math.min(3, prev * 1.1));
//   };
//
//   const navigateMedia = (direction) => {
//     setScale(1);
//     setSelectedIndex(prev => {
//       if (prev === null) return null;
//       const newIndex = (prev + direction + mediaList.length) % mediaList.length;
//       return newIndex;
//     });
//   };
//
//   const closeViewer = () => {
//     setSelectedIndex(null);
//     setScale(1);
//   };
//
//   const isVideo = (filename) => {
//     const ext = filename?.slice(filename.lastIndexOf('.')).toLowerCase();
//     return videoFormats.includes(ext);
//   };
//
//   if (loading) return <div className="loading">Загрузка медиа...</div>;
//   if (error) return <div className="error">Ошибка: {error}</div>;
//   if (mediaList.length === 0) return <div className="no-media">Медиафайлы не найдены</div>;
//
//   return (
//       <div className="media-viewer">
//         <div className="media-grid">
//           {mediaList.map((media, index) => (
//               <div
//                   key={index}
//                   className="grid-item"
//                   onClick={() => setSelectedIndex(index)}
//               >
//                  {isVideo(media) ? (
//                      <div className="video-thumbnail">
//                        <video>
//                          <source
//                              src={`http://localhost:8080/api/files/download/${media}`}
//                              type={`video/${media.split('.').pop()}`}
//                          />
//                        </video>
//                        <div className="play-icon">▶</div>
//                      </div>
//                  ) :
//                     (
//                     <img
//                         src={`http://localhost:8080/api/files/download/${media}`}
//                         alt={`Превью ${index + 1}`}
//                         onError={(e) => {
//                           e.target.onerror = null;
//                           e.target.src = 'placeholder.png';
//                         }}
//                     />
//                 )}
//                 <div className="media-type">
//                   {isVideo(media) ? 'VIDEO' : 'IMAGE'}
//                 </div>
//               </div>
//           ))}
//         </div>
//
//         {selectedIndex !== null && (
//             <div className="media-modal">
//               <button className="close-button" onClick={closeViewer}>
//                 <X size={24} />
//               </button>
//
//               {!isVideo(mediaList[selectedIndex]) && (
//                   <>
//                     <button
//                         className="nav-button prev"
//                         onClick={() => navigateMedia(-1)}
//                     >
//                       <ChevronLeft size={36} />
//                     </button>
//                     <button
//                         className="nav-button next"
//                         onClick={() => navigateMedia(1)}
//                     >
//                       <ChevronRight size={36} />
//                     </button>
//                   </>
//               )}
//
//               <div className="modal-content" onWheel={handleWheel}>
//                 {isVideo(mediaList[selectedIndex]) ? (
//                     <video controls autoPlay>
//                       <source
//                           src={`http://localhost:8080/api/files/download/${mediaList[selectedIndex]}`}
//                           type={`video/${mediaList[selectedIndex].split('.').pop()}`}
//                       />
//                       Ваш браузер не поддерживает видео тег.
//                     </video>
//                 ) : (
//                     <img
//                         src={`http://localhost:8080/api/files/download/${mediaList[selectedIndex]}`}
//                         alt="Полный размер"
//                         style={{ transform: `scale(${scale})` }}
//                     />
//                 )}
//               </div>
//
//               <div className="media-info">
//                 <span className="filename">{mediaList[selectedIndex]}</span>
//                 {!isVideo(mediaList[selectedIndex]) && (
//                     <span className="scale">Масштаб: {Math.round(scale * 100)}%</span>
//                 )}
//               </div>
//             </div>
//         )}
//       </div>
//
//   );
// };
//
// export default MediaViewer;




import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, X, Play, Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward } from 'lucide-react';
import axios from 'axios';
import '../MediaViewer.css';


const MediaViewer = () => {
  const [mediaList, setMediaList] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [scale, setScale] = useState(1);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

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
                <span className="filename">{mediaList[selectedIndex]}</span>
                {!isVideo(mediaList[selectedIndex]) && (
                    <span className="scale">Масштаб: {Math.round(scale * 100)}%</span>
                )}
              </div>
            </div>
        )}
      </div>

  );
  };

export default MediaViewer;
