import { Component, OnInit } from '@angular/core';

//angular form
import { NgForm } from '@angular/forms';

//angular router
import { Router } from '@angular/router';

//services
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

import { finalize } from 'rxjs/operators';

//firebase
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireDatabase } from '@angular/fire/database';

//browser image resizer
import { readAndCompressImage } from 'browser-image-resizer';
import { imageConfig } from 'src/app/utils/config';

//uuid

import {v4 as uuidv4} from 'uuid';

@Component({
  selector: 'app-addpost',
  templateUrl: './addpost.component.html',
  styleUrls: ['./addpost.component.css']
})
export class AddpostComponent implements OnInit {

  location: string;
  description: string;
  picture: string =null;

  user = null;
  uploadPercent: number =null;

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private router : Router,
    private db: AngularFireDatabase,
    private storage: AngularFireStorage
  ) { 

    this.authService.getUser().subscribe((user) =>{
      this.db.object(`/users/${user.uid}`)
      .valueChanges()
      .subscribe()
    }
    )
  }

  ngOnInit(): void {
  }

}
