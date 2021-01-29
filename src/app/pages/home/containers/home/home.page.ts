import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { Store, select } from '@ngrx/store';
import { Observable, Subject, combineLatest } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';

import { Bookmark } from 'src/app/shared/models/bookmark.model';
import * as fromHomeActions from '../../state/home.actions';
import * as fromHomeSelectors from '../../state/home.selectors';
import * as fromBookmarksSelectors from '../../../bookmarks/state/bookmarks.selectors';

@Component({
  selector: 'jv-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage implements OnInit, OnDestroy {

  searchForm: FormGroup;
  estado: string;

  localInfo$: Observable<any>;
  bookmarksList$: Observable<Bookmark[]>;
  isCurrentFavorite$: Observable<boolean>;
  
  listaLocais: any = [];
  listaFavoritos: any = {};

  private componentDestroyed$ = new Subject();

  localInfo: any = [];
  loading$: Observable<boolean>;
  error$: Observable<boolean>;

  visualizacaoInfo: string;
  erroInfo: boolean = false;
  count = 0;

  pagedItems: Array<any>; 

  constructor(private store: Store, private fb: FormBuilder, private route: ActivatedRoute) { }

  // Para paginação 
  beginPagination(pagedItems: Array<any>) { this.pagedItems = pagedItems; }
  
  // Retorna o tipo para html
  get tipo() { return this.searchForm.get('searchTypeControl').value; }

  // Executa no início do carregamento
  ngOnInit(): void {
      
    this.criarFormulario();
    
    this.store.pipe(
                select(fromHomeSelectors.selecionaEstadoAtual),
                takeUntil(this.componentDestroyed$)
               )
              .subscribe(value => {
                if(value){
                  
                  this.localInfo = (value?.data ? (value.data.country? [value.data] : value.data) : [value])
                  if(!this.localInfo[0] || this.localInfo[0]?.error) this.localInfo = undefined;
                  if(!this.localInfo && this.count > 0) this.erroInfo = true;
                  
                  this.favs()
                }
              });
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
  }

  // Limpa o estado da página
  ngOnDestroy(): void {
    this.componentDestroyed$.next();
    this.componentDestroyed$.unsubscribe();
    this.store.dispatch(fromHomeActions.limpaPaginaInicial());
  }

  // Formulário para receber
  criarFormulario(): void {
    this.searchForm = this.fb.group({
      searchControl: ['', [Validators.required]],
      searchTypeControl: ['estado', [Validators.required]]
    })
  }

  // Reseta as variáveis
  resetVariaveis(): void {
    this.erroInfo = false;
    this.localInfo = undefined
  }

  // Pesquisar ao clique do botão ou redirecionamento
  pesquisar(): void {
    this.resetVariaveis()

    this.visualizacaoInfo = this.searchForm.controls['searchTypeControl'].value
    this.count++;

    // alterando a url de chamada à API a depender das entradas
    let url = this.searchForm.controls['searchControl'].value
    let query = this.visualizacaoInfo == 'estado' ? (url ? `/brazil/uf/${url}` : '') : (url ? `/${url}` : '/countries');

    this.store.dispatch(fromHomeActions.carregaAtualizacao({ query }))
  }

  onSelect(estado){
    this.searchForm.controls['searchControl'].setValue(estado);
  }

  // Adicionar/Remover dos favoritos
  onToggleBookmark(local: any){
    const bookmark = new Bookmark();
    bookmark.tipo = this.visualizacaoInfo;
    
    bookmark.stringBusca = this.visualizacaoInfo == 'estado' ? local.uf : local.country;
    bookmark.stringExibic = this.visualizacaoInfo == 'estado' ? local.state : local.country;

    this.store.dispatch(fromHomeActions.toggleBookmark({ entity: bookmark }))
  }

  // Verificar se os elementos buscados estão na lista de favoritos
  favs(): void {
    this.localInfo$ = this.store.pipe(select(fromHomeSelectors.selecionaEstadoAtual));
    this.localInfo$
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe(value => {
        this.listaLocais = value?.data ? (value.data.country? [value.data] : value.data) : [value]
      });
    this.loading$ = this.store.pipe(select(fromHomeSelectors.selecionaEstadoAtualLoading));
    this.error$ = this.store.pipe(select(fromHomeSelectors.selecionaEstadoAtualErro));

    this.bookmarksList$ = this.store.pipe(select(fromBookmarksSelectors.selectBookmarksList));

    this.isCurrentFavorite$ = combineLatest([this.localInfo$, this.bookmarksList$])
      .pipe(
        map(([current, bookmarksList]) => {
          if (!!current) {
            let lista = current?.data ? (current.data.country? [current.data] : current.data) : [current]
            let key = lista[0]?.uf ? 'uf' : 'country';
            
            try{
              lista.forEach(e => {
                this.listaFavoritos[e[key]] = bookmarksList.some(bookmark => bookmark.stringBusca === (e[key]));
              });
            } catch(err) { return false }
            
            return this.listaFavoritos;
          }
          return false;
        }),
      );

    let x = this.isCurrentFavorite$.subscribe({
        next(position) { this.listaFavoritos = position },
        error(msg) { console.log('Error: ', msg) }
      });

  }
    
}
