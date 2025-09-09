import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZarbiDexComponent } from './zarbi-dex.component';

describe('ZarbiDexComponent', () => {
  let component: ZarbiDexComponent;
  let fixture: ComponentFixture<ZarbiDexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZarbiDexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZarbiDexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
