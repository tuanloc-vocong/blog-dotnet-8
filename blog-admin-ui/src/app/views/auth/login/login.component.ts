import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  AdminApiAuthApiClient,
  AuthenticatedResult,
  LoginRequest,
} from 'src/app/api/admin-api.service.generated';
import { AlertService } from 'src/app/shared/services/alert.service';
import { UrlConstants } from 'src/app/shared/constants/url.constant';
import { TokenStorageService } from 'src/app/shared/services/token-storage.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs';
import { OnDestroy } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnDestroy {
  loginForm: FormGroup;
  private ngUnsubscribe = new Subject<void>();
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authApiClient: AdminApiAuthApiClient,
    private alertService: AlertService,
    private router: Router,
    private tokenService: TokenStorageService
  ) {
    this.loginForm = this.fb.group({
      userName: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  login() {
    this.loading = true;
    var request: LoginRequest = new LoginRequest({
      userName: this.loginForm.controls['userName'].value,
      password: this.loginForm.controls['password'].value,
    });

    this.authApiClient
      .login(request)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res: AuthenticatedResult) => {
          // Save token and refresh token to localstorage
          this.tokenService.saveToken(res.token);
          this.tokenService.saveRefreshToken(res.refreshToken);
          this.tokenService.saveUser(res);

          // Redirect to dashboard
          this.router.navigate([UrlConstants.HOME]);
        },
        error: (error: any) => {
          this.alertService.showError('Đăng nhập không đúng!');
          this.loading = false;
        },
      });
  }
}
