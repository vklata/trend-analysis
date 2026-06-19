import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardFilterService {

  private sessionSource = new BehaviorSubject<string>('2026-27');
  private stateSource = new BehaviorSubject<string>('All States');
  private branchSource = new BehaviorSubject<string>('');

  session$ = this.sessionSource.asObservable();
  state$ = this.stateSource.asObservable();
  branch$ = this.branchSource.asObservable();

  setSession(session: string) {
    this.sessionSource.next(session);
  }

  setState(state: string) {
    this.stateSource.next(state);
  }

  setBranch(branch: string) {
    this.branchSource.next(branch);
  }
}
