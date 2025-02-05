package org.example.filetransferspring;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import java.io.IOException;
import org.springframework.http.ResponseEntity;
import exceptions.FileAlreadyExistsException;
import exceptions.FileStorageException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/files")
public class FileController {

    private final FileService fileService;

    public FileController(FileService fileService) {
        this.fileService = fileService;
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("Файл пустой");
            }

            String filename = file.getOriginalFilename();
            if (fileService.fileExists(filename)) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("Файл с именем '" + filename + "' уже существует");
            }


            fileService.saveFile(file);
            return ResponseEntity.ok("Файл успешно загружен");

        } catch (FileAlreadyExistsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(ex.getMessage());
        } catch (FileStorageException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        } catch (Exception ex) {
            return ResponseEntity.internalServerError()
                    .body("Ошибка сервера: " + ex.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> listFiles() {
        try {
            return ResponseEntity.ok(fileService.listAllFiles());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/download/{filename}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String filename) throws IOException {
        Path filePath = Paths.get("server-storage").resolve(filename).normalize();
        Resource resource = new UrlResource(filePath.toUri());

        if (resource.exists()) {
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                    .contentType(MediaType.parseMediaType(Files.probeContentType(filePath)))
                    .body(resource);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/metadata/{filename}")
    public ResponseEntity<Map<String, Object>> getFileMetadata(@PathVariable String filename) {
        try {
            Path filePath = Paths.get("server-storage").resolve(filename);
            BasicFileAttributes attrs = Files.readAttributes(filePath, BasicFileAttributes.class);

            Map<String, Object> metadata = new HashMap<>();
            metadata.put("size", Files.size(filePath));
            metadata.put("uploadDate", attrs.creationTime().toMillis());

            return ResponseEntity.ok(metadata);
        } catch (IOException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{filename}")
    public ResponseEntity<?> deleteFile(@PathVariable String filename) {
        try {
            if (fileService.deleteFile(filename)) {
                return ResponseEntity.ok("File deleted");
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }
}