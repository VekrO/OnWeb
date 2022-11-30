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
    return this.http.post<User>('https://onwebapi-production.up.railway.app/users', params);
  }

  getUsers(): Observable<User>{
    return this.http.get<User>('https://onwebapi-production.up.railway.app/users');
  }

  getUser(id: Number): Observable<any> {
    return this.http.get<any>(`https://onwebapi-production.up.railway.app/users/${id}`)
  }

  updateUser(id: Number, params: User): Observable<any> {
    return this.http.patch(`https://onwebapi-production.up.railway.app/users/${id}`, params);
  }

  deleteUser(id: string): Observable<any>{
    return this.http.delete(`https://onwebapi-production.up.railway.app/users/${id}`);
  }

}
