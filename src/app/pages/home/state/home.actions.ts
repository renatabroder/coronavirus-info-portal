import { createAction, props } from "@ngrx/store";
import { Bookmark } from "src/app/shared/models/bookmark.model";

export const limpaPaginaInicial = createAction(
    '[Home] Limpa tela inicial'
);

export const carregaAtualizacao = createAction(
    '[Home] Carrega Atualizacao',
    props<{ query: string }>(),
); // ação criada quando botão pesquisar é clicado

export const carregaAtualizacaoSucesso = createAction(
    '[Covid19 Brazil API] Carrega Atualizacao Sucesso',
    props<{ entity: any }>(),
); // ação criada com API retornando sucesso

export const carregaAtualizacaoFalha = createAction(
    '[Covid19 Brazil API] Carrega Atualizacao Falha'
); // ação criada com API retornando falha

export const toggleBookmark = createAction(
    '[Home] Toggle Bookmark',
    props<{ entity: Bookmark }>(),
); // ação criada com para salvar localidade aos favoritos