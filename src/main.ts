import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

const providers = [
  {
    provide: 'BTCIS.ME-API',
    useFactory: () => 'https://api.btcis.me'
    //useFactory: () => 'https://localhost:5001'
  }
]

platformBrowserDynamic(providers).bootstrapModule(AppModule)
  .catch(err => console.error(err));
