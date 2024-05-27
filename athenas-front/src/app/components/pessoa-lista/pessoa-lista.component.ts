import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Pageable } from '../../utils/Pageable';
import { PessoaFormComponent } from '../pessoa-form/pessoa-form.component';
import { PessoaFiltro } from '../../dto/filtro/PessoaFiltro';
import { PessoaService } from '../../service/PessoaService';
import { Page } from '../../utils/Page';
import { Pessoa } from '../../dto/Pessoa';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-pessoa-lista',
  templateUrl: './pessoa-lista.component.html',
  styleUrls: ['./pessoa-lista.component.css']
})
export class PessoaListaComponent implements OnInit {
  
  listaPessoas: Pessoa[] = []
  pagePessoas: Page<Pessoa> = {
    content: [], totalElements: 0, totalPages: 0, size: 0, number: 0,
    sort: null,
    first: false,
    last: false,
    numberOfElements: 0,
    empty: false
  };
  size: number = 0
  totalElements: number = 0;
  filtro: PessoaFiltro = new PessoaFiltro();
  filtroForm!: FormGroup;
  
  pageable: Pageable = {
    pageNumber: 0,
    pageSize: 10,
    sort: {
      sorted: true,
      unsorted: false,
      empty: false,
      direction: 'ASC',
      property: 'nome'
    }
  };

  displayedColumns: string[] = ['nome', 'dataNascimento', 'cpf', 'sexo', 'altura', 'peso', 'acoes'];
  dataSource: MatTableDataSource<Pessoa> = new MatTableDataSource<Pessoa>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  constructor(
    private pessoaService: PessoaService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.filtroForm = this.formBuilder.group({
      nome: [''],
      cpf: [''],
      sexo: ['']
    });
    this.listarPessoas();
  }

  listarPessoas(): void {
    this.pessoaService.listarPessoas(this.filtro, this.pageable).subscribe(
      (page) => {
        this.listaPessoas = page.content
        this.totalElements = page.totalElements
        this.size = page.size;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

      },
      error => this.snackBar.open('Erro ao carregar lista de pessoas', 'Fechar', { duration: 3000 })
    );
  }

  editarPessoa(id: number): void {
    this.pessoaService.getPessoaById(id).subscribe(
      data => {
        const dialogRef = this.dialog.open(PessoaFormComponent, {
          width: '400px',
          data: data
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.listarPessoas();
            this.snackBar.open('Pessoa atualizada com sucesso', 'Fechar', { duration: 3000 });
          }
        });
      },
      error => this.snackBar.open('Erro ao carregar pessoa', 'Fechar', { duration: 3000 })
    );
  }

  excluirPessoa(id: number): void {
    this.pessoaService.excluirPessoa(id).subscribe(
      () => {
        this.listarPessoas();
        this.snackBar.open('Pessoa excluída com sucesso', 'Fechar', { duration: 3000 });
      },
      error => this.snackBar.open('Erro ao excluir pessoa', 'Fechar', { duration: 3000 })
    );
  }

  calcularPesoIdeal(cpf: string): void {
    this.pessoaService.calcularPesoIdeal(cpf).subscribe(
      data => this.snackBar.open(`Peso ideal: ${data}`, 'Fechar', { duration: 3000 }),
      error => this.snackBar.open('Erro ao calcular peso ideal', 'Fechar', { duration: 3000 })
    );
  }

  applyFilter(): void {
    this.pageable.pageNumber = 0; // Reset page number when applying filter
    this.listarPessoas();
  }

  nextPage(): void {
    if (this.pageable.pageNumber < this.pagePessoas.totalPages - 1) {
      this.pageable.pageNumber++;
      this.listarPessoas();
    }
  }

  previousPage(): void {
    if (this.pageable.pageNumber > 0) {
      this.pageable.pageNumber--;
      this.listarPessoas();
    }
  }
}
