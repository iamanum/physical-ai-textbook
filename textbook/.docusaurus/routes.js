import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/physical-ai-textbook/__docusaurus/debug',
    component: ComponentCreator('/physical-ai-textbook/__docusaurus/debug', '8bc'),
    exact: true
  },
  {
    path: '/physical-ai-textbook/__docusaurus/debug/config',
    component: ComponentCreator('/physical-ai-textbook/__docusaurus/debug/config', 'ad1'),
    exact: true
  },
  {
    path: '/physical-ai-textbook/__docusaurus/debug/content',
    component: ComponentCreator('/physical-ai-textbook/__docusaurus/debug/content', '29c'),
    exact: true
  },
  {
    path: '/physical-ai-textbook/__docusaurus/debug/globalData',
    component: ComponentCreator('/physical-ai-textbook/__docusaurus/debug/globalData', '3a7'),
    exact: true
  },
  {
    path: '/physical-ai-textbook/__docusaurus/debug/metadata',
    component: ComponentCreator('/physical-ai-textbook/__docusaurus/debug/metadata', '868'),
    exact: true
  },
  {
    path: '/physical-ai-textbook/__docusaurus/debug/registry',
    component: ComponentCreator('/physical-ai-textbook/__docusaurus/debug/registry', 'b51'),
    exact: true
  },
  {
    path: '/physical-ai-textbook/__docusaurus/debug/routes',
    component: ComponentCreator('/physical-ai-textbook/__docusaurus/debug/routes', '6ce'),
    exact: true
  },
  {
    path: '/physical-ai-textbook/search',
    component: ComponentCreator('/physical-ai-textbook/search', 'd5c'),
    exact: true
  },
  {
    path: '/physical-ai-textbook/search',
    component: ComponentCreator('/physical-ai-textbook/search', '9b4'),
    exact: true
  },
  {
    path: '/physical-ai-textbook/docs',
    component: ComponentCreator('/physical-ai-textbook/docs', '7f2'),
    routes: [
      {
        path: '/physical-ai-textbook/docs/foundations',
        component: ComponentCreator('/physical-ai-textbook/docs/foundations', '5f6'),
        exact: true,
        sidebar: "textbookSidebar"
      },
      {
        path: '/physical-ai-textbook/docs/hri',
        component: ComponentCreator('/physical-ai-textbook/docs/hri', '616'),
        exact: true,
        sidebar: "textbookSidebar"
      },
      {
        path: '/physical-ai-textbook/docs/introduction',
        component: ComponentCreator('/physical-ai-textbook/docs/introduction', '6b1'),
        exact: true,
        sidebar: "textbookSidebar"
      },
      {
        path: '/physical-ai-textbook/docs/locomotion',
        component: ComponentCreator('/physical-ai-textbook/docs/locomotion', '886'),
        exact: true,
        sidebar: "textbookSidebar"
      },
      {
        path: '/physical-ai-textbook/docs/manipulation',
        component: ComponentCreator('/physical-ai-textbook/docs/manipulation', '720'),
        exact: true,
        sidebar: "textbookSidebar"
      }
    ]
  },
  {
    path: '/physical-ai-textbook/',
    component: ComponentCreator('/physical-ai-textbook/', '85f'),
    exact: true
  },
  {
    path: '/physical-ai-textbook/',
    component: ComponentCreator('/physical-ai-textbook/', '31b'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
