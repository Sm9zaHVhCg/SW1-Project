package de.dhbwstuttgart.wordlebackend.api.payload;

import lombok.Data;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Data
public class SaveScoreRequest {
    String username;
    int score;
}
