import { Component, OnInit } from '@angular/core';



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

import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-addpost',
  templateUrl: './addpost.component.html',
  styleUrls: ['./addpost.component.css'],
})
export class AddpostComponent implements OnInit {
  locationName: string;
  description: string;
  picture: string = null;

  user = null;
  uploadPercent: number = null;

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router,
    private db: AngularFireDatabase,
    private storage: AngularFireStorage
  ) {
    this.authService.getUser().subscribe((user) => {
      this.db.object(`/users/${user.uid}`).valueChanges().subscribe();
    });
  }

  onSubmit() {
    const uid = uuidv4();

    this.db
      .object(`/posts/${uid}`)
      .set({
        id: uid,
        locationName: this.locationName,
        description: this.description,
        picture: this.picture,
        by: this.user.name,
        instaId: this.user.username,
        date: Date.now(),
      })
      .then(() => {
        this.router.navigateByUrl('/');
        this.toastr.success('post added successfully');
      })
      .catch((err) => {
        console.log(err);
        this.toastr.error('oopppss');
      });
  }

  ngOnInit(): void {}

  async uploadFile(event)
  {
   
   
    const file = event.target.files[0];

    let resiedImage =  await readAndCompressImage(file, imageConfig);

    const filePath =  file.name;

    const fileRef =  this.storage.ref(filePath);

    const task =  this.storage.upload(filePath, resiedImage);

    task.percentageChanges().subscribe((percentage) => {
      this.uploadPercent=percentage;
    })

    task.snapshotChanges()
    .pipe(
      finalize(
        ()=> {
          fileRef.getDownloadURL().subscribe(
            (url) =>{
              this.picture=url;
              this.toastr.success('image uploaded successfully');
            }
          )
        }
      )
    )
    .subscribe(

    )
  }
}
