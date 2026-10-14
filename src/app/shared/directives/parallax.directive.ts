import { Directive, ElementRef, Input, NgZone, OnDestroy, OnInit } from '@angular/core';
import { prefersReducedMotion } from './reveal.directive';

/**
 * Moves an element slower than the page scroll, used for the hero image.
 *
 * <div [appParallax]="0.25"></div>
 */
@Directive({
  selector: '[appParallax]',
  standalone: true
})
export class ParallaxDirective implements OnInit, OnDestroy {

  @Input('appParallax') speed: number | string = 0.25;

  private frame?: number;

  private onScroll = () => {
    if (this.frame) {
      return;
    }

    this.frame = requestAnimationFrame(() => {
      this.frame = undefined;

      const offset = window.scrollY;

      // nothing to do once the hero is out of sight
      if (offset > window.innerHeight * 1.2) {
        return;
      }

      this.el.nativeElement.style.transform = `translate3d(0, ${ offset * Number(this.speed) }px, 0)`;
    });
  };

  constructor(
    private el: ElementRef<HTMLElement>,
    private zone: NgZone
  ) { }

  ngOnInit(): void {
    if (prefersReducedMotion()) {
      return;
    }

    this.zone.runOutsideAngular(() => {
      window.addEventListener('scroll', this.onScroll, { passive: true });
    });
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.onScroll);

    if (this.frame) {
      cancelAnimationFrame(this.frame);
    }
  }
}
