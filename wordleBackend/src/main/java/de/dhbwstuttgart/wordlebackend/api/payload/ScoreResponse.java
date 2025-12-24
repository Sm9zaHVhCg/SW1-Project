package de.dhbwstuttgart.wordlebackend.api.payload;

import de.dhbwstuttgart.wordlebackend.api.model.Topic;

public record ScoreResponse(
        String username,
        int score,
        Topic category,
        int guesses
) {}

