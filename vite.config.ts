import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import checker from 'vite-plugin-checker';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  const port = Number(env.VITE_APP_PORT ?? 5001);
  const base = env.VITE_BASENAME ?? '/';

  return {
    // Required for some legacy CJS interop cases (React + older deps)
    legacy: {
      inconsistentCjsInterop: true,
    },

    build: {
      sourcemap: false,
      rollupOptions: {
        onwarn(warning, warn) {
          if (warning.message?.includes('Use of direct `eval`')) {
            return;
          }
          warn(warning);
        },
      },
    },

    plugins: [
      react(),
      checker({
        typescript: true,
        eslint: false,
        overlay: {
          initialIsOpen: false,
        },
      }),
    ],

    preview: {
      port,
    },

    server: {
      host: '0.0.0.0',
      port,
      allowedHosts: true,
    },

    base,

    resolve: {
      tsconfigPaths: true,
      alias: {
        'package.json': path.resolve(__dirname, './package.json'),
      },
    },
  };
});
