# 🌌 JAXlaxy 
### *Your compass for the JAX multiverse*

<a href="https://github.com/google/jax">
  <img src="https://raw.githubusercontent.com/google/jax/master/images/jax_logo_250px.png" alt="JAX Logo" align="right" height="120">
</a>

[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/your-username/jaxlaxy/graphs/commit-activity)
[![JAX Version](https://img.shields.io/badge/JAX-2026%20Ready-blueviolet.svg)](https://github.com/google/jax)
[![Awesome](https://awesome.re/badge.svg)](https://awesome.re)

**JAXlaxy** is a curated, opinionated, and constantly updated map of the **JAX** ecosystem. 

In 2026, JAX has evolved from a research curiosity into the backbone of global AI. It powers the world’s largest Foundation Models, real-time physics simulators, and structural biology breakthroughs. While the original DeepMind "JAX Ecosystem" post (2020) is a classic archive, the universe has expanded. **JAXlaxy** filters the noise to show you the brightest stars.

---

## 🛰️ Navigation
* [☀️ Core Systems](#core) - The sun of our universe.
* [🪐 High-Level Frameworks](#frameworks) - Where models are built.
* [🛰️ Utilities & Tools](#utilities) - Essential mission control.
* [🧪 Science & Simulation](#science) - Physics, Bio, and Math.
* [🤖 Reinforcement Learning](#rl) - Agents and Environments.
* [🧭 The Pathfinder](#pathfinder) - What should you choose?
* [⚠️ Legacy Radar](#legacy) - The warning zone.

---

<a name="core" />

## ☀️ The Sun: Core JAX & Compilers
*The foundational technologies that make high-performance computing possible.*

* 🟢 **[JAX](https://github.com/google/jax)**: Autograd and XLA-powered numerical computing. <img src="https://img.shields.io/github/stars/google/jax?style=social" align="center">
* 🟢 **[Pallas](https://jax.readthedocs.io/en/latest/pallas/index.html)**: The standard for writing custom, high-performance GPU/TPU kernels.
* 🟢 **[OpenXLA](https://github.com/openxla/xla)**: The open-source compiler ecosystem for ML. <img src="https://img.shields.io/github/stars/openxla/xla?style=social" align="center">

---

<a name="frameworks" />

## 🪐 The Giants: High-Level Frameworks
*The primary solar systems for building and training neural networks.*

* 🟢 **[Flax (NNX)](https://github.com/google/flax)**: The 2026 standard for Google-scale research. Flexible and production-ready. <img src="https://img.shields.io/github/stars/google/flax?style=social" align="center">
* 🟢 **[Equinox](https://github.com/patrick-kidger/equinox)**: Pure elegance. Everything is a PyTree. The best choice for PyTorch converts. <img src="https://img.shields.io/github/stars/patrick-kidger/equinox?style=social" align="center">
* 🟢 **[MaxText](https://github.com/google/maxtext)**: Google's flagship for training LLMs at massive scale on Cloud TPUs. <img src="https://img.shields.io/github/stars/google/maxtext?style=social" align="center">
* 🟢 **[Penzai](https://github.com/google-deepmind/penzai)**: A toolkit for visualizing, inspecting, and editing models. <img src="https://img.shields.io/github/stars/google-deepmind/penzai?style=social" align="center">

---

<a name="utilities" />

## 🛰️ The Satellites: Crucial Utilities
*The tools that keep your experiments stable and your data moving.*

* 🟢 **[Optax](https://github.com/google-deepmind/optax)**: The undisputed king of gradient processing and optimization. <img src="https://img.shields.io/github/stars/google-deepmind/optax?style=social" align="center">
* 🟢 **[Orbax](https://github.com/google/orbax)**: Modern, multi-host checkpointing and model exporting. <img src="https://img.shields.io/github/stars/google/orbax?style=social" align="center">
* 🟢 **[Grain](https://github.com/google/grain)**: New standard for high-speed, deterministic data loading. <img src="https://img.shields.io/github/stars/google/grain?style=social" align="center">
* 🟡 **[Chex](https://github.com/google-deepmind/chex)**: Essential utilities for testing and debugging JAX code. <img src="https://img.shields.io/github/stars/google-deepmind/chex?style=social" align="center">

---

<a name="science" />

## 🧪 Science & Simulation
*Where JAX meets the real world: Biology, Physics, and Math.*

* 🟢 **[Diffrax](https://github.com/patrick-kidger/diffrax)**: Numerical differential equation solvers in JAX. <img src="https://img.shields.io/github/stars/patrick-kidger/diffrax?style=social" align="center">
* 🟢 **[JAX-MD](https://github.com/google/jax-md)**: Differentiable molecular dynamics at light speed. <img src="https://img.shields.io/github/stars/google/jax-md?style=social" align="center">
* 🟢 **[AlphaFold 3](https://github.com/google-deepmind/alphafold3)**: The state-of-the-art in protein structure prediction. <img src="https://img.shields.io/github/stars/google-deepmind/alphafold3?style=social" align="center">

---

<a name="rl" />

## 🤖 Reinforcement Learning
*Training agents in the most efficient simulators ever built.*

* 🟢 **[Brax](https://github.com/google/brax)**: Massively parallel physics engine for RL. <img src="https://img.shields.io/github/stars/google/brax?style=social" align="center">
* 🟢 **[Jumanji](https://github.com/instadeepai/jumanji)**: A suite of hardware-accelerated RL environments. <img src="https://img.shields.io/github/stars/instadeepai/jumanji?style=social" align="center">
* 🟢 **[RLax](https://github.com/google-deepmind/rlax)**: DeepMind's library for RL agent building blocks. <img src="https://img.shields.io/github/stars/google-deepmind/rlax?style=social" align="center">

---

<a name="pathfinder" />

## 🧭 The Pathfinder: What to use?

| Use Case | Recommended (2026) | Status | Why? |
| :--- | :--- | :--- | :--- |
| **Large Scale LLMs** | [MaxText](https://github.com/google/maxtext) | 🟢 Active | TPU-native, highly optimized. |
| **Scientific Research** | [Equinox](https://github.com/patrick-kidger/equinox) | 🟢 Active | Minimalist, PyTree-based. |
| **Foundation Models** | [Flax NNX](https://github.com/google/flax) | 🟢 Active | Industry standard, massive scale. |
| **Legacy DeepMind** | [Haiku](https://github.com/deepmind/dm-haiku) | 🟡 Stable | Maintenance mode, but rock solid. |

---

<a name="legacy" />

## ⚠️ Legacy Radar (Warning Zone)
*These pioneers were great, but the galaxy has moved on. Use caution.*

* **Trax**: 🛑 Obsolete. Use Flax or MaxText.
* **Haiku**: 🟡 In maintenance mode. DeepMind research is shifting to Flax NNX.
* **Objax**: 🔴 No longer actively developed.

---

## 🛠️ Contributing
The JAX multiverse is expanding! If you see a new star, open an **Issue** or a **PR**. Check out our [CONTRIBUTING.md](CONTRIBUTING.md) for cosmic guidelines.

---
*Maintained with ❤️ by the JAX community. 2026 Edition.*
