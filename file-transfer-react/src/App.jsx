import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import FileUploader from './components/FileUploader';
import FileList from './components/FileList';
// import ImageViewer from './components/ImageViewer';
import MediaViewer from "./components/MediaViewer.jsx";

const App = () => {
  const [refreshFiles, setRefreshFiles] = useState(false);

  return (
      <div className="app">
        <nav>
          <Link to="/">Главная</Link>
          <Link to="/upload">Загрузить файл</Link>
          <Link to="/images">Просмотр изображений</Link>
        </nav>

        <Routes>
          <Route
              path="/"
              element={
                <FileList
                    refresh={refreshFiles}
                    onDelete={() => setRefreshFiles(!refreshFiles)}
                />
              }
          />
          <Route
              path="/upload"
              element={<FileUploader onUpload={() => setRefreshFiles(!refreshFiles)}/>}
          />
          <Route path="/images" element={<MediaViewer />} />
        </Routes>
      </div>
  );
};

export default App;