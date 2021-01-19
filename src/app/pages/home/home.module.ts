import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { HomePage } from './containers/home/home.page';
import { homeReducer } from './state/home.reducer';
import { HomeEffects } from './state/home.effects';
import { HomeGuard } from './services/home.guard';

import { ComponentsModule } from 'src/app/shared/components/components.module';
import { LocalInfoComponent } from './components/local-info/local-info.component';
import { CountryInfoComponent } from './components/country-info/country-info.component';
import { JwPaginationModule } from 'jw-angular-pagination';
import { RouterModule } from '@angular/router';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    JwPaginationModule,
    RouterModule.forChild([
      { path: '', component: HomePage, canActivate: [HomeGuard] },
    ]),
    StoreModule.forFeature('home', homeReducer),
    EffectsModule.forFeature([HomeEffects]),
    ComponentsModule,
  ],
  declarations: [
    HomePage,
    LocalInfoComponent,
    CountryInfoComponent
  ],
  providers: [
    HomeGuard
  ]
})
export class HomeModule { }
