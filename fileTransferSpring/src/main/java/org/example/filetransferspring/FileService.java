package org.example.filetransferspring;

import exceptions.FileStorageException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FileService {

    private final Path rootLocation = Paths.get("server-storage");

    public FileService() {
        init();
    }

    private void init() {
        try {
            if (!Files.exists(rootLocation)) {
                Files.createDirectories(rootLocation);
            }
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize storage", e);
        }
    }

    public void saveFile(MultipartFile file) throws FileStorageException, FileAlreadyExistsException {
        try {
            String filename = file.getOriginalFilename();
            Path destination = rootLocation.resolve(filename)
                    .normalize()
                    .toAbsolutePath();

            // Проверка существования файла
//            if (Files.exists(destination)) {
//                throw new FileAlreadyExistsException("Файл с именем '" + filename + "' уже существует");
//            }

            // Проверка безопасности пути
            if (!destination.getParent().equals(rootLocation.toAbsolutePath())) {
                throw new FileStorageException("Недопустимый путь к файлу");
            }

            // Сохраняем без перезаписи
            Files.copy(file.getInputStream(), destination);

        } catch (FileAlreadyExistsException ex) {
            throw ex; // Пробрасываем специальное исключение
        } catch (IOException ex) {
            throw new FileStorageException("Не удалось сохранить файл: " + ex.getMessage());
        }
    }

    public boolean fileExists(String filename) {
        try {
            return Files.exists(rootLocation.resolve(filename));
        } catch (InvalidPathException ex) {
            return false;
        }
    }

    public boolean deleteFile(String filename) throws IOException {
        return Files.deleteIfExists(rootLocation.resolve(filename));
    }

    public List<String> listAllFiles() throws IOException {
        return Files.walk(rootLocation, 1)
                .filter(path -> !path.equals(rootLocation))
                .map(path -> path.getFileName().toString())
                .collect(Collectors.toList());
    }
}