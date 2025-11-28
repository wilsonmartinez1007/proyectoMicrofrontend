import { registerApplication, start, navigateToUrl  } from "single-spa";
import {
  constructApplications,
  constructRoutes,
  constructLayoutEngine,
} from "single-spa-layout";
import microfrontendLayout from "./microfrontend-layout.html";

const routes = constructRoutes(microfrontendLayout);

const applications = constructApplications({
  routes,
  loadApp({ name }) {
    if (name !== "@inventario/inventario-mf") {
      return import(/* webpackIgnore: true */ name);
    }

    // Para el microfrontend Angular:
    // Cargamos el main.js (UMD) y devolvemos window["inventario-mf"]
    return import(/* webpackIgnore: true */ "//localhost:4200/main.js").then(
      () => {
        const mf = window["inventario-mf"];
        if (!mf) {
          throw new Error(
            "No se encontró window['inventario-mf'] después de cargar main.js"
          );
        }
        return mf; 
      }
    );
  },
});

const layoutEngine = constructLayoutEngine({ routes, applications });

applications.forEach(registerApplication);
layoutEngine.activate();
if (location.pathname === "/" || location.pathname === "") {
  navigateToUrl("/login");
}

start({
  urlRerouteOnly: true,
});