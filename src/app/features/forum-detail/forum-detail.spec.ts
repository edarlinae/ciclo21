import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForumDetail } from './forum-detail';

describe('ForumDetail', () => {
  let component: ForumDetail;
  let fixture: ComponentFixture<ForumDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForumDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForumDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
