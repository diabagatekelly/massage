import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';


@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit {
  employees;

  constructor(private firebase: FirebaseService) { }

  ngOnInit() {
    this.getEmployees();
  }

  getEmployees = () => {
    this.firebase.getEmployees()
    .subscribe(res => {
      this.employees = res;
      this.employees.sort((a, b) => {
        const nameA = a.payload.doc.data().info.name;
        const nameB = b.payload.doc.data().info.name;
        console.log(nameA, nameB);
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      });
      return this.employees;
    });
  }

}
