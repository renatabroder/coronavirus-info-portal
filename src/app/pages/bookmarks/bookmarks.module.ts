import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { StoreModule } from '@ngrx/store';

import { bookmarkReducer } from './state/bookmarks.reducer';
import { BookmarksPage } from './containers/bookmarks/bookmarks.page';

@NgModule({
  declarations: [
    BookmarksPage
  ],
  imports: [
    CommonModule,
    RouterModule,
    StoreModule.forFeature('bookmark', bookmarkReducer),
  ]
})
export class BookmarksModule { }
