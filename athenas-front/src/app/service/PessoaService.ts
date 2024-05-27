import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pessoa } from '../dto/Pessoa';
import { PessoaFiltro } from '../dto/filtro/PessoaFiltro';
import { Pageable } from '../utils/Pageable';
import { Page } from '../utils/Page';

@Injectable({
  providedIn: 'root'
})
export class PessoaService {

  private baseUrl = 'http://localhost:8080/api/pessoas'; 

  constructor(private http: HttpClient) { }

  salvarPessoa(pessoa: Pessoa): Observable<Pessoa> {
    return this.http.post<Pessoa>(this.baseUrl, pessoa);
  }

  listarPessoas(filtro: PessoaFiltro, pageable: Pageable): Observable<Page<Pessoa>> {
    let params = new HttpParams();
    Object.entries(filtro).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        params = params.set(key, value);
      }
    });
    params = params.set('page', pageable.pageNumber.toString())
      .set('size', pageable.pageSize.toString());
    if (pageable.sort && pageable.sort.property) {
      params = params.set('sort', pageable.sort.property + ',' + pageable.sort.direction);
    }

    return this.http.get<Page<Pessoa>>(this.baseUrl, { params });
  }

  atualizarPessoa(id: number, pessoa: Pessoa): Observable<Pessoa> {
    return this.http.put<Pessoa>(`${this.baseUrl}/${id}`, pessoa);
  }

  excluirPessoa(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  calcularPesoIdeal(cpf: string): Observable<number> {
    let params = new HttpParams().set('cpf', cpf);
    return this.http.get<number>(`${this.baseUrl}/peso-ideal`, { params });
  }

  getPessoaById(id: number): Observable<Pessoa> {
    return this.http.get<Pessoa>(`${this.baseUrl}/${id}`);
  }
}
