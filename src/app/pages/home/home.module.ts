import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
import { EstadosComboComponent } from 'src/app/shared/components/estados-combo/estados-combo.component';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
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
    CountryInfoComponent,
    EstadosComboComponent
  ],
  providers: [
    HomeGuard
  ]
})
export class HomeModule { }
