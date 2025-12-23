package de.dhbwstuttgart.wordlebackend.api.service;

import de.dhbwstuttgart.wordlebackend.api.model.User;
import de.dhbwstuttgart.wordlebackend.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public void saveScore(String username, int score) {
        userRepository.findByUserName(username).ifPresent(user -> {
            user.setScore(score);
            userRepository.save(user);
        });
    }

    public Map<String, Integer> getAllScores() {
        Map<String, Integer> scores = new HashMap<>();

        userRepository.findAll().forEach(user -> {
            scores.put(user.getUserName(), user.getScore());
        });

        return scores;
    }

    public void saveNewUser(String username) {
        //check if user already exists
        boolean exists = userRepository.findAll().stream()
                .anyMatch(user -> user.getUserName().equals(username));
        if (!exists) {
            //create new user
            User user = new User(false, false);
            user.setUserName(username);
            userRepository.save(user);
        }
    }

    public void saveNewGuestUser() {
        //generate random username
        String username = "guest_" + System.currentTimeMillis();
        //create new guest user
        User user = new User(false, true);
        user.setUserName(username);
        userRepository.save(user);
    }

    public void changeAdminStatus(String username) {
        userRepository.findAll().forEach(user -> {
            if (user.getUserName().equals(username)) {
                user.setAdmin(!user.isAdmin());
                userRepository.save(user);
            }
        });
    }

    public Map<String, Integer> getLeaderboard() {
        return userRepository.findTop3ByScoreGreaterThanZeroOrderByScoreAsc()
                .stream()
                .collect(Collectors.toMap(
                        User::getUserName,
                        User::getScore,
                        (a, b) -> a,
                        LinkedHashMap::new
                ));
    }

    @Transactional
    public void resetAllScores() {
        userRepository.resetAllScores();
    }
}
