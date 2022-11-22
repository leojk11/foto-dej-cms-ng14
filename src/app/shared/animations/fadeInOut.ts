import { animate, style, transition, trigger } from '@angular/animations';

export const fadeIn = trigger('fadeInAnimation', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('0.1s ease-in-out', style({ opacity: 1 }))
  ]),
  transition(':leave', [
    style({ opacity: 1 }),
    animate('0.1s ease-in-out', style({ opacity: 0 }))
  ]),
]);