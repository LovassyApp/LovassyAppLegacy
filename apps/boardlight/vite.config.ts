import { defineConfig, splitVendorChunkPlugin } from 'vite';
import react from '@vitejs/plugin-react';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';
import rollupNodePolyFill from 'rollup-plugin-node-polyfills';
import { dependencies } from './package.json';

function renderChunks(deps: Record<string, string>): Record<string, string> {
    const chunks = {};
    Object.keys(deps).forEach((key) => {
        if (['react', 'react-router-dom', 'react-dom'].includes(key)) return;
        if (key.startsWith('@types')) return;
        chunks[key] = [key];
    });
    return chunks;
}

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), splitVendorChunkPlugin()],
    server: {
        open: '/',
    },
    define: {
        global: 'globalThis',
    },
    optimizeDeps: {
        esbuildOptions: {
            // Node.js global to browser globalThis
            define: {
                global: 'globalThis',
            },
            // Enable esbuild polyfill plugins
            plugins: [
                NodeGlobalsPolyfillPlugin({
                    process: true,
                    buffer: true,
                }),
                NodeModulesPolyfillPlugin(),
            ],
        },
    },
    build: {
        rollupOptions: {
            plugins: [
                // Enable rollup polyfills plugin
                // used during production bundling
                // @ts-ignore
                rollupNodePolyFill(),
            ],
            output: {
                manualChunks: {
                    vendor: ['react', 'react-router-dom', 'react-dom'],
                    ...renderChunks(dependencies),
                },
            },
        },
    },
});
