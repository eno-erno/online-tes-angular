import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isLogin : boolean = false;
  isLogout : boolean = false;
  constructor(private router : Router) { 
    const auth = localStorage.getItem('users');
    if(auth){
      this.isLogin = false;
      this.isLogout = true;
      this.router.navigate(['/']);
    }else{
      this.isLogin = true;
      this.isLogout = false;
      this.router.navigate(['/login']);
    }
  }

  ngOnInit(): void {
  }
  logout(){
    localStorage.removeItem("users"); 
    this.router.navigate(['/login']);
  }
}
