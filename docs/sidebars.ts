// docs/sidebars.ts (Final Corrected Paths - Match Generated IDs)

import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    // FIX: Default intro file ka ID
    'intro', 

    // --- MODULE 1: ROS ---
    {
      type: 'category',
      label: '01: The Robotic Nervous System (ROS 2)',
      collapsible: true,
      items: [
        // FIX: IDs ko generated IDs se match karein (numerical prefixes aur 'docs/docs/' hata dein)
        'ROS/Intro-Foundations/Physical-AI-Principles', 
        'ROS/Intro-Foundations/Humanoid-Sensing',
        'ROS/ROS2-Core/Architecture-Concepts',
        'ROS/ROS2-Core/Services-Actions',
        'ROS/Robot-Modeling/URDF-SDF',
      ],
    },

    // --- MODULE 2: SIMULATION ---
    {
        type: 'category',
        label: '02: The Digital Twin (Simulation)',
        collapsible: true,
        items: [
            // FIX: IDs ko generated IDs se match karein
            'Simulation/Gazebo-Fundamentals/Environment-Setup',
            'Simulation/Gazebo-Fundamentals/Physics-Collisions', 
            'Simulation/Advanced-Viz/Sensor-Simulation',
        ],
    },
  ],
};

export default sidebars;