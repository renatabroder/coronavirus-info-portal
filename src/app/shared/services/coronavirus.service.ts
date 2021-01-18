import { HttpClient, HttpParams } from '@angular/common/http';
import { QueryValueType } from '@angular/compiler/src/core';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CoronavirusService {

  constructor(private http: HttpClient ) { }

  getCidadeInfo(query: string): Observable<any> {
    return this.doGet(query)
  }

  private doGet<T>(url: string): Observable<T> {
    // // Checar a url da requisiao para a API
    //console.log(`https://covid19-brazil-api.now.sh/api/report/v1${ url }`)

    return this.http.get<T>(`https://covid19-brazil-api.now.sh/api/report/v1${ url }`);
  }

}
