import React, { useState, useCallback } from "react";
import { auth, db } from "../firebase";
import { withRouter } from "react-router-dom";

// Material UI
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const Login = (props) => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState(null);
  const [esRegistro, setEsRegistro] = useState(false);
  const procesarDatos = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Ingrese Email");
      return;
    }
    if (!pass.trim()) {
      setError("Ingrese Password");
      return;
    }

    if (pass.length < 6) {
      setError("Password de 6 caracteres o mas");

      return;
    }

    setError(null);
    if (esRegistro) {
      registrar();
    } else {
      login();
    }
  };
  const login = useCallback(async () => {
    try {
      const res = await auth.signInWithEmailAndPassword(email, pass);
      console.log(res.user);
      setEmail("");
      setPass("");
      setError(null);
      props.history.push("/admin");
    } catch (error) {
      console.log(error);
      if (error.code === "auth/invalid-email") {
        setError("Email no valido");
      }
      if (error.code === "auth/user-not-found") {
        setError("Email no registrado");
      }
      if (error.code === "auth/wrong-password") {
        setError("Contrasenha incorrecta");
      }
      setError(null);
    }
  }, [email, pass, props.history]);
  const registrar = useCallback(async () => {
    try {
      const res = await auth.createUserWithEmailAndPassword(email, pass);
      console.log(res.user);
      await db.collection("usuarios").doc(res.user.email).set({
        email: res.user.email,
        uid: res.user.uid,
      });
      setEmail("");
      setPass("");
      setError(null);
      props.history.push("/admin");
    } catch (error) {
      console.log(error);
      if (error.code === "auth/invalid-email") {
        setError("Email no valido");
      }
      if (error.code === "auth/email-already-in-use") {
        setError("Email ya existente");
      }
    }
  }, [email, pass, props.history]);

  const classes = useStyles();

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          {esRegistro ? "Registro de usuarios" : "Login de acceso"}
        </Typography>
        <form className={classes.form} onSubmit={procesarDatos} noValidate>
          {error && <div className="alert alert-danger">{error}</div>}
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Ingrese Email"
            name="email"
            autoComplete="email"
            autoFocus
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Ingrese una contrasenha"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={(e) => setPass(e.target.value)}
            value={pass}
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            {esRegistro ? "Registrarse" : "Acceder"}
          </Button>
          <Grid container>
            <Grid item xs></Grid>
            <Grid item>
              <Link
                href="#"
                variant="body2"
                onClick={() => setEsRegistro(!esRegistro)}
              >
                {esRegistro ? "Ya estas registrado?" : "No tienes cuenta?"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
};

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default withRouter(Login);
