import { createFeatureSelector, createSelector } from "@ngrx/store";
import { HomeState } from "./home.reducer";

export const selectHomeState = createFeatureSelector('home');

export const selecionaEstadoAtual = createSelector(
    selectHomeState,
    (homeState: HomeState) => homeState.entity,
)

export const selecionaEstadoAtualLoading = createSelector(
    selectHomeState,
    (homeState: HomeState) => homeState.loading,
)

export const selecionaEstadoAtualErro = createSelector(
    selectHomeState,
    (homeState: HomeState) => homeState.error,
)