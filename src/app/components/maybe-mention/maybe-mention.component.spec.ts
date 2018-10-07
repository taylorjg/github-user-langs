import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MaybeMentionComponent } from './maybe-mention.component';

describe('MaybeMentionComponent', () => {

  let component: MaybeMentionComponent;
  let fixture: ComponentFixture<MaybeMentionComponent>;
  let el: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MaybeMentionComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaybeMentionComponent);
    component = fixture.componentInstance;
    el = fixture.debugElement.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('name is a mention', () => {

    beforeEach(() => {
      component.name = '@something';
      fixture.detectChanges();
    });

    it('should render an anchor', () => {
      const a = el.querySelector('a');
      expect(a).toBeTruthy();
      expect(a.getAttribute('href')).toBe('https://github.com/something');
      expect(a.innerText).toBe(component.name);
    });
  });

  describe('name is not a mention', () => {

    beforeEach(() => {
      component.name = 'something';
      fixture.detectChanges();
    });

    it('should render plain text', () => {
      const a = el.querySelector('a');
      expect(a).toBeFalsy();
      expect(el.innerText).toBe(component.name);
    });
  });
});
