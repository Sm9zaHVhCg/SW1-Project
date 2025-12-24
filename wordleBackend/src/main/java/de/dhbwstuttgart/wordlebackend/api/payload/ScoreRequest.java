package de.dhbwstuttgart.wordlebackend.api.payload;

import de.dhbwstuttgart.wordlebackend.api.model.Topic;
import lombok.Data;

@Data
public class ScoreRequest {
    private String username;
    private int score;
    private Topic category;
    private int guesses;
    private String word;
}
