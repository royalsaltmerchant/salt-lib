import { LandingPage } from "./landing/components/LandingPage.js";

const appRoot = document.getElementById("app");
if (!appRoot) {
  throw new Error("Missing #app root element");
}

new LandingPage({ domElem: appRoot });
