import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { SigninPage } from '../../pages/signin/signin'
import { SignupPage } from '../../pages/signup/signup'

@NgModule({
  imports: [
    IonicModule.forRoot(SigninPage),
    IonicModule.forRoot(SignupPage)
  ],
  declarations: [
    SigninPage,
    SignupPage
  ],
  exports: [
    SigninPage,
    SignupPage
  ]
})
export class AuthModule {}
