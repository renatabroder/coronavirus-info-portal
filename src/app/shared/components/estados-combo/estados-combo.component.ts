import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { estadosList } from '../../data/estados'
import { sigla_estado } from '../../models/modelos';

@Component({
  selector: 'jv-estados-combo',
  templateUrl: './estados-combo.component.html',
  styleUrls: ['./estados-combo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush, //apenas será atualizado quando houver mudanças

})
export class EstadosComboComponent implements OnInit {

  @Output() select = new EventEmitter;
  
  comboEstados: sigla_estado[] = [];
  estadoSelecionado: string;

  constructor() {
    this.select = new EventEmitter();
  }

  ngOnInit(): void {
    this.comboEstados = estadosList.UF;
  }

  selecionaEstado(){
    this.select.emit(this.estadoSelecionado);
  }

}
