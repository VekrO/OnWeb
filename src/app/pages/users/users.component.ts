import User from 'src/app/Interfaces/User';
import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';  

export const MY_DATE_FORMATS = {
    parse: {
      dateInput: 'DD/MM/YYYY',
    },
    display: {
      dateInput: 'DD/MM/YYYY',
      monthYearLabel: 'MMMM YYYY',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'MMMM YYYY'
    },
};

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS}
  ]
})

export class UsersComponent implements OnInit {

  // Constructor do componente com 2 serviços injetados.
  constructor(private snackBar: MatSnackBar, private user: UserService) { }

  // Variáveis públicas.
  public form!: FormGroup;
  public selected: string = 'masculino';
  public telefone: string = '';
  public isOpened: Boolean = true;
  public step!: number;
  public users: Array<User> = [];
  public searchUsername: string = '';
  public userNotFound: boolean = false;
    
  // Quando o componente iniciar.
  ngOnInit(): void {
    
    this.form = new FormGroup({
      nome: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      telefone: new FormControl('', [Validators.required, Validators.minLength(15)]),
      data_nascimento: new FormControl('', [Validators.required]),
      cpf: new FormControl('', [Validators.required, Validators.minLength(14)]),
      genero: new FormControl('', [Validators.required]),
    });

  }

  deleteUser(id: any){
    this.user.deleteUser(id).subscribe((data)=>{
      this.setSnackBar('Usuário excluído com sucesso!', 3000);
      this.getUser();
    })
  }

  // Receber todos os usuários cadastrados.
  getUser(): void {
    this.users = [];
    this.user.getUsers().subscribe((users)=>{
      for(let user of Object(users)){
        this.users.push(user);
      }
    });
  }

  // Resetar a lista de usuários depois que fechar o panel.
  resetUser(): void {
    this.users = [];
  }

  searchUser(): void {
    if(this.searchUsername.length != 0){

      this.users = this.users.filter((user)=>{
        return String(user.nome).toLowerCase().replace(/\s+/g, "").includes(this.searchUsername.toLowerCase().replace(/\s+/g, ""))
      })

      if(this.users.length == 0){
        this.getUser();
      }

    }else{
      this.getUser();
    }
  }
  
  // Função responsável por retornar o valor do telefone corretamente.
  telefoneMask(value: any): any {
    if(!value) return "";
    value = value.replace(/\D/g,'')
    value = value.replace(/(\d{2})(\d)/,"($1) $2")
    value = value.replace(/(\d)(\d{4})$/,"$1-$2")
    return value
  }
  
  // Função responsável por enviar os valores digitados pelo usuário no campo de telefone para função acima.
  handlePhone(event: any){
    let input = event.target;
    input.value = this.telefoneMask(input.value);
  }

  // Função responsável por definir um formato para o CPF.
  handleCpfMask(): void {
    
    if(this.form.value.cpf.length === 3 || this.form.value.cpf.length === 7){
      if(this.form.value.cpf.length !== 9){
        this.form.patchValue({
          cpf: this.form.value.cpf += '.'
        })
      }
    }else if(this.form.value.cpf.length === 11){
      this.form.patchValue({
        cpf: this.form.value.cpf + '-'
      })
    }
  }

  // Função responsável por gerar um snackbar <Alerta> com uma mensagem que pode ser customizada!
  setSnackBar(message: string, duration: number): void {
    this.snackBar.open(message, 'X', {
      verticalPosition: 'top',
      horizontalPosition: 'right',
      duration: duration
    })
  }

  // Função responsável por mudar os passos no formulário.
  setStep(number: number): void {
    this.step = number;
  }
  nextStep(): void {
    this.step++;
  }
  prevStep(): void {
    this.step--;
  }

  // Enviar formulário.
  formSubmit(): void {
  
    if(this.form.valid){
      
      let params: User = {
        nome: this.form.value.nome,
        email: this.form.value.email,
        telefone: this.form.value.telefone,
        data_nascimento: this.form.value.data_nascimento,
        cpf: this.form.value.cpf,
        genero: this.form.value.genero

      }
      this.user.createUser(params).subscribe(()=>{

        this.setSnackBar('Usuário criado com sucesso!', 3000);
        this.isOpened = false;
        this.form.reset();
        this.form.controls['nome'].setErrors(null);
        this.form.controls['email'].setErrors(null);
        this.form.controls['telefone'].setErrors(null);
        this.form.controls['data_nascimento'].setErrors(null);
        this.form.controls['cpf'].setErrors(null);
        this.form.controls['genero'].setErrors(null);
        
      })

    }else{
      this.setSnackBar('Preencha todos os campos marcados!', 3000)
    }
  }



}
