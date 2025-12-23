package de.dhbwstuttgart.wordlebackend.api.controller;

import de.dhbwstuttgart.wordlebackend.api.payload.SaveScoreRequest;
import de.dhbwstuttgart.wordlebackend.api.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    //save new user
    @PostMapping("/new")
    public void newUser(@RequestParam String username) {
        userService.saveNewUser(username);
    }

    //save new guest user
    @PostMapping("/new-guest")
    public void newGuestUser() {
        userService.saveNewGuestUser();
    }

    //save score (if won)
    @PostMapping("/save-score")
    public void saveScore(@RequestBody SaveScoreRequest request) {
        // Call the userService to save the score
        userService.saveScore(request.getUsername(), request.getScore());
    }

    //get all scores (DEBUG)
    @GetMapping ("/all-scores")
    public ResponseEntity<Map<String, Integer>> getAllScores() {
       return ResponseEntity.ok(userService.getAllScores());
    }

    //get best scores for leaderboard
    @GetMapping ("/leaderboard")
    public ResponseEntity<Map<String, Integer>> getLeaderboard() {
        return ResponseEntity.ok(userService.getLeaderboard());
    }
}
