import { RouterModule, Routes } from '@angular/router';
import { PessoaListaComponent } from './components/pessoa-lista/pessoa-lista.component';
import { PessoaFormComponent } from './components/pessoa-form/pessoa-form.component';
import { NgModule } from '@angular/core';

export const routes: Routes = [
    { path: '', redirectTo: '/pessoas', pathMatch: 'full' },
    { path: 'pessoas', component: PessoaListaComponent },
    { path: 'pessoas/novo', component: PessoaFormComponent },
    { path: 'pessoas/editar/:id', component: PessoaFormComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }