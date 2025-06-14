import { trigger, state, style, transition, animate } from '@angular/animations';

export const slideInOutAnimation = trigger('slideInOut', [
  state('in', style({
    transform: 'translateX(0)',
    opacity: 1,
  })),
  state('out', style({
    transform: 'translateX(-100%)',
    opacity: 0,
  })),
  transition('out => in', [
    animate('300ms ease-in')
  ]),
  transition('in => out', [
    animate('300ms ease-out')
  ]),
]);
