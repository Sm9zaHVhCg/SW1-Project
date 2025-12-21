package de.dhbwstuttgart.wordlebackend.api.repository;

import de.dhbwstuttgart.wordlebackend.api.model.Word;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WordRepository extends JpaRepository<Word, Integer> {
    Optional<Word> findByWordTitle(String wordTitle);

    List<Word> findByWordStatusIsNot(String status);
}
