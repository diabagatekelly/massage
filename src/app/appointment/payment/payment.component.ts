import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild, AfterContentChecked, AfterViewChecked } from '@angular/core';
// import { environment} from '../../../../environments/environment';
// import { ICreateOrderRequest, IPayPalConfig } from '../../../../../node_modules/ngx-paypal/public_api';

// declare var hljs: any;
declare let paypal: any;

@Component({
  selector: 'app-payment',
  // changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './payment.component.html'
})
export class PaymentComponent implements AfterViewChecked, OnInit {
  addScript: boolean = false;
  paypalLoad: boolean = true;
  public showCancel: boolean = false;
  public showSuccess: boolean = false;
  public showError: boolean = false;

  finalAmount: number = 0;

  ngOnInit() {
    this.resetStatus();
  }

  paypalConfig = {
    // Need paypal dev password
    // env: environment.env,
    // client: {
    //   sandbox: environment.paypalID,
    //   production: environment.paypalID,
    // },
    commit: true,
    payment: (data, actions) => {
      return actions.payment.create({
        payment: {
          transactions: [
            { amount: { total: this.finalAmount, currency: 'USD' } }
          ]
        }
      });
    },
    style: {
            label: 'paypal',
            layout: 'horizontal',
            size: 'medium'
          },
    onAuthorize: (data, actions) => {
      return actions.payment.execute().then((payment) => {
      this.resetStatus();
      this.showSuccess = true;
      })
    },
    onCancel: (data, actions) => {
      console.log('OnCancel', data, actions);
      this.resetStatus();
       this.showCancel = true;
     },
     onError: err => {
            console.log('OnError', err);
            this.resetStatus();
            this.showError = true;
          },
  };

  ngAfterViewChecked(): void {
    if (!this.addScript) {
      this.addPaypalScript().then(() => {
        paypal.Button.render(this.paypalConfig, '#paypal-checkout-btn');
        this.paypalLoad = false;
      })
    }
  }

  addPaypalScript() {
    this.addScript = true;
    return new Promise((resolve, reject) => {
      let scripttagElement = document.createElement('script');
      scripttagElement.src = 'https://www.paypalobjects.com/api/checkout.js';
      scripttagElement.onload = resolve;
      document.body.appendChild(scripttagElement);
    });
  }

  private resetStatus(): void {
      this.showError = false;
      this.showSuccess = false;
      this.showCancel = false;
      this.finalAmount = 0;
    }
}
