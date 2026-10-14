import { Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';

export type RevealVariant = '' | 'up' | 'left' | 'right' | 'zoom' | 'fade';

const callbacks = new WeakMap<Element, () => void>();
let sharedObserver: IntersectionObserver | null = null;

function getObserver(): IntersectionObserver {
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          callbacks.get(entry.target)?.();
          callbacks.delete(entry.target);
          sharedObserver?.unobserve(entry.target);
        }
      }
    }, { threshold: 0.1, rootMargin: '0px 0px -5% 0px' });
  }

  return sharedObserver;
}

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Fades an element in the first time it scrolls into view.
 *
 * <div appReveal [revealDelay]="i * 70">...</div>
 * <div appReveal="left">...</div>
 */
@Directive({
  selector: '[appReveal]',
  standalone: true
})
export class RevealDirective implements OnInit, OnDestroy {

  @Input('appReveal') variant: RevealVariant | string = '';
  @Input() revealDelay: number = 0;

  constructor(private el: ElementRef<HTMLElement>) { }

  ngOnInit(): void {
    const element = this.el.nativeElement;

    if (typeof IntersectionObserver === 'undefined' || prefersReducedMotion()) {
      return;
    }

    element.classList.add('reveal');

    if (this.variant) {
      element.classList.add(`reveal--${ this.variant }`);
    }

    // long delays on long lists feel slow, so cap them
    element.style.setProperty('--reveal-delay', `${ Math.min(Math.max(this.revealDelay, 0), 560) }ms`);

    callbacks.set(element, () => element.classList.add('reveal--in'));
    getObserver().observe(element);
  }

  ngOnDestroy(): void {
    const element = this.el.nativeElement;

    callbacks.delete(element);
    sharedObserver?.unobserve(element);
  }
}
