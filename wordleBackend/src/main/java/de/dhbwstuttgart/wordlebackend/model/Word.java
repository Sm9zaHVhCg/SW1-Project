package de.dhbwstuttgart.wordlebackend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "words")
public class Word {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String word;

    private String role; 

    private String Studiengang;

    private String definition;

    public Word() {
    }

    public Word(String word, String role, String Studiengang ,String definition) {
        this.word = word;
        this.role = role;
        this.definition = definition;
    }

    public Long getId() {
        return id;
    }

    public String getWord() {
        return word;
    }

    public void setWord(String word) {
        this.word = word;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getStudiengang() {
        return Studiengang;
    }
    public void setStudiengang(String Studiengang) {
        this.Studiengang = Studiengang;
    }

    public String getDefinition() {
        return definition;
    }

    public void setDefinition(String definition) {
        this.definition = definition;
    }
}
