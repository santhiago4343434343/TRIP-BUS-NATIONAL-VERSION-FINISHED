import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from '@app/app.component';
import { appConfig } from '@app/app.component.config';
import { CookieService } from '@services/cookie.service';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { routerProviders } from './app/app.routes';

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...(appConfig.providers ?? []), // mantém os providers do appConfig
    CookieService,                  // adiciona o serviço de cookies
    provideHttpClient(withFetch()), // adiciona HttpClient com fetch
    ...routerProviders              // <- importante: espalhar os providers de rota
  ]
}).catch(err => console.error(err));
