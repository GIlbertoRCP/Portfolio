# Gilberto Romero-Cano — Portfolio

Source for my portfolio site: **https://gilbertorcp.github.io/Portfolio/**

I'm a Computer Science student at CU Denver (B.S., expected May 2027) working on GPU computing, ML evaluation, and data pipelines.

## Featured projects

| Project | What it is | Repo |
|---|---|---|
| Relativistic Raymarcher | CUDA C++ and WebGPU geodesic tracer for Schwarzschild, Kerr and Reissner-Nordström spacetimes, with cross-backend validation | [raymarcher](https://github.com/GIlbertoRCP/raymarcher) |
| predictive-audit | Checks a time-series forecasting result against trivial baselines and common leakage mistakes | [predictive_audit](https://github.com/GIlbertoRCP/predictive_audit) |
| F1 Winner Oracle | Calibrated race-winner odds, frozen before each race in a hash-chained log and scored in public (started as a fork of a classmate's project) | [F1-Prediction](https://github.com/GIlbertoRCP/F1-Prediction) |
| Spatial Pipeline: Photo Hotspot Engine | Finds wildlife and nature photo hotspots in geotagged observations using equal-area hexes, Moran's I, Getis-Ord Gi* and seasonal lift | [spatial_pipeline](https://github.com/GIlbertoRCP/spatial_pipeline) |
| WhispNotes | Native macOS note app with on-device Whisper transcription and a local LLM assistant | [whispNotes](https://github.com/GIlbertoRCP/whispNotes) |
| Movie Match | Real-time paired movie picker with a two-tower recommender | [movie_match](https://github.com/GIlbertoRCP/movie_match) |
| Literature Companion | Local desktop RAG app (Tauri, FastAPI, ChromaDB) with hybrid retrieval and spaced repetition | [ficP](https://github.com/GIlbertoRCP/ficP) |
| Predictive SDN | Team course project: Kafka-based SDN telemetry with LSTM forecasting | [Predictive_Activation](https://github.com/GIlbertoRCP/Predictive_Activation) |

## Stack

[Astro](https://astro.build) with MDX, React islands for the interactive demos, Tailwind CSS, and KaTeX for equations. It deploys to GitHub Pages through [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) on every push to `main`.

`backend_api/` is an unused FastAPI prototype for an LLM-backed chat assistant. The live site's assistant runs entirely in the browser (`src/components/ChatWidget.jsx`).

## Run locally

```sh
npm install
npm run dev      # http://localhost:4321/Portfolio/
npm run build    # static output in dist/
```

## Layout

```text
src/layouts/Layout.astro    shared nav, footer, chat widget
src/pages/index.astro       home page and project cards
src/pages/about.astro       about, education, certifications
src/pages/projects/*.mdx    one case-study page per project
src/components/*.jsx        interactive demos (illustrative, run in the browser)
public/assets/              project images and thumbnails
```
