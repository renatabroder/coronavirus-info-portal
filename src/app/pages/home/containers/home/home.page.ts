import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Store, select } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Bookmark } from 'src/app/shared/models/bookmark.model';

import * as fromHomeActions from '../../state/home.actions';
import * as fromHomeSelectors from '../../state/home.selectors';

@Component({
  selector: 'jv-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage implements OnInit, OnDestroy {

  searchForm: FormGroup;

  private componentDestroyed$ = new Subject();

  localInfo: any;
  loading$: Observable<boolean>;
  error$: Observable<boolean>;

  visualizacaoInfo: string = "estado";
  erroInfo: boolean = false;
  count = 0;

  constructor(private store: Store, private fb: FormBuilder) { }

  ngOnInit(): void {
  
    this.criarFormulario();
    
    this.store.pipe(
                select(fromHomeSelectors.selecionaEstadoAtual),
                takeUntil(this.componentDestroyed$)
               )
              .subscribe(value => {this.recebeInfos(value)});
    this.loading$ = this.store.pipe(select(fromHomeSelectors.selecionaEstadoAtualLoading));
    this.error$ = this.store.pipe(select(fromHomeSelectors.selecionaEstadoAtualErro));

  }

  ngOnDestroy(): void {
    this.componentDestroyed$.next();
    this.componentDestroyed$.unsubscribe();
  }

  criarFormulario(): void {
    this.searchForm = this.fb.group({
      searchControl: ['', [Validators.required]],
      searchTypeControl: ['estado', [Validators.required]]
    })
  }

  resetVariaveis(): void {
    this.erroInfo = false;
    this.localInfo = undefined
  }

  pesquisar(): void {
    this.resetVariaveis()

    this.visualizacaoInfo = this.searchForm.controls['searchTypeControl'].value
    this.count++;

    let url = this.searchForm.controls['searchControl'].value

    let query = ""
    if(this.visualizacaoInfo == 'estado') {
      query = url ? `/brazil/uf/${url}` : '';
    } else {
      query = url ? `/${url}` : '/countries';
    }

    this.store.dispatch(fromHomeActions.carregaAtualizacao({ query }))
  }

  recebeInfos(infos): void {
    // Como as informações que vêm da API não são padronizadas,
    // é necessário fazer esta checagem para armazenar corretamente
    
    try {
      if(infos.error) this.localInfo = undefined;
      else if(infos.uid) this.localInfo = [infos];
      else if(infos.data.country) this.localInfo = [infos.data]
      else if(infos.data[0].uid || infos.data[0].country) this.localInfo = infos.data; 
      else this.localInfo = undefined;  
    } catch (error) {}   
    
    if(!this.localInfo && this.count > 0) this.erroInfo = true;
    //console.log(this.localInfo)
  }

  onToggleBookmark(){
    const bookmark = new Bookmark();
    bookmark.tipo = this.visualizacaoInfo;
    bookmark.stringBusca = this.visualizacaoInfo == 'estado' ? this.localInfo.uf : this.localInfo.data.country;
    bookmark.stringExibic = this.visualizacaoInfo == 'estado' ? this.localInfo.state : this.localInfo.data.country;

    console.log(bookmark)

    this.store.dispatch(fromHomeActions.toggleBookmark({ entity: bookmark }))
  }

}
