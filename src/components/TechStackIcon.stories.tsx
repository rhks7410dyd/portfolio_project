import type { Meta, StoryObj } from '@storybook/react';
import TechStackIcon from './TechStackIcon';

const meta = {
  title: 'Components/TechStackIcon',
  component: TechStackIcon,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof TechStackIcon>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Database: Story = {
  args: {
    icon: 'database',
    label: 'PostgreSQL',
  },
};

export const Api: Story = {
  args: {
    icon: 'api',
    label: 'GraphQL',
  },
};

export const Cloud: Story = {
  args: {
    icon: 'cloud',
    label: 'AWS',
  },
};

export const Container: Story = {
  args: {
    icon: 'deployed_code',
    label: 'Docker',
  },
};

export const Cache: Story = {
  args: {
    icon: 'memory',
    label: 'Redis',
  },
};
