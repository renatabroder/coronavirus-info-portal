import { Injectable } from "@angular/core";

import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { catchError, map, mergeMap } from "rxjs/operators";
import { CoronavirusService } from "src/app/shared/services/coronavirus.service";

import * as fromHomeActions from './home.actions';

@Injectable()
export class HomeEffects{

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