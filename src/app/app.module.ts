import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

// PARA TRABALHAR COM FORMULÁRIOS NO ANGULAR
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// PARA REALIZAR REQUISIÇÕES HTTP
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';

// IMPORTS PARA COMPONENTES DO ANGULAR MATERIAL
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';

// PARA HABILITAR ANIMAÇÕES ASSÍNCRONAS NO ANGULAR
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

// MÓDULO PARA UTILIZAR COMPONENTES DE SELEÇÃO DE DATA
import { MatDatepickerModule } from '@angular/material/datepicker';

// IMPORT DOS COMPONENTES
import { MatTabGroup } from '@angular/material/tabs';
import { NavComponent } from './components/nav/nav.component';
import { HomeComponent } from './components/home/home.component';
import { HeaderComponent } from './components/header/header.component';
import { TecnicoListComponent } from './components/tecnico/tecnico-list/tecnico-list.component';
import { LoginComponent } from './components/login/login.component';
import { ToastrModule, ToastrService } from 'ngx-toastr';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    HomeComponent,
    HeaderComponent,
    TecnicoListComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatCardModule,
    MatTableModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    MatPaginatorModule,
    MatSnackBarModule,
    MatTabGroup,
    //CONFIGURAÇÃO DO SERVIÇO DE MENSAGEM
    ToastrModule.forRoot({
      timeOut:4000,
      closeButton:true,
      progressBar:true
    })
  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync(),
    provideHttpClient(withFetch())  // Habilita o uso da API fetch
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
