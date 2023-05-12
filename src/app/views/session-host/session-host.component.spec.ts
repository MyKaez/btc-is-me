import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionsHostComponent } from './session-host.component';

describe('SessionsHostComponent', () => {
  let component: SessionsHostComponent;
  let fixture: ComponentFixture<SessionsHostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SessionsHostComponent]
    });
    fixture = TestBed.createComponent(SessionsHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
