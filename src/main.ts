import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';  // Certifique-se de importar corretamente o AppComponent

bootstrapApplication(AppComponent)
  .catch(err => console.error(err));