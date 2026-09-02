import type { Meta, StoryObj } from '@storybook/react';
import Button from './Button';

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: { control: 'radio', options: ['outline', 'ghost', 'icon'] },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Test Outline',
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Test Ghost',
  },
};

export const Icon: Story = {
  args: {
    variant: 'icon',
    children: (
      <span className="material-symbols-outlined text-[18px]">settings</span>
    ),
  },
};
