package de.dhbwstuttgart.wordlebackend.api.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "Score")
public class Score {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int score;        // time taken
    private Topic category;  // COMP_SCI, MATH, etc.
    private int guesses;      // attempts
    private String word;      // optional but useful

    @ManyToOne
    @JoinColumn(name = "USER_NAME")
    @JsonIgnore
    private User user;
}
