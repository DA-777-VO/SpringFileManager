package org.example.filetransferspring;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface SharedFileRepository extends JpaRepository<SharedFile, Long> {
    Optional<SharedFile> findByShareToken(String token);
}