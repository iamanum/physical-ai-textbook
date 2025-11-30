import { themes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type *as Preset from '@docusaurus/preset-classic';

const config: Config = {
  // --- HACKATHON CONFIGURATION START ---
  title: 'Physical AI & Humanoid Robotics', 
  tagline: 'Bridging the digital brain and the physical body.', 
  // --- HACKATHON CONFIGURATION END ---
  
  favicon: 'img/favicon.ico',

  // FIX: GitHub Pages deployment ke liye zaroori (Final Deployed URL)
  url: 'https://iamanum.github.io', 
  
  // FIX: Local testing ke liye '/' (aur deployment ke liye /repo-name/)
  // Jab deploy karenge, Docusaurus khud hi isko /physical-ai-textbook/ kar dega.
  // Lekin, hume locally kaam karne ke liye / hi rakhna chahiye, aur deploy ke waqt change karna zaroori hai.
  // HUM ISKO '/' RAKHTE HAIN, AUR DEPLOYMENT COMMAND KO CUSTOMIZE KARENGE.
  baseUrl: '/', 

  // GitHub pages deployment config.
  organizationName: 'iamanum', // Aapka GitHub Username
  projectName: 'physical-ai-textbook', // Aapka Repo Name
  deploymentBranch: 'gh-pages', // GitHub Pages deployment branch

  // FIX: Trailing Slash Warning/Error (GitHub Pages ke liye zaroori)
  trailingSlash: false, 

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to set htmlLang: 'zh-Hans'.
  i18n: {
    defaultLocale: 'en',
    locales: ['en'], 
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/iamanum/physical-ai-textbook/tree/master/docs/', 
        },
        blog: false, // Blog band kar rahe hain, kyunki yeh sirf textbook hai
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'Physical AI & Robotics',
      logo: {
        alt: 'Panaversity Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Textbook Modules',
        },
        {
          href: 'https://github.com/iamanum/physical-ai-textbook',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [],
      copyright: `Copyright © ${new Date().getFullYear()} Panaversity. Built with Docusaurus.`,
    },
    prism: {
      theme: themes.github,
      darkTheme: themes.dracula,
      // Robotics ke liye zaroori languages
      additionalLanguages: ['python', 'cpp', 'bash', 'yaml'], 
    },
  } satisfies Preset.ThemeConfig,
};

export default config;