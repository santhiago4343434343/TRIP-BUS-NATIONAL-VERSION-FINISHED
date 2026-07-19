import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
/*Usa isPlatformBrowser → garante que só acessa document.cookie 
no navegador, evitando erro em SSR. */
@Injectable({
  providedIn: 'root'
})
export class CookieService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  /** Cria ou atualiza um cookie */
  set(name: string, value: string, days: number = 7): void {
    if (isPlatformBrowser(this.platformId)) {
      const expires = new Date(Date.now() + days * 864e5).toUTCString();
      document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
    }
  }

  /** Lê um cookie pelo nome */
  get(name: string): string | null {
    if (isPlatformBrowser(this.platformId)) {
      const cookies = document.cookie.split('; ');
      const found = cookies.find(row => row.startsWith(name + '='));
      return found ? decodeURIComponent(found.split('=')[1]) : null;
    }
    return null;
  }

  /** Apaga um cookie */
  delete(name: string): void {
    if (isPlatformBrowser(this.platformId)) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC;
     path=/; SameSite=Lax`;
      /*SameSite=lax :: melhora a segurança dos cookies*/
    }
  }

  /** Retorna todos os cookies como objeto */
  getAll(): { [key: string]: string } {
    if (isPlatformBrowser(this.platformId)) {
      return document.cookie
        .split('; ')
        .reduce((acc: any, cookie) => {
          const [key, value] = cookie.split('=');
          acc[key] = decodeURIComponent(value);
          return acc;
        }, {});
    }
    return {};
  }
}
