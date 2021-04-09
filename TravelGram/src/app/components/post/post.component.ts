import { Component, Input, OnInit , OnChanges, SimpleChanges } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

import {
  faThumbsUp,
  faThumbsDown,
  faShareSquare,
} from '@fortawesome/free-regular-svg-icons';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
})
export class PostComponent implements OnInit, OnChanges {
  faThumbsUp = faThumbsUp;
  faThumbsDown = faThumbsDown;
  faShareSquare = faShareSquare;

  uid = null;
  upVote = 0;
  downVote = 0;
  @Input() post;
  constructor(
    private authService: AuthService,
    private db: AngularFireDatabase
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    
    if(this.post.vote)
    {
      Object.values(this.post.vote).map(
        (val: any) => {
          if(val.upVote)
          {
            this.upVote ++;
          }
          if(val.downVote)
          {
            this.downVote ++;
          }
        }
      )
    }
  }

  ngOnInit(): void {

    this.authService.getUser().subscribe(
      (user)=> {
        this.uid=user?.uid;
      }
    )

  }

  upVotePost()
  {
    console.log("upvoting");
    this.db.object(`/posts/${this.post.id}/vote/${this.uid}`).set(
      {
        upVote:1,
      }
    )
  }

  downVotePost()
  {
    console.log("downvoting");
    this.db.object(`/posts/${this.post.id}/vote/${this.uid}`).set(
      {
        downVote:1,
      }
    )
  }


  getInstaUrl()
  {
    return 'https://instagram.com/${this.post.instaId}'
  }
}
