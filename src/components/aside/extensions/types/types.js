import {Aside} from '../../aside';

// TODO use setters instead of direct dom manipulation
let asideManipulator = {
  setSliding(sliding) {
    this.aside.domElement.classList[sliding ? 'add' : 'remove']('no-transition');
  },
  setOpen(open) {
    this.aside.domElement.classList[open ? 'add' : 'remove']('open');
  },
  setTransform(t) {
    this.aside.domElement.style.transform = t;
  }
}
let contentManipulator = {
  setSliding(sliding) {
    this.aside.content.domElement.classList[sliding ? 'add' : 'remove']('no-transition');
  },
  setOpen(open) {
    this.aside.content.domElement.classList[open ? 'add' : 'remove'](
      `aside-open-${this.aside.side}`
    )
  },
  setTransform(t) {
    this.aside.content.domElement.style.transform = t;
  }
}

class AsideType {
  constructor(aside) {
    this.aside = aside;

    aside.domElement.classList.add(`type-${aside.type}`);

    //FIXME(ajoslin): have to wait for for bindings to apply in a component
    setTimeout(() => {
      this.aside.content.domElement.classList.add('aside-content')
    })
  }
}

export class AsideTypeOverlay extends AsideType {
  setSliding(sliding) {
    asideManipulator.setSliding.call(this, sliding);
  }
  setOpen(open) {
    asideManipulator.setOpen.call(this, open);
  }
  setTransform(t) {
    asideManipulator.setTransform.call(this, t);
  }
}

export class AsideTypePush extends AsideType {
  setSliding(sliding) {
    asideManipulator.setSliding.call(this, sliding);
    contentManipulator.setSliding.call(this, sliding);
  }
  setOpen(open) {
    asideManipulator.setOpen.call(this, open);
    contentManipulator.setOpen.call(this, open);
  }
  setTransform(t) {
    asideManipulator.setTransform.call(this, t);
    contentManipulator.setTransform.call(this, t);
  }
}

export class AsideTypeReveal extends AsideType {
  setSliding(sliding) {
    contentManipulator.setSliding.call(this, sliding);
  }
  setOpen(sliding) {
    asideManipulator.setOpen.call(this, sliding);
    contentManipulator.setOpen.call(this, sliding);
  }
  setTransform(t) {
    contentManipulator.setTransform.call(this, t);
  }
}
