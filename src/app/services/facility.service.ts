import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommentRequestModel } from '../common/comment-request-model';
import { Facility } from '../common/facility';
import { FacilityRequestModel } from '../common/facility-request-model';
import { FacilityResponse } from '../common/facility-response';
import { Instructor } from '../common/instructor';

@Injectable({
  providedIn: 'root'
})
export class FacilityService {
  private baseUrl = 'https://fitforfun-backend.herokuapp.com/facilities';

  constructor(private httpClient: HttpClient) { }

  getFacilites(): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl);
  }

  getFacility(facilityId: number): Observable<any> {
    const facilityUrl = `${this.baseUrl}/${facilityId}`;
    return this.httpClient.get<any>(facilityUrl);
  }
  
  getFacilityBySport(thePage: number, thePageSize: number,sport: string):Observable<any>{
    return this.httpClient.get<any>(`${this.baseUrl}/bySport?sport=${sport}`);
  }

  modifyFacility(id: number, facility: FacilityRequestModel): Observable<any> {
    return this.httpClient.put<any>(`${this.baseUrl}/${id}`, facility);
  }

  saveFacility(facility: FacilityRequestModel): Observable<any> {
    return this.httpClient.post<any>(this.baseUrl, facility);
  }
  getFacilitiesWithFilter(thePage: number, thePageSize: number,
    name: string, address: string
  ): Observable<any> {

    let searchUrl: any;
    searchUrl = `${this.baseUrl}` + `?page=${thePage}&limit=${thePageSize}`;

    let nameFilter: any;
    let addressFilter: any;
    name ? nameFilter = name : nameFilter = ""
    address ? addressFilter = address : addressFilter = ""

    searchUrl = searchUrl + `&name=${nameFilter}&address=${addressFilter}`
    return this.httpClient.get<any>(searchUrl);
  }

  deleteFacility(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.baseUrl}/${id}`);
  }
  addImage(id: number, file: any, type: string): Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrl}/${id}/uploadImage/${type}`, file);
  }
  addInstructor(id: number, instructor: Instructor): Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrl}/${id}/addInstructor`, instructor);
  }
  addComment(id: number, message: CommentRequestModel): Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrl}/${id}/addComment`, message);
  }

}
