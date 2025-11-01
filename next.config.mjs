/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "static-assets-44d.pages.dev",
      "static-assets.freeanimehentai.net",
      "hentai.tv",
      "watchhentai.net",
      "watchhentai.org",
      "cdn.noitatnemucod.net",
    ], // Add your domain here
  },
  eslint: {
    ignoreDuringBuilds: true, // Disable ESLint during the build process
  },
  typescript: {
    ignoreBuildErrors: true, // Disable TypeScript type checking during the build process
  },
  staticPageGenerationTimeout: 300,
};

export default nextConfig;


//root@srv1010212:~/newpro# git remote -v
//origin  https://github.com/david123ar/newpro.git (fetch)
//origin  https://github.com/david123ar/newpro.git (push)
//root@srv1010212:~/newpro#
// root@srv1010212:~/newpro# cd
//root@srv1010212:~# cd henpro-api
// root@srv1010212:~/henpro-api# git remote -v
// origin  https://github.com/david123ar/henpro-api.git (fetch)
// origin  https://github.com/david123ar/henpro-api.git (push)
// root@srv1010212:~/henpro-api# 
//
//