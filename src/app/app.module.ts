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
import { PaginationComponent } from './components/pokedex/components/pagination/pagination.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreModule } from '@ngrx/store';
import { appReducers } from './store/app.store.config';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './components/header/header.component';

@NgModule({
  declarations: [
    AppComponent,
    SquareShapeComponent,
    WelcomeComponent,
    BannersComponent,
    PokedexComponent,
    CardComponent,
    PresentationComponent,
    PaginationComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    StoreModule.forRoot(appReducers),
    StoreDevtoolsModule.instrument({ maxAge: 100 }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
