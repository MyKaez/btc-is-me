import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionsUserComponent } from './sessions-user.component';

describe('SessionsUserComponent', () => {
  let component: SessionsUserComponent;
  let fixture: ComponentFixture<SessionsUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SessionsUserComponent]
    });
    fixture = TestBed.createComponent(SessionsUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
