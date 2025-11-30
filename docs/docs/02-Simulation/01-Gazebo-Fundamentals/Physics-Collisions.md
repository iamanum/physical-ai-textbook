# 02.02 Simulating Physics, Gravity, and Collisions

## 2.1 The Physics Engine
Every simulation environment, including **Gazebo** and **NVIDIA Isaac Sim**, relies on a specialized **physics engine** (e.g., ODE, PhysX) to accurately model how objects behave under physical laws. This engine solves complex dynamics equations, calculating velocity, acceleration, and forces in real-time.

## 2.2 Critical Parameters for Realism
To ensure **Sim-to-Real** transfer works—meaning the robot learns realistically in simulation—the physics parameters must be tuned correctly.

### A. Gravity
The standard gravity vector is `$\vec{g} = (0, 0, -9.81) \text{ m/s}^2$` (for the Z-axis down). // **FINAL FIX: Inline Code Block use kiya**

### B. Inertia and Mass
The robot's links must have accurate **mass** and **moment of inertia** defined in the URDF/SDF. If the mass or inertia tensor is incorrect, the robot's balance control (Module 4) will fail in both simulation and reality.

### C. Friction and Restitution
* **Friction:** The force resisting motion between surfaces (e.g., a robot's foot sliding on the floor). This coefficient ($\mu$) is often tuned empirically.
* **Restitution (Bounciness):** How much kinetic energy is conserved during a collision (e.g., how high a dropped ball bounces). For humanoids, low restitution (non-bouncy, close to 0) is typically required to avoid unwanted bouncing during foot contact.

## 2.3 Collision vs. Visual Geometry
In simulation, objects have two distinct geometries:
1.  **Visual Geometry:** The aesthetically detailed model (e.g., high-poly mesh) that the human viewer sees.
2.  **Collision Geometry:** A simplified, often low-poly shape (e.g., primitive boxes or cylinders) used by the physics engine for faster, more stable calculations. 
* **Expert Tip:** Using simplified collision geometry is essential for running **real-time physics** required for bipedal locomotion.