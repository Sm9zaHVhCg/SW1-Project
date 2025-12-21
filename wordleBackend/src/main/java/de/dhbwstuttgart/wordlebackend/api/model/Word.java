package de.dhbwstuttgart.wordlebackend.api.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;
import org.antlr.v4.runtime.misc.NotNull;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Data
@Table(name = "Word")
public class Word {

    @Id
    @Column(name = "Word_ID")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long wordId;

    /*it is of note that I have consciously made the decision not to make the word title the identifier
    seeing as when people suggest words, there is the possibility that their word titles are subject to change
    thus the word title is not invariant and unsuitable as id*/

    @NotNull
    @JsonProperty("wordTitle")
    @Column(name = "Word_title")
    private String wordTitle;

    @NotNull
    @JsonProperty("wordDescription")
    @Column(name = "Word_description")
    private String wordDescription;

    @NotNull
    @JsonProperty("topic")
    @Column(name = "topic")
    private String topic;

    @NotNull
    @JsonProperty("wordStatus")
    @Column(name = "Word_status")
    private String wordStatus;

    @JsonProperty("lastUsed")
    @Column(name = "Last_used")
    @CreationTimestamp
    private Instant lastUsed;
}
