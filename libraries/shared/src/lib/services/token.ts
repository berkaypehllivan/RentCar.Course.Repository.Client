import { Injectable } from '@angular/core';

const TOKEN_KEY = 'response';

@Injectable({ providedIn: 'root' })
export class TokenService {
  setToken(token: string, remember: Boolean): void {
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem(TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY);
  }

  clearToken(): void {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
  }
}
