import { Injectable } from '@angular/core';
import { forkJoin, map, mergeMap, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import User from '../Interfaces/User';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  createUser(params: User): Observable<User>{
    return this.http.post<User>('http://localhost:3000/users', params);
  }

  getUsers(): Observable<User>{
    return this.http.get<User>('http://localhost:3000/users');
  }

  getUser(id: Number): Observable<any> {
    return this.http.get<any>(`http://localhost:3000/users/${id}`)
  }

  updateUser(id: Number, params: User): Observable<any> {
    return this.http.patch(`http://localhost:3000/users/${id}`, params);
  }

  deleteUser(id: string): Observable<any>{
    return this.http.delete(`http://localhost:3000/users/${id}`);
  }

}
