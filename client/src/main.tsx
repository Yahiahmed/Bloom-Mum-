import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { remixiconUrl } from "./lib/utils";

// Add Remix icon stylesheet
const linkElement = document.createElement("link");
linkElement.rel = "stylesheet";
linkElement.href = remixiconUrl;
document.head.appendChild(linkElement);

// Add meta tags
const metaDescription = document.createElement("meta");
metaDescription.name = "description";
metaDescription.content = "AI-powered pregnancy assistant providing accurate information and support for expectant mothers";
document.head.appendChild(metaDescription);

// Add title
const titleElement = document.createElement("title");
titleElement.textContent = "MommyHelper | AI Pregnancy Assistant";
document.head.appendChild(titleElement);

// Add Open Graph tags
const ogTitle = document.createElement("meta");
ogTitle.property = "og:title";
ogTitle.content = "MommyHelper | AI Pregnancy Assistant";
document.head.appendChild(ogTitle);

const ogDescription = document.createElement("meta");
ogDescription.property = "og:description";
ogDescription.content = "Get personalized answers to your pregnancy questions with our AI assistant";
document.head.appendChild(ogDescription);

const ogType = document.createElement("meta");
ogType.property = "og:type";
ogType.content = "website";
document.head.appendChild(ogType);

createRoot(document.getElementById("root")!).render(<App />);
