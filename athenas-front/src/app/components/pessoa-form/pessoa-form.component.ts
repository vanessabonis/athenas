import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Pessoa } from '../../dto/Pessoa';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {provideNativeDateAdapter} from '@angular/material/core';
import { PessoaService } from '../../service/PessoaService';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-pessoa-form',
  templateUrl: './pessoa-form.component.html',
  styleUrls: ['./pessoa-form.component.css'],
  providers: [provideNativeDateAdapter()],

})
export class PessoaFormComponent implements OnInit {
  pessoaForm!: FormGroup;
  pessoa: Pessoa = new Pessoa(0, '', new Date(), '', ''); 

  constructor(
    private fb: FormBuilder,
    private pessoaService: PessoaService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<PessoaFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number }
  ) {
    this.pessoaForm = this.fb.group({
      nome: ['', [Validators.required, Validators.maxLength(255)]],
      dataNascimento: ['', Validators.required],
      cpf: ['', Validators.required],
      sexo: ['', Validators.required],
      altura: [null],
      peso: [null]
    });
  }

  ngOnInit(): void {
    if (this.data && this.data.id) {
      this.pessoaService.getPessoaById(this.data.id).subscribe((pessoa) => {
        this.pessoaForm.patchValue(pessoa);
      });
    }
  }

  onSubmit(): void {
    if (this.pessoaForm.valid) {
      const pessoa: Pessoa = { ...this.pessoaForm.value };
      if (this.data && this.data.id) {
        this.pessoaService.atualizarPessoa(this.data.id, pessoa).subscribe(
          (response) => {
            this.snackBar.open('Pessoa atualizada com sucesso', 'Fechar', { duration: 3000 });
            this.dialogRef.close(true);
          },
          (error) => {
            this.snackBar.open(`Erro ao atualizar pessoa: ${error.message}`, 'Fechar', { duration: 3000 });
          }
        );
      } else {
        this.pessoaService.salvarPessoa(pessoa).subscribe(
          (response) => {
            this.snackBar.open('Pessoa salva com sucesso', 'Fechar', { duration: 3000 });
            this.dialogRef.close(true);
          },
          (error) => {
            this.snackBar.open(`Erro ao salvar pessoa: ${error.message}`, 'Fechar', { duration: 3000 });
          }
        );
      }
    } else {
      this.pessoaForm.markAllAsTouched();
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
