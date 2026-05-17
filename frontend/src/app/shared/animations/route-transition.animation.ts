import { animate, style, transition, trigger } from '@angular/animations';

// Learning Lab: Angular animations
// A reusable trigger gives routed pages a consistent entrance without each page owning animation code.
export const routeTransition = trigger('routeTransition', [
  transition('* <=> *', [
    style({ opacity: 0, transform: 'translateY(10px)' }),
    animate('180ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
  ])
]);
