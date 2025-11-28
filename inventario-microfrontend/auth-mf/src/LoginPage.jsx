import { useState } from "react";
import { login, register } from "./api";
import { navigateToUrl } from "single-spa";

export default function LoginPage({ onLoginSuccess }) {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (mode === "login") {
        // ---- INICIAR SESIÓN ----
        const data = await login(username, password);
        localStorage.setItem("access_token", data.access);
        localStorage.setItem("refresh_token", data.refresh);
        navigateToUrl("/inventario");
        onLoginSuccess && onLoginSuccess();
      } else {
        // ---- REGISTRARSE ----
        await register(username, password);

        // Opcional: login automático después de registrarse
        const data = await login(username, password);
        localStorage.setItem("access_token", data.access);
        localStorage.setItem("refresh_token", data.refresh);
        navigateToUrl("/inventario");
        onLoginSuccess && onLoginSuccess();
      }
    } catch (err) {
      console.error(err);
      if (mode === "login") {
        setError("Usuario o contraseña incorrectos");
      } else {
        setError("No se pudo registrar el usuario");
      }
    }
  };

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "40px auto",
        padding: 20,
        borderRadius: 8,
        background: "#f5f5f5",
        boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
      }}
    >
      <h2 style={{ marginBottom: 20 }}>
        {mode === "login" ? "Iniciar sesión" : "Registrarse"}
      </h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 10 }}>
          <label>Usuario</label>
          <input
            style={{ width: "100%", padding: 6, marginTop: 4 }}
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>Contraseña</label>
          <input
            style={{ width: "100%", padding: 6, marginTop: 4 }}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && (
          <p style={{ color: "red", marginBottom: 10 }}>{error}</p>
        )}

        <button
          type="submit"
          style={{
            width: "100%",
            padding: 8,
            borderRadius: 6,
            border: "none",
            background: "#c14a30",
            color: "#fff",
            fontWeight: "bold",
            cursor: "pointer",
            marginBottom: 10,
          }}
        >
          {mode === "login" ? "Entrar" : "Crear cuenta"}
        </button>
      </form>

      {mode === "login" ? (
        <p style={{ fontSize: 14 }}>
          ¿No tienes cuenta?{" "}
          <button
            type="button"
            onClick={() => {
              setMode("register");
              setError("");
            }}
            style={{
              background: "none",
              border: "none",
              color: "#c14a30",
              textDecoration: "underline",
              cursor: "pointer",
              padding: 0,
            }}
          >
            Regístrate aquí
          </button>
        </p>
      ) : (
        <p style={{ fontSize: 14 }}>
          ¿Ya tienes cuenta?{" "}
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setError("");
            }}
            style={{
              background: "none",
              border: "none",
              color: "#c14a30",
              textDecoration: "underline",
              cursor: "pointer",
              padding: 0,
            }}
          >
            Inicia sesión
          </button>
        </p>
      )}
    </div>
  );
}
