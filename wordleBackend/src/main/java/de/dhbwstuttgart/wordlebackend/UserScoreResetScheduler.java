package de.dhbwstuttgart.wordlebackend;

import de.dhbwstuttgart.wordlebackend.api.service.UserService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserScoreResetScheduler {

    private final UserService userScoreService;

    public UserScoreResetScheduler(UserService userScoreService) {
        this.userScoreService = userScoreService;
    }

    @Transactional
    @Scheduled(cron = "0 0 0 * * *")
    public void resetAllUserScores() {
        userScoreService.resetAllScores();
        System.out.println("All user scores reset to zero.");
    }
}

