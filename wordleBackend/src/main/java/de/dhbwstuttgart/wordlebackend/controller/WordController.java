package de.dhbwstuttgart.wordlebackend.controller;

import de.dhbwstuttgart.wordlebackend.model.Word;
import de.dhbwstuttgart.wordlebackend.repository.WordRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/words")
@CrossOrigin(origins = "http://localhost:4200")
public class WordController {

    private final WordRepository repository;

    public WordController(WordRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Word> getAllWords() {
        return repository.findAll();
    }

    @PostMapping
    public Word saveWord(@RequestBody Word word) {
        return repository.save(word);
    }
}
