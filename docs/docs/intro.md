---
sidebar_position: 1
---

# 🚀 Physical AI Hackathon Project: Textbook Overview

Let's explore the **Physical AI & Humanoid Robotics** textbook modules.

---

## 1. Project Specifications and Blueprint

This project is a **Spec-Driven, AI-Native** textbook built using **Claude Code API** and the **Spec-Kit Plus** methodology.

You can view the detailed architecture and file organization that guided the generation of all content:
* [**View Project SPEC.md on GitHub**](https://github.com/iamanum/physical-ai-textbook/blob/master/SPEC.md)

## 2. Embodied Intelligence Modules (Course Structure)

The course covers four main pillars of Embodied Intelligence:
1. **The Robotic Nervous System** (ROS 2)
2. **The Digital Twin** (Simulation)
3. **The AI-Robot Brain** (NVIDIA Isaac)
4. **Vision-Language-Action** (VLA)

---

## 🤖 Ask the Physical AI Assistant (RAG Chatbot)

Yeh Chatbot aapki kitaab ke content (Modules 1-4) se **Retrieval-Augmented Generation (RAG)** use karke jawab deta hai.

**Features:**
* Answers questions using **only** the indexed content.
* Supports **Selected Text** functionality (try highlighting text on this page and then typing a question).

**Try karain:**
1. "Define Embodied Intelligence based on the textbook."
2. "What are the core components of a ROS 2 Node?"
3. "Explain the difference between a ROS 2 Service and Action."

import RAGChatbot from '@site/src/components/RAGChatbot';

<RAGChatbot />