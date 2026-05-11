import { animate, style, transition, trigger } from '@angular/animations';

export const routeTransition = trigger('routeTransition', [
  transition('* <=> *', [
    style({ opacity: 0, transform: 'translateY(10px)' }),
    animate('180ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
  ])
]);
