import { useState } from "react";
import { useNavigate, useSearchParams, Link as RouterLink } from "react-router-dom";
import Card from "@mui/material/Card";
import Alert from "@mui/material/Alert";
import Box from "ui/Box";
import Text from "ui/Text";
import Input from "ui/Input";
import Button from "ui/Button";
import { startSession, initSessionGuard } from "auth/session";

const DEMO = { email: "demo@ornek.edu.tr", password: "kampus-demo", name: "Deniz Örnek" };

const REASONS = {
  "sure-doldu": "Oturum süresi doldu. Devam etmek için tekrar giriş yapın.",
  "baska-sekme": "Başka bir sekmede çıkış yapıldı.",
  cikis: "Çıkış yaptınız.",
};

export default function SignIn() {
  const [params] = useSearchParams();
  const [email, setEmail] = useState(DEMO.email);
  const [password, setPassword] = useState(DEMO.password);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const reason = REASONS[params.get("neden")];
  const next = params.get("devam") || "/analytics?bolum=trafik";

  const submit = (e) => {
    e.preventDefault();
    if (email.trim() !== DEMO.email || password !== DEMO.password) {
      setError(
        "E-posta ya da şifre demo hesabıyla eşleşmiyor. Alanlardaki hazır bilgilerle giriş yapın."
      );
      return;
    }
    startSession({ name: DEMO.name, email: DEMO.email });
    initSessionGuard();
    navigate(next, { replace: true });
  };

  return (
    <Box
      minHeight="100vh"
      display="grid"
      sx={{ placeItems: "center", px: 2, bgcolor: "background.default" }}
    >
      <Card
        component="form"
        onSubmit={submit}
        sx={{ width: "100%", maxWidth: 400, p: { xs: 3, sm: 4 } }}
      >
        <Text variant="h3" component="h1" mb={1}>
          Giriş yap
        </Text>
        <Text variant="body2" color="text" mb={3}>
          Bu bir demo. Alanlarda demo hesabının bilgileri hazır.
        </Text>
        {reason && (
          <Alert severity="info" sx={{ mb: 2 }}>
            {reason}
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Box display="grid" gap={2} mb={3}>
          <Input
            label="E-posta"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
          />
          <Input
            label="Şifre"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </Box>
        <Button type="submit" fullWidth size="large">
          Giriş yap
        </Button>
        <Text variant="body2" color="text" mt={2} textAlign="center">
          <Box component={RouterLink} to="/" sx={{ color: "primary.main" }}>
            Portal nasıl çalışıyor
          </Box>
        </Text>
      </Card>
    </Box>
  );
}
