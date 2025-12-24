package de.dhbwstuttgart.wordlebackend.api.controller;

import de.dhbwstuttgart.wordlebackend.api.model.Score;
import de.dhbwstuttgart.wordlebackend.api.model.User;
import de.dhbwstuttgart.wordlebackend.api.payload.ScoreRequest;
import de.dhbwstuttgart.wordlebackend.api.payload.ScoreResponse;
import de.dhbwstuttgart.wordlebackend.api.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
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
    public ResponseEntity<Map<String, String>> newGuestUser() {
        return ResponseEntity.ok(Map.of("user", userService.saveNewGuestUser()));
    }

    @PostMapping("/save-score")
    public ResponseEntity<?> saveScore(@RequestBody ScoreRequest request) {
        User user = userService.findByUsername(request.getUsername());

        Score score = new Score();
        score.setScore(request.getScore());
        score.setCategory(request.getCategory());
        score.setGuesses(request.getGuesses());
        score.setWord(request.getWord());
        score.setUser(user);

        user.getScores().add(score);
        userService.save(user);

        return ResponseEntity.ok("Score saved");
    }


    //get best scores for leaderboard
    @GetMapping ("/leaderboard")
    public ResponseEntity<List<ScoreResponse>> getLeaderboard(@RequestParam String category) {
        return ResponseEntity.ok(userService.getLeaderboardForCategory(category));
    }

    //get if user is admin
    @GetMapping ("/is-admin")
    public ResponseEntity<Map<String,Boolean>> isAdmin(@RequestParam String username) {
        return ResponseEntity.ok(Map.of("isAdmin",userService.isAdmin(username)));
        }
}
