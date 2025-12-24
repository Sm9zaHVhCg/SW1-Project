package de.dhbwstuttgart.wordlebackend.api.repository;

import de.dhbwstuttgart.wordlebackend.api.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

    Optional<User> findByUserName(String userName);

    @Transactional
    @Modifying
    @Query("DELETE FROM User u WHERE u.isGuest = true")
    void deleteAllByIsGuestTrue();
}
