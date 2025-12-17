// @ts-check
// Is file mein hum project ki main configuration setup kar rahe hain.

/** @type {import('@docusaurus/types').Config} */
const config = {
  // Website ka main title jo tab par nazar ayega
  title: 'Physical AI & Humanoid Robotics Textbook', 
  // Tagline ko professional aur unique banaya hai
  tagline: 'Leading the Future of Physical AI and Autonomous Systems',
  favicon: 'img/favicon.ico',

  // Aap ki GitHub profile ka link yahan connect hai
  url: 'https://iamanum.github.io',
  baseUrl: '/physical-ai-textbook/', 
  organizationName: 'iamanum', // Aapka username
  projectName: 'physical-ai-textbook', 

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          // Sidebar ki configuration yahan se control hoti hai
          sidebarPath: './sidebars.js',
          // Edit link ko aap ki repository par point kar diya hai
          editUrl: 'https://github.com/iamanum/physical-ai-textbook/edit/main/textbook/',
          routeBasePath: '/docs',
          showLastUpdateTime: true,
        },
        blog: false, // Blog band rakha hai kyunke ye ek textbook portal hai
        theme: {
          // Custom CSS file yahan se attach hoti hai visuals ke liye
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themes: [
    [
      "@easyops-cn/docusaurus-search-local",
      /** @type {import('@easyops-cn/docusaurus-search-local')} */
      ({
        // Search bar ko professional banane ke liye settings
        hashed: true,
        highlightSearchTermsOnTargetPage: false,
        explicitSearchResultPath: true,
        language: ["en"],
        docsRouteBasePath: "/docs",
        indexDocs: true,
        indexBlog: false,
        indexPages: false,
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Navbar ka design aur items
      navbar: {
        title: 'Physical AI Textbook', // Top left corner ka naam
        hideOnScroll: true, // Scroll karte waqt navbar chup jayegi (Professional feature)
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'textbookSidebar',
            position: 'left',
            label: 'Textbook Chapters', 
          },
          {
            href: 'https://github.com/iamanum/physical-ai-textbook',
            label: 'Project Archive', // GitHub ka naam change kar ke professional kiya
            position: 'right',
          },
          {
            type: 'search',
            position: 'right',
          },
        ],
      },
      // Footer section jahan aapka copyright aur links hain
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Knowledge Base',
            items: [
              { label: 'Introduction', to: '/docs/introduction' },
              { label: 'Core Foundations', to: '/docs/foundations' },
            ],
          },
          {
            title: 'Institutional Links',
            items: [
              { label: 'Panaversity Official', href: 'https://panaversity.org' },
            ],
          },
          {
            title: 'Connect with Admin',
            items: [
              {
                label: 'Professional LinkedIn',
                href: 'https://www.linkedin.com/in/your-profile', // Isay apna real link se badal dein
              },
              {
                label: 'Research Portfolio',
                href: 'https://github.com/iamanum',
              },
            ],
          },
        ],
        // Niche wala copyright text
        copyright: `Copyright © ${new Date().getFullYear()} Anum Munir - AI Research Portal. Built with Professional Standards.`,
      },
      // Code highlights ke liye dark mode theme
      prism: {
        theme: require('prism-react-renderer/themes/github'),
        darkTheme: require('prism-react-renderer/themes/dracula'),
      },
      // Chatbot ko server se connect karne ka path
      custom: {
        apiUrl: process.env.REACT_APP_API_URL || 'https://physical-ai-textbook-zeta.vercel.app',
      },
    }),
};

module.exports = config;