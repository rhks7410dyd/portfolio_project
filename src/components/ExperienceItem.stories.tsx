import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';
import ExperienceItem from './ExperienceItem';

const meta = {
  title: 'Components/ExperienceItem',
  component: ExperienceItem,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof ExperienceItem>;

export default meta;

type Story = StoryObj<typeof meta>;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const baseArgs = {
  role: 'Senior Systems Engineer',
  company: 'TechNova Solutions // 2021 - Present',
  bullets: [
    'Architected microservices transition, reducing deployment time by 40%.',
    'Implemented distributed caching strategy handling 10k+ req/sec.',
    'Led a team of 4 engineers in redesigning the core data pipeline.',
  ],
  tags: ['Go', 'Kubernetes', 'Kafka'],
};

export const Collapsed: Story = {
  args: baseArgs,
};

export const NoTags: Story = {
  args: {
    role: 'Backend Developer',
    company: 'DataSync Inc. // 2018 - 2021',
    bullets: [
      'Developed RESTful APIs supporting mobile and web platforms.',
      'Optimized legacy database queries, improving read speeds by 25%.',
    ],
  },
};

export const ClickToExpand: Story = {
  args: baseArgs,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const card = canvas.getByText(baseArgs.role);
    const content = canvasElement.querySelector('.accordion-content');

    await expect(content).not.toHaveClass('expanded');
    await delay(600);

    await userEvent.click(card);
    await expect(content).toHaveClass('expanded');
    await delay(600);

    await userEvent.click(card);
    await expect(content).not.toHaveClass('expanded');
  },
};
