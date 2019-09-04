import { Component, OnInit, HostListener } from '@angular/core';
import AOS from 'aos';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isCollapsed;
  button = '';
  screen;
  public innerWidth: any;


  constructor() { }

  ngOnInit() {
    AOS.init();

    this.innerWidth = window.innerWidth;
    if (this.innerWidth < 600) {
      this.screen = 'left'
    } else if (this.innerWidth >= 600) {
      this.screen = 'center';
  }
}

@HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
    if (this.innerWidth < 600) {
      this.screen = 'left'
    } else if (this.innerWidth >= 600) {
      this.screen = 'center';
  }
  }


  buttonToggle(e) {
if (this.button === '' || this.button === 'square') {
  this.button = 'cross';
} else if(this.button === 'cross') {
  this.button = 'square';
}
  }

}
