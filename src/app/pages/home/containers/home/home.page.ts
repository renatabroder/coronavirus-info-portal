import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Store, select } from '@ngrx/store';
import { Observable, Subject, combineLatest } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';

import { Bookmark } from 'src/app/shared/models/bookmark.model';
import * as fromHomeActions from '../../state/home.actions';
import * as fromHomeSelectors from '../../state/home.selectors';
// import * as fromBookmarksSelectors from '../../../bookmarks/state/bookmarks.selectors';
import * as fromRouterSelectors from '../../../../shared/state/router/router.selector'; 
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'jv-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage implements OnInit, OnDestroy {

  searchForm: FormGroup;

  localInfo$: Observable<any>;
  bookmarksList$: Observable<Bookmark[]>;
  isCurrentFavorite$: Observable<boolean>;

  private componentDestroyed$ = new Subject();

  localInfo: any;
  loading$: Observable<boolean>;
  error$: Observable<boolean>;

  visualizacaoInfo: string;
  erroInfo: boolean = false;
  count = 0;

  pagedItems: Array<any>; 

  constructor(private store: Store, private fb: FormBuilder, private route: ActivatedRoute) { }

  beginPagination(pagedItems: Array<any>) {  
    this.pagedItems = pagedItems;  
  }
  
  get tipo() { return this.searchForm.get('searchTypeControl').value; }

  ngOnInit(): void {
  
    this.criarFormulario();
    
    this.store.pipe(
                select(fromHomeSelectors.selecionaEstadoAtual),
                takeUntil(this.componentDestroyed$)
               )
              .subscribe(value => {this.recebeInfos(value)});
    this.loading$ = this.store.pipe(select(fromHomeSelectors.selecionaEstadoAtualLoading));
    this.error$ = this.store.pipe(select(fromHomeSelectors.selecionaEstadoAtualErro));

    // Pesquisa redirecionada
    this.route.queryParams.subscribe(params => {
      if(params['tipo'] && params['stringBusca']){
        this.searchForm.controls['searchTypeControl'].setValue(params['tipo']);
        this.searchForm.controls['searchControl'].setValue(params['stringBusca']);

        //this.removeParamFromUrl(params, ['tipo','stringBusca'])
        this.pesquisar()
      }
    });
    
    
    // // Pensar na lógica para mostrar o Adicionar/Remover favoritos

    // this.localInfo$ = this.store.pipe(select(fromHomeSelectors.selecionaEstadoAtual));
    //  this.localInfo$
    //    .pipe(takeUntil(this.componentDestroyed$))
    //    .subscribe(value => this.localInfo = value);
    //  this.loading$ = this.store.pipe(select(fromHomeSelectors.selecionaEstadoAtualLoading));
    //  this.error$ = this.store.pipe(select(fromHomeSelectors.selecionaEstadoAtualErro));

    // this.bookmarksList$ = this.store.pipe(select(fromBookmarksSelectors.selectBookmarksList));

    // this.isCurrentFavorite$ = combineLatest([this.localInfo$, this.bookmarksList$])
    // .pipe(
    //   map(([current, bookmarksList]) => {
    //     if (!!current) {
    //       return bookmarksList.some(bookmark => bookmark.stringBusca === current.stringBusca);
    //     }
    //     return false;
    //   }),
    // );

  }

  ngOnDestroy(): void {
    this.componentDestroyed$.next();
    this.componentDestroyed$.unsubscribe();
    this.store.dispatch(fromHomeActions.limpaPaginaInicial());
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

  onToggleBookmark(local: any){
    const bookmark = new Bookmark();
    bookmark.tipo = this.visualizacaoInfo;
    
    bookmark.stringBusca = this.visualizacaoInfo == 'estado' ? local.uf : local.country;
    bookmark.stringExibic = this.visualizacaoInfo == 'estado' ? local.state : local.country;

    this.store.dispatch(fromHomeActions.toggleBookmark({ entity: bookmark }))
  }

}
