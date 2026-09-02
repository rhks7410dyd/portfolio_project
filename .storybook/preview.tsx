import type { Preview } from 'storybook-react-rsbuild';
import '../src/App.css';
import './docs-theme.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },

  globalTypes: {
    theme: {
      toolbar: {
        icon: 'circlehollow',
        items: [
          { value: 'dark', icon: 'moon', title: 'Dark' },
          { value: 'light', icon: 'sun', title: 'Light' },
        ],
      },
    },
  },

  initialGlobals: {
    theme: 'light',
  },

  decorators: [
    (Story, context) => {
      document.documentElement.classList.toggle(
        'dark',
        context.globals.theme === 'dark',
      );
      return <Story />;
    },
  ],
};

export default preview;
