import { createFeatureSelector, createSelector } from '@ngrx/store';

import { BookmarksState } from './bookmarks.reducer';

export const selectBookmarksState = createFeatureSelector('bookmark');

export const selectBookmarksList = createSelector(
  selectBookmarksState,
  (bookmarksState: BookmarksState) => bookmarksState.list,
);
