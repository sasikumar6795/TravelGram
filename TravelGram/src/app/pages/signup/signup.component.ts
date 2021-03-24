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

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  picture: string = '../../assets/img.png';

  uploadPercent: number;

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router,
    private db: AngularFireDatabase,
    private storage: AngularFireStorage
  ) {}

  ngOnInit(): void {}

  onSubmit(f: NgForm) {
    const { email, password, username, country, bio, name } = f.form.value;

    // further validation like username has to be unique , password must be 8 characters like that

    this.authService
      .signUp(email, password)
      .then((res) => {
        console.log('response of auth service user object', res);

        const {uid} = res.user;

        this.db.object(`/users/${uid}`).set({
          id: uid,
          name: name,
          email: email,
          instaId: username,
          country: country,
          bio: bio,
          picture: this.picture,
        });
      })
      .then(() => {
        this.router.navigateByUrl('/');
        this.toastr.success('Sign up success');
      })
      .catch((err) => {
        console.log(err);
        this.toastr.error('something went wrong in signup');
      });
  }

  async uploadFile(event : any)
  {
    const file =  event.target.files[0];

    let resizeImage =  await readAndCompressImage(file, imageConfig);

    const filePath =  file.name // rename the image with uid 

    const fileRef =  this.storage.ref(filePath);

    const task =  this.storage.upload(filePath, resizeImage); 

    task.percentageChanges().subscribe(
      (percentage) => {
        this.uploadPercent = percentage;
      }
    )

    task.snapshotChanges()
    .pipe(
      finalize(
        () => {
          fileRef.getDownloadURL().subscribe(
            (url) => {
              this.picture =url;
              this.toastr.success('image uploaded successfully');
            }
          )
        }
      )
    )
    .subscribe();
  }
}
