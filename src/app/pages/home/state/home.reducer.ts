import { state } from "@angular/animations";
import { createReducer, Action, on } from "@ngrx/store"

import * as fromHomeActions from './home.actions';

export interface HomeState {
    entity: any;
    loading: boolean;
    error: boolean;
}

export const homeInitialState: HomeState = {
    entity: undefined,
    loading: false,
    error: false
}

const reducer = createReducer(
    homeInitialState,
    on(fromHomeActions.limpaPaginaInicial, () => homeInitialState),
    on(fromHomeActions.carregaAtualizacao, (state) => ({
        ...state,
        loading: true,
        error: false
    })),
    on(fromHomeActions.carregaAtualizacaoSucesso, (state, { entity }) => ({
        ...state,
        entity,
        loading: false,
    }
    )),
    on(fromHomeActions.carregaAtualizacaoFalha, (state) => ({
        ...state,
        loading: false,
        error: true
    }))

);

export function homeReducer(state: HomeState | undefined, action: Action): HomeState {
    return reducer(state, action);
}