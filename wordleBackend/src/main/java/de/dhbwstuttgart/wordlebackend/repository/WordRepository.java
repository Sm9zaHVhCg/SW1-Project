package de.dhbwstuttgart.wordlebackend.repository;

import de.dhbwstuttgart.wordlebackend.model.Word;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WordRepository extends JpaRepository<Word, Long> {
}

