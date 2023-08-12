import adapter from '@sveltejs/adapter-auto';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    // Adapter settings
    adapter: adapter(),

    // Vite settings
    vite: {
      css: {
        // Add the path to your global CSS file
        preprocessorOptions: {
          scss: {
            additionalData: `@import './path/to/your/global.css';`
          },
        },
      },
    },
  },
};