# 01.05 Robot Description Formats (URDF and SDF)

## 5.1 The Robot Blueprint
In robotics, every physical characteristic of a robot (its shape, size, weight, joints, and sensors) must be mathematically defined so that simulation environments (like Gazebo) and control software (like ROS 2) can interact with it correctly. This blueprint is created using description formats.

### A. URDF (Unified Robot Description Format)
URDF is the original XML-based standard primarily used by ROS for describing robot kinematics (structure and movement limits).
* **Focus:** **Structure (links)** and **Kinematics (joints)**.
* **Limitation:** It cannot fully define physics properties (like friction and gravity interaction) or complex environments. It is best used for the robot's mobile base and arm structure.

### B. SDF (Simulation Description Format)
SDF is used by Gazebo and other modern simulators (like NVIDIA Isaac Sim) for describing the **full world environment** and detailed **physics properties**.
* **Focus:** **Dynamics (mass, inertia, friction)**, environment objects, lights, and complex sensor plugins.
* **Benefit:** SDF can embed URDF, meaning you can define the robot structure using URDF, and then add detailed simulation properties using SDF.

## 5.2 Key Elements of a Robot Model

| Element | Description | Format Focus |
| :--- | :--- | :--- |
| **Link** | A rigid part of the robot (e.g., the torso, a foot, the camera body). | URDF/SDF |
| **Joint** | Defines the connection between two links and specifies the type of movement (e.g., revolute, fixed, prismatic). | URDF/SDF |
| **Inertial** | The mass and moment of inertia of a link. Crucial for realistic physics simulation. | SDF (Best Practice) |

> **Best Practice:** Always define the robot in URDF for ROS compatibility, then embed this URDF into an SDF file for simulation fidelity in Gazebo or Isaac Sim.