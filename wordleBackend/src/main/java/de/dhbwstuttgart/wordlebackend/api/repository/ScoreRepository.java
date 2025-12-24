package de.dhbwstuttgart.wordlebackend.api.repository;

import de.dhbwstuttgart.wordlebackend.api.model.Score;
import de.dhbwstuttgart.wordlebackend.api.model.Topic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface ScoreRepository extends JpaRepository<Score, Integer> {
    List<Score> findByWord(String word);

    List<Score> findByCategory(Topic category);

    List<Score> findByScoreGreaterThan(int score);

    @Transactional
    @Modifying
    @Query("DELETE FROM Score")
    void deleteAllScores();
}
