import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { City } from '../common/city';
import { County } from '../common/county';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  private countiesUrl = "http://18.193.77.12:8080/fit-for-fun/counties";
  private citiesUrl = "http://18.193.77.12:8080/fit-for-fun/cities";

  constructor(private httpClient: HttpClient) { }

  getCounties(): Observable<County[]> {
    return this.httpClient.get<County[]>(this.countiesUrl);
  }

  getCities(): Observable<City[]> {
    return this.httpClient.get<City[]>(this.citiesUrl);
  }

  getCitiesByCounty(county: string): Observable<City[]> {
    return this.httpClient.get<City[]>(`${this.citiesUrl}/${county}`);
  }

  getCreditCardMonths(startMonth: number): Observable<number[]> {
    let data: number[] = [];
    for (let month = startMonth; month <= 12; month++) {
      data.push(month);
    }

    return of(data);
  }

  getCreditCardYears(): Observable<number[]> {
    let data: number[] = [];
    const startYear: number = new Date().getFullYear();
    const endYear: number = startYear + 10;

    for (let year = startYear; year <= endYear; year++) {
      data.push(year);
    }
    return of(data);
  }
}
