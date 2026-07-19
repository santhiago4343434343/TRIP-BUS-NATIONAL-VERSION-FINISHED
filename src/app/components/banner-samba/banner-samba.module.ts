// banner-samba.module.ts
// Encaixe este módulo no seu AppModule ou no módulo de destino
// adicionando BannerSambaModule em imports: [...]

import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';

import { BannerSambaComponent  } from './banner-samba.component';
import { SlideAcessoComponent  } from './slide-acesso.component';
import { SlideLogoComponent    } from './slide-logo.component';
import { SlideExtremaComponent } from './slide-extrema.component';
import { SlideRotaComponent    } from './slide-rota.component';

@NgModule({
  declarations: [
    BannerSambaComponent,
    SlideAcessoComponent,
    SlideLogoComponent,
    SlideExtremaComponent,
    SlideRotaComponent,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    BannerSambaComponent, // único export necessário
  ],
})
export class BannerSambaModule {}
