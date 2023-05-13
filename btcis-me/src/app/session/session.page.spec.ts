import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SessionPage } from './session.page';

describe('SessionPage', () => {
  let component: SessionPage;
  let fixture: ComponentFixture<SessionPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(SessionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
