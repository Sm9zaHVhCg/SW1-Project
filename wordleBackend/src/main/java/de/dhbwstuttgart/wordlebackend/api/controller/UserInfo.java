package de.dhbwstuttgart.wordlebackend.api.controller;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "User_info")
public class UserInfo {

    @Id
    private String userId;
}
