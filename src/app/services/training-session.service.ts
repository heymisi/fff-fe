import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TrainingSession } from '../common/training-session';

@Injectable({
  providedIn: 'root'
})
export class TrainingSessionService {
  private baseUrl = 'https://fitforfun-backend.herokuapp.com/trainingSessions';

  constructor(private http: HttpClient) { }

  getTrainingSessionByUser(userId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/user/${userId}`);
  }
  getTrainingSessionByInstructor(instructorId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/instructor/${instructorId}`);
  }
  getTrainingSessionByInstructorAndAvalability(instructorId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${instructorId}/byInstructorAndAvailable`);
  }
  deleteTrainingSession(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }
  deleteTrainingSessionForUser(userId: number, sessionId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/user/${userId}/deleteSession/${sessionId}`)
  }
  saveTrainingSession(instructorId: number, session: TrainingSession): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}?instructorId=${instructorId}`, session);
  }
}
