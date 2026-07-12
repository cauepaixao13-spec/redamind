import { ApplicationConfig, APP_INITIALIZER } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { AuthService } from './core/services/auth.service';

function waitForAuthReady(auth: AuthService) {
  return () => new Promise<void>((resolve) => {
    const check = () => {
      if (auth.ready()) resolve();
      else setTimeout(check, 20);
    };
    check();
  });
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withViewTransitions()),
    provideAnimationsAsync(),
    provideHttpClient(),
    // Espera a sessão do Supabase ser restaurada (ou confirmada como inexistente)
    // ANTES do app renderizar — evita telas piscando "deslogado" por 1 frame.
    {
      provide: APP_INITIALIZER,
      useFactory: waitForAuthReady,
      deps: [AuthService],
      multi: true,
    },
  ]
};
