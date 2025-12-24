package de.dhbwstuttgart.wordlebackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class WordleBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(WordleBackendApplication.class, args);
    }

}
