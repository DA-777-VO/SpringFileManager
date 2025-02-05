// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import '../ImageViewer.css'; // Создадим отдельный CSS файл
//
// const ImageViewer = () => {
//   const [images, setImages] = useState([]);
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [scale, setScale] = useState(1);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);
//
//   useEffect(() => {
//     const fetchImages = async () => {
//       try {
//         const response = await axios.get('http://localhost:8080/api/files');
//         const imageFiles = response.data.filter(file =>
//             /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(file)
//         );
//         setImages(imageFiles);
//         setError(null);
//       } catch (error) {
//         setError(error.message);
//         console.error('Error loading images:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchImages();
//   }, []);
//
//   useEffect(() => {
//     const handleKeyPress = (e) => {
//       if (e.key === 'Escape') {
//         setSelectedImage(null);
//         setScale(1);
//       }
//     };
//
//     window.addEventListener('keydown', handleKeyPress);
//     return () => window.removeEventListener('keydown', handleKeyPress);
//   }, []);
//
//   const handleWheel = (e) => {
//     e.preventDefault();
//     if (!selectedImage) return;
//
//     e.deltaY > 0
//         ? setScale(prev => Math.max(0.5, prev / 1.1))
//         : setScale(prev => Math.min(3, prev * 1.1));
//   };
//
//   const handleImageClick = (imageName) => {
//     setSelectedImage(imageName);
//     setScale(1);
//   };
//
//   const handleOverlayClick = (e) => {
//     if (e.target === e.currentTarget) {
//       setSelectedImage(null);
//       setScale(1);
//     }
//   };
//
//   if (loading) return <div className="loading">Loading images...</div>;
//   if (error) return <div className="error">Error: {error}</div>;
//   if (images.length === 0) return <div className="no-images">No images available</div>;
//
//   return (
//       <div className="image-viewer">
//         <div className="image-grid">
//           {images.map((image, index) => (
//               <div
//                   key={index}
//                   className="grid-item"
//                   onClick={() => handleImageClick(image)}
//               >
//                 <img
//                     src={`http://localhost:8080/api/files/download/${image}`}
//                     alt={`Thumbnail ${index + 1}`}
//                     onError={(e) => {
//                       e.target.onerror = null;
//                       e.target.src = 'placeholder-image.png';
//                     }}
//                 />
//               </div>
//           ))}
//         </div>
//
//         {selectedImage && (
//             <div className="image-modal" onClick={handleOverlayClick}>
//               <div className="modal-content" onWheel={handleWheel}>
//                 <img
//                     src={`http://localhost:8080/api/files/download/${selectedImage}`}
//                     alt="Full size"
//                     style={{
//                       transform: `scale(${scale})`,
//                       cursor: scale === 1 ? 'zoom-in' : 'zoom-out'
//                     }}
//                 />
//                 <div className="image-info">
//                   <span>{selectedImage}</span>
//                   <span>Zoom: {Math.round(scale * 100)}%</span>
//                 </div>
//               </div>
//             </div>
//         )}
//       </div>
//   );
// };
//
// export default ImageViewer;