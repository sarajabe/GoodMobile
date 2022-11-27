import { trigger, state, style, transition, animate, group, keyframes } from '@angular/animations';

export const SlideInOutAnimation = [trigger('slideInOut', [
  state('in', style({
    'max-height': '500px', opacity: '1', visibility: 'visible'
  })),
  state('out', style({
    'max-height': '0px', opacity: '0', visibility: 'hidden'
  })),
  transition('in => out', [group([
    animate('400ms ease-in-out', style({
      opacity: '0'
    })),
    animate('600ms ease-in-out', style({
      'max-height': '0px'
    })),
    animate('700ms ease-in-out', style({
      visibility: 'hidden'
    }))
  ]
  )]),
  transition('out => in', [group([
    animate('100ms ease-in-out', style({
      visibility: 'visible'
    })),
    animate('600ms ease-in-out', style({
      'max-height': '500px'
    })),
    animate('200ms ease-in-out', style({
      opacity: '1'
    }))
  ]
  )])
])];

export const FadeInOutAnimation = [
  trigger('fadeInOut', [
    state('in', style({})),
    transition('void => *', [
      animate(500, keyframes([
        style({ opacity: 0, offset: 0 }),
        style({ opacity: 1, offset: 0.7 }),
        style({ opacity: 1, offset: 1.0 })
      ]))
    ]),
    transition('* => void', [
      animate(0, keyframes([
        style({ opacity: 1, offset: 0 }),
        style({ opacity: 0, offset: 1 })
      ]))
    ])
  ])
];

export const ShakeAnimation = [trigger('scaleAnimate', [
  state('small', style({
    transform: 'scale(1)',
  })),
  state('large', style({
    transform: 'scale(1)',
  })),
  transition('small <=> large', animate('400ms ease-in', keyframes([
    style({ opacity: 0, transform: 'translateY(-2px)', offset: 0 }),
    style({ opacity: 1, transform: 'translateY(2px)', offset: 0.25 }),
    style({ opacity: 1, transform: 'translateY(-2px)', offset: 0.5 }),
    style({ opacity: 1, transform: 'translateY(2px)', offset: 0.75 }),
    style({ opacity: 1, transform: 'translateY(0)', offset: 1.0 })
  ])))
])];

export const MoveInOutAnimation = [
  trigger('moveInOut', [
    state('in', style({})),
    transition('void => in', [
      animate(500, keyframes([
        style({ bottom: '-200px' }),
        style({ bottom: '0px' })
      ]))
    ]),
    transition('in => out', [
      animate(500, keyframes([
        style({ bottom: '0px' }),
        style({ bottom: '-200px' })
      ]))
    ]),
    state('inTablet', style({})),
    transition('void => inTablet', [
      animate(500, keyframes([
        style({ bottom: '-384px' }),
        style({ bottom: '0px' })
      ]))
    ]),
    transition('inTablet => outTablet', [
      animate(500, keyframes([
        style({ bottom: '0px' }),
        style({ bottom: '-384px' })
      ]))
    ]),
    state('inMobile', style({})),
    transition('void => inMobile', [
      animate(500, keyframes([
        style({ bottom: '-496px' }),
        style({ bottom: '0px' })
      ]))
    ]),
    transition('inMobile => outMobile', [
      animate(500, keyframes([
        style({ bottom: '0px' }),
        style({ bottom: '-496px' })
      ]))
    ])
  ])
];


export const SlideInOutAnimationMobMenu = [trigger('slideInOut', [
  state('in', style({
    'max-height': '570px', opacity: '1', visibility: 'visible'
  })),
  state('out', style({
    'max-height': '0px', opacity: '0', visibility: 'hidden'
  })),
  transition('in => out', [group([
    animate('200ms ease-in-out', style({
      'max-height': '0px'
    })),
    animate('200ms ease-in-out', style({
      visibility: 'hidden'
    }))
  ]
  )]),
  transition('out => in', [group([
    animate('100ms ease-in-out', style({
      visibility: 'visible'
    })),
    animate('200ms ease-in-out', style({
      'max-height': '570px'
    })),
    animate('200ms ease-in-out', style({
      opacity: '1'
    }))
  ]
  )])
])];
