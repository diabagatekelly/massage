import { Component, OnInit } from '@angular/core';
import {NgbCarouselConfig} from '@ng-bootstrap/ng-bootstrap';
import AOS from 'aos';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [NgbCarouselConfig]  // add NgbCarouselConfig to the component providers

  })
export class HeaderComponent implements OnInit {
  showNavigationArrows = false;
  showNavigationIndicators = false;
  images = ['https://images.pexels.com/photos/269131/pexels-photo-269131.jpeg?cs=srgb&dl=bad-flower-massage-269131.jpg&fm=jpg',
  2, 3].map(() => `https://picsum.photos/900/500?random&t=${Math.random()}`);

bg = [
  [
    {background: 'bg1'}
  ]
];
  constructor(config: NgbCarouselConfig) {
    config.showNavigationArrows = true;
    config.showNavigationIndicators = true;
  }

  ngOnInit() {
    // this.cycleBackgrounds();
    AOS.init();
  }


  cycleBackgrounds() {
    let bg: any[] = [
    {
      background: 'bg1',
    },
  ];

    let index = 1;

    setInterval(() => {
      // Get the next index.  If at end, restart to the beginning.
      if (index >= 1 && index < 4) {
        bg[0].background = `bg${index}`;
        this.bg.splice(0, 1, bg);
        console.log(this.bg);
        index = index += 1 ;
      } else if (index === 4) {
        bg[0].background = `bg${index}`;
        this.bg.splice(0, 1, bg);
        console.log(this.bg);
        index = 1 ;
        this.bg[0][0].background = 'bg4';
      }
    }, 5000);
  }
}
