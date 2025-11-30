# 01.03 ROS 2 Architecture and Core Concepts (Nodes, Topics)

## 3.1 The ROS 2 Ecosystem
**ROS 2 (Robot Operating System 2)** is not an operating system, but a **middleware** framework—a set of libraries and tools for building robot applications. It acts as the "nervous system" for any Physical AI system, managing communication between the robot's brain (AI model) and its body (motors, sensors).

## 3.2 Core Communication Layer: DDS
ROS 2 uses **DDS (Data Distribution Service)** as its underlying transport layer. This allows for reliable, real-time, and distributed communication across multiple computers (e.g., a powerful workstation training the AI, and a Jetson Orin running the robot's motor control).

## 3.3 The Processors: Nodes
A **Node** is essentially a program or process running on the robot. Every piece of logic (sensor reading, motor control, path planning) is encapsulated in a separate Node. This modularity ensures system robustness.
* **Benefit:** If one Node crashes (e.g., the camera processing Node), the rest of the system (e.g., balance control Node) can continue running.

## 3.4 The Data Pipelines: Topics
**Topics** are the main way data moves asynchronously (real-time streaming) through the robot's nervous system.
* **Publisher:** A Node that sends data (e.g., the Camera Node publishes `/image_raw`).
* **Subscriber:** A Node that receives data (e.g., the Computer Vision Node subscribes to `/image_raw`).
* **Mechanism:** Data messages are continuously streamed without confirmation from the receiver (**one-way, many-to-many communication**).

| Component | Function | Analogy to the Human Body |
| :--- | :--- | :--- |
| **Node** | An independent program or process. | The visual cortex, or the motor control center. |
| **Topic** | Real-time stream of data. | The optic nerve sending signals from the eye to the brain. |
| **Message** | A chunk of data (e.g., an image, a sensor reading). | A single electrical impulse containing visual information. |