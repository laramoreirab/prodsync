import { PLEXUS_NODES, PLEXUS_EDGES } from "./plexusMesh";

const PALE_LINE = "#b8c8dc";
const PALE_NODE = "#a8bdd4";
/** Tons um pouco mais saturados na área do login (direita) */
const RIGHT_LINE = "#8fa4c4";
const RIGHT_NODE = "#7d95b8";

function nodeSide(x) {
  return x < 420 ? "left" : "right";
}

/**
 * Plexus: linhas/nós azul-acinzentado pálido, opacidade tipo marca d'água.
 * Mais denso e visível à direita; mais esparso à esquerda.
 */
export function HomeMeshBackground({ className = "" }) {
  const leftEdges = PLEXUS_EDGES.filter(([a, b]) => {
    const na = PLEXUS_NODES[a];
    const nb = PLEXUS_NODES[b];
    return nodeSide(na.x) === "left" && nodeSide(nb.x) === "left";
  });

  const mixedOrRightEdges = PLEXUS_EDGES.filter(([a, b]) => {
    const na = PLEXUS_NODES[a];
    const nb = PLEXUS_NODES[b];
    return !(nodeSide(na.x) === "left" && nodeSide(nb.x) === "left");
  });

  const leftNodes = PLEXUS_NODES.filter((n) => nodeSide(n.x) === "left");
  const rightNodes = PLEXUS_NODES.filter((n) => nodeSide(n.x) === "right");

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden
    >
      <svg
        className="home-plexus-mesh absolute inset-0 h-full w-full"
        viewBox="0 0 1000 800"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Esquerda: mais preenchido, ainda sutil */}
        <g stroke={PALE_LINE} strokeWidth="0.38" opacity="0.13">
          {leftEdges.map(([a, b], i) => (
            <line
              key={`l-${i}`}
              x1={PLEXUS_NODES[a].x}
              y1={PLEXUS_NODES[a].y}
              x2={PLEXUS_NODES[b].x}
              y2={PLEXUS_NODES[b].y}
            />
          ))}
        </g>
        <g fill={PALE_NODE} opacity="0.2">
          {leftNodes.map((n, i) => (
            <circle key={`ln-${i}`} cx={n.x} cy={n.y} r="1.55" />
          ))}
        </g>

        {/* Centro-direita e direita: tons mais fortes, focal atrás do login */}
        <g stroke={RIGHT_LINE} strokeWidth="0.45" opacity="0.26">
          {mixedOrRightEdges.map(([a, b], i) => (
            <line
              key={`r-${i}`}
              x1={PLEXUS_NODES[a].x}
              y1={PLEXUS_NODES[a].y}
              x2={PLEXUS_NODES[b].x}
              y2={PLEXUS_NODES[b].y}
            />
          ))}
        </g>
        <g fill={RIGHT_NODE} opacity="0.38">
          {rightNodes.map((n, i) => (
            <circle key={`rn-${i}`} cx={n.x} cy={n.y} r="1.85" />
          ))}
        </g>
      </svg>

      <div className="home-plexus-glow absolute inset-0" />
      <div className="home-plexus-depth-mask absolute inset-0" />
    </div>
  );
}
