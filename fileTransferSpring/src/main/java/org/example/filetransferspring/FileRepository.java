package org.example.filetransferspring;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface FileRepository extends JpaRepository<FileEntity, Long> {
    boolean existsByFilenameAndOwner(String filename, User owner);
    Optional<FileEntity> findByFilenameAndOwner(String filename, User owner);
    List<FileEntity> findByOwner(User owner);
}