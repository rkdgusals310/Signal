package com.signal.domain.comment.model;

import com.signal.domain.article.model.Article;
import com.signal.domain.auth.model.User;
import com.signal.domain.post.model.Post;
import com.signal.global.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.springframework.data.annotation.LastModifiedDate;

@Entity
@Table(name = "comment")
@Getter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class Comment extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "post_id")
    private Post post;

    @ManyToOne
    @JoinColumn(name = "article_id")
    private Article article;

    @Column(nullable = false)
    private String contents;

    @LastModifiedDate
    @Column(name = "modified_at")
    @Temporal(TemporalType.TIMESTAMP)
    private LocalDateTime modifiedAt;

    private LocalDateTime deletedAt;
    
    public Comment(Post post,String contents) {
    	this.post=post;
    	this.contents=contents;
    }

	public void updateCotents(String newContents){
		if(newContents==null ||newContents.isBlank()) {
			throw new IllegalArgumentException("댓글내용이 비어 있습니다.");
		}
		this.contents=newContents;
		
	}
	public Comment(Post post, User user, String contents) {
	    this.post = post;
	    this.user = user;
	    this.contents = contents;
	}
	
	public Comment(Article article, User user, String contents) {
	    this.article = article;
	    this.user = user;
	    this.contents = contents;
	}

}
