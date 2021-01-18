import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'jv-local-info',
  templateUrl: './local-info.component.html',
  styleUrls: ['./local-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush, //apenas será atualizado quando houver mudanças
})
export class LocalInfoComponent {

  @Input() localInfo: any; 
  @Output() toggleBookmark = new EventEmitter;

  get nomeLocal(): string {
    return `${this.localInfo.state} - ${this.localInfo.uf}`
  }

  onToggleBookmark(){
    this.toggleBookmark.emit();
  }
}
