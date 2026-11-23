import { Component, Suspense, useEffect, useState } from "react";
import PropTypes from "prop-types";
import LinearProgress from "@mui/material/LinearProgress";
import Tooltip from "@mui/material/Tooltip";
import Box from "ui/Box";
import Text from "ui/Text";
import Button from "ui/Button";
import { useUiController } from "ui/UiContext";
import { remoteEntryTiming } from "./remotes";

class RemoteBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    const { error } = this.state;
    const { remote, children } = this.props;
    if (!error) return children;
    // one remote being down must not take the shell or the other remote with it
    return (
      <Box px={{ xs: 2, md: 4 }} py={6} maxWidth="60ch">
        <Text variant="h5" mb={1}>
          {remote.label} şu an yüklenemiyor
        </Text>
        <Text variant="body2" color="text" mb={3}>
          Bu uygulamanın sunucusuna ulaşılamadı. Menüdeki diğer bölümler çalışmaya devam ediyor.
        </Text>
        <Button onClick={() => window.location.reload()}>Tekrar dene</Button>
      </Box>
    );
  }
}

RemoteBoundary.propTypes = { remote: PropTypes.object.isRequired, children: PropTypes.node };

function Seam({ remote }) {
  const [timing, setTiming] = useState(null);
  useEffect(() => {
    // the entry shows up in resource timing once the download finishes
    let tries = 0;
    let t;
    const look = () => {
      const found = remoteEntryTiming(remote.key);
      if (found) setTiming(found);
      else if (++tries < 20) t = setTimeout(look, 300);
    };
    look();
    return () => clearTimeout(t);
  }, [remote.key]);

  const detail = timing
    ? `remoteEntry.js ${timing.ms} ms${timing.kb ? `, ${timing.kb} kB` : ", önbellekten"}`
    : "";

  return (
    <Tooltip title={`Bu alanı "${remote.key}" uygulaması çiziyor. ${detail}`} placement="left">
      <Box
        component="p"
        m={0}
        sx={(t) => ({
          position: "absolute",
          top: 0,
          right: 0,
          px: 1.25,
          py: 0.25,
          fontSize: "0.72rem",
          fontWeight: 600,
          color: "#fff",
          bgcolor: remote.color,
          borderBottomLeftRadius: 6,
          zIndex: t.zIndex.appBar - 1,
          cursor: "default",
        })}
      >
        {remote.key} {timing ? `${timing.ms} ms` : ""}
      </Box>
    </Tooltip>
  );
}

Seam.propTypes = { remote: PropTypes.object.isRequired };

// frames a remote's page: a thin rule in its colour on the left and a tag
// naming which app drew it, so the seams between apps stay visible
export default function RemoteFrame({ remote }) {
  const { Routes } = remote;
  const [{ darkMode }] = useUiController();
  return (
    <Box position="relative" minHeight="100%" sx={{ borderLeft: `3px solid ${remote.color}` }}>
      <Seam remote={remote} />
      <RemoteBoundary remote={remote}>
        <Suspense
          fallback={
            <Box px={4} py={6}>
              <LinearProgress
                sx={{ mb: 2, "& .MuiLinearProgress-bar": { bgcolor: remote.color } }}
              />
              <Text variant="body2" color="text">
                {remote.label} yükleniyor
              </Text>
            </Box>
          }
        >
          <Routes darkMode={darkMode} />
        </Suspense>
      </RemoteBoundary>
    </Box>
  );
}

RemoteFrame.propTypes = { remote: PropTypes.object.isRequired };
