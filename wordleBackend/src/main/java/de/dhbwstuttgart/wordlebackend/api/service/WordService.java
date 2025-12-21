package de.dhbwstuttgart.wordlebackend.api.service;

import de.dhbwstuttgart.wordlebackend.api.model.Word;
import de.dhbwstuttgart.wordlebackend.api.repository.WordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Comparator;
import java.util.List;
import java.util.Random;
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

    public Word getWordOfTheDay() {
        // 1. Get all suitable words
        List<Word> suitableWords = wordRepository.findByWordStatusIsNot("toBeVerified");

        if (suitableWords.isEmpty()) {
            return null; // or throw a custom exception
        }

        // 2. Sort words by lastUsed (oldest first)
        // Words never used yet (lastUsed == null) should come first
        suitableWords.sort(Comparator.comparing(
                word -> word.getLastUsed() != null ? word.getLastUsed() : Instant.EPOCH
        ));

        // 3. Pick the first N words that haven't been used recently
        int topN = Math.min(10, suitableWords.size()); // you can adjust N
        List<Word> candidates = suitableWords.subList(0, topN);

        // 4. Pick one at random from the oldest ones
        Random random = new Random();
        Word selectedWord = candidates.get(random.nextInt(candidates.size()));

        // 5. Update its lastUsed timestamp
        selectedWord.setLastUsed(Instant.now());
        wordRepository.save(selectedWord);

        return selectedWord;
    }
}
