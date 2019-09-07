import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild, AfterContentChecked, AfterViewChecked } from '@angular/core';
import { environment} from '../../../environments/environment';
import { ICreateOrderRequest, IPayPalConfig } from '../../../../node_modules/ngx-paypal/public_api';

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
    env: environment.env,
    client: {
      sandbox: environment.paypalID,
      production: environment.paypalID,
    },
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


  // public defaultPrice: string = '0.00';
  // public price;
  // public payPalConfig?: IPayPalConfig;

  // public showSuccess: boolean = false;
  // public showCancel: boolean = false;
  // public showError: boolean = false;

  // @ViewChild('priceElem', { static: false }) priceElem?: ElementRef;

  // constructor() {
  // }

  // ngOnInit(): void {
  //   this.initConfig(this.defaultPrice);
  //   console.log(this.price);
  // }

  // ngAfterViewInit(): void {
  //   this.prettify();
  // }

  // ngAfterContentChecked() {
  //   this.initConfig(this.price);
  // }
  // changePrice(): void {
  //   if (this.priceElem) {
  //     this.initConfig(this.priceElem.nativeElement.value);
  //   }
  // }

  // private initConfig(price: string): void {
  //   this.payPalConfig = {
  //     currency: 'USD',
  //     clientId: 'AQ_hXKTjkMgQlus5p0o2I9Nns9LFHrg-l10Rh1YbbNIJro-wdvzmek_Q4_vEf1Jr9AqE8qG7__Ah9_al',
  //     createOrderOnClient: (data) => <ICreateOrderRequest>{
  //       intent: 'CAPTURE',
  //         purchase_units: [
  //           {
  //             amount: {
  //               currency_code: 'USD',
  //               value: price,
  //               breakdown: {
  //                 item_total: {
  //                   currency_code: 'USD',
  //                   value: price
  //                 }
  //               }
  //             },
  //           }
  //         ]
  //     },
  //     advanced: {
  //       commit: 'true'
  //     },
  //     style: {
  //       label: 'paypal',
  //       layout: 'vertical'
  //     },
  //     onApprove: (data, actions) => {
  //       console.log('onApprove - transaction was approved, but not authorized', data, actions);
  //       actions.order.get().then((details: any) => {
  //         console.log('onApprove - you can get full order details inside onApprove: ', details);
  //       });

  //     },
  //     onClientAuthorization: (data) => {
  //       console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
  //       this.showSuccess = true;
  //     },
  //     onCancel: (data, actions) => {
  //       console.log('OnCancel', data, actions);
  //       this.showCancel = true;
  //       this.resetStatus();
  //     },
  //     onError: err => {
  //       console.log('OnError', err);
  //       this.showError = true;
  //     },
  //     onClick: (data, actions) => {
  //       console.log('onClick', data, actions);
  //       this.resetStatus();
  //     },
  //     onInit: (data, actions) => {
  //       console.log('onInit', data, actions);
  //       this.onclick(data, actions);
  //     }
  //   };
  // }

  // private resetStatus(): void {
  //   this.showError = false;
  //   this.showSuccess = false;
  //  // this.showCancel = false;
  // }

  // private prettify(): void {
  //   hljs.initHighlightingOnLoad();
  // }
}