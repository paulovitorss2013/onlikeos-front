import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { AppModule } from './app.module'; // Continuação do uso do AppModule

@NgModule({
  imports: [
    AppModule,
    ServerModule,
  ],
})
export class AppServerModule {}
