# 02.01 Gazebo Simulation Environment and Physics

## 1.1 The Role of Simulation in Physical AI
Simulation environments, often called **Digital Twins**, are critical for developing Physical AI and Humanoid Robotics. They provide a safe, repeatable, and cost-effective platform to test complex algorithms before deploying them to expensive real-world hardware.

## 1.2 Introduction to Gazebo
**Gazebo** is the most widely used, open-source 3D physics simulator for ROS (Robot Operating System). It provides accurate modeling of:
* **Rigid Body Dynamics:** How physical objects move and interact.
* **Sensors:** Generating realistic data streams for cameras, LiDAR, and IMUs.
* **Environments:** Defining terrain, lighting, and material properties.

## 1.3 World Definition: SDF (Simulation Description Format)
While robots are often described using URDF (as discussed in Module 1), the **Gazebo world** and its objects are defined using **SDF (Simulation Description Format)**.
* **SDF's Focus:** It describes everything external to the robot: the ground plane, walls, furniture, gravity vector, and lighting conditions.

## 1.4 Setting up the Gazebo Environment
To launch a simulation:
1. **Define the World:** Create an `.sdf` file specifying the gravity, materials, and static objects.
2. **Define the Robot:** Use the robot's existing `.urdf` file (or embed the URDF within an SDF file).
3. **Launch the Simulation:** Use a ROS 2 launch file (`.launch.py` or `.launch.xml`) to start the Gazebo server and load the world and robot models simultaneously.