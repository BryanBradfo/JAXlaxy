# 🌌 JAXlaxy
### *Your compass for the JAX multiverse*

<a href="https://github.com/jax-ml/jax">
  <img src="https://raw.githubusercontent.com/google/jax/master/images/jax_logo_250px.png" alt="JAX Logo" align="right" height="120">
</a>

[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/BryanBradfo/JAXlaxy/graphs/commit-activity)
[![JAX Version](https://img.shields.io/badge/JAX-2026%20Ready-blueviolet.svg)](https://github.com/jax-ml/jax)
[![Awesome](https://awesome.re/badge.svg)](https://awesome.re)

**JAXlaxy** is a curated, opinionated, and constantly updated map of the **JAX** ecosystem.

In 2026, JAX has evolved from a research curiosity into the backbone of global AI. It powers the world's largest Foundation Models, real-time physics simulators, and structural biology breakthroughs. While the original DeepMind "JAX Ecosystem" post (2020) is a classic archive, the universe has expanded. **JAXlaxy** filters the noise to show you the brightest stars.

Every entry ships with a **health indicator** — 🟢 Active · 🟡 Stable · 🔴 Legacy — so you can tell at a glance whether a library is the right launchpad in 2026 or a relic better admired than flown.

---

## 🛰️ Navigation

* [☀️ The Sun — Core & Kernels](#core)
* [🪐 The Giants — Neural Network Frameworks](#frameworks)
* [🛰️ The Satellites — Training Infrastructure](#satellites)
* [🌌 Constellations — LLM & Foundation-Model Training](#constellations)
* [🧪 Scientific Computing & Simulation](#science)
* [📊 Probabilistic Programming](#probabilistic)
* [🤖 Reinforcement Learning & Evolution](#rl)
* [🔭 Domain Libraries — Graphs, Vision, Brain Dynamics](#domain)
* [🧭 The Pathfinder — What should you choose?](#pathfinder)
* [🛸 Onramps — Reference Implementations](#onramps)
* [⚠️ Legacy Radar — The warning zone](#legacy)

---

<a name="core" />

## ☀️ The Sun: Core & Kernels

*The foundational technologies that make high-performance JAX computing possible. If your stack has JAX, it has these.*

* 🟢 **[JAX](https://github.com/jax-ml/jax)**: Autograd and XLA-powered numerical computing — the sun of our universe. <img src="https://img.shields.io/github/stars/jax-ml/jax?style=social" align="center">
* 🟢 **[Pallas](https://jax.readthedocs.io/en/latest/pallas/index.html)**: JAX-native kernel authoring language for writing custom TPU/GPU kernels without leaving Python.
* 🟢 **[OpenXLA](https://github.com/openxla/xla)**: The open-source compiler that turns your JAX program into blazing accelerator code. <img src="https://img.shields.io/github/stars/openxla/xla?style=social" align="center">
* 🟢 **[torchax](https://github.com/google/torchax)**: Run PyTorch model code directly on JAX — the bridge for teams migrating in from the PyTorch universe. <img src="https://img.shields.io/github/stars/google/torchax?style=social" align="center">

---

<a name="frameworks" />

## 🪐 The Giants: Neural Network Frameworks

*The primary solar systems for building and training neural networks in JAX.*

* 🟢 **[Flax (NNX)](https://github.com/google/flax)**: The 2026 standard for DeepMind and Google-scale research. NNX brings ergonomic object-oriented state on top of JAX's functional core. <img src="https://img.shields.io/github/stars/google/flax?style=social" align="center">
* 🟢 **[Equinox](https://github.com/patrick-kidger/equinox)**: Everything is a PyTree. Minimal magic, maximum transparency — the default pick for scientific ML and PyTorch converts. <img src="https://img.shields.io/github/stars/patrick-kidger/equinox?style=social" align="center">
* 🟢 **[Penzai](https://github.com/google-deepmind/penzai)**: DeepMind's toolkit for legible, introspectable, surgically-editable neural networks — the interpretability researcher's first choice. <img src="https://img.shields.io/github/stars/google-deepmind/penzai?style=social" align="center">

> 💡 **Pragmatic multi-framework options.** Teams already invested in the Keras or HuggingFace ecosystem can use **[Keras 3](https://github.com/keras-team/keras)** with its JAX backend or **[HuggingFace Transformers](https://github.com/huggingface/transformers)** Flax models — not JAX-native in design, but battle-tested bridges for real production stacks.

---

<a name="satellites" />

## 🛰️ The Satellites: Training Infrastructure

*The utilities that keep your training loop stable, your weights safe, and your data moving at TPU speed.*

* 🟢 **[Optax](https://github.com/google-deepmind/optax)**: The undisputed king of gradient processing — composable optimizer transforms used in every serious JAX training loop. <img src="https://img.shields.io/github/stars/google-deepmind/optax?style=social" align="center">
* 🟢 **[Orbax](https://github.com/google/orbax)**: The 2026 standard for multi-host checkpointing, model exporting, and resumable training at scale. <img src="https://img.shields.io/github/stars/google/orbax?style=social" align="center">
* 🟢 **[Grain](https://github.com/google/grain)**: Deterministic, JAX-native high-throughput data loading — the TPU-era replacement for `tf.data`. <img src="https://img.shields.io/github/stars/google/grain?style=social" align="center">
* 🟢 **[Chex](https://github.com/google-deepmind/chex)**: DeepMind's assertions and testing toolkit for writing JAX code you can actually trust. <img src="https://img.shields.io/github/stars/google-deepmind/chex?style=social" align="center">
* 🟢 **[jaxtyping](https://github.com/patrick-kidger/jaxtyping)**: Shape-and-dtype-aware type hints that catch bugs *before* the first JIT compile. <img src="https://img.shields.io/github/stars/patrick-kidger/jaxtyping?style=social" align="center">
* 🟡 **[safejax](https://github.com/alvarobartt/safejax)**: Serialize Flax / Haiku / Equinox parameters via `safetensors` — safer than pickling, portable across frameworks. <img src="https://img.shields.io/github/stars/alvarobartt/safejax?style=social" align="center">
* 🟢 **[jax-tqdm](https://github.com/jeremiecoullon/jax-tqdm)**: Add a real progress bar to JIT-compiled `jax.lax.scan` and training loops — one decorator, zero friction. <img src="https://img.shields.io/github/stars/jeremiecoullon/jax-tqdm?style=social" align="center">
* 🟢 **[JAX Toolbox](https://github.com/NVIDIA/JAX-Toolbox)**: NVIDIA's nightly CI and optimized container images for running JAX workloads on H100/B200 GPUs. <img src="https://img.shields.io/github/stars/NVIDIA/JAX-Toolbox?style=social" align="center">
* 🟡 **[mpi4jax](https://github.com/PhilipVinc/mpi4jax)**: Zero-copy MPI collectives inside JIT-compiled JAX code — the bridge for classical HPC clusters. <img src="https://img.shields.io/github/stars/PhilipVinc/mpi4jax?style=social" align="center">

---

<a name="constellations" />

## 🌌 Constellations: LLM & Foundation-Model Training

*Large-scale training stacks. Pick by workload scale and how much of the stack you want to own.*

* 🟢 **[MaxText](https://github.com/AI-Hypercomputer/maxtext)**: Google's flagship pure-JAX LLM reference — scales from single-TPU to multi-pod without leaving Python. <img src="https://img.shields.io/github/stars/AI-Hypercomputer/maxtext?style=social" align="center">
* 🟢 **[Tunix](https://github.com/google/tunix)**: Google's post-training toolkit on JAX — SFT, RLHF (PPO/GRPO/DAPO), and agentic RL with tool use, built on Flax NNX. <img src="https://img.shields.io/github/stars/google/tunix?style=social" align="center">
* 🟢 **[Levanter](https://github.com/stanford-crfm/levanter)**: Stanford CRFM's scalable, reproducible foundation-model trainer with named tensors and bit-level determinism. <img src="https://img.shields.io/github/stars/stanford-crfm/levanter?style=social" align="center">
* 🟢 **[EasyDeL](https://github.com/erfanzar/EasyDeL)**: Opinionated training *and* serving for Llama/Mixtral/Falcon/Qwen families in JAX — ergonomics-first. <img src="https://img.shields.io/github/stars/erfanzar/EasyDeL?style=social" align="center">
* 🟢 **[kvax](https://github.com/nebius/kvax)**: A production-grade FlashAttention implementation for JAX with document-mask and context-parallel support. <img src="https://img.shields.io/github/stars/nebius/kvax?style=social" align="center">
* 🟡 **[Lorax](https://github.com/davisyoshida/lorax)**: Automatic LoRA injection for any JAX model (Flax, Haiku, Equinox) — one line to fine-tune at a fraction of the memory. <img src="https://img.shields.io/github/stars/davisyoshida/lorax?style=social" align="center">
* 🟢 **[FlaxDiff](https://github.com/AshishKumar4/FlaxDiff)**: Multi-node, multi-device diffusion model training on TPUs — the LLM world has a sibling. <img src="https://img.shields.io/github/stars/AshishKumar4/FlaxDiff?style=social" align="center">
* 🟡 **[EasyLM](https://github.com/young-geng/EasyLM)**: Pre-train, fine-tune, evaluate and serve LLMs in JAX/Flax — the original reference used in several early open models; stable but slower-moving. <img src="https://img.shields.io/github/stars/young-geng/EasyLM?style=social" align="center">

---

<a name="science" />

## 🧪 Scientific Computing & Simulation

*Where JAX truly outshines PyTorch: differentiable physics, biology, cosmology, and inverse problems.*

### 🧬 Life Sciences

* 🟢 **[AlphaFold 3](https://github.com/google-deepmind/alphafold3)**: DeepMind's state-of-the-art predictor for protein, nucleic-acid and ligand structure. *Weights gated; non-commercial research license.* <img src="https://img.shields.io/github/stars/google-deepmind/alphafold3?style=social" align="center">
* 🟡 **[jax-unirep](https://github.com/ElArkk/jax-unirep)**: Fast UniRep protein-embedding models — the pragmatic starting point for sequence-level protein ML. <img src="https://img.shields.io/github/stars/ElArkk/jax-unirep?style=social" align="center">

### ➗ Differentiable Solvers & Optimization

* 🟢 **[Diffrax](https://github.com/patrick-kidger/diffrax)**: Numerical ODE / SDE / CDE solvers in JAX — the canonical answer for Neural ODEs and continuous-time models. <img src="https://img.shields.io/github/stars/patrick-kidger/diffrax?style=social" align="center">
* 🟢 **[Optimistix](https://github.com/patrick-kidger/optimistix)**: Root-finding, minimization, fixed-points and nonlinear least-squares — the "SciPy optimize" of JAX. <img src="https://img.shields.io/github/stars/patrick-kidger/optimistix?style=social" align="center">
* 🟢 **[JAXopt](https://github.com/google/jaxopt)**: Hardware-accelerated, batchable, differentiable optimizers — great for bi-level and implicit-differentiation problems. <img src="https://img.shields.io/github/stars/google/jaxopt?style=social" align="center">

### ⚛️ Physics & Molecular Dynamics

* 🟢 **[Brax](https://github.com/google/brax)**: Massively parallel differentiable rigid-body physics — training humanoid policies on a single GPU in minutes. <img src="https://img.shields.io/github/stars/google/brax?style=social" align="center">
* 🟢 **[JAX-MD](https://github.com/jax-md/jax-md)**: Differentiable molecular dynamics at accelerator speed — end-to-end backprop through an MD trajectory. <img src="https://img.shields.io/github/stars/jax-md/jax-md?style=social" align="center">
* 🟢 **[dynamiqs](https://github.com/dynamiqs/dynamiqs)**: High-performance, differentiable simulation of open and closed quantum systems in JAX. <img src="https://img.shields.io/github/stars/dynamiqs/dynamiqs?style=social" align="center">
* 🟢 **[XLB](https://github.com/Autodesk/XLB)**: Autodesk's differentiable, massively parallel Lattice-Boltzmann fluid solver for ML-in-the-loop CFD. <img src="https://img.shields.io/github/stars/Autodesk/XLB?style=social" align="center">
* 🟢 **[FDTDX](https://github.com/ymahlau/fdtdx)**: Finite-Difference Time-Domain electromagnetic simulation in JAX — design photonic devices with autograd. <img src="https://img.shields.io/github/stars/ymahlau/fdtdx?style=social" align="center">
* 🟢 **[JaxDF](https://github.com/ucl-bug/jaxdf)**: Write differentiable PDE simulators with arbitrary discretizations — the building block for inverse-problem science. <img src="https://img.shields.io/github/stars/ucl-bug/jaxdf?style=social" align="center">
* 🟢 **[JAX-in-Cell](https://github.com/uwplasma/JAX-in-Cell)**: Self-consistent particle-in-cell plasma simulations — classical HPC physics meets JAX autodiff. <img src="https://img.shields.io/github/stars/uwplasma/JAX-in-Cell?style=social" align="center">
* 🟡 **[foragax](https://github.com/i-m-iron-man/Foragax)**: Agent-based modelling framework in JAX — fast, vectorized, auto-differentiable social and ecological sims. <img src="https://img.shields.io/github/stars/i-m-iron-man/Foragax?style=social" align="center">

### 🔭 Cosmology & Astrophysics

* 🟢 **[jax-cosmo](https://github.com/DifferentiableUniverseInitiative/jax_cosmo)**: Differentiable cosmology — end-to-end gradients through large-scale-structure likelihoods. <img src="https://img.shields.io/github/stars/DifferentiableUniverseInitiative/jax_cosmo?style=social" align="center">
* 🟢 **[astronomix](https://github.com/leo1200/astronomix)**: Differentiable (magneto)hydrodynamics for astrophysics — simulate galaxy-scale flows with autograd. <img src="https://img.shields.io/github/stars/leo1200/astronomix?style=social" align="center">
* 🟡 **[exojax](https://github.com/HajimeKawahara/exojax)**: Automatically differentiable spectrum modelling of exoplanets and brown dwarfs. <img src="https://img.shields.io/github/stars/HajimeKawahara/exojax?style=social" align="center">

### 📡 Imaging, Signals & Tomography

* 🟢 **[jwave](https://github.com/ucl-bug/jwave)**: Differentiable acoustic wave simulation — for medical-imaging and photoacoustic inverse problems. <img src="https://img.shields.io/github/stars/ucl-bug/jwave?style=social" align="center">
* 🟢 **[SCICO](https://github.com/lanl/scico)**: Los Alamos' scientific computational imaging — plug-and-play priors and inverse problems in JAX. <img src="https://img.shields.io/github/stars/lanl/scico?style=social" align="center">
* 🟢 **[MBIRJAX](https://github.com/cabouman/mbirjax)**: High-performance tomographic reconstruction — CT and 3D imaging with modern regularizers. <img src="https://img.shields.io/github/stars/cabouman/mbirjax?style=social" align="center">
* 🟢 **[DiffeRT](https://github.com/jeertmans/DiffeRT)**: Differentiable ray tracing for radio propagation — wireless-channel modelling with gradients. <img src="https://img.shields.io/github/stars/jeertmans/DiffeRT?style=social" align="center">
* 🟢 **[tmmax](https://github.com/bahremsd/tmmax)**: Vectorized transfer-matrix method for thin-film optics — the Swiss Army knife for photonic stacks. <img src="https://img.shields.io/github/stars/bahremsd/tmmax?style=social" align="center">
* 🟢 **[vivsim](https://github.com/haimingz/vivsim)**: Fluid-structure interaction via the Immersed-Boundary Lattice-Boltzmann method — engineering-grade FSI with autograd. <img src="https://img.shields.io/github/stars/haimingz/vivsim?style=social" align="center">

---

<a name="probabilistic" />

## 📊 Probabilistic Programming

*Bayesian inference, sampling, and uncertainty — JAX's vectorized scans make MCMC fly.*

* 🟢 **[NumPyro](https://github.com/pyro-ppl/numpyro)**: The mainstream full-DSL probabilistic programming language — Pyro semantics on a JAX engine. <img src="https://img.shields.io/github/stars/pyro-ppl/numpyro?style=social" align="center">
* 🟢 **[BlackJAX](https://github.com/blackjax-devs/blackjax)**: Composable samplers — NUTS, HMC, SMC, VI — with no DSL lock-in. Bring your own log-density. <img src="https://img.shields.io/github/stars/blackjax-devs/blackjax?style=social" align="center">
* 🟢 **[Distrax](https://github.com/google-deepmind/distrax)**: DeepMind's lightweight distributions and bijectors library — a pragmatic alternative to TFP when you want minimum dependencies. <img src="https://img.shields.io/github/stars/google-deepmind/distrax?style=social" align="center">
* 🟢 **[Dynamax](https://github.com/probml/dynamax)**: Probabilistic state-space models — HMMs, LGSSMs, nonlinear filters — with Kevin Murphy's seal of approval. <img src="https://img.shields.io/github/stars/probml/dynamax?style=social" align="center">
* 🟢 **[GPJax](https://github.com/JaxGaussianProcesses/GPJax)**: Gaussian Processes in JAX — a didactic, extensible framework for kernel machines. <img src="https://img.shields.io/github/stars/JaxGaussianProcesses/GPJax?style=social" align="center">
* 🟢 **[tinygp](https://github.com/dfm/tinygp)**: The *tiniest* GP library — fast, elegant, and built for astronomers by Dan Foreman-Mackey. <img src="https://img.shields.io/github/stars/dfm/tinygp?style=social" align="center">
* 🟢 **[flowjax](https://github.com/danielward27/flowjax)**: Normalizing flows built as Equinox modules — density estimation with a clean PyTree interface. <img src="https://img.shields.io/github/stars/danielward27/flowjax?style=social" align="center">
* 🟢 **[bayex](https://github.com/alonfnt/bayex)**: Bayesian optimization powered by JAX — hyperparameter tuning that runs *inside* your training job. <img src="https://img.shields.io/github/stars/alonfnt/bayex?style=social" align="center">
* 🟡 **[Oryx](https://github.com/tensorflow/probability/tree/master/spinoffs/oryx)**: Probabilistic programming via program transformations — inside TensorFlow Probability, niche but powerful for researchers.

> 💡 Also worth knowing: **[`tfp.substrates.jax`](https://www.tensorflow.org/probability/examples/TensorFlow_Probability_on_JAX)** — TensorFlow Probability's distributions, MCMC, and VI running on a pure JAX substrate.

---

<a name="rl" />

## 🤖 Reinforcement Learning & Evolution

*End-to-end JIT'd training loops and hardware-accelerated environments — the JAX RL stack trains in minutes what TensorFlow took hours to simulate.*

* 🟡 **[PureJaxRL](https://github.com/luchris429/purejaxrl)**: Fully vectorized, end-to-end JIT'd RL pipelines — PPO on 2048 envs without leaving JAX. Low recent commit activity, but remains the canonical reference for the JAX-native RL-loop pattern. <img src="https://img.shields.io/github/stars/luchris429/purejaxrl?style=social" align="center">
* 🟢 **[Jumanji](https://github.com/instadeepai/jumanji)**: InstaDeep's suite of industry-driven, hardware-accelerated RL environments — from bin-packing to routing. <img src="https://img.shields.io/github/stars/instadeepai/jumanji?style=social" align="center">
* 🟢 **[gymnax](https://github.com/RobertTLange/gymnax)**: Classic Gym environments re-implemented in JAX — CartPole, Atari-lite, bsuite, and more, all JIT-compatible. <img src="https://img.shields.io/github/stars/RobertTLange/gymnax?style=social" align="center">
* 🟢 **[Pgx](https://github.com/sotetsuk/pgx)**: Vectorized board-game environments with an AlphaZero reference — Chess, Shogi, Go at scale. <img src="https://img.shields.io/github/stars/sotetsuk/pgx?style=social" align="center">
* 🟢 **[NAVIX](https://github.com/epignatelli/navix)**: MiniGrid reimplemented in pure JAX — RL gridworlds that train in seconds, not hours. <img src="https://img.shields.io/github/stars/epignatelli/navix?style=social" align="center">
* 🟢 **[QDax](https://github.com/adaptive-intelligent-robotics/QDax)**: Quality-Diversity optimization — MAP-Elites and neuro-evolution at accelerator speed. <img src="https://img.shields.io/github/stars/adaptive-intelligent-robotics/QDax?style=social" align="center">
* 🟢 **[evosax](https://github.com/RobertTLange/evosax)**: JAX-based evolutionary strategies — CMA-ES, OpenAI-ES, NSLC, ready to vectorize. <img src="https://img.shields.io/github/stars/RobertTLange/evosax?style=social" align="center">
* 🟢 **[RLax](https://github.com/google-deepmind/rlax)**: DeepMind's RL building blocks — value functions, distributional losses, exploration — the LEGO set, not the agent. <img src="https://img.shields.io/github/stars/google-deepmind/rlax?style=social" align="center">
* 🟢 **[Mctx](https://github.com/google-deepmind/mctx)**: DeepMind's Monte-Carlo Tree Search primitives in native JAX — MuZero-style planning, vectorized. <img src="https://img.shields.io/github/stars/google-deepmind/mctx?style=social" align="center">
> 💡 For continuous-control physics environments, see **Brax** in the [Scientific Computing](#science) section — it doubles as a world-class RL env suite.
> 💡 **EvoJAX** — the original "put ES on TPU" toolkit — has been archived; see the [Legacy Radar](#legacy). Use **evosax** or **QDax** above.

---

<a name="domain" />

## 🔭 Domain Libraries

*Specialized stellar systems: graphs, vision, neuroscience, and privacy-preserving compute.*

### 🕸️ Graphs & Structured Models

* 🟡 **[PGMax](https://github.com/google-deepmind/PGMax)**: Discrete probabilistic graphical models with loopy-BP and smooth-minimum-sum inference in JAX. <img src="https://img.shields.io/github/stars/google-deepmind/PGMax?style=social" align="center">

> ⚠️ **Jraph** — the de facto GNN library in JAX — was archived by DeepMind. See the [Legacy Radar](#legacy); no drop-in JAX-native successor exists yet.

### 🖼️ Vision

* 🟢 **[Scenic](https://github.com/google-research/scenic)**: Google Research's JAX/Flax library for vision transformers, video, and multi-modal research — the *living* vision codebase in JAX. <img src="https://img.shields.io/github/stars/google-research/scenic?style=social" align="center">
* 🟢 **[dm_pix](https://github.com/google-deepmind/dm_pix)**: DeepMind's image-processing primitives for JAX — JIT-friendly augmentations and color ops. <img src="https://img.shields.io/github/stars/google-deepmind/dm_pix?style=social" align="center">

> ⚠️ Note on vision model zoos: most Flax/Equinox pre-trained-weight repos (FlaxVision, jax-models, Eqxvision) have gone dormant. See the [Legacy Radar](#legacy) and prefer Scenic or HuggingFace Transformers' Flax models for new work.

### 🧠 Brain Dynamics Programming

* 🟢 **[BrainPy](https://github.com/brainpy/BrainPy)**: Computational neuroscience and brain-inspired computing — differentiable spiking networks and neural dynamics. <img src="https://img.shields.io/github/stars/brainpy/BrainPy?style=social" align="center">
* 🟢 **[brainunit](https://github.com/chaobrain/brainunit)**: Physical units and unit-aware arithmetic inside JAX — make your neuroscience code dimensionally safe. <img src="https://img.shields.io/github/stars/chaobrain/brainunit?style=social" align="center">
* 🟢 **[brainstate](https://github.com/chaobrain/brainstate)**: State-based program compilation for brain-dynamics models — augmenting JAX's functional core with stateful ergonomics. <img src="https://img.shields.io/github/stars/chaobrain/brainstate?style=social" align="center">
* 🟢 **[dendritex](https://github.com/chaobrain/dendritex)**: Compartmental dendritic neuron modelling in JAX — cable-equation dynamics at GPU speed. <img src="https://img.shields.io/github/stars/chaobrain/dendritex?style=social" align="center">
* 🟢 **[Spyx](https://github.com/kmheckel/spyx)**: Spiking Neural Networks in JAX — neuromorphic-style learning with modern accelerators. <img src="https://img.shields.io/github/stars/kmheckel/spyx?style=social" align="center">

### 🛡️ Specialty

* 🟢 **[OTT-JAX](https://github.com/ott-jax/ott)**: Optimal transport — Sinkhorn, low-rank Gromov-Wasserstein, and neural OT — the reference toolkit in JAX. <img src="https://img.shields.io/github/stars/ott-jax/ott?style=social" align="center">
* 🟢 **[Coreax](https://github.com/gchq/coreax)**: GCHQ's coreset algorithms for compressing large datasets while preserving statistical structure. <img src="https://img.shields.io/github/stars/gchq/coreax?style=social" align="center">
* 🟢 **[SPU](https://github.com/secretflow/spu)**: A compiler + runtime for running JAX programs under Secure Multi-Party Computation — privacy-preserving ML, the compiler way. <img src="https://img.shields.io/github/stars/secretflow/spu?style=social" align="center">

---

<a name="pathfinder" />

## 🧭 The Pathfinder: What should you choose?

*Real 2026 user journeys → recommended stars. Pick the row that matches your mission.*

| Your Mission | Recommended | Status | Why |
| :--- | :--- | :--- | :--- |
| **Large-scale LLM training on TPU** | [MaxText](https://github.com/AI-Hypercomputer/maxtext) | 🟢 | Pure-JAX, scales multi-pod, battle-tested on Gemini-class workloads |
| **Post-training LLMs (SFT + RLHF)** | [Tunix](https://github.com/google/tunix) | 🟢 | PPO/GRPO/DAPO with tool-using agents, on Flax NNX |
| **Foundation-model research (custom arch)** | [Flax NNX](https://github.com/google/flax) | 🟢 | DeepMind's new OO-ergonomic API — Haiku's successor |
| **Scientific ML / PyTorch-style transparency** | [Equinox](https://github.com/patrick-kidger/equinox) | 🟢 | Callable PyTrees, minimal magic, strong sci-ML adoption |
| **Neural ODEs / continuous-time models** | [Diffrax](https://github.com/patrick-kidger/diffrax) | 🟢 | The canonical differential-equation solver in JAX |
| **Differentiable physics simulation** | [Brax](https://github.com/google/brax) or [JAX-MD](https://github.com/jax-md/jax-md) | 🟢 | Brax = rigid body, JAX-MD = molecular dynamics |
| **Probabilistic modelling (full DSL)** | [NumPyro](https://github.com/pyro-ppl/numpyro) | 🟢 | Pyro-lineage, fast, mainstream |
| **Sampling only (MCMC / SMC / VI)** | [BlackJAX](https://github.com/blackjax-devs/blackjax) | 🟢 | Composable samplers, no DSL lock-in |
| **RL research** | [PureJaxRL](https://github.com/luchris429/purejaxrl) + [Jumanji](https://github.com/instadeepai/jumanji) / [gymnax](https://github.com/RobertTLange/gymnax) | 🟡 | End-to-end JIT'd loops (PureJaxRL is in maintenance but still canonical) + 🟢 accelerator-native envs |
| **Protein / biomolecular structure** | [AlphaFold 3](https://github.com/google-deepmind/alphafold3) | 🟢 | DeepMind canonical (research license) |
| **Interpretability / model surgery** | [Penzai](https://github.com/google-deepmind/penzai) | 🟢 | DeepMind's introspective modelling library |
| **TPU/GPU kernel authoring** | [Pallas](https://jax.readthedocs.io/en/latest/pallas/index.html) | 🟢 | JAX-native — write kernels without leaving Python |

### 🔧 Plumbing (pick these regardless of mission)

| Concern | Use | Why |
| :--- | :--- | :--- |
| **Optimizers** | [Optax](https://github.com/google-deepmind/optax) | Composable gradient transforms — universal adoption |
| **Checkpointing** | [Orbax](https://github.com/google/orbax) | Multi-host, resumable, the 2026 standard |
| **Data loading** | [Grain](https://github.com/google/grain) | Deterministic, JAX-native, replaces `tf.data` |
| **Testing & invariants** | [Chex](https://github.com/google-deepmind/chex) | DeepMind's assertions library for JAX code |
| **Shape-safe types** | [jaxtyping](https://github.com/patrick-kidger/jaxtyping) | Catches shape bugs before JIT |

---

<a name="onramps" />

## 🛸 Onramps: Reference Implementations

*Canonical codebases to read when you're learning how idiomatic JAX is written. Pick one near your mission and study it.*

* 🚀 **[MaxText Examples](https://github.com/AI-Hypercomputer/maxtext/tree/main/MaxText)** — see how a production-grade, multi-pod LLM training loop is structured in pure JAX.
* 🧭 **[PureJaxRL Tutorials](https://github.com/luchris429/purejaxrl)** — the clearest demonstration of end-to-end JIT'd training-loop design in the JAX world.
* 🧪 **[JAX-MD Notebooks](https://github.com/jax-md/jax-md/tree/main/notebooks)** — differentiable molecular dynamics from first principles, with narrative tutorials.
* 🔬 **[Penzai Tutorials](https://github.com/google-deepmind/penzai/tree/main/notebooks)** — model introspection and editing — a great example of *composable* PyTree APIs.
* 📊 **[NumPyro Examples](https://github.com/pyro-ppl/numpyro/tree/master/examples)** — Bayesian inference recipes, from linear regression to deep GPs.
* 🌸 **[Flax NNX Guides](https://flax.readthedocs.io/en/latest/nnx_basics.html)** — the official "how to think in NNX" walkthrough; the best starting point if you're coming from Haiku or PyTorch.

---

<a name="legacy" />

## ⚠️ Legacy Radar

*These pioneers lit the way, but the galaxy has moved on. Each entry explains **what to use instead** — if you're reading old tutorials, read this first.*

* 🔴 **[Haiku (dm-haiku)](https://github.com/google-deepmind/dm-haiku)** — In maintenance mode. DeepMind's new research has shifted to Flax NNX. **→ Use Flax NNX.**
* 🔴 **[Trax](https://github.com/google/trax)** — Effectively abandoned (Google). **→ Use MaxText for scale, Flax NNX for research.**
* 🔴 **[Objax](https://github.com/google/objax)** — No longer actively developed. **→ Use Equinox (similar OO feel) or Flax NNX.**
* 🔴 **[Elegy](https://github.com/poets-ai/elegy)** — Unmaintained. **→ Use Flax NNX or Equinox directly.**
* 🔴 **[SymJAX](https://github.com/SymJAX/SymJAX)** — Superseded by native JAX tracing. **→ Use JAX itself.**
* 🔴 **[Parallax](https://github.com/srush/parallax)** — Archived experimental project. **→ Use Equinox for "immutable modules" ergonomics.**
* 🔴 **[mcx](https://github.com/rlouf/mcx)** — Sampling DSL superseded by the community. **→ Use BlackJAX.**
* 🔴 **[Coax](https://github.com/coax-dev/coax)** — Slowed to a crawl. **→ Use PureJaxRL.**
* 🔴 **[EvoJAX](https://github.com/google/evojax)** — Archived by Google. **→ Use [evosax](https://github.com/RobertTLange/evosax) (general ES) or [QDax](https://github.com/adaptive-intelligent-robotics/QDax) (Quality-Diversity).** <img src="https://img.shields.io/github/stars/google/evojax?style=social" align="center">
* 🔴 **[Jraph](https://github.com/google-deepmind/jraph)** — Archived by DeepMind in 2024. **→ No drop-in JAX-native successor.** For new GNN work, consider PyTorch Geometric or compose message-passing primitives with Equinox. <img src="https://img.shields.io/github/stars/google-deepmind/jraph?style=social" align="center">
* 🔴 **[FlaxVision](https://github.com/rolandgvc/flaxvision)** / **[jax-models](https://github.com/DarshanDeshpande/jax-models)** / **[Eqxvision](https://github.com/paganpasta/eqxvision)** — Dormant vision model zoos. **→ Use Scenic or HuggingFace Transformers' Flax models.**
* 🟡 **[Pax / Praxis](https://github.com/google/paxml)** — Still ships, but Google's external narrative has moved to MaxText + Flax NNX. Google-internal lineage; new users should not start here.
* 🟡 **[Neural Tangents](https://github.com/google/neural-tangents)** — Low activity. Stays here because it's the canonical library for its (niche) infinite-width-network research area.
* 🟡 **[FedJAX](https://github.com/google/fedjax)** — Federated-learning niche with minimal recent activity. No clear successor in JAX; still worth knowing if you work on FL.

---

## 🛠️ Contributing

The JAX multiverse is expanding. If you see a new star — or see a dying one — open an **Issue** or a **PR**. See [CONTRIBUTING.md](CONTRIBUTING.md) for cosmic guidelines.

To audit the health of the stars yourself, run:

```bash
python scripts/health_check.py
```

This fetches last-commit dates and star counts for every linked repo and flags classifications that look stale.

---

*Maintained with ❤️ by the JAX community. 2026 Edition. Let's map the stars.* 🌌
