package de.dhbwstuttgart.wordlebackend.api.model;


import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

@Entity
@Data
@Table(name = "WordleUser")
@NoArgsConstructor
@RequiredArgsConstructor
public class User {

    @Id
    @Column(name = "USER_NAME", nullable = false, unique = true, length = 50)
    String userName;

    @JsonProperty("score")
    @Column(name = "SCORE")
    int score;

    @NonNull
    @JsonProperty("isAdmin")
    @Column(name = "IS_ADMIN")
    boolean isAdmin;

    @NonNull
    @JsonProperty("isGuest")
    @Column(name = "IS_GUEST")
    boolean isGuest;
}
