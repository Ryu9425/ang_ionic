import { AnimationOptions } from '../';
import { getElementRoot } from '../utils';
import { Animation, AnimationBuilder, createAnimation } from '@ionic/core';

const createBase = (animationOpts: AnimationOptions, enteringEl: HTMLElement): { [key: string]: Animation; } => {
  const { duration, easing } = animationOpts;
  const rootAnimation = createAnimation()
    .duration(duration !== undefined ? duration : 150)
    .easing(easing || 'ease');

  const elementAnimation = createAnimation().addElement(enteringEl);

  rootAnimation.addAnimation([elementAnimation]);

  return { rootAnimation, elementAnimation };
};

const enter = (animationOpts: AnimationOptions, baseEl: HTMLElement): Animation => {
  const root = getElementRoot(baseEl);
  const wrapper = (root.querySelector('.ion-wrapper') || baseEl) as HTMLElement;
  const backdrop = root.querySelector('ion-backdrop');
  const { rootAnimation, elementAnimation } = createBase(animationOpts, wrapper);

  elementAnimation.keyframes([
    { offset: 0, opacity: 0, transform: 'scale(0.8)' },
    { offset: 0.3, opacity: 1 },
    { offset: 1, opacity: 1, transform: 'scale(1)' },
  ]);

  if (backdrop) {
    const backdropAnimation = createAnimation()
      .addElement(backdrop)
      .fromTo('opacity', '0', 'var(--backdrop-opacity, 1)');

    rootAnimation.addAnimation(backdropAnimation);
  }

  return rootAnimation;
};

const leave = (animationOpts: AnimationOptions, baseEl: HTMLElement): Animation => {
  const root = getElementRoot(baseEl);
  const wrapper = (root.querySelector('.ion-wrapper') || baseEl) as HTMLElement;
  const backdrop = root.querySelector('ion-backdrop');
  const { rootAnimation, elementAnimation } = createBase(animationOpts, wrapper);

  elementAnimation.keyframes([
    { offset: 0, opacity: 1 },
    { offset: 1, opacity: 0 },
  ]);

  if (backdrop) {
    const backdropAnimation = createAnimation()
      .addElement(backdrop)
      .fromTo('opacity', 'var(--backdrop-opacity, 1)', '0');

    rootAnimation.addAnimation(backdropAnimation);
  }

  return rootAnimation;
};

export const fadeMotionEnter = (animationOpts: AnimationOptions = {}): AnimationBuilder => (baseEl: HTMLElement): Animation => enter(animationOpts, baseEl);

export const fadeMotionLeave = (animationOpts: AnimationOptions = {}): AnimationBuilder => (baseEl: HTMLElement): Animation => leave(animationOpts, baseEl);

export const fadeMotion = (animationOpts: AnimationOptions = {}): AnimationBuilder => (_: HTMLElement, opts: any): Animation => {
  const backDirection = opts.direction === 'back';
  const { enteringEl, leavingEl } = opts;

  return backDirection ? leave(animationOpts, leavingEl) : enter(animationOpts, enteringEl);
};
