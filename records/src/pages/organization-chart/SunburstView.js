import { useMemo } from "react";
import PropTypes from "prop-types";
import Highcharts from "highcharts";
import "highcharts/modules/sunburst";
import HighchartsReact from "highcharts-react-official";
import { useTheme } from "@mui/material/styles";
import { unitColor } from "./palette";

// The whole university on one disc: each ring is a level and every leaf unit
// counts as one, so a slice's width shows how many units sit under it.
// Clicking a slice drills into it and opens its details.
export default function SunburstView({ index, onSelect }) {
  const theme = useTheme();
  const dark = theme.palette.mode === "dark";

  const options = useMemo(() => {
    const data = [...index.values()].map(({ node, parent }) => {
      const leaf = !node.children?.length;
      return {
        id: node.id,
        parent: parent || "",
        name: node.name,
        color: unitColor(index.get(node.id), dark),
        // every leaf counts the same, so the disc shows structure; head
        // counts are in the tooltip
        ...(leaf && { value: 1 }),
        staff: node.staffCount || 0,
        manager: node.managerName || "atanmamış",
      };
    });
    return {
      chart: {
        backgroundColor: "transparent",
        style: { fontFamily: '"IBM Plex Sans", sans-serif' },
      },
      title: { text: null },
      credits: { enabled: false },
      accessibility: { enabled: false },
      tooltip: {
        backgroundColor: theme.palette.background.paper,
        borderColor: theme.palette.divider,
        style: { color: theme.palette.text.primary },
        pointFormat: "<b>{point.name}</b><br/>{point.staff} kişi, yönetici {point.manager}",
      },
      series: [
        {
          type: "sunburst",
          data,
          allowTraversingTree: true,
          cursor: "pointer",
          borderColor: theme.palette.background.paper,
          borderWidth: 2,
          breadcrumbs: {
            format: "{level.name}",
            buttonTheme: { style: { color: theme.palette.text.secondary } },
          },
          dataLabels: {
            style: { textOutline: "none", fontWeight: 600, fontSize: "11px", color: "#fff" },
            rotationMode: "circular",
            filter: { property: "outerArcLength", operator: ">", value: 40 },
          },
          levels: [
            { level: 1, dataLabels: { rotationMode: "parallel", style: { fontSize: "13px" } } },
            { level: 2, colorByPoint: false },
            { level: 3, colorByPoint: false },
            { level: 4, colorByPoint: false },
          ],
          point: {
            events: {
              click() {
                onSelect(this.id);
              },
            },
          },
        },
      ],
    };
  }, [index, dark, theme, onSelect]);

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
      containerProps={{ style: { width: "100%", height: "100%" } }}
    />
  );
}

SunburstView.propTypes = {
  index: PropTypes.object.isRequired,
  onSelect: PropTypes.func.isRequired,
};
