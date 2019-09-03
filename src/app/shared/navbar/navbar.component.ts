import { Component, OnInit } from '@angular/core';
import AOS from 'aos';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isCollapsed;
  constructor() { }

  ngOnInit() {
    AOS.init();
  }


}
