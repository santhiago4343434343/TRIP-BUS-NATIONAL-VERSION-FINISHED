import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerSambaComponent } from './banner-samba.component';

describe('BannerSambaComponent', () => {
    let component: BannerSambaComponent;
    let fixture: ComponentFixture<BannerSambaComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BannerSambaComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(BannerSambaComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
