import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'jv-country-info',
  templateUrl: './country-info.component.html',
  styleUrls: ['./country-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush, //apenas será atualizado quando houver mudanças
})
export class CountryInfoComponent {

  
  @Input() countryInfo: any; 
  @Output() toggleBookmark = new EventEmitter;

  onToggleBookmark(){
    this.toggleBookmark.emit();
  }
}
