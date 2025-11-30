# 01.04 ROS 2 Communication: Services and Actions

## 4.1 Synchronous Communication: Services
While **Topics** are asynchronous data streams, **Services** are used for direct, **synchronous Request-Response** communication.
* **Client:** Sends a request (e.g., "Tell me the robot's battery level").
* **Server:** Processes the request and sends a single, confirmed response (e.g., "Battery is 95%").
* **Use Case:** Configuration changes, status checks, or triggering a single, quick command. The client waits for the response before proceeding.

## 4.2 Asynchronous Tasks: Actions
**Actions** are designed for long-running, preemptible tasks. They are an upgrade from Services, as they provide continuous feedback and allow the task to be cancelled.
* **Goal:** The Client sends a Goal (e.g., "Walk 5 meters forward").
* **Feedback:** The Server continuously sends Feedback (e.g., "Progress: 2 meters remaining, tilt angle 5 degrees").
* **Result:** The Server sends a final Result upon completion (e.g., "Goal complete. Distance traveled: 5.1 meters").
* **Use Case:** Navigation, complex manipulation (like grasping an object), or any long-duration bipedal movement.

## 4.3 Summary of Communication Types

| Type | Communication Pattern | Timing | Use Case |
| :--- | :--- | :--- | :--- |
| **Topic** | One-way stream (Pub/Sub) | Asynchronous (Real-time) | Sensor fusion, motor telemetry |
| **Service** | Request/Response | Synchronous (Blocking) | Querying status, basic configuration change |
| **Action** | Goal/Feedback/Result | Asynchronous (Preemptible) | Navigation, long-distance walking |