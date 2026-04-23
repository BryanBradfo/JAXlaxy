# 🚀 Contributing to JAXlaxy

First of all, thank you for considering contributing to **JAXlaxy**! 🌌 

The JAX ecosystem is expanding faster than we can track alone. Whether you found a new high-performance library, noticed a repo has gone "dark" (Legacy), or want to improve our documentation, your help is vital to keep this map accurate for the community.

---

## 🛰️ How Can You Help?

We are looking for contributions in the following areas:

1.  **New Discoveries:** Adding new JAX-native libraries or research projects.
2.  **Status Updates:** Moving libraries to the "Legacy Radar" if they are no longer maintained.
3.  **Refinement:** Improving descriptions to make them more "choice-oriented" (helping users choose the right tool).
4.  **Automation:** Helping us build scripts to keep the "Galaxy" updated automatically.

---

## 🔭 Submission Guidelines

To keep the quality of the galaxy high, please ensure your suggestions meet these criteria:

* **JAX-Centric:** The project must be built on JAX or significantly extend its capabilities.
* **Quality Descriptions:** Don't just copy the repo's tagline. Tell us *why* someone should use it in 2026.
* **Health Check:** Assign a status to your submission:
    * 🟢 **Active:** Frequent commits, 2026-ready.
    * 🟡 **Stable:** Feature-complete, low activity but perfectly functional.
    * 🔴 **Legacy:** No longer recommended for new projects (archived or superseded).

---

## 🛠️ The Contribution Process

### 1. Open an Issue or PR
* For **small changes** (typos, broken links): Open a Pull Request directly.
* For **new libraries**: Open an Issue first so we can discuss which **Stellar System** it belongs to. The current systems are:
    1. ☀️ **The Sun** — Core & Kernels
    2. 🪐 **The Giants** — Neural Network Frameworks
    3. 🛰️ **The Satellites** — Training Infrastructure
    4. 🌌 **Constellations** — LLM & Foundation-Model Training
    5. 🧪 **Scientific Computing & Simulation** (with Life Sciences / Solvers / Physics / Cosmology / Imaging sub-bullets)
    6. 📊 **Probabilistic Programming**
    7. 🤖 **Reinforcement Learning & Evolution**
    8. 🔭 **Domain Libraries** — Graphs / Vision / Brain Dynamics / Specialty
    9. 🛸 **Onramps** — canonical reference implementations
    10. ⚠️ **Legacy Radar** — superseded / dormant libraries

### 2. Formatting your Entry
Every library entry must follow this exact format:

```markdown
* 🟢 **[Library Name](https://github.com/USER/REPO)**: One-sentence sharp value proposition. <img src="https://img.shields.io/github/stars/USER/REPO?style=social" align="center">
```

Rules:
* Pick a status: 🟢 Active · 🟡 Stable · 🔴 Legacy.
* One sentence. Tell us **why** a 2026 user would reach for it, not what its README says.
* Include the dynamic stars badge so readers can gauge adoption at a glance.
* If it's a DeepMind / Google / DeepMind-InstaDeep / Stanford project, work that attribution into the sentence.

### 3. Commit Messages
Be clear and concise.
* `feat: add Diffrax to Scientific Computing`
* `fix: update broken link for Orbax`
* `refactor: move Haiku to legacy radar`
* `chore: run health_check.py and downgrade stale entries`

### 4. Health Check Script
Before opening a PR that adds or updates many entries, run:

```bash
python scripts/health_check.py
```

It fetches the last-commit date and star count for every linked repository and flags any entry whose status badge looks out of date (e.g. a 🟢 whose repo hasn't seen a commit in 18+ months). Reconcile flagged entries before submitting.

---

## 📜 Code of Conduct
By participating in this project, you agree to maintain a respectful, inclusive, and collaborative environment. We are all here to learn and build the future of AI together.

---

## 🎨 Design & Visuals
If you are a wizard with **Mermaid.js** or **SVG**, we are always looking for better ways to visualize the "JAX Multiverse" map in the README!

**Thank you for helping us map the stars! 🚀**
