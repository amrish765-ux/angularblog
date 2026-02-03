import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private seq = 1;
  private subj = new BehaviorSubject<Toast[]>([]);
  toasts$ = this.subj.asObservable();

  show(type: ToastType, message: string, ms = 2500) {
    const toast: Toast = { id: this.seq++, type, message };
    if (this.subj.value.some(t => t.message === message && t.type === type)) return;

    this.subj.next([...this.subj.value, toast]);
    setTimeout(() => this.dismiss(toast.id), ms);
  }

  dismiss(id: number) {
    this.subj.next(this.subj.value.filter(t => t.id !== id));
  }

  clear() {
    this.subj.next([]);
  }
}
