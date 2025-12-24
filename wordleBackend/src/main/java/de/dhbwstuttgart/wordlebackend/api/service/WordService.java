package de.dhbwstuttgart.wordlebackend.api.service;

import de.dhbwstuttgart.wordlebackend.api.model.Topic;
import de.dhbwstuttgart.wordlebackend.api.model.Word;
import de.dhbwstuttgart.wordlebackend.api.model.WordStatus;
import de.dhbwstuttgart.wordlebackend.api.repository.WordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
@Service
@RequiredArgsConstructor
public class WordService {

    private final WordRepository wordRepository;

    public void createWord(Word word) {
        // Check if it already exists
        if (wordRepository.findByWordTitle(word.getWordTitle()).isPresent()) {
            throw new RuntimeException("Word already exists!");
        }
        wordRepository.save(word);
    }

    public Word updateWord(int wordId, Word word) {
        //try to find & change word, else throw error
        Word existingWord = wordRepository.findById(wordId)
                .orElseThrow(() -> new IllegalArgumentException("Word does not exist!"));

        //change the field accordingly
        if (word.getWordTitle() != null) existingWord.setWordTitle(word.getWordTitle());
        if (word.getWordDescription() != null) existingWord.setWordDescription(word.getWordDescription());
        if (word.getWordStatus() != null) existingWord.setWordStatus(word.getWordStatus());
        if (word.getTopic() != null) existingWord.setTopic(word.getTopic());
        if (word.getLastUsed() != null) existingWord.setLastUsed(word.getLastUsed());

        return wordRepository.save(existingWord);
    }

    public List<Word> getAllWords() {
        return wordRepository.findAll();
    }

    public void deleteWordById(int wordId) {
        wordRepository.deleteById(wordId);
    }

    @Transactional
    public Word getWordOfTheDay(Topic topic) {

        // 1. Try to find an existing WOTD
        Optional<Word> existing = wordRepository.findFirstByWordStatusAndTopicOrderByLastUsedAsc(
                WordStatus.WORD_OF_THE_DAY, topic
        );

        if (existing.isPresent()) {
            return existing.get();
        }

        // 2. No WOTD exists → manually trigger selection logic
        // Reset any leftover WOTD (just in case)
        wordRepository.bulkUpdateStatus(
                WordStatus.WORD_OF_THE_DAY,
                WordStatus.AVAILABLE,
                topic
        );

        // 3. Pick the oldest available word
        Word selected = wordRepository
                .findFirstByWordStatusAndTopicOrderByLastUsedAsc(
                        WordStatus.AVAILABLE,
                        topic
                )
                .orElseThrow(() -> new IllegalStateException("No available words for topic: " + topic));

        // 4. Promote it
        selected.setWordStatus(WordStatus.WORD_OF_THE_DAY);
        selected.setLastUsed(Instant.now());
        wordRepository.save(selected);

        return selected;
    }


    public Word verifyWord(int wordId) {
        //try to find & change word, else throw error
        Word existingWord = wordRepository.findById(wordId)
                .orElseThrow(() -> new IllegalArgumentException("Word does not exist!"));

        //change the status to be verified
        existingWord.setWordStatus(WordStatus.AVAILABLE);

        return wordRepository.save(existingWord);
    }

    public List<Word> getAllUnverifiedWords() {
        return wordRepository.findAllByWordStatus(WordStatus.TO_BE_VERIFIED);
    }

    public List<Word> getAllAvailableWords() {
        return wordRepository.findAllByWordStatus(WordStatus.AVAILABLE);
    }

    public List<Word> getAllAvailableWordsByTopic(String topic) {
        Topic topicEnum;
        try {
            topicEnum = Topic.valueOf(topic.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid topic: " + topic);
        }
        return wordRepository.findByWordStatusIsAndTopic(WordStatus.AVAILABLE, topicEnum);
    }
}
