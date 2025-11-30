import { themes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type *as Preset from '@docusaurus/preset-classic';

const config: Config = {
  // --- HACKATHON CONFIGURATION START ---
  title: 'Physical AI & Humanoid Robotics', 
  tagline: 'Bridging the digital brain and the physical body.', 
  // --- HACKATHON CONFIGURATION END ---
  
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://iamanum.github.io', 
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it's often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you use GitHub pages, here is where to set them up.
  organizationName: 'iamanum',
  projectName: 'physical-ai-textbook',
  deploymentBranch: 'gh-pages', // GitHub Pages deployment branch (Aksar yeh 'gh-pages' hota hai)

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to set htmlLang: 'zh-Hans'.
  i18n: {
    defaultLocale: 'en',
    locales: ['en'], // Urdu translation ke liye hum yahan 'ur' add kareinge, lekin abhi nahi
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          
          editUrl:
            'https://github.com/iamanum/physical-ai-textbook/tree/main/docs/', 
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