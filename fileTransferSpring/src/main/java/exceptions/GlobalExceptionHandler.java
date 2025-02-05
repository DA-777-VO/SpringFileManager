package exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(FileAlreadyExistsException.class)
    public ResponseEntity<?> handleFileAlreadyExists(FileAlreadyExistsException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
    }

    @ExceptionHandler(FileStorageException.class)
    public ResponseEntity<?> handleFileStorageException(FileStorageException ex) {
        return ResponseEntity.badRequest().body(ex.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleGeneralExceptions(Exception ex) {
        return ResponseEntity.internalServerError().body("Внутренняя ошибка сервера: " + ex.getMessage());
    }
}