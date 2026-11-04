package com.example.activityservice.repository;

import com.example.activityservice.model.UserActivity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface UserActivityRepository extends JpaRepository<UserActivity, Long> {
    List<UserActivity> findTop10ByOrderByTimestampDesc();
}
