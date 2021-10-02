import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  formValue !: FormGroup;
  alertError : boolean = false;
  message : any = '';

  constructor(private formBuilder : FormBuilder,private router : Router) { }
  usersData = {"email":"eno.erno@gmail.com","password":"qwerty"}
  ngOnInit(): void {
    this.formValue = this.formBuilder.group({
      email : [''],
      password : ['']
    })
  }
  postLogin(){
    if(this.formValue.value.email == '' && this.formValue.value.password == ''){
      this.alertError = true;
      this.message = 'Required Email dan Password';
      setTimeout(() => {
        this.alertError = false;
      },2500)
    }else {
      if(this.formValue.value.email == this.usersData.email && this.formValue.value.password == this.usersData.password){
        localStorage.removeItem("users"); 
        localStorage.setItem('users', JSON.stringify(this.usersData));
        this.router.navigate(['/']);
      }else{
        this.alertError = true;
        this.message = 'Email dan Password Not Match';
        setTimeout(() => {
          this.alertError = false;
        },2500)
      }
    }
  }
}
