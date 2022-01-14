import React from 'react';

import { IonButton } from '@ionic/react';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/IonButton',
  component: IonButton,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    disabled: { type: 'boolean' },
    strong: { type: 'boolean' },
    expand: {
      control: { type: 'select' },
      options: ['full', 'block']
    },
    fill: {
      control: { type: 'select' },
      options: ['clear', 'outline', 'solid', 'default']
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'default', 'large'],
    },
    color: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'tertiary', 'warning', 'success', 'danger']
    },
  },
  parameters: {
    actions: {
      argTypesRegex: '^on.*',
      handles: ['click', 'ionFocus', 'ionBlur']
    }
  },
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = (args) => <IonButton {...args}>{args.label}</IonButton>;

export const Playground = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Playground.args = {
  label: 'Button',
};
