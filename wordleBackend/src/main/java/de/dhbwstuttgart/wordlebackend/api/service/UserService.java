package de.dhbwstuttgart.wordlebackend.api.service;

import de.dhbwstuttgart.wordlebackend.api.model.Score;
import de.dhbwstuttgart.wordlebackend.api.model.Topic;
import de.dhbwstuttgart.wordlebackend.api.model.User;
import de.dhbwstuttgart.wordlebackend.api.payload.ScoreResponse;
import de.dhbwstuttgart.wordlebackend.api.repository.ScoreRepository;
import de.dhbwstuttgart.wordlebackend.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final ScoreRepository scoreRepository;

    public void saveNewUser(String username) {
        Optional<User> existing = userRepository.findByUserName(username);

        if (existing.isPresent()) {
            // User already exists → do nothing
            return;
        }

        // Create new user
        User user = new User(false, false);
        user.setUserName(username);
        userRepository.save(user);
    }

    public String saveNewGuestUser() {
        //generate random username
        String username = "guest_" + System.currentTimeMillis();
        //create new guest user
        User user = new User(false, true);
        user.setUserName(username);
        userRepository.save(user);
        return username;
    }

    public void changeAdminStatus(String username) {
        userRepository.findAll().forEach(user -> {
            if (user.getUserName().equals(username)) {
                user.setAdmin(!user.isAdmin());
                userRepository.save(user);
            }
        });
    }

    public List<ScoreResponse> getLeaderboardForCategory(String category) {
        try {
            category = category.replace("-", "_").toUpperCase();
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid category: " + category);
        }
        return scoreRepository.findByCategory(Topic.valueOf(category)).stream()
                // group scores by username
                .collect(Collectors.groupingBy(s -> s.getUser().getUserName())).entrySet().stream()
                // pick the best score per user
                .map(entry -> entry.getValue().stream().min(Comparator.comparingInt(Score::getScore).thenComparingInt(Score::getGuesses)).orElseThrow())
                // sort the best scores
                .sorted(Comparator.comparingInt(Score::getScore).thenComparingInt(Score::getGuesses))
                // take top 3
                .limit(3).map(score -> new ScoreResponse(
                        score.getUser().getUserName(),
                        score.getScore(),
                        score.getCategory(),
                        score.getGuesses())).toList();
    }


    public boolean isAdmin(String username) {
        return userRepository.findByUserName(username).map(User::isAdmin).orElse(false);
    }

    @Transactional
    public void deleteAllGuestUsers() {
        userRepository.deleteAllByIsGuestTrue();
    }

    @Transactional
    public void save(User user) {
    }

    public User findByUsername(String username) {
        return userRepository.findByUserName(username).orElseThrow(() -> new NoSuchElementException("User not found: " + username));
    }

    @Transactional
    public void resetAllScores() {
        scoreRepository.deleteAllScores();
    }
}
