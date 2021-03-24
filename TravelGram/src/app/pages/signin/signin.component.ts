import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';



@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  constructor(
    private authService : AuthService,
    private toastr : ToastrService,
    private router : Router
  ) { }

  ngOnInit(): void {
  }

  onSubmit(f: NgForm)
  {
    const {email, password} = f.form.value;

    this.authService.signIn(email,password)
    .then( (res) => {
      console.log("sign in response"+ " " +res);
      this.toastr.success('sign in success');
      this.router.navigateByUrl('/'); 
    }

    )
    .catch((err)=>{
      console.log(err);
      this.toastr.error(err.message, "",{
        closeButton: true
      } );
    })
  }

}
