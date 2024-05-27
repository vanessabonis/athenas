import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routes';
import { PessoaListaModule } from './components/pessoa-lista.module';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    AppRoutingModule,
    PessoaListaModule,
    HttpClientModule,
    AppComponent
  ],
  providers: [

  ],

})
export class AppModule { }
