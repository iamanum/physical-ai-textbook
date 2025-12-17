// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  textbookSidebar: [
    {
      type: 'category',
      label: 'Getting Started',
      items: [
        'introduction',
      ],
      link: {
        type: 'doc',
        id: 'introduction',
      },
    },
    {
      type: 'category',
      label: 'Fundamentals',
      items: [
        'foundations',
      ],
    },
    {
      type: 'category',
      label: 'Locomotion Systems',
      items: [
        'locomotion',
      ],
    },
    {
      type: 'category',
      label: 'Manipulation Systems',
      items: [
        'manipulation',
      ],
    },
    {
      type: 'category',
      label: 'Human-Robot Interaction',
      items: [
        'hri',
      ],
    },
  ],
};

module.exports = sidebars;