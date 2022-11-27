import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { take } from 'rxjs/operators';
import { ZMP_G2G_BFF_ENDPOINT_URL } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupportService {
  public baseURL = ZMP_G2G_BFF_ENDPOINT_URL;
  constructor(private httpClient: HttpClient) { }

  createTicket(body): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.httpClient
        .post<any>(`${this.baseURL}/v1/support/tickets`, body)
        .pipe(take(1))
        .subscribe(
          response => resolve(response),
          error => reject(error)
        )
    });
  }
}
