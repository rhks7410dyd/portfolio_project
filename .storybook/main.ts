import { pluginTailwindcss } from '@rsbuild/plugin-tailwindcss';
import type { StorybookConfig } from 'storybook-react-rsbuild';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-docs'],
  framework: 'storybook-react-rsbuild',
  async rsbuildFinal(config) {
    config.plugins ??= [];
    config.plugins.push(pluginTailwindcss());
    return config;
  },
};
export default config;
