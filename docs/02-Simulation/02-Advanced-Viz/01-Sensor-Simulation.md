# 02.03 Simulating Sensors: Depth Cameras and LiDAR Data

## 3.1 The Digital Sensor Pipeline
In simulation (Gazebo or Isaac Sim), physical sensors do not exist. Instead, the physics engine generates **synthetic data** that accurately mimics the output of real-world hardware. This is essential for training perception models without needing a physical robot.

## 3.2 LiDAR Sensor Simulation
LiDAR simulation models the reflection of virtual laser rays against objects in the 3D world.
* **Output:** A **Point Cloud**—a large collection of data points, where each point represents a distance measurement in 3D space.
* **Parameters:** Simulators allow control over parameters like:
    * **Horizontal/Vertical Resolution:** The density of the emitted rays.
    * **Range:** The maximum distance the simulated laser can reach.
    * **Noise:** Adding realistic noise/error to the data to prepare the AI for real-world uncertainty.

## 3.3 Depth Camera Simulation
Depth cameras (like Intel RealSense) are simulated by calculating the distance from the virtual lens to every pixel in the view.
* **Output:** Two fused images: an **RGB Image** (color data) and a **Depth Map** (a grayscale image where pixel intensity represents distance).
* **Use:** This fused data is the primary input for **Visual SLAM (VSLAM)** algorithms (Module 3) and object detection tasks.

## 3.4 Simulating IMUs
The **IMU (Inertial Measurement Unit)** simulation directly reads the robot's state from the physics engine (e.g., its acceleration and angular velocity) and adds calculated **drift and noise** to model real-world sensor imperfections.
* **Importance:** This noise modeling is vital for successful **Sim-to-Real Transfer**.