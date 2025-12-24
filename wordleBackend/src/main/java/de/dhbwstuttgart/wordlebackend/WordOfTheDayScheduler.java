package de.dhbwstuttgart.wordlebackend;

import de.dhbwstuttgart.wordlebackend.api.model.Topic;
import de.dhbwstuttgart.wordlebackend.api.model.Word;
import de.dhbwstuttgart.wordlebackend.api.model.WordStatus;
import de.dhbwstuttgart.wordlebackend.api.repository.WordRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
public class WordOfTheDayScheduler {

    private final WordRepository wordRepository;

    public WordOfTheDayScheduler(WordRepository wordRepository) {
        this.wordRepository = wordRepository;
    }

    @Scheduled(cron = "0 0 0 * * *") // every midnight
    public void selectWordOfTheDayForAllTopics() {

        for (Topic topic : Topic.values()) {
            updateWordOfTheDayForTopic(topic);
        }
    }

    @Transactional
    protected void updateWordOfTheDayForTopic(Topic topic) {

        // 1. Reset previous WOTD for this topic
        wordRepository.bulkUpdateStatus(
                WordStatus.WORD_OF_THE_DAY,
                WordStatus.AVAILABLE,
                topic
        );

        // 2. Find oldest unused word for this topic
        Word word = wordRepository
                .findFirstByWordStatusAndTopicOrderByLastUsedAsc(
                        WordStatus.AVAILABLE,
                        topic
                )
                .orElseThrow(() ->
                        new IllegalStateException("No available words found for topic: " + topic)
                );

        // 3. Promote to WOTD
        word.setWordStatus(WordStatus.WORD_OF_THE_DAY);
        word.setLastUsed(Instant.now());

        wordRepository.save(word);
    }
}
