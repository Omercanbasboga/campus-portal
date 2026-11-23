import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Drawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import Skeleton from "@mui/material/Skeleton";
import ButtonBase from "@mui/material/ButtonBase";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

import api from "api/client";
import Box from "ui/Box";
import Text from "ui/Text";
import Input from "ui/Input";
import Button from "ui/Button";
import Avatar from "ui/Avatar";
import Page from "ui/Page";
import PageHero from "ui/PageHero";
import TreeView from "./TreeView";
import SunburstView from "./SunburstView";
import { indexTree, kindOf, pathIds, tint, unitColor } from "./palette";

const PREF_OPEN = "pref:orgchart-open";
const PREF_VIEW = "pref:orgchart-view";
const norm = (s) => (s || "").toLocaleLowerCase("tr-TR");

const readPref = (key, fallback) => {
  try {
    const v = localStorage.getItem(key);
    return v === null ? fallback : JSON.parse(v);
  } catch {
    return fallback;
  }
};
const writePref = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage unavailable: preferences just don't stick
  }
};

function UnitPanel({ entry, index, onClose, onSelect }) {
  const navigate = useNavigate();
  const theme = useTheme();
  const dark = theme.palette.mode === "dark";
  if (!entry) return null;
  const { node } = entry;
  const kind = kindOf(node);
  const color = unitColor(entry, dark);
  const path = pathIds(index, node.id).map((id) => index.get(id));

  return (
    <Box width={{ xs: "100vw", sm: 380 }} height="100%" display="flex" flexDirection="column">
      <Box
        p={3}
        pb={4}
        sx={{
          color: "#fff",
          background: `linear-gradient(135deg, ${color}, ${tint(color, 0.75)})`,
          position: "relative",
          overflow: "hidden",
          "&::after": {
            content: '""',
            position: "absolute",
            right: -40,
            top: -40,
            width: 180,
            height: 180,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.12)",
          },
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
          mb={2.5}
          position="relative"
          zIndex={1}
        >
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: "14px",
              display: "grid",
              placeItems: "center",
              bgcolor: "rgba(255,255,255,0.2)",
            }}
          >
            <Icon>{kind.icon}</Icon>
          </Box>
          <IconButton aria-label="Paneli kapat" onClick={onClose} sx={{ color: "#fff" }}>
            <Icon>close</Icon>
          </IconButton>
        </Box>
        <Text
          variant="body2"
          sx={{ color: "rgba(255,255,255,0.85)" }}
          position="relative"
          zIndex={1}
        >
          {kind.label}
        </Text>
        <Text
          variant="h3"
          component="h2"
          sx={{ color: "#fff", fontSize: "1.45rem" }}
          position="relative"
          zIndex={1}
        >
          {node.name}
        </Text>
      </Box>

      <Box px={3} py={3} flex={1} sx={{ overflowY: "auto" }}>
        <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={1} mb={3}>
          {[
            ["Personel", node.staffCount ?? 0],
            ["Öğrenci", node.studentCount ?? 0],
            ["Alt birim", node.children?.length ?? 0],
          ].map(([label, value]) => (
            <Box
              key={label}
              p={1.5}
              borderRadius="lg"
              sx={{ bgcolor: tint(color, dark ? 0.16 : 0.09) }}
            >
              <Text variant="h4" component="p" sx={{ fontSize: "1.6rem", color }}>
                {value}
              </Text>
              <Text variant="caption" color="text">
                {label}
              </Text>
            </Box>
          ))}
        </Box>

        <Text variant="body2" fontWeight={600} mb={1.25}>
          Yönetici
        </Text>
        <Box display="flex" alignItems="center" gap={1.5} mb={3}>
          <Avatar alt={node.managerName || ""} size="md">
            <Icon>person_off</Icon>
          </Avatar>
          <Box>
            <Text variant="body2" fontWeight={600}>
              {node.managerName || "Atanmamış"}
            </Text>
            <Text variant="caption" color="text">
              {node.managerTitle || "Bu birime yönetici kaydı yok"}
            </Text>
          </Box>
        </Box>

        <Text variant="body2" fontWeight={600} mb={1}>
          Bağlı olduğu yol
        </Text>
        <Box component="ol" m={0} mb={3} p={0} sx={{ listStyle: "none" }}>
          {path.map((e, i) => {
            const c = unitColor(e, dark);
            const last = i === path.length - 1;
            return (
              <Box component="li" key={e.node.id} display="flex" gap={1.25}>
                <Box display="flex" flexDirection="column" alignItems="center" pt={0.75}>
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      bgcolor: c,
                      boxShadow: `0 0 0 3px ${tint(c, 0.25)}`,
                    }}
                  />
                  {!last && <Box sx={{ width: 2, flex: 1, bgcolor: tint(c, 0.4), my: 0.5 }} />}
                </Box>
                <ButtonBase
                  onClick={() => onSelect(e.node.id)}
                  sx={{
                    pb: last ? 0 : 1.25,
                    fontSize: "0.88rem",
                    textAlign: "left",
                    fontWeight: last ? 700 : 400,
                  }}
                >
                  {e.node.name}
                </ButtonBase>
              </Box>
            );
          })}
        </Box>

        {node.children?.length > 0 && (
          <>
            <Text variant="body2" fontWeight={600} mb={1}>
              Alt birimler
            </Text>
            {node.children.map((c) => {
              const cc = unitColor(index.get(c.id), dark);
              return (
                <ButtonBase
                  key={c.id}
                  onClick={() => onSelect(c.id)}
                  sx={{
                    width: "100%",
                    justifyContent: "space-between",
                    gap: 1,
                    px: 1.5,
                    py: 1.1,
                    mb: 0.75,
                    borderRadius: "12px",
                    bgcolor: tint(cc, dark ? 0.12 : 0.07),
                    fontSize: "0.86rem",
                    textAlign: "left",
                    "&:hover": { bgcolor: tint(cc, dark ? 0.2 : 0.13) },
                  }}
                >
                  <Box display="flex" alignItems="center" gap={1}>
                    <Icon sx={{ fontSize: 18, color: cc }}>{kindOf(c).icon}</Icon>
                    {c.name}
                  </Box>
                  <Text
                    component="span"
                    variant="caption"
                    fontWeight={600}
                    sx={{ color: cc, whiteSpace: "nowrap" }}
                  >
                    {c.staffCount ?? 0} kişi
                  </Text>
                </ButtonBase>
              );
            })}
          </>
        )}
      </Box>

      <Divider />
      <Box p={2}>
        <Button
          fullWidth
          onClick={() => navigate(`/records/department-details/${node.id}`)}
          startIcon={<Icon>open_in_new</Icon>}
          sx={{ bgcolor: color, "&:hover": { bgcolor: color, filter: "brightness(1.08)" } }}
        >
          Birim sayfasını aç
        </Button>
      </Box>
    </Box>
  );
}

UnitPanel.propTypes = {
  entry: PropTypes.object,
  index: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
};

function OrganizationChart() {
  const theme = useTheme();
  const dark = theme.palette.mode === "dark";
  const wide = useMediaQuery("(min-width:900px)");
  const [root, setRoot] = useState(null);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(() => new Set(readPref(PREF_OPEN, [])));
  const [view, setView] = useState(() => readPref(PREF_VIEW, "agac"));
  const [selected, setSelected] = useState(null);
  const [focusId, setFocusId] = useState(null);
  const [query, setQuery] = useState("");
  const [zoom, setZoom] = useState(1);
  const drag = useRef(null);
  const canvas = useRef(null);

  useEffect(() => {
    api
      .get("/api/departments/tree")
      .then((res) => {
        const tree = Array.isArray(res.data) ? res.data[0] : res.data;
        setRoot(tree);
        // saved branches may come from another dataset; keep only ids that exist
        const known = indexTree(tree);
        setOpen((prev) => {
          const kept = [...prev].filter((id) => known.has(id));
          return kept.length ? new Set(kept) : new Set([tree.id]);
        });
        setFocusId(tree.id);
      })
      .catch(() => setError("Organizasyon ağacı alınamadı. Sayfayı yenileyip tekrar deneyin."));
  }, []);

  useEffect(() => writePref(PREF_OPEN, [...open]), [open]);
  useEffect(() => writePref(PREF_VIEW, view), [view]);

  const index = useMemo(() => (root ? indexTree(root) : new Map()), [root]);

  const matches = useMemo(() => {
    const q = norm(query.trim());
    if (q.length < 2) return new Set();
    return new Set(
      [...index.values()]
        .filter(({ node }) => norm(node.name).includes(q) || norm(node.managerName).includes(q))
        .map(({ node }) => node.id)
    );
  }, [query, index]);

  const onPath = useMemo(() => {
    const s = new Set();
    matches.forEach((id) => pathIds(index, id).forEach((p) => s.add(p)));
    return s;
  }, [matches, index]);

  useEffect(() => {
    if (!onPath.size) return;
    setOpen((prev) => new Set([...prev, ...onPath]));
    setFocusId([...matches][0]);
  }, [onPath, matches]);

  const toggle = useCallback((id) => {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const select = useCallback(
    (id) => {
      setSelected(id);
      setFocusId(id);
      setOpen((prev) => new Set([...prev, ...pathIds(index, id).slice(0, -1)]));
    },
    [index]
  );

  const focusBranch = (id) => {
    setOpen(
      new Set([
        root.id,
        ...[...index.values()]
          .filter((e) => pathIds(index, e.node.id).includes(id))
          .map((e) => e.node.id),
      ])
    );
    setFocusId(id);
  };

  // drag anywhere on the canvas to pan (the tree view scrolls inside it)
  const scrollerOf = () => canvas.current?.querySelector("[data-pan]");
  const onPointerDown = (e) => {
    const el = scrollerOf();
    if (!el || e.button !== 0 || e.target.closest("button")) return;
    drag.current = { x: e.clientX, y: e.clientY, left: el.scrollLeft, top: el.scrollTop };
  };
  const onPointerMove = (e) => {
    const el = scrollerOf();
    if (!drag.current || !el) return;
    el.scrollLeft = drag.current.left - (e.clientX - drag.current.x);
    el.scrollTop = drag.current.top - (e.clientY - drag.current.y);
  };
  const endDrag = () => {
    drag.current = null;
  };

  const totals = root
    ? [
        ["Birim", index.size, "account_tree"],
        ["Aktif personel", root.staffCount, "badge"],
        ["Öğrenci", root.studentCount, "school"],
        [
          "Fakülte ve enstitü",
          [...index.values()].filter((e) =>
            ["FAKULTE", "ENSTITU", "YUKSEKOKUL"].includes(e.node.nodeType)
          ).length,
          "apartment",
        ],
      ]
    : [];

  const branches = root ? root.children.map((c) => index.get(c.id)) : [];

  return (
    <Page>
      <PageHero
        tone="records"
        title="Organizasyon şeması"
        description="Birimlerin kime bağlı olduğu, kimin yönettiği ve kaç kişinin çalıştığı. Bir birime tıklayınca ayrıntıları sağda açılır."
        stats={totals}
      />

      <Box display="flex" flexWrap="wrap" alignItems="center" gap={1.5} mb={1.5}>
        <ToggleButtonGroup
          exclusive
          size="small"
          value={view}
          onChange={(_, v) => v && setView(v)}
          aria-label="Görünüm"
          sx={{
            "& .MuiToggleButton-root": {
              px: 1.75,
              gap: 0.75,
              textTransform: "none",
              fontWeight: 600,
            },
          }}
        >
          <ToggleButton value="agac">
            <Icon fontSize="small">account_tree</Icon>
            Ağaç
          </ToggleButton>
          <ToggleButton value="halka">
            <Icon fontSize="small">donut_large</Icon>
            Halka
          </ToggleButton>
        </ToggleButtonGroup>
        <Box flex={1} minWidth={220} maxWidth={360}>
          <Input
            placeholder="Birim ya da yönetici ara"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            icon={{ component: "search", direction: "left" }}
          />
        </Box>
        {query.trim().length >= 2 && (
          <Text variant="body2" fontWeight={600} color={matches.size ? "dark" : "error"}>
            {matches.size ? `${matches.size} birim bulundu` : "Eşleşen birim yok"}
          </Text>
        )}
        <Box flex={1} />
        {view === "agac" && (
          <Box display="flex" alignItems="center" gap={0.5}>
            <Tooltip title="Tümünü aç">
              <IconButton
                size="small"
                onClick={() => setOpen(new Set(index.keys()))}
                aria-label="Tümünü aç"
              >
                <Icon fontSize="small">unfold_more</Icon>
              </IconButton>
            </Tooltip>
            <Tooltip title="Tümünü kapat">
              <IconButton
                size="small"
                onClick={() => root && setOpen(new Set([root.id]))}
                aria-label="Tümünü kapat"
              >
                <Icon fontSize="small">unfold_less</Icon>
              </IconButton>
            </Tooltip>
            <Tooltip title="Uzaklaştır">
              <IconButton
                size="small"
                onClick={() => setZoom((z) => Math.max(0.5, +(z - 0.1).toFixed(1)))}
                aria-label="Uzaklaştır"
              >
                <Icon fontSize="small">zoom_out</Icon>
              </IconButton>
            </Tooltip>
            <Text
              variant="caption"
              sx={{ width: 40, textAlign: "center", fontVariantNumeric: "tabular-nums" }}
            >
              %{Math.round(zoom * 100)}
            </Text>
            <Tooltip title="Yakınlaştır">
              <IconButton
                size="small"
                onClick={() => setZoom((z) => Math.min(1.4, +(z + 0.1).toFixed(1)))}
                aria-label="Yakınlaştır"
              >
                <Icon fontSize="small">zoom_in</Icon>
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </Box>

      <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
        {branches.map((e) => {
          const c = unitColor(e, dark);
          return (
            <ButtonBase
              key={e.node.id}
              onClick={() => (view === "agac" ? focusBranch(e.node.id) : select(e.node.id))}
              sx={{
                gap: 0.75,
                px: 1.25,
                py: 0.5,
                borderRadius: 999,
                fontSize: "0.8rem",
                fontWeight: 600,
                color: c,
                bgcolor: tint(c, dark ? 0.16 : 0.1),
                border: `1px solid ${tint(c, 0.35)}`,
                "&:hover": { bgcolor: tint(c, dark ? 0.26 : 0.18) },
              }}
            >
              <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: c }} />
              {e.node.name}
            </ButtonBase>
          );
        })}
      </Box>

      <Card
        ref={canvas}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        sx={{
          height: { xs: "68vh", md: "calc(100vh - 380px)" },
          minHeight: 460,
          p: 0,
          cursor: view === "agac" ? "grab" : "default",
          "&:active": { cursor: view === "agac" ? "grabbing" : "default" },
          backgroundColor: theme.palette.surface.raised,
          backgroundImage: `radial-gradient(${tint(theme.palette.text.secondary, 0.16)} 1px, transparent 1px)`,
          backgroundSize: "20px 20px",
        }}
      >
        {error && (
          <Box p={4}>
            <Text color="error">{error}</Text>
          </Box>
        )}
        {!root && !error && (
          <Box p={4} display="grid" gap={2}>
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} variant="rounded" width={248} height={56} sx={{ ml: i ? 30 : 0 }} />
            ))}
          </Box>
        )}
        {root && view === "agac" && (
          <TreeView
            root={root}
            index={index}
            open={open}
            onToggle={toggle}
            selected={selected}
            onSelect={select}
            matches={matches}
            onPath={onPath}
            zoom={zoom}
            focusId={focusId}
          />
        )}
        {root && view === "halka" && (
          <Box height="100%" p={2}>
            <SunburstView index={index} onSelect={select} />
          </Box>
        )}
      </Card>

      <Drawer
        anchor={wide ? "right" : "bottom"}
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        PaperProps={{
          sx: {
            height: wide ? "100%" : "88vh",
            borderRadius: wide ? 0 : "16px 16px 0 0",
            overflow: "hidden",
          },
        }}
      >
        <UnitPanel
          entry={selected ? index.get(selected) : null}
          index={index}
          onClose={() => setSelected(null)}
          onSelect={select}
        />
      </Drawer>
    </Page>
  );
}

export default OrganizationChart;
