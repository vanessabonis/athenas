import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PessoaFormComponent } from './components/pessoa-form/pessoa-form.component';
import {
  MatDialog,
  MatDialogRef,
  MatDialogActions,
  MatDialogClose,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { PessoaListaModule } from './components/pessoa-lista.module';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatButtonModule,
    MatToolbarModule,
    CommonModule,
    PessoaListaModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',

})
export class AppComponent {

  constructor(public dialog: MatDialog) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(PessoaFormComponent, {
      width: '400px',
      data: {} 
    });

  }
}
