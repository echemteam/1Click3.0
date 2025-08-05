import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['local-origin.dev', '*.local-origin.dev'],

  sassOptions: {
    // Include the path to your global styles folder (e.g., styles/global)
    includePaths: [path.join(process.cwd(), 'src/styles/global')],
    prependData: `@import "main";`,  // Automatically imports 'main.scss' into every SCSS file
  },
};

export default nextConfig;