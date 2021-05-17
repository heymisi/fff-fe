import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommentRequestModel } from '../common/comment-request-model';
import { Facility } from '../common/facility';
import { Instructor } from '../common/instructor';
import { InstructorRegistrationModel } from '../common/instructor-registration-model';
import { InstructorResponse } from '../common/instructor-response';
import { User } from '../common/user';

@Injectable({
  providedIn: 'root'
})
export class InstructorService {

  private baseUrl = 'http://18.193.77.12:8080/fit-for-fun/instructors';

  constructor(private httpClient: HttpClient) { }

  getInstructors(): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl);
  }
  getInstructorsWithFilter(thePage: number, thePageSize: number,
    name: string, address: string, sport: string
  ): Observable<any> {
    let searchUrl: any;
    searchUrl = `${this.baseUrl}` + `?page=${thePage}&limit=${thePageSize}`;

    let nameFilter: any;
    let addressFilter: any;
    let sportFilter: any;
    name ? nameFilter = name : nameFilter = ""
    address ? addressFilter = address : addressFilter = ""
    sport ? sportFilter = sport : sportFilter = ""

    searchUrl = searchUrl + `&name=${nameFilter}&address=${addressFilter}&sport=${sportFilter}`
    return this.httpClient.get<any>(searchUrl);
  }

  getInstructor(instructorId: number): Observable<any> {
    const instructorUrl = `${this.baseUrl}/${instructorId}`;
    return this.httpClient.get<any>(instructorUrl);
  }
  getInstructorByUser(userId: number): Observable<any> {
    const instructorUrl = `${this.baseUrl}/byUser/${userId}`;
    return this.httpClient.get<any>(instructorUrl);
  }

  modifyInstructor(id: number, instructor: InstructorResponse): Observable<any> {
    return this.httpClient.put<any>(`${this.baseUrl}/${id}`, instructor);
  }

  modifyInstructorUser(id: number, user: User): Observable<any> {
    return this.httpClient.put<any>(`${this.baseUrl}/${id}/updateUser`, user);
  }

  deteleInstructor(id: number, pass: string): Observable<any> {
    return this.httpClient.delete<any>(`${this.baseUrl}/${id}?pass=${pass}`);
  }

  addComment(id: number, message: CommentRequestModel): Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrl}/${id}/addComment`, message);
  }

  searchInstructorsByName(thePage: number,
    thePageSize: number,
    theKeyword: string): Observable<Instructor[]> {

    const searchUrl = `${this.baseUrl}/search/${theKeyword}`
      + `?page=${thePage}&limit=${thePageSize}`;
    return this.httpClient.get<Instructor[]>(searchUrl);
  }

  searchInstructorsByCity(thePage: number,
    thePageSize: number,
    theKeyword: string): Observable<Instructor[]> {

    const searchUrl = `${this.baseUrl}/search/city/${theKeyword}`
      + `?page=${thePage}&limit=${thePageSize}`;
    return this.httpClient.get<Instructor[]>(searchUrl);
  }

  searchInstructorsBySport(thePage: number,
    thePageSize: number,
    sportId: number): Observable<Instructor[]> {
    const searchUrl = `${this.baseUrl}/sport/${sportId}`
      + `?page=${thePage}&limit=${thePageSize}`;
    return this.httpClient.get<Instructor[]>(searchUrl);
  }

  getInstructorsByAvailableFacility() {
    return this.httpClient.get<any>(`${this.baseUrl}/availableFacility`);
  }

  createInstructor(instructor: InstructorRegistrationModel): Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrl}`, instructor);
  }
  
  addImage(id: number, file: any): Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrl}/${id}/uploadImage`, file);
  }
}
