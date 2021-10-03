import { Component, OnInit } from '@angular/core';
import { EmployeeModel } from './employee.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../service/api.service';
import { Router } from '@angular/router';

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

  p : number = 1;

  employeeModel : EmployeeModel = new EmployeeModel();
  constructor(private formBuilder : FormBuilder, private api : ApiService,private router : Router) { }
  optionGroup: any = [
                    {'label' : 'front-end','value':'Front End'},
                    {'label' : 'back-end','value':'Back End'},
                    {'label' : 'akuntansi','value':'Akuntansi'},
                    {'label' : 'teknisi','value':'Teknisi'},
                    {'label' : 'admin','value':'Admin'},
                    {'label' : 'dev-ops','value':'Dev Ops'},
                    {'label' : 'q-a','value':'QA'},
                    {'label' : 'analis','value':'Analis'},
                    {'label' : 'ui-ux','value':'UI/UX'},
                    {'label' : 'designer','value':'Designer'},
                    {'label' : 'web-design','value':'Web Design'},
                  ];

  ngOnInit(): void {
    this.formValue = this.formBuilder.group({
      username : [''],
      firstName : [''],
      lastName : [''],
      email : [''],
      birthDate : [''],
      basicSalary  : [''],
      status : [''],
      group : [''],
      description : ['']
    })
    this.getAllEmployee()
  }

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
    if(this.validationEmpty()){
      alert('Please input form');
    }else{
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
  }

  getAllEmployee(){
    this.api.getEmployee()
    .subscribe((res : any)=>{
      this.getDataEmployee = res;
    })
  }

  deleteAllEmployee(row : any){
    if(confirm('You sure delete this items?')){
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
    if(this.validationEmpty()){
      alert('Please input form');
    }else{
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

  btnClick(){
    this.formValue.reset();
    this.showAdd = true;
    this.showUpdate = false;
    this.showDetail = false;
  }

  numberOnly(event : any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  validationEmpty(){
    const {username,firstName,lastName,email,birthDate,basicSalary,status,group,description} = this.formValue.value;
    if(username === null || firstName === null || lastName  === null || email  === null || birthDate  === null || basicSalary  === null || status  === null || group  === null || description === null){
      return true;
    }else{
      return false;
    }
  }
  formatRupiah(angka:any){
    var number_string = angka.replace(/[^,\d]/g, '').toString();
    var split           = number_string.split(',');
    var sisa            = split[0].length % 3;
    var rupiah          = split[0].substr(0, sisa);
    var ribuan          = split[0].substr(sisa).match(/\d{3}/gi);
    if(ribuan){
        var separator = sisa ? '.' : '';
        rupiah += separator + ribuan.join('.');
    }
    var spr = ',';
    rupiah = split[1] != undefined ? rupiah + spr + split[1] : rupiah;
    return rupiah;
}
}
