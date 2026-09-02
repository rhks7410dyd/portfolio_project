import type { Meta, StoryObj } from '@storybook/react';
import ProjectCard from './ProjectCard';

const meta = {
  title: 'Components/ProjectCard',
  component: ProjectCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof ProjectCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Nolinks: Story = {
  args: {
    icon: 'code',
    title: 'Nolinks',
    description: 'No link test story',
    tags: ['No', 'Link', 'Test'],
  },
};

export const Bothlinks: Story = {
  args: {
    icon: 'terminal',
    title: 'BothLinks',
    description: 'Both link test story',
    tags: ['Both', 'Link', 'Test'],
    externalUrl: 'www.youtube.com',
    codeUrl: 'www.google.com',
  },
};
