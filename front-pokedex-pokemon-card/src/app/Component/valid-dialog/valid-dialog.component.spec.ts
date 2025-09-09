import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidDialogComponent } from './valid-dialog.component';

describe('ValidDialogComponent', () => {
  let component: ValidDialogComponent;
  let fixture: ComponentFixture<ValidDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValidDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValidDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
