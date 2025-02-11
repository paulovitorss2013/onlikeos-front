import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

// ANGULAR MATERIAL
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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';


// NGX-MASK PARA MASCARAMENTO DE CPF, TELEFONE E ETC...
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';

// ANIMAÇÕES ASSÍNCRONAS DO ANGULAR
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

// TOASTR PARA NOTIFICAÇÕES
import { ToastrModule } from 'ngx-toastr';

// COMPONENTES
import { NavComponent } from './components/nav/nav.component';
import { HomeComponent } from './components/home/home.component';
import { HeaderComponent } from './components/header/header.component';
import { TecnicoListComponent } from './components/tecnico/tecnico-list/tecnico-list.component';
import { LoginComponent } from './components/login/login.component';
import { TecnicoCreateComponent } from './components/tecnico/tecnico-create/tecnico-create.component';

// INTERCEPTOR DE AUTENTICAÇÃO
import { AuthInterceptor } from './interceptors/auth.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    HomeComponent,
    HeaderComponent,
    TecnicoListComponent,
    LoginComponent,
    TecnicoCreateComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,

    // ANGULAR MATERIAL
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatCardModule,
    MatTableModule,
    MatCheckboxModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    MatPaginatorModule,
    MatSnackBarModule,
    MatTabsModule,

    // NGX-MASK
    NgxMaskDirective,
    NgxMaskPipe,
    
    // OUTROS MÓDULOS
    MatTooltipModule, 

    // CONFIGURAÇÃO DO TOASTR
    ToastrModule.forRoot({
      timeOut: 4000,
      closeButton: true,
      progressBar: true
    })
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }, // Interceptor de autenticação
    provideClientHydration(),
    provideAnimationsAsync(),
    provideHttpClient(withFetch()),  // Habilita API fetch
    provideNgxMask() // Ativa ngx-mask para mascaramento
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
