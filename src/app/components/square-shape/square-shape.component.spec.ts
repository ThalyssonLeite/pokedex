import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SquareShapeComponent } from './square-shape.component';

describe('SquareShapeComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        SquareShapeComponent
      ],
    }).compileComponents();
  });

  it('should create the square shape', () => {
    const fixture = TestBed.createComponent(SquareShapeComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
