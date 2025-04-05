const react = require('@vitejs/plugin-react');

/** @type {import('vite').UserConfig} */
module.exports = {
  plugins: [react()],
};

import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  base: '/',
});

