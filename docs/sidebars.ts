// docs/sidebars.ts

import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    // --- INTRO MODULE ---
    'intro', // intro.md file

    // --- MODULE 1: ROS ---
    {
      type: 'category',
      label: '01: The Robotic Nervous System (ROS 2)',
      collapsible: true,
      items: [
        '01-ROS/01-Intro-Foundations/01-Physical-AI-Principles',
        '01-ROS/01-Intro-Foundations/02-Humanoid-Sensing',
        '01-ROS/02-ROS2-Core/01-Architecture-Concepts',
        '01-ROS/02-ROS2-Core/02-Services-Actions',
        '01-ROS/03-Robot-Modeling/01-URDF-SDF',
        // '01-ROS/03-Robot-Modeling/02-RCLPY-Controllers', // Yeh file abhi likhni hai
      ],
    },

    // --- MODULE 2: SIMULATION ---
    {
        type: 'category',
        label: '02: The Digital Twin (Simulation)',
        collapsible: true,
        items: [
            '02-Simulation/01-Gazebo-Fundamentals/01-Environment-Setup',
            '02-Simulation/01-Gazebo-Fundamentals/02-Physics-Collisions',
            '02-Simulation/02-Advanced-Viz/01-Sensor-Simulation',
            // '02-Simulation/02-Advanced-Viz/02-Unity-Visualization', // Yeh file abhi likhni hai
        ],
    },
    // --- MODULE 3 & 4 (Will be added later) ---
  ],
};

export default sidebars;