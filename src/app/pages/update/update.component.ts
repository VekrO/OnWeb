import { MatSnackBar } from '@angular/material/snack-bar';
import User from 'src/app/Interfaces/User';
import { UserService } from './../../services/user.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MAT_DATE_FORMATS } from '@angular/material/core';

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
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS}
  ]
})
export class UpdateComponent implements OnInit {

  constructor(private route: ActivatedRoute, private snackBar: MatSnackBar, private router: Router, private user: UserService) {}

  private id: Number = this.route.snapshot.params['id'];
  public form!: FormGroup;

  public selected: string = 'masculino';

  ngOnInit(): void {

    // Receber usuário.
    this.user.getUser(this.id).subscribe((person: User)=>{
      
      this.form = new FormGroup({
        nome: new FormControl(person.nome),
        email: new FormControl(person.email),
        telefone: new FormControl(person.telefone),
        data_nascimento: new FormControl(person.data_nascimento),
        cpf: new FormControl(person.cpf),
        genero: new FormControl(person.genero)
      });
      
    });

  }

  formSubmit(): void {
    if(this.form.valid){
      let params = {
        nome: this.form.value.nome,
        email: this.form.value.email,
        telefone: this.form.value.telefone,
        data_nascimento: this.form.value.data_nascimento,
        cpf: this.form.value.cpf,
        genero: this.form.value.genero,
      }
      this.user.updateUser(this.id, params).subscribe(()=>{
        this.setSnackBar('Usuário atualizado com sucesso!', 3000);
        this.router.navigate(['users'])
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

}
