package de.dhbwstuttgart.wordlebackend;

import de.dhbwstuttgart.wordlebackend.api.service.UserService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class GuestUserCleanupScheduler {

    private final UserService userService;

    public GuestUserCleanupScheduler(UserService userService) {
        this.userService = userService;
    }

    @Transactional
    @Scheduled(cron = "0 0 0 * * *") // every day at midnight
    public void deleteGuestUsers() {
        userService.deleteAllGuestUsers();
        System.out.println("All guest users have been deleted.");
    }
}
