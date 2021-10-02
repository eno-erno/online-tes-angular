import { Component, OnInit } from '@angular/core';
import { EmployeeModel } from './employee.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../service/api.service';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
  getDataEmployee : any;
  showAdd !: boolean;
  showUpdate !: boolean;
  showDetail !: boolean;
  formValue !: FormGroup;
  alert : boolean = false;
  alertError : boolean = false;
  alertUpdate : boolean = false;

  employeeModel : EmployeeModel = new EmployeeModel();
  constructor(private formBuilder : FormBuilder, private api : ApiService) { }
  optionGroup: any = [
                    {'id' : 'front-end','value':'Front End'},
                    {'id' : 'back-end','value':'Back End'}
                  ];
  btnClick(){
    this.formValue.reset();
    this.showAdd = true;
    this.showUpdate = false;
    this.showDetail = false;
  }

  ngOnInit(): void {
    // this.formValue = new FormGroup({
    //   'username' : new FormControl(null, Validators.required),
    //   'firstName' : new FormControl(null, Validators.required),
    //   'lastName' : new FormControl(null, Validators.required),
    //   'email' : new FormControl(null, [Validators.required, Validators.email]),
    //   'birthDate' : new FormControl(null, Validators.required),
    //   'basicSalary'  : new FormControl(null, [Validators.required, Validators.pattern('/^[0-9]*$/')]),
    //   'status' : new FormControl(null, Validators.required),
    //   'group' : new FormControl(null, Validators.required),
    //   'description' : new FormControl(null, Validators.required)
    // })
    this.formValue = this.formBuilder.group({
      username : [null, [Validators.required, Validators.minLength(4)]],
      firstName : [null, [Validators.required]],
      lastName : [null, [Validators.required]],
      email : [null, [Validators.required, Validators.email]],
      birthDate : [null, [Validators.required]],
      basicSalary  : [null, [Validators.required, Validators.pattern('/^[0-9]*$/')]],
      status : [null, [Validators.required]],
      group : [null, [Validators.required]],
      description : [null, [Validators.required]]
    })
    this.getAllEmployee()
  }
  // get username(){ return this.formValue.get('username'); }

  globalSetValue(){
    this.employeeModel.username = this.formValue.value.username;
    this.employeeModel.firstName = this.formValue.value.firstName;
    this.employeeModel.lastName = this.formValue.value.lastName;
    this.employeeModel.email = this.formValue.value.email;
    this.employeeModel.birthDate = this.formValue.value.birthDate;
    this.employeeModel.basicSalary = this.formValue.value.basicSalary;
    this.employeeModel.status = this.formValue.value.status;
    this.employeeModel.group = this.formValue.value.group;
    this.employeeModel.description = this.formValue.value.description;
  }
  getOneView(row: { username: any; firstName: any; lastName: any; email: any; birthDate: any; basicSalary: any; status: any; group: any; description: any; }){
    this.formValue.controls['username'].setValue(row.username)
    this.formValue.controls['firstName'].setValue(row.firstName)
    this.formValue.controls['lastName'].setValue(row.lastName)
    this.formValue.controls['email'].setValue(row.email)
    this.formValue.controls['birthDate'].setValue(row.birthDate)
    this.formValue.controls['basicSalary'].setValue(row.basicSalary)
    this.formValue.controls['status'].setValue(row.status)
    this.formValue.controls['group'].setValue(row.group)
    this.formValue.controls['description'].setValue(row.description)
  }

  postEmployeeDetails(){
    this.globalSetValue();
    this.api.postEmployee(this.employeeModel)
    .subscribe((res: any)=>{
      let closeModal = document.getElementById('closeModal');
      closeModal?.click();
      this.formValue.reset()
      this.getAllEmployee()
      this.alert = true;
      setTimeout(() => {
        this.alert = false;
      },2500)
    },
    (err: any)=>{
      alert('error')
    })
  }

  getAllEmployee(){
    this.api.getEmployee()
    .subscribe((res : any)=>{
      this.getDataEmployee = res;
    })
  }

  deleteAllEmployee(row : any){
    confirm('You sure delete this items?')
    this.api.deleteEmployee(row.id)
    .subscribe((res : any)=>{
      this.alertError = true;
      setTimeout(() => {
        this.alertError = false;
      },2500)
      this.getAllEmployee()
    },
    (err: any)=>{
      alert('error '+err)
    })
  }

  updateAllEmployee(row : any){
    this.showAdd = false;
    this.showUpdate = true;
    this.showDetail = false;
    this.employeeModel.id = row.id;
    this.getOneView(row)
  }
  getByOneAllEmployee(row : any){
    this.showAdd = false;
    this.showUpdate = false;
    this.showDetail = true;
    this.getOneView(row)
  }

  updateEmployeeDetails(){
    this.globalSetValue();
    this.api.updateEmployee(this.employeeModel,this.employeeModel.id)
    .subscribe(res=>{
      let closeModal = document.getElementById('closeModal');
      closeModal?.click();
      this.formValue.reset()
      this.getAllEmployee()
      this.alertUpdate = true;
      setTimeout(() => {
        this.alertUpdate = false;
      },2500)
    })
  }
}
