import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionUserComponent } from './session-user.component';

describe('SessionsUserComponent', () => {
  let component: SessionUserComponent;
  let fixture: ComponentFixture<SessionUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SessionUserComponent]
    });
    fixture = TestBed.createComponent(SessionUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
