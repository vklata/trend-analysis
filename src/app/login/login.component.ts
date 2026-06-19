import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
    styleUrls: ["./login.component.css"],
})
export class LoginComponent {

  username = '';
  password = '';
  errorMessage = '';
  ngOnInit() {

  const tenantId =
    localStorage.getItem('tenantId');

  if (tenantId) {

    this.router.navigate(['/overview']);

  }

}

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login() {

  this.http.post<any>(
    'http://localhost:5001/api/dashboard/login',
    {
      username: this.username,
      password: this.password
    }
  )
  .subscribe({

    next:(res)=>{

      localStorage.setItem(
        'tenantId',
        res.user.TenantId
      );

      localStorage.setItem(
        'username',
        res.user.UserName
      );

      this.router.navigate(['/overview']);

    },

  error: (err) => {

    console.log(err);

  }

  });

}
}
