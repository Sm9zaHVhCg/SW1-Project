package de.dhbwstuttgart.wordlebackend.api.repository;

import de.dhbwstuttgart.wordlebackend.api.model.Topic;
import de.dhbwstuttgart.wordlebackend.api.model.Word;
import de.dhbwstuttgart.wordlebackend.api.model.WordStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
@Repository
public interface WordRepository extends JpaRepository<Word, Integer> {

    Optional<Word> findByWordTitle(String wordTitle);

    Optional<Word> findFirstByWordStatusAndTopicOrderByLastUsedAsc(
            WordStatus wordStatus,
            Topic topic
    );

    @Modifying
    @Query("""
        UPDATE Word w 
        SET w.wordStatus = :status 
        WHERE w.wordStatus = :oldStatus 
          AND w.topic = :topic
    """)
    int bulkUpdateStatus(
            @Param("oldStatus") WordStatus oldStatus,
            @Param("status") WordStatus status,
            @Param("topic") Topic topic
    );

    List<Word> findAllByWordStatus(WordStatus status);

    List<Word> findByWordStatusIsAndTopic(WordStatus wordStatus, Topic topicEnum);
}

