package de.dhbwstuttgart.wordlebackend.api.controller;

import de.dhbwstuttgart.wordlebackend.api.model.Word;
import de.dhbwstuttgart.wordlebackend.api.payload.AdminChangeRequest;
import de.dhbwstuttgart.wordlebackend.api.payload.WordResponse;
import de.dhbwstuttgart.wordlebackend.api.service.UserService;
import de.dhbwstuttgart.wordlebackend.api.service.WordService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserService userService;
    private final WordService wordService;

    //change admin status of user
    @PostMapping("/change-admin-status")
    public void newAdminUser(@RequestBody AdminChangeRequest request) {
        userService.changeAdminStatus(request.getUsernameOfUserToChange());
    }

    //delete word
    @DeleteMapping("/word-edit/{wordId}/delete")
    public ResponseEntity<String> deleteWord(@Validated @PathVariable ("wordId") int wordId) {
        wordService.deleteWordById(wordId);
        return ResponseEntity.ok("Word deleted!");
    }

    //verify a word (change status to verified)
    @PatchMapping("/word-edit/{wordId}/verify")
    public ResponseEntity<WordResponse> patchWord(@Validated @PathVariable ("wordId") int wordId) {
        Word updatedWord = wordService.verifyWord(wordId);
        return  ResponseEntity.ok(new WordResponse().mapWordToWordResponse(updatedWord));
    }

    //create new word
    @PostMapping("/word-edit/new")
    public ResponseEntity<WordResponse> newWord(@Validated @RequestBody Word word) {
        wordService.createWord(word);
        System.out.println("New word created");
        return ResponseEntity.ok(new WordResponse().mapWordToWordResponse(word));
    }

    //change existing word
    @PatchMapping("/word-edit/{wordId}/edit")
    public ResponseEntity<WordResponse> patchWord(@Validated @PathVariable ("wordId") int wordId, @RequestBody Word word) {
        Word updatedWord = wordService.updateWord(wordId, word);
        return  ResponseEntity.ok(new WordResponse().mapWordToWordResponse(updatedWord));
    }

    //get all existing words
    @GetMapping("/word-edit/all")
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

}
