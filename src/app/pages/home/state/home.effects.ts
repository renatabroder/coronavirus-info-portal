import { Injectable } from "@angular/core";
import { Params } from "@angular/router";

import { select, Store } from "@ngrx/store";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { combineLatest } from "rxjs";
import { catchError, map, mergeMap, withLatestFrom } from "rxjs/operators";

import { CoronavirusService } from "src/app/shared/services/coronavirus.service";
import * as fromHomeActions from './home.actions';
import * as fromRouterSelectors from '../../../shared/state/router/router.selector'; 

@Injectable()
export class HomeEffects{

    carregaRedirecionada$ = createEffect(()=> this.actions$
        .pipe(
            ofType(fromHomeActions.carregaRedirecionada),
            withLatestFrom(this.store.pipe(select(fromRouterSelectors.selectRouterQueryParams))),
            mergeMap(([, queryParams]: [any, Params]) =>
                combineLatest([
                this.cv19Service.getCidadeInfo( queryParams.tipo == 'estado' ? `/brazil/uf/${queryParams.stringBusca}` : `/${queryParams.stringBusca}`)            
                ])
            ),
            catchError((err, caught$) => {
                this.store.dispatch(fromHomeActions.carregaAtualizacaoFalha());
                return caught$;
            }),
            map((entity: any) => 
            fromHomeActions.carregaAtualizacaoSucesso({ entity }),
            )
        )
    ); 
  
    carregaAtualizacao$ = createEffect(()=> this.actions$
        .pipe(
            ofType(fromHomeActions.carregaAtualizacao),
            mergeMap(({ query }) => (this.cv19Service.getCidadeInfo(query))),
            catchError((err, caught$) => {
                this.store.dispatch(fromHomeActions.carregaAtualizacaoFalha());
                return caught$;
            }),
            map((entity: any) => fromHomeActions.carregaAtualizacaoSucesso({ entity }))
        ),
    );

    constructor(private actions$: Actions,
                private store: Store,
                private cv19Service: CoronavirusService){
    }
}