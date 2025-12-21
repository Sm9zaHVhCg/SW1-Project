package de.dhbwstuttgart.wordlebackend.api.controller;

import de.dhbwstuttgart.wordlebackend.api.model.Word;

import de.dhbwstuttgart.wordlebackend.api.payload.WordResponse;
import de.dhbwstuttgart.wordlebackend.api.service.WordService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/word")
@RequiredArgsConstructor
public class WordController {

    private final WordService wordService;

    //get all existing words
    @GetMapping("/all")
    public ResponseEntity<List<WordResponse>> getAllWords() {
        List<Word> words = wordService.getAllWords();
        // Convert Word -> WordResponse
        List<WordResponse> responses = words.stream()
                .map(word -> new WordResponse(
                        word.getWordId(),
                        word.getWordTitle(),
                        word.getWordDescription(),
                        word.getTopic(),
                        word.getWordStatus(),
                        word.getLastUsed()
                ))
                .toList();

        return new ResponseEntity<>(responses, HttpStatus.OK);
    }

    //create new word
    @PostMapping("/new")
    public ResponseEntity<WordResponse> newWord(@Validated @RequestBody Word word) {
        wordService.createWord(word);
        System.out.println("New word created");
        return ResponseEntity.ok(new WordResponse().mapWordToWordResponse(word));
    }

    //suggest new word
    @PostMapping("new-suggestion")
    public ResponseEntity<WordResponse> suggestWord(@Validated @RequestBody Word word) {
        word.setWordStatus("toBeVerified");
        wordService.createWord(word);
        System.out.println("New word suggested");
        return ResponseEntity.ok(new WordResponse().mapWordToWordResponse(word));
    }

    //change existing word
    @PatchMapping("/{wordId}/patch")
    public ResponseEntity<WordResponse> patchWord(@Validated @PathVariable ("wordId") int wordId, @RequestBody Word word) {
        Word updatedWord = wordService.updateWord(wordId, word);
        return  ResponseEntity.ok(new WordResponse().mapWordToWordResponse(updatedWord));
    }

    //delete word
    @DeleteMapping("/{wordId}/delete")
    public ResponseEntity<String> deleteWord(@Validated @PathVariable ("wordId") int wordId) {
        wordService.deleteWordById(wordId);
        return ResponseEntity.ok("Word deleted!");
    }

    //retrieve word of the day
    @GetMapping("/getWordOfTheDay")
    public ResponseEntity<WordResponse> getWordOfTheDay() {
        Word wordOfTheDay = wordService.getWordOfTheDay();
        return ResponseEntity.ok(new WordResponse().mapWordToWordResponse(wordOfTheDay));
    }
}
