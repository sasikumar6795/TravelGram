import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  email: any;
  constructor(
    private authService: AuthService,
    private toastrService: ToastrService,
    private router: Router
  ) {
  
  }

  ngOnInit(): void {
    this.authService.getUser().subscribe((user) => {
      console.log('USER IS :', user);
      this.email = user?.email;
    });
  }

  async handleSignOut() {
    try {
      await this.authService.signOut();
      this.router.navigateByUrl('/signin');
      this.toastrService.info('Logout Success');
      this.email = null;
    } catch (error) {
      this.toastrService.error('Something went wrong');
    }
  }
}
