/**
 * ALGOVERSE 3D - Computer Science, DSA & AI Neural Network Simulation Lab
 * Built with Three.js & Vanilla JavaScript
 * 1. 3D Deep Neural Network (Forward Prop & Backprop)
 * 2. 3D Binary Search Tree (Insertion & In-Order Traversal)
 * 3. 3D Sorting Algorithms & Big-O Complexity (QuickSort vs BubbleSort)
 */

(function () {
  'use strict';

  // =========================================================================
  // CS Module Scientific Data & First-Principles Models
  // =========================================================================
  const CS_MODULES = {
    neural: {
      tag: 'ARTIFICIAL INTELLIGENCE & DEEP LEARNING',
      title: 'Deep Neural Network (Multi-Layer Perceptron)',
      logic: 'z = Σ (w_i · x_i) + b | a = σ(z)',
      desc: 'Deep Learning Core: Har neuron pehle inputs ka weighted sum (dot product) nikalta hai, bias jodta hai, aur activation function (ReLU ya Sigmoid) se non-linear output generate karta hai.',
      feynman: 'Neural network ek voting committee jaisa hai! Input layer facts dekhti hai, hidden layer aapas mein argue karke decision leti hai, aur output layer final answer deti hai (e.g., "Yeh photo Cat hai ya Dog?").',
      impact: 'ChatGPT, Google Gemini, Tesla FSD aur Midjourney 100% isi deep matrix multiplication aur backpropagation par kaam karte hain!',
      codeTitle: 'Python / PyTorch (Forward Prop)',
      code: `import numpy as np

def forward_propagation(X, W1, b1, W2, b2):
    # Hidden Layer activation (ReLU)
    Z1 = np.dot(X, W1) + b1
    A1 = np.maximum(0, Z1)
    
    # Output Layer activation (Softmax)
    Z2 = np.dot(A1, W2) + b2
    exp_Z = np.exp(Z2)
    return exp_Z / np.sum(exp_Z, axis=1, keepdims=True)`
    },
    bst: {
      tag: 'DATA STRUCTURES & ALGORITHMS',
      title: 'Binary Search Tree (BST)',
      logic: 'Left < Root < Right | Time: O(log N)',
      desc: 'Hierarchical Tree Structure: Har node ka left child chhota hota hai aur right child bada hota hai. Isse 10 Lakh (1 Million) elements mein se kisi bhi number ko sirf ~20 comparisons mein dhoondha ja sakta hai!',
      feynman: 'Socho aap ek moti dictionary mein word dhoondh rahe ho. Aap page 1 se nahi dhoondhte. Aap beech mein se kholte ho—aur har baar aadha book ek jhatke mein chhod dete ho!',
      impact: 'SQL Databases (MySQL, PostgreSQL B-Trees), Git version control, aur Linux Kernel file systems isi tree structure par instant search karte hain.',
      codeTitle: 'JavaScript / Python (BST Insertion)',
      code: `class TreeNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None

def insert_bst(root, val):
    if not root:
        return TreeNode(val)
    if val < root.val:
        root.left = insert_bst(root.left, val)
    else:
        root.right = insert_bst(root.right, val)
    return root`
    },
    sorting: {
      tag: 'ALGORITHMIC EFFICIENCY & BIG-O',
      title: 'Sorting Algorithms & Big-O Complexity',
      logic: 'QuickSort: O(N log N) | BubbleSort: O(N²)',
      desc: 'Divide & Conquer vs Brute Force: QuickSort ek pivot chunta hai aur array ko 2 hisso mein baant deta hai. BubbleSort bagal wale elements ko baar-baar compare karke swap karta hai.',
      feynman: 'BubbleSort school ki line jaisa hai jahan har bachha apne peeche wale se height naapta hai (bohot slow). QuickSort monitor ko beech mein khada karke sabko chhote-bade mein turant divide kar deta hai!',
      impact: 'Google Search index sorting, Amazon e-commerce product ranking, aur Stock market high-frequency trading mein sorting algorithms backbone hain.',
      codeTitle: 'Python (QuickSort Divide & Conquer)',
      code: `def quicksort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quicksort(left) + middle + quicksort(right)`
    },
    workspace: {
      tag: 'SPATIAL PRODUCTIVITY & EXECUTION',
      title: 'Orbit Work OS — 3D Mission Field',
      logic: 'Energy × Priority × Time = Meaningful progress',
      desc: 'A premium command space where tasks are visible as objects, not noisy cards. The closer and brighter a mission is, the more attention it needs today.',
      feynman: 'Socho tumhare saare kaam desk par nahi, ek chhote solar system mein hain. Jo planet sabse bright hai, usko pehle complete karna hai!',
      impact: 'This is the same operating principle used by high-performing product teams: make priority, capacity and deadlines visible in one calm command view.',
      codeTitle: 'Work OS / Focus Protocol',
      code: `focus_mission = highest_impact(tasks)
block_calendar(25, focus_mission)
ship_smallest_next_step()
review_energy_before_next_mission()`
    }
  };

  // =========================================================================
  // Web Audio Synthesizer for Algorithms
  // =========================================================================
  class CSAudio {
    constructor() {
      this.ctx = null;
      this.enabled = true;
    }

    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioCtx();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    playPitch(freq = 440, duration = 0.08) {
      if (!this.enabled) return;
      this.init();
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + duration + 0.05);
    }

    playChime() {
      if (!this.enabled) return;
      this.init();
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((f, i) => {
        setTimeout(() => this.playPitch(f, 0.2), i * 60);
      });
    }

    toggle() {
      this.enabled = !this.enabled;
      return this.enabled;
    }
  }

  const audio = new CSAudio();

  // =========================================================================
  // Global Viewport & Three.js Scene Setup
  // =========================================================================
  let scene, camera, renderer, controls;
  let activeModule = 'neural';

  let neuralGroup = new THREE.Group();
  let bstGroup = new THREE.Group();
  let sortingGroup = new THREE.Group();
  let workspaceGroup = new THREE.Group();

  function initThree() {
    const container = document.getElementById('canvas-container');

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050811);

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.5, 200);
    camera.position.set(0, 18, 38);

    renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 6;
    controls.maxDistance = 100;
    controls.target.set(0, 0, 0);

    // Subtle Ambient Light + Key Directional Light
    scene.add(new THREE.AmbientLight(0x1e293b, 1.2));
    const dir = new THREE.DirectionalLight(0xffffff, 1.4);
    dir.position.set(20, 30, 20);
    scene.add(dir);

    // Subtle Tech Grid on Ground
    const grid = new THREE.GridHelper(60, 30, 0x00f0ff, 0x111e38);
    grid.position.y = -8;
    scene.add(grid);

    scene.add(neuralGroup);
    scene.add(bstGroup);
    scene.add(sortingGroup);
    scene.add(workspaceGroup);

    buildNeuralNetwork();
    buildBinarySearchTree();
    buildSortingArena();
    buildWorkspaceField();

    switchModule('neural');

    window.addEventListener('resize', onResize);
    animate();
  }

  // =========================================================================
  // MODULE 1: 3D DEEP NEURAL NETWORK (AI/ML)
  // =========================================================================
  let neuralLayers = [];
  let synapticLines = [];
  let neuralPulses = [];
  let lossVal = 0.0412;

  function buildNeuralNetwork() {
    // 4 Layers: Input (3), Hidden1 (5), Hidden2 (4), Output (2)
    const layerConfigs = [
      { name: 'Input', count: 3, x: -16, color: 0x00f0ff },
      { name: 'Hidden1', count: 5, x: -5, color: 0xa855f7 },
      { name: 'Hidden2', count: 4, x: 5, color: 0xa855f7 },
      { name: 'Output', count: 2, x: 16, color: 0x10b981 }
    ];

    neuralLayers = [];

    layerConfigs.forEach((cfg, layerIdx) => {
      const neurons = [];
      const spacingY = 3.2;
      const startY = ((cfg.count - 1) * spacingY) / 2;

      for (let i = 0; i < cfg.count; i++) {
        const y = startY - i * spacingY;
        const geo = new THREE.SphereGeometry(0.7, 24, 24);
        const mat = new THREE.MeshStandardMaterial({
          color: cfg.color,
          roughness: 0.2,
          metalness: 0.8
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(cfg.x, y, 0);
        neuralGroup.add(mesh);

        // Halo Ring
        const ringGeo = new THREE.RingGeometry(0.85, 0.95, 32);
        const ringMat = new THREE.MeshBasicMaterial({
          color: cfg.color,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.5
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.position.set(cfg.x, y, 0);
        neuralGroup.add(ring);

        neurons.push({ mesh, ring, pos: new THREE.Vector3(cfg.x, y, 0), layerIdx });
      }
      neuralLayers.push(neurons);
    });

    // Synaptic Connection Lines (Dense Layer Connections)
    synapticLines = [];
    for (let l = 0; l < neuralLayers.length - 1; l++) {
      const currentLayer = neuralLayers[l];
      const nextLayer = neuralLayers[l + 1];

      currentLayer.forEach(n1 => {
        nextLayer.forEach(n2 => {
          const points = [n1.pos, n2.pos];
          const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
          const weightVal = Math.random() * 0.8 + 0.2;
          const lineMat = new THREE.LineBasicMaterial({
            color: 0x38bdf8,
            transparent: true,
            opacity: weightVal * 0.35
          });
          const line = new THREE.Line(lineGeo, lineMat);
          neuralGroup.add(line);
          synapticLines.push({ line, p1: n1.pos, p2: n2.pos, weight: weightVal });
        });
      });
    }
  }

  function triggerForwardProp() {
    audio.playPitch(523, 0.1);
    showToast('⚡ Forward Propagation Signal Dispatched!');

    // Spawn animated signal pulses traveling from Input -> Hidden -> Output
    for (let l = 0; l < neuralLayers.length - 1; l++) {
      const fromLayer = neuralLayers[l];
      const toLayer = neuralLayers[l + 1];

      setTimeout(() => {
        fromLayer.forEach(n1 => {
          toLayer.forEach(n2 => {
            if (Math.random() < 0.7) {
              spawnSynapticPulse(n1.pos, n2.pos, 0x00f0ff);
            }
          });
          // Flash neuron
          n1.mesh.scale.set(1.4, 1.4, 1.4);
          setTimeout(() => n1.mesh.scale.set(1, 1, 1), 200);
        });
        audio.playPitch(400 + l * 150, 0.08);
      }, l * 280);
    }

    setTimeout(() => {
      audio.playChime();
      showToast('🎯 Output Class Activated: 98.6% Confidence');
    }, 3 * 280);
  }

  function triggerBackprop() {
    lossVal = Math.max(lossVal * 0.75, 0.0012);
    document.getElementById('meter-loss').innerText = lossVal.toFixed(4);

    audio.playPitch(350, 0.1);
    showToast(`↻ Backpropagation: Gradient Descent Loss Reduced to ${lossVal.toFixed(4)}`);

    // Reverse pulses (Output -> Input)
    for (let l = neuralLayers.length - 1; l > 0; l--) {
      const fromLayer = neuralLayers[l];
      const toLayer = neuralLayers[l - 1];

      setTimeout(() => {
        fromLayer.forEach(n1 => {
          toLayer.forEach(n2 => {
            if (Math.random() < 0.6) {
              spawnSynapticPulse(n1.pos, n2.pos, 0xf43f5e);
            }
          });
        });
        audio.playPitch(700 - l * 100, 0.08);
      }, (neuralLayers.length - 1 - l) * 250);
    }
  }

  function spawnSynapticPulse(p1, p2, colorHex) {
    const geo = new THREE.SphereGeometry(0.2, 12, 12);
    const mat = new THREE.MeshBasicMaterial({ color: colorHex });
    const pulse = new THREE.Mesh(geo, mat);
    pulse.position.copy(p1);
    neuralGroup.add(pulse);

    let t = 0;
    const anim = setInterval(() => {
      t += 0.06;
      pulse.position.lerpVectors(p1, p2, t);
      if (t >= 1) {
        clearInterval(anim);
        neuralGroup.remove(pulse);
      }
    }, 16);
  }

  // =========================================================================
  // MODULE 2: 3D BINARY SEARCH TREE (BST)
  // =========================================================================
  let bstRoot = null;
  let bstMeshes = [];
  let bstLines = [];

  class BSTNode {
    constructor(val) {
      this.val = val;
      this.left = null;
      this.right = null;
      this.x = 0;
      this.y = 0;
      this.z = 0;
      this.mesh = null;
    }
  }

  function buildBinarySearchTree() {
    clearBST();
    // Insert Initial Balanced Tree: 50, 25, 75, 12, 38, 62, 88
    [50, 25, 75, 12, 38, 62, 88].forEach(v => {
      insertBSTValue(v, false);
    });
    repositionAndRenderBST();
  }

  function insertBSTValue(val, animateNew = true) {
    if (!bstRoot) {
      bstRoot = new BSTNode(val);
      if (animateNew) {
        repositionAndRenderBST();
        audio.playPitch(600, 0.15);
        showToast(`🌲 Root Node Created: [${val}]`);
      }
      return;
    }

    let curr = bstRoot;
    while (curr) {
      if (val < curr.val) {
        if (!curr.left) {
          curr.left = new BSTNode(val);
          break;
        }
        curr = curr.left;
      } else if (val > curr.val) {
        if (!curr.right) {
          curr.right = new BSTNode(val);
          break;
        }
        curr = curr.right;
      } else {
        showToast(`Value [${val}] already exists in BST!`);
        return; // Duplicate
      }
    }

    if (animateNew) {
      repositionAndRenderBST();
      audio.playChime();
      showToast(`🌲 Inserted [${val}] into BST according to Left < Root < Right`);
    }
  }

  function calculateBSTPositions(node, x, y, spreadX) {
    if (!node) return;
    node.x = x;
    node.y = y;
    node.z = 0;

    const nextSpread = spreadX * 0.52;
    if (node.left) calculateBSTPositions(node.left, x - spreadX, y - 4.5, nextSpread);
    if (node.right) calculateBSTPositions(node.right, x + spreadX, y - 4.5, nextSpread);
  }

  function repositionAndRenderBST() {
    // Clear old visual meshes
    bstMeshes.forEach(m => bstGroup.remove(m));
    bstLines.forEach(l => bstGroup.remove(l));
    bstMeshes = [];
    bstLines = [];

    calculateBSTPositions(bstRoot, 0, 8, 12);
    renderBSTNodesAndEdges(bstRoot);
  }

  function createTextSprite(text) {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.arc(64, 64, 58, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 6;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 44px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 64, 64);

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMat = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(2.4, 2.4, 1);
    return sprite;
  }

  function renderBSTNodesAndEdges(node) {
    if (!node) return;

    // Node Visual Mesh
    const sprite = createTextSprite(node.val);
    sprite.position.set(node.x, node.y, node.z);
    bstGroup.add(sprite);
    bstMeshes.push(sprite);
    node.mesh = sprite;

    // Edge lines to children
    if (node.left) {
      const line = createTreeBranchLine(node, node.left);
      bstGroup.add(line);
      bstLines.push(line);
      renderBSTNodesAndEdges(node.left);
    }
    if (node.right) {
      const line = createTreeBranchLine(node, node.right);
      bstGroup.add(line);
      bstLines.push(line);
      renderBSTNodesAndEdges(node.right);
    }
  }

  function createTreeBranchLine(n1, n2) {
    const points = [new THREE.Vector3(n1.x, n1.y, n1.z), new THREE.Vector3(n2.x, n2.y, n2.z)];
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    const mat = new THREE.LineBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.6, linewidth: 2 });
    return new THREE.Line(geo, mat);
  }

  function clearBST() {
    bstRoot = null;
    bstMeshes.forEach(m => bstGroup.remove(m));
    bstLines.forEach(l => bstGroup.remove(l));
    bstMeshes = [];
    bstLines = [];
  }

  function traverseInOrder(node, list = []) {
    if (!node) return list;
    traverseInOrder(node.left, list);
    list.push(node);
    traverseInOrder(node.right, list);
    return list;
  }

  // =========================================================================
  // MODULE 3: 3D SORTING & BIG-O COMPLEXITY
  // =========================================================================
  let sortingBars = [];
  let sortArray = [];
  let isSortingActive = false;
  let sortComparisons = 0;

  function buildSortingArena() {
    shuffleNewArray();
  }

  function shuffleNewArray() {
    // Clear old bars
    sortingBars.forEach(b => sortingGroup.remove(b));
    sortingBars = [];
    sortComparisons = 0;
    document.getElementById('meter-sort-comparisons').innerText = '0';

    const count = 18;
    sortArray = [];
    for (let i = 0; i < count; i++) {
      sortArray.push(Math.floor(Math.random() * 85) + 15);
    }

    const barWidth = 1.0;
    const spacing = 1.6;
    const startX = -((count - 1) * spacing) / 2;

    for (let i = 0; i < count; i++) {
      const h = sortArray[i] * 0.16;
      const geo = new THREE.BoxGeometry(barWidth, h, barWidth);
      geo.translate(0, h / 2, 0); // Origin at base

      const mat = new THREE.MeshStandardMaterial({
        color: 0x00f0ff,
        roughness: 0.3,
        metalness: 0.5
      });
      const bar = new THREE.Mesh(geo, mat);
      bar.position.set(startX + i * spacing, -6, 0);
      sortingGroup.add(bar);
      sortingBars.push(bar);
    }
  }

  function getSortDelay() {
    const speed = parseInt(document.getElementById('slider-sort-speed').value);
    return Math.round(240 / speed);
  }

  async function runQuickSort() {
    if (isSortingActive) return;
    isSortingActive = true;
    showToast('🚀 Running QuickSort: O(N log N) Divide & Conquer');

    await quickSortHelper(0, sortArray.length - 1);

    isSortingActive = false;
    audio.playChime();
    showToast('🎉 QuickSort Complete!');
  }

  async function quickSortHelper(low, high) {
    if (low < high) {
      const pi = await partition(low, high);
      await quickSortHelper(low, pi - 1);
      await quickSortHelper(pi + 1, high);
    }
  }

  async function partition(low, high) {
    const pivot = sortArray[high];
    sortingBars[high].material.color.setHex(0xfbbf24); // Gold Pivot

    let i = low - 1;
    for (let j = low; j < high; j++) {
      sortComparisons++;
      document.getElementById('meter-sort-comparisons').innerText = sortComparisons;

      sortingBars[j].material.color.setHex(0xf43f5e); // Comparison (Rose)
      audio.playPitch(200 + sortArray[j] * 6, 0.04);
      await sleep(getSortDelay());

      if (sortArray[j] < pivot) {
        i++;
        swapBars(i, j);
        await sleep(getSortDelay());
      }
      sortingBars[j].material.color.setHex(0x00f0ff);
    }
    swapBars(i + 1, high);
    sortingBars[high].material.color.setHex(0x10b981);
    await sleep(70);
    return i + 1;
  }

  async function runBubbleSort() {
    if (isSortingActive) return;
    isSortingActive = true;
    showToast('🐢 Running BubbleSort: O(N²) Comparison');

    const n = sortArray.length;
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        sortComparisons++;
        document.getElementById('meter-sort-comparisons').innerText = sortComparisons;

        sortingBars[j].material.color.setHex(0xf43f5e);
        sortingBars[j + 1].material.color.setHex(0xf43f5e);
        audio.playPitch(180 + sortArray[j] * 5, 0.04);
        await sleep(getSortDelay());

        if (sortArray[j] > sortArray[j + 1]) {
          swapBars(j, j + 1);
          await sleep(getSortDelay());
        }

        sortingBars[j].material.color.setHex(0x00f0ff);
        sortingBars[j + 1].material.color.setHex(0x00f0ff);
      }
      sortingBars[n - i - 1].material.color.setHex(0x10b981);
    }
    sortingBars[0].material.color.setHex(0x10b981);

    isSortingActive = false;
    audio.playChime();
    showToast('🎉 BubbleSort Complete!');
  }

  function swapBars(i, j) {
    const temp = sortArray[i];
    sortArray[i] = sortArray[j];
    sortArray[j] = temp;

    // Redraw bar geometries with updated heights
    updateBarHeight(i, sortArray[i]);
    updateBarHeight(j, sortArray[j]);
  }

  function updateBarHeight(idx, val) {
    const h = val * 0.16;
    const bar = sortingBars[idx];
    bar.geometry.dispose();
    const newGeo = new THREE.BoxGeometry(1.0, h, 1.0);
    newGeo.translate(0, h / 2, 0);
    bar.geometry = newGeo;
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // =========================================================================
  // MODULE 4: SPATIAL WORK OS — large, calm 3D task constellation
  // =========================================================================
  const workMissions = [
    { title: 'Mobile onboarding', priority: 'CRITICAL', color: 0xf43f5e, pos: [-7, 1, 0] },
    { title: 'Launch narrative', priority: 'HIGH', color: 0xf59e0b, pos: [-2, 4, -1] },
    { title: 'Design system', priority: 'IN PROGRESS', color: 0x00f0ff, pos: [4, 2, 1] },
    { title: 'Research synthesis', priority: 'READY', color: 0x10b981, pos: [7, -2, 0] },
    { title: 'Accessibility audit', priority: 'NEXT', color: 0xa855f7, pos: [-1, -4, 1] }
  ];
  let workNodes = [];

  function buildWorkspaceField() {
    workspaceGroup.clear(); workNodes = [];
    const hub = new THREE.Mesh(new THREE.IcosahedronGeometry(1.35, 2), new THREE.MeshStandardMaterial({ color: 0x00f0ff, emissive: 0x006677, emissiveIntensity: 1.2, roughness: 0.25 }));
    workspaceGroup.add(hub);
    [2.2, 4.2, 6.5, 9].forEach((r, index) => {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(r, 0.018, 8, 96), new THREE.MeshBasicMaterial({ color: index === 0 ? 0x00f0ff : 0x31526c, transparent: true, opacity: .65 }));
      ring.rotation.x = Math.PI / 2; workspaceGroup.add(ring);
    });
    workMissions.forEach((mission, i) => {
      const node = new THREE.Group();
      const sphere = new THREE.Mesh(new THREE.IcosahedronGeometry(0.72, 2), new THREE.MeshStandardMaterial({ color: mission.color, emissive: mission.color, emissiveIntensity: .65, roughness: .32 }));
      const orbit = new THREE.Mesh(new THREE.TorusGeometry(1.08, .025, 8, 48), new THREE.MeshBasicMaterial({ color: mission.color, transparent: true, opacity: .65 }));
      orbit.rotation.x = Math.PI / 2;
      node.add(sphere, orbit); node.position.set(...mission.pos); node.userData = { mission, phase: i * 1.3 };
      workspaceGroup.add(node); workNodes.push(node);
    });
  }

  // =========================================================================
  // Module Switching & Concept Synchronization
  // =========================================================================
  function switchModule(key) {
    activeModule = key;

    neuralGroup.visible = (key === 'neural');
    bstGroup.visible = (key === 'bst');
    sortingGroup.visible = (key === 'sorting');
    workspaceGroup.visible = (key === 'workspace');

    document.getElementById('ctrls-neural').style.display = (key === 'neural' ? 'block' : 'none');
    document.getElementById('ctrls-bst').style.display = (key === 'bst' ? 'block' : 'none');
    document.getElementById('ctrls-sorting').style.display = (key === 'sorting' ? 'block' : 'none');
    document.getElementById('ctrls-workspace').style.display = (key === 'workspace' ? 'block' : 'none');

    document.querySelectorAll('.mod-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.mod === key);
    });

    const info = CS_MODULES[key];
    document.getElementById('panel-cs-tag').innerText = info.tag;
    document.getElementById('panel-cs-title').innerText = info.title;

    document.getElementById('dock-logic').innerText = info.logic;
    document.getElementById('dock-logic-desc').innerText = info.desc;
    document.getElementById('dock-feynman').innerText = info.feynman;
    document.getElementById('dock-impact').innerText = info.impact;

    document.getElementById('code-lang-label').innerText = info.codeTitle;
    document.getElementById('code-display').innerText = info.code;

    // Reset camera target
    if (key === 'neural') {
      camera.position.set(0, 10, 36);
      controls.target.set(0, 0, 0);
    } else if (key === 'bst') {
      camera.position.set(0, 6, 32);
      controls.target.set(0, 2, 0);
    } else if (key === 'sorting') {
      camera.position.set(0, 8, 30);
      controls.target.set(0, 0, 0);
    } else if (key === 'workspace') {
      camera.position.set(0, 11, 29);
      controls.target.set(0, 0, 0);
    }

    showToast(`💻 Module Loaded: ${info.title}`);
  }

  // =========================================================================
  // Render Loop
  // =========================================================================
  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const time = clock.getElapsedTime();
    controls.update();

    if (activeModule === 'neural') {
      // Subtle pulsing halo rings
      neuralLayers.forEach(layer => {
        layer.forEach(n => {
          n.ring.rotation.z = time * 0.5;
        });
      });
    } else if (activeModule === 'bst') {
      // Gentle floating motion
      bstGroup.position.y = Math.sin(time * 1.5) * 0.2;
    } else if (activeModule === 'workspace') {
      workNodes.forEach(node => {
        node.position.y = node.userData.mission.pos[1] + Math.sin(time * 0.8 + node.userData.phase) * 0.35;
        node.rotation.y = time * 0.25 + node.userData.phase;
      });
    }

    renderer.render(scene, camera);
  }

  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  // =========================================================================
  // UI Handlers & Button Listeners
  // =========================================================================
  function initUI() {
    // Module Tabs
    document.querySelectorAll('.mod-tab').forEach(btn => {
      btn.addEventListener('click', () => switchModule(btn.dataset.mod));
    });

    // Reset Lab
    document.getElementById('btn-reset-module').addEventListener('click', () => {
      switchModule(activeModule);
      showToast('↺ Simulation Reset to Initial State');
    });

    // Audio Toggle
    const btnSound = document.getElementById('btn-sound');
    btnSound.addEventListener('click', () => {
      const on = audio.toggle();
      btnSound.querySelector('.btn-text').innerText = on ? 'Audio: ON' : 'Audio: OFF';
      showToast(on ? '🎵 Audio Active' : '🔇 Audio Muted');
    });

    // Neural Controls
    document.getElementById('btn-forward-prop').addEventListener('click', triggerForwardProp);
    document.getElementById('btn-train-epoch').addEventListener('click', triggerBackprop);

    // BST Controls
    document.getElementById('btn-bst-insert').addEventListener('click', () => {
      const input = document.getElementById('input-bst-val');
      const val = parseInt(input.value);
      if (!isNaN(val)) {
        insertBSTValue(val, true);
        input.value = Math.floor(Math.random() * 80) + 10;
      }
    });

    document.getElementById('btn-bst-reset').addEventListener('click', () => {
      buildBinarySearchTree();
      showToast('🌲 New Random BST Generated');
    });

    document.getElementById('btn-bst-inorder').addEventListener('click', async () => {
      const sortedList = traverseInOrder(bstRoot);
      showToast(`In-Order Sorted Traversal: ${sortedList.map(n => n.val).join(' ➔ ')}`);

      for (let i = 0; i < sortedList.length; i++) {
        const node = sortedList[i];
        if (node.mesh) {
          node.mesh.scale.set(3.2, 3.2, 1);
          audio.playPitch(300 + node.val * 8, 0.12);
          await sleep(240);
          node.mesh.scale.set(2.4, 2.4, 1);
        }
      }
    });

    // Sorting Controls
    document.getElementById('btn-start-sort').addEventListener('click', () => {
      const algo = document.getElementById('select-algo').value;
      if (algo === 'quicksort') runQuickSort();
      else runBubbleSort();
    });

    document.getElementById('btn-shuffle-array').addEventListener('click', () => {
      if (!isSortingActive) {
        shuffleNewArray();
        showToast('🔀 Array Shuffled Randomly');
      }
    });

    // Synaptic Weight Density Slider
    document.getElementById('slider-weight-intensity').addEventListener('input', e => {
      const intensity = parseFloat(e.target.value);
      synapticLines.forEach(s => {
        s.line.material.opacity = s.weight * 0.35 * intensity;
      });
    });

    // Bottom Explainer Toggle
    const dock = document.getElementById('cs-dock');
    document.getElementById('btn-toggle-dock').addEventListener('click', () => {
      dock.classList.toggle('collapsed');
    });

    // Workspace Controls
    document.getElementById('btn-work-focus').addEventListener('click', () => {
      audio.playChime();
      showToast('🎯 25-Minute Focus Sprint Started! Deep work activated.');
    });
    document.getElementById('btn-work-shuffle').addEventListener('click', () => {
      buildWorkspaceField();
      audio.playPitch(480, 0.15);
      showToast('✨ Work Field Rebalanced');
    });
  }

  function showToast(msg) {
    const toast = document.getElementById('cs-toast');
    toast.innerText = msg;
    toast.classList.add('visible');
    setTimeout(() => toast.classList.remove('visible'), 2800);
  }

  window.addEventListener('DOMContentLoaded', () => {
    initThree();
    initUI();
  });
})();
