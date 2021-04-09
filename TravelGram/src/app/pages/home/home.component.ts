import { Component, OnInit } from '@angular/core';
import {
  AngularFireDatabase,
  AngularFireDatabaseModule,
} from '@angular/fire/database';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  users = [];
  posts = [];

  isLoading = false;

  constructor(private db: AngularFireDatabase, private toastr: ToastrService) {}

  ngOnInit(): void {
    //getting all the users
    this.isLoading = true;
    this.db
      .object(`/users`)
      .valueChanges()
      .subscribe((obj) => {
        console.log('object of users from database', obj);
        if (obj) {
          this.users = Object.values(obj);
          this.toastr.success('users found');
          this.isLoading = false;
        } else {
          this.toastr.error('No users found');
          this.users = [];
          this.isLoading = false;
        }
      });

    //grab all the posts from firebase database

    this.db
      .object('/posts')
      .valueChanges()
      .subscribe((obj) => {
        console.log('posts object from db', obj);
        if (obj) {
          this.posts = Object.values(obj).sort((a, b) => b.date - a.date);
          this.toastr.success('posts retrived from db');
          this.isLoading = false;
        } else {
          this.toastr.error('grabbing posts failed');
          this.posts = [];
          this.isLoading = false;
        }
      });
  }
}
