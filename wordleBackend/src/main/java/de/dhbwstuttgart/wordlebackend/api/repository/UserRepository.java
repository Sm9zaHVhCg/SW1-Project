package de.dhbwstuttgart.wordlebackend.api.repository;

import de.dhbwstuttgart.wordlebackend.api.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    @Modifying
    @Query("UPDATE User u SET u.score = 0")
    void resetAllScores();

    @Query("SELECT u FROM User u WHERE u.score IS NOT NULL AND u.score > 0 ORDER BY u.score ASC")
    List<User> findTop3ByScoreGreaterThanZeroOrderByScoreAsc();

    Optional<User> findByUserName(String userName);

}
