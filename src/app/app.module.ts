import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SquareShapeComponent } from './components/square-shape/square-shape.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { BannersComponent } from './components/banners/banners.component';
import { PokedexComponent } from './components/pokedex/pokedex.component';
import { CardComponent } from './components/pokedex/components/card/card.component';
import { PresentationComponent } from './components/presentation/presentation.component';

@NgModule({
  declarations: [
    AppComponent,
    SquareShapeComponent,
    WelcomeComponent,
    BannersComponent,
    PokedexComponent,
    CardComponent,
    PresentationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }