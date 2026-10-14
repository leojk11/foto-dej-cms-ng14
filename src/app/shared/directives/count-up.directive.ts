import { Directive, ElementRef, Input, NgZone, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { prefersReducedMotion } from './reveal.directive';

/**
 * Renders a number and counts it up from zero once it is visible.
 *
 * <span [appCountUp]="42"></span>
 */
@Directive({
  selector: '[appCountUp]',
  standalone: true
})
export class CountUpDirective implements OnChanges, OnDestroy {

  @Input('appCountUp') value: number | string = 0;
  @Input() countDuration: number = 1100;

  private observer?: IntersectionObserver;
  private frame?: number;
  private shown: number = 0;
  private visible: boolean = false;

  constructor(
    private el: ElementRef<HTMLElement>,
    private zone: NgZone
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    const target = Number(this.value);

    if (!Number.isFinite(target) || typeof IntersectionObserver === 'undefined' || prefersReducedMotion()) {
      this.el.nativeElement.textContent = `${ this.value ?? '' }`;
      return;
    }

    if (this.visible) {
      this.animate(target);
      return;
    }

    if (!this.observer) {
      this.el.nativeElement.textContent = '0';
      this.observer = new IntersectionObserver(entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          this.visible = true;
          this.observer?.disconnect();
          this.animate(Number(this.value));
        }
      }, { threshold: 0.4 });
      this.observer.observe(this.el.nativeElement);
    }
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();

    if (this.frame) {
      cancelAnimationFrame(this.frame);
    }
  }

  private animate(target: number): void {
    const from = this.shown;
    const start = performance.now();

    if (this.frame) {
      cancelAnimationFrame(this.frame);
    }

    this.zone.runOutsideAngular(() => {
      const tick = (now: number) => {
        const progress = Math.min((now - start) / this.countDuration, 1);
        const eased = 1 - Math.pow(1 - progress, 4);

        this.shown = Math.round(from + (target - from) * eased);
        this.el.nativeElement.textContent = `${ this.shown }`;

        if (progress < 1) {
          this.frame = requestAnimationFrame(tick);
        }
      };

      this.frame = requestAnimationFrame(tick);
    });
  }
}
