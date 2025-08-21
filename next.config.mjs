import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['local-origin.dev', '*.local-origin.dev'],
  sassOptions: {
    includePaths: [path.join(process.cwd(), 'src/styles/global')],
    prependData: `@use "index.scss" as *;`,
  },
};

export default nextConfig;