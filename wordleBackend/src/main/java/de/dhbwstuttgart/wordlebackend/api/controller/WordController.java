package de.dhbwstuttgart.wordlebackend.api.controller;

import de.dhbwstuttgart.wordlebackend.api.model.Topic;
import de.dhbwstuttgart.wordlebackend.api.model.Word;

import de.dhbwstuttgart.wordlebackend.api.model.WordStatus;
import de.dhbwstuttgart.wordlebackend.api.payload.WordResponse;
import de.dhbwstuttgart.wordlebackend.api.service.WordService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/word")
@RequiredArgsConstructor
public class WordController {

    private final WordService wordService;

    //get all possible topics
    @GetMapping("/topics")
    public ResponseEntity<Topic[]> getAllTopics() {
        Topic[] topics = Topic.values();
        return new ResponseEntity<>(topics, HttpStatus.OK);
    }

    //suggest new word
    @PostMapping("/new-suggestion")
    public ResponseEntity<WordResponse> suggestWord(@Validated @RequestBody Word word) {
        word.setWordStatus(WordStatus.TO_BE_VERIFIED);
        wordService.createWord(word);
        System.out.println("New word suggested");
        return ResponseEntity.ok(new WordResponse().mapWordToWordResponse(word));
    }

    //retrieve word of the day by topic
    @GetMapping("/getWordOfTheDay")
    public ResponseEntity<?> getWordOfTheDay(@RequestParam String topic) {

        String normalized = topic.replace("-", "_").toUpperCase();

        boolean exists = Arrays.stream(Topic.values())
                .anyMatch(t -> t.name().equals(normalized));

        if (!exists) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Invalid topic: " + topic);
        }

        try {
            Topic enumTopic = Topic.valueOf(normalized);
            Word wordOfTheDay = wordService.getWordOfTheDay(enumTopic);
            return ResponseEntity.ok(new WordResponse().mapWordToWordResponse(wordOfTheDay));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No available words for topic: " + normalized);
        }
    }

}
