import { useEffect, useMemo, useRef } from "react";
import PropTypes from "prop-types";
import { hierarchy, tree } from "d3-hierarchy";
import Icon from "@mui/material/Icon";
import ButtonBase from "@mui/material/ButtonBase";
import { useTheme } from "@mui/material/styles";
import Box from "ui/Box";
import Text from "ui/Text";
import { kindOf, tint, unitColor } from "./palette";

const NODE_W = 280;
const NODE_H = 64;
const ROW = 78; // vertical distance between siblings
const COL = 340; // horizontal distance between levels
const PAD = 32;

// Left-to-right tree laid out by d3-hierarchy. Only open branches are part of
// the layout, so the chart stays as small as what you're looking at, and
// positions animate when branches open or close.
export default function TreeView({
  root,
  index,
  open,
  onToggle,
  selected,
  onSelect,
  matches,
  onPath,
  zoom,
  focusId,
}) {
  const theme = useTheme();
  const dark = theme.palette.mode === "dark";
  const scroller = useRef(null);

  const layout = useMemo(() => {
    const h = hierarchy(root, (d) => (open.has(d.id) ? d.children : null));
    tree()
      .nodeSize([ROW, COL])
      .separation((a, b) => (a.parent === b.parent ? 1 : 1.25))(h);
    const nodes = h.descendants();
    const minX = Math.min(...nodes.map((n) => n.x));
    const maxX = Math.max(...nodes.map((n) => n.x));
    const maxY = Math.max(...nodes.map((n) => n.y));
    nodes.forEach((n) => {
      n.top = n.x - minX + PAD;
      n.left = n.y + PAD;
    });
    return {
      nodes,
      links: h.links(),
      width: maxY + NODE_W + PAD * 2,
      height: maxX - minX + NODE_H + PAD * 2,
    };
  }, [root, open]);

  // keep the selected / searched unit in view
  useEffect(() => {
    if (!focusId || !scroller.current) return;
    const n = layout.nodes.find((x) => x.data.id === focusId);
    if (!n) return;
    const el = scroller.current;
    el.scrollTo({
      left: Math.max(0, n.left * zoom - el.clientWidth / 3),
      top: Math.max(0, n.top * zoom - el.clientHeight / 2),
      behavior: "smooth",
    });
  }, [focusId, layout, zoom]);

  const dimAll = matches.size > 0;

  return (
    <Box ref={scroller} sx={{ width: "100%", height: "100%", overflow: "auto" }} data-pan>
      <Box
        sx={{
          position: "relative",
          width: layout.width * zoom,
          height: layout.height * zoom,
          transition: "width 300ms, height 300ms",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            width: layout.width,
            height: layout.height,
            transform: `scale(${zoom})`,
            transformOrigin: "0 0",
          }}
        >
          <svg
            width={layout.width}
            height={layout.height}
            style={{ position: "absolute", inset: 0, overflow: "visible" }}
            aria-hidden
          >
            {layout.links.map(({ source, target }) => {
              const sx = source.left + NODE_W;
              const sy = source.top + NODE_H / 2;
              const tx = target.left;
              const ty = target.top + NODE_H / 2;
              const mx = (sx + tx) / 2;
              const color = unitColor(index.get(target.data.id), dark);
              const faded = dimAll && !onPath.has(target.data.id);
              return (
                <path
                  key={target.data.id}
                  d={`M${sx},${sy} C${mx},${sy} ${mx},${ty} ${tx},${ty}`}
                  fill="none"
                  stroke={color}
                  strokeOpacity={faded ? 0.15 : 0.7}
                  strokeWidth={2}
                  style={{ transition: "d 300ms ease, stroke-opacity 200ms" }}
                />
              );
            })}
          </svg>

          {layout.nodes.map((n) => {
            const node = n.data;
            const entry = index.get(node.id);
            const color = unitColor(entry, dark);
            const kind = kindOf(node);
            const kids = node.children?.length || 0;
            const isOpen = open.has(node.id);
            const isSel = selected === node.id;
            const faded = dimAll && !onPath.has(node.id);
            const hit = matches.has(node.id);
            return (
              <Box
                key={node.id}
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: NODE_W,
                  height: NODE_H,
                  transform: `translate(${n.left}px, ${n.top}px)`,
                  transition: "transform 300ms cubic-bezier(.2,.7,.2,1), opacity 200ms",
                  opacity: faded ? 0.3 : 1,
                  display: "flex",
                }}
              >
                <ButtonBase
                  onClick={() => onSelect(node.id)}
                  aria-pressed={isSel}
                  sx={{
                    flex: 1,
                    minWidth: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: 1.25,
                    pl: 0.75,
                    pr: kids ? 4 : 1.25,
                    borderRadius: "14px",
                    textAlign: "left",
                    bgcolor: isSel ? color : dark ? tint(color, 0.14) : "#fff",
                    color: isSel ? "#fff" : "text.primary",
                    border: `1px solid ${isSel ? color : tint(color, dark ? 0.45 : 0.35)}`,
                    boxShadow: isSel
                      ? `0 12px 28px -12px ${tint(color, 0.9)}`
                      : `0 6px 18px -14px ${tint(color, 0.9)}`,
                    outline: hit ? `2px solid ${color}` : "none",
                    outlineOffset: 3,
                    transition: "background-color 160ms, box-shadow 160ms, transform 160ms",
                    "&:hover": {
                      transform: "translateX(2px)",
                      boxShadow: `0 12px 26px -14px ${tint(color, 1)}`,
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      flexShrink: 0,
                      borderRadius: "11px",
                      display: "grid",
                      placeItems: "center",
                      bgcolor: isSel ? "rgba(255,255,255,0.22)" : color,
                      color: "#fff",
                    }}
                  >
                    <Icon sx={{ fontSize: 20 }}>{kind.icon}</Icon>
                  </Box>
                  <Box minWidth={0} flex={1}>
                    <Text
                      variant="body2"
                      fontWeight={600}

                      title={node.name}
                      sx={{
                        color: "inherit",
                        lineHeight: 1.25,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        fontSize: "0.84rem",
                      }}
                    >
                      {node.name}
                    </Text>
                    <Text
                      variant="caption"
                      noWrap
                      sx={{
                        color: isSel ? "rgba(255,255,255,0.85)" : "text.secondary",
                        display: "block",
                      }}
                    >
                      {node.staffCount ?? 0} kişi{node.managerName ? `, ${node.managerName}` : ""}
                    </Text>
                  </Box>
                </ButtonBase>
                {kids > 0 && (
                  <ButtonBase
                    onClick={() => onToggle(node.id)}
                    aria-expanded={isOpen}
                    aria-label={`${node.name}: ${isOpen ? "alt birimleri gizle" : `${kids} alt birimi göster`}`}
                    sx={{
                      position: "absolute",
                      right: -12,
                      top: NODE_H / 2 - 13,
                      width: 26,
                      height: 26,
                      borderRadius: "50%",
                      bgcolor: isOpen ? "background.paper" : color,
                      color: isOpen ? color : "#fff",
                      border: `2px solid ${color}`,
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      boxShadow: `0 4px 10px -4px ${tint(color, 0.8)}`,
                    }}
                  >
                    {isOpen ? <Icon sx={{ fontSize: 16 }}>chevron_left</Icon> : kids}
                  </ButtonBase>
                )}
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}

TreeView.propTypes = {
  root: PropTypes.object.isRequired,
  index: PropTypes.object.isRequired,
  open: PropTypes.object.isRequired,
  onToggle: PropTypes.func.isRequired,
  selected: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
  matches: PropTypes.object.isRequired,
  onPath: PropTypes.object.isRequired,
  zoom: PropTypes.number.isRequired,
  focusId: PropTypes.string,
};
