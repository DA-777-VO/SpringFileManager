package org.example.filetransferspring;

import exceptions.FileStorageException;
import exceptions.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.stream.Collectors;

import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class FileService {

    private final Path rootLocation = Paths.get("server-storage");
    private final FileRepository fileRepository;
    private final UserRepository userRepository;
    private final SharedFileRepository sharedFileRepository;

    public FileService(FileRepository fileRepository,
                       UserRepository userRepository,
                       SharedFileRepository sharedFileRepository) {
        this.fileRepository = fileRepository;
        this.userRepository = userRepository;
        this.sharedFileRepository = sharedFileRepository;
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

    public void saveFile(MultipartFile file, String username)
            throws IOException, FileAlreadyExistsException {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        String filename = file.getOriginalFilename();
        Path userDir = rootLocation.resolve(username);

        if (!Files.exists(userDir)) {
            Files.createDirectory(userDir);
        }

        Path destination = userDir.resolve(filename).normalize().toAbsolutePath();

        if (fileRepository.existsByFilenameAndOwner(filename, user)) {
            throw new FileAlreadyExistsException("File already exists");
        }

        Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);

        FileEntity fileEntity = new FileEntity();
        fileEntity.setFilename(filename);
        fileEntity.setFilePath(destination.toString());
        fileEntity.setOwner(user);
        fileEntity.setUploadDate(LocalDateTime.now());
        fileRepository.save(fileEntity);
    }

    public boolean fileExists(String filename, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return fileRepository.existsByFilenameAndOwner(filename, user);
    }

    public void deleteFile(String filename, String username) throws IOException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        FileEntity fileEntity = fileRepository.findByFilenameAndOwner(filename, user)
                .orElseThrow(() -> new FileNotFoundException("File not found"));

        Files.deleteIfExists(Paths.get(fileEntity.getFilePath()));
        fileRepository.delete(fileEntity);
    }

    public List<FileEntity> listUserFiles(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return fileRepository.findByOwner(user);
    }

    public FileEntity getFileByNameAndUser(String filename, String username) throws FileNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return fileRepository.findByFilenameAndOwner(filename, user)
                .orElseThrow(() -> new FileNotFoundException("File not found"));
    }

    public String generateShareToken(String filename, String ownerUsername) throws FileNotFoundException {
        User owner = userRepository.findByUsername(ownerUsername)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        FileEntity file = fileRepository.findByFilenameAndOwner(filename, owner)
                .orElseThrow(() -> new FileNotFoundException("File not found"));

        String token = UUID.randomUUID().toString();

        SharedFile sharedFile = new SharedFile();
        sharedFile.setFile(file);
        sharedFile.setShareToken(token);
        sharedFile.setCreatedAt(LocalDateTime.now());
        sharedFileRepository.save(sharedFile);

        return token;
    }

    public FileEntity getFileByShareToken(String token) throws FileNotFoundException {
        SharedFile sharedFile = sharedFileRepository.findByShareToken(token)
                .orElseThrow(() -> new FileNotFoundException("Invalid token"));

        // Здесь можно добавить проверку срока действия токена
        return sharedFile.getFile();
    }
}