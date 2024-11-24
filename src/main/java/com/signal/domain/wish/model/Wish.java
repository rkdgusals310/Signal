package com.signal.domain.wish.model;


import com.signal.domain.auth.model.User;
import com.signal.global.entity.BaseEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;


@Entity
@Table(name = "wish")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class Wish extends BaseEntity {
    @ManyToOne
    @JoinColumn(name = "user_id",nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "consultant_id",nullable = false)
    private User consultant;

    public static Wish create(User user, User consultant) {
        return Wish.builder()
            .user(user)
            .consultant(consultant)
            .build()
            ;
    }
}
