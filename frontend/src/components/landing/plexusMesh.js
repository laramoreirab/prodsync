/**
 * Nós esparsos (região direita / centro-direita) para malha estilo Plexus.
 * Coordenadas no viewBox 1000 x 800.
 */
  export const PLEXUS_NODES = [
    { x: 40, y: 100 },
    { x: 70, y: 280 },
    { x: 55, y: 460 },
    { x: 90, y: 640 },
    { x: 160, y: 40 },
    { x: 120, y: 60 },
    { x: 200, y: 200 },
    { x: 220, y: 120 },
    { x: 180, y: 240 },
    { x: 240, y: 360 },
    { x: 280, y: 380 },
    { x: 140, y: 480 },
    { x: 260, y: 620 },
    { x: 320, y: 160 },
    { x: 300, y: 340 },
    { x: 360, y: 90 },
    { x: 380, y: 520 },
    { x: 420, y: 80 },
    { x: 520, y: 40 },
    { x: 640, y: 90 },
    { x: 760, y: 50 },
    { x: 880, y: 110 },
    { x: 950, y: 200 },
    { x: 380, y: 180 },
    { x: 480, y: 220 },
    { x: 600, y: 160 },
    { x: 720, y: 200 },
    { x: 840, y: 240 },
    { x: 920, y: 320 },
    { x: 340, y: 300 },
    { x: 450, y: 340 },
    { x: 560, y: 280 },
    { x: 680, y: 320 },
    { x: 800, y: 380 },
    { x: 900, y: 420 },
    { x: 980, y: 500 },
    { x: 400, y: 440 },
    { x: 520, y: 400 },
    { x: 640, y: 460 },
    { x: 760, y: 500 },
    { x: 880, y: 540 },
    { x: 360, y: 560 },
    { x: 480, y: 520 },
    { x: 600, y: 580 },
    { x: 720, y: 620 },
    { x: 850, y: 660 },
    { x: 940, y: 720 },
    { x: 420, y: 680 },
    { x: 540, y: 720 },
    { x: 660, y: 760 },
    { x: 780, y: 740 },
    { x: 500, y: 120 },
    { x: 820, y: 140 },
    { x: 700, y: 420 },
    { x: 580, y: 360 },
    { x: 460, y: 600 },
    { x: 800, y: 280 },
    { x: 920, y: 600 },
    { x: 300, y: 420 },
    { x: 620, y: 640 },
  ];
  
  const MAX_DISTANCE = 195;
  const MAX_LINKS_PER_NODE = 5;
  
  export function buildPlexusEdges(nodes) {
    const edges = [];
    const seen = new Set();
  
    for (let i = 0; i < nodes.length; i++) {
      const neighbors = nodes
        .map((n, j) => ({
          j,
          d: Math.hypot(n.x - nodes[i].x, n.y - nodes[i].y),
        }))
        .filter(({ j, d }) => j !== i && d <= MAX_DISTANCE)
        .sort((a, b) => a.d - b.d)
        .slice(0, MAX_LINKS_PER_NODE);
  
      for (const { j } of neighbors) {
        const key = i < j ? `${i}-${j}` : `${j}-${i}`;
        if (seen.has(key)) continue;
        seen.add(key);
        edges.push([i, j]);
      }
    }
  
    return edges;
  }
  
  export const PLEXUS_EDGES = buildPlexusEdges(PLEXUS_NODES);