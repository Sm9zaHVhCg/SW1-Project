package de.dhbwstuttgart.wordlebackend.api.model;


import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@Table(name = "WordleUser")
@NoArgsConstructor
@RequiredArgsConstructor
public class User {

    @Id
    @Column(name = "USER_NAME", nullable = false, unique = true, length = 50)
    String userName;

    @NonNull
    @JsonProperty("isAdmin")
    @Column(name = "IS_ADMIN")
    boolean isAdmin;

    @NonNull
    @JsonProperty("isGuest")
    @Column(name = "IS_GUEST")
    boolean isGuest;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL,orphanRemoval = true)
    private List<Score> scores = new ArrayList<>();
}
