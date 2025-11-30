# 01.02 Sensor Systems: LiDAR, IMUs, and Force/Torque

## 2.1 The Need for Physical Perception
In Physical AI, sensors are the robot's eyes, ears, and sense of touch. They transform **physical data** into **digital signals** that the ROS 2 system (Module 1) and the AI Brain (Module 3) can process.

## 2.2 Key Sensor Modalities

### A. LiDAR (Light Detection and Ranging)
LiDAR is crucial for creating a **3D map** of the environment.
* **Function:** Emits pulsed laser light and measures the time-of-flight (ToF) for the light to return.
* **Use in Humanoids:** Provides **long-range obstacle detection** and **localization** (where the robot is in the world).

### B. Depth Cameras (e.g., Intel RealSense)
These cameras provide RGB (color) and accurate depth (distance) data simultaneously.
* **Function:** Projects a pattern (IR dots) onto the scene and calculates depth by analyzing the pattern's distortion.
* **Use in Humanoids:** Essential for **object recognition** (Computer Vision) and **manipulation/grasping**.

### C. IMUs (Inertial Measurement Units)
IMUs measure the robot's **orientation and acceleration** in space.
* **Components:** Accelerometers (measures linear acceleration), Gyroscopes (measures angular velocity), and Magnetometers (measures heading).
* **Use in Humanoids:** Critical for **bipedal balance control** and **VSLAM** (Visual SLAM, Module 3). They determine if the robot is tilting or falling.

### D. Force/Torque Sensors
These sensors measure the external **forces and torques** applied to the robot's body, usually at the wrists or ankles.
* **Use in Humanoids:** Vital for **stable walking/gait control** (determining weight shift) and **safe physical interaction** (e.g., how hard it pushes against an object).