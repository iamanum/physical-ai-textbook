# Technical Specification: Physical AI & Humanoid Robotics Textbook

## I. Project Overview
This specification outlines the modular structure and file organization for the "Physical AI & Humanoid Robotics" textbook. The book is divided into four main modules, corresponding to the 12-week course overview, with content structured for Docusaurus/Spec-Kit Plus integration.

## II. Module and File Structure (Weeks 1-12)
All content files are Markdown (`.md`) and follow the strict naming convention: `docs/##-ModuleName/##-ChapterName/##-LessonName.md`.

---

### Module 1: The Robotic Nervous System (ROS 2)
**(Focus: Weeks 1-5)**

| Week | Chapter File Path | Chapter Title |
| :--- | :--- | :--- |
| **Wk 1-2** | `docs/01-ROS/01-Intro-Foundations/01-Physical-AI-Principles.md` | Foundations of Physical AI and Embodied Intelligence |
| **Wk 1-2** | `docs/01-ROS/01-Intro-Foundations/02-Humanoid-Sensing.md` | Sensor Systems: LiDAR, IMUs, and Force/Torque |
| **Wk 3** | `docs/01-ROS/02-ROS2-Core/01-Architecture-Concepts.md` | ROS 2 Architecture and Core Concepts (Nodes, Topics) |
| **Wk 4** | `docs/01-ROS/02-ROS2-Core/02-Services-Actions.md` | ROS 2 Communication: Services and Actions |
| **Wk 5** | `docs/01-ROS/03-Robot-Modeling/01-URDF-SDF.md` | Robot Description Formats (URDF and SDF) |
| **Wk 5** | `docs/01-ROS/03-Robot-Modeling/02-RCLPY-Controllers.md` | Bridging Python Agents to ROS Controllers (rclpy) |

---

### Module 2: The Digital Twin (Gazebo & Unity)
**(Focus: Weeks 6-7)**

| Week | Chapter File Path | Chapter Title |
| :--- | :--- | :--- |
| **Wk 6** | `docs/02-Simulation/01-Gazebo-Fundamentals/01-Environment-Setup.md` | Gazebo Simulation Environment and Physics |
| **Wk 6** | `docs/02-Simulation/01-Gazebo-Fundamentals/02-Physics-Collisions.md` | Simulating Physics, Gravity, and Collisions |
| **Wk 7** | `docs/02-Simulation/02-Advanced-Viz/01-Sensor-Simulation.md` | Simulating Sensors: Depth Cameras and LiDAR Data |
| **Wk 7** | `docs/02-Simulation/02-Advanced-Viz/02-Unity-Visualization.md` | Introduction to Unity for High-Fidelity Robot Visualization |

---

### Module 3: The AI-Robot Brain (NVIDIA Isaac™)
**(Focus: Weeks 8-10)**

| Week | Chapter File Path | Chapter Title |
| :--- | :--- | :--- |
| **Wk 8** | `docs/03-Isaac/01-Isaac-Sim-SDK/01-Isaac-Setup-SDK.md` | NVIDIA Isaac Sim and Photorealistic Simulation |
| **Wk 8** | `docs/03-Isaac/01-Isaac-Sim-SDK/02-Synthetic-Data-Generation.md` | Synthetic Data Generation (SDG) for Perception |
| **Wk 9** | `docs/03-Isaac/02-Perception-Nav/01-Isaac-ROS-VSLAM.md` | Isaac ROS: Hardware-Accelerated VSLAM and Perception |
| **Wk 9-10** | `docs/03-Isaac/02-Perception-Nav/02-Nav2-Bipedal-Planning.md` | Nav2 Stack and Path Planning for Humanoids |
| **Wk 10** | `docs/03-Isaac/03-Control/01-Sim-to-Real-Transfer.md` | Reinforcement Learning and Sim-to-Real Techniques |

---

### Module 4: Vision-Language-Action (VLA)
**(Focus: Weeks 11-13)**

| Week | Chapter File Path | Chapter Title |
| :--- | :--- | :--- |
| **Wk 11** | `docs/04-VLA/01-LLMs-in-Robotics/01-Conversational-AI.md` | LLMs and the Convergence with Robotics |
| **Wk 11** | `docs/04-VLA/01-LLMs-in-Robotics/02-Voice-to-Action.md` | Voice-to-Action: Integrating Whisper for Commands |
| **Wk 12** | `docs/04-VLA/02-Cognitive-Planning/01-Language-to-Action.md` | Cognitive Planning: Translating "Clean the room" into ROS Actions |
| **Wk 12** | `docs/04-VLA/02-Cognitive-Planning/02-HRI-Design.md` | Human-Robot Interaction (HRI) and Safety |
| **Wk 13** | `docs/04-VLA/03-Capstone/01-Autonomous-Humanoid-Project.md` | Capstone Project: Autonomous Humanoid Deployment |

## III. Core Deliverables Integration
The following deliverables must be integrated into the final book architecture:
1.  **Docusaurus Book Structure:** (Completed in Section II)
2.  **RAG Chatbot Endpoint:** Must be hosted via **FastAPI** and utilize **Neon/Qdrant** for vector search against the content paths listed above.
3.  **Agentic Reusability (Bonus):** Claude Subagents/Agent Skills must be developed and demonstrated (e.g., a Skill for auto-generating URDF snippets based on prompts).