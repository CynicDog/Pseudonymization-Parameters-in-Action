# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Dependencies 

```bash
npm install gh-pages --save-dev
```

```bash
npm install d3
```

## Deploy with `gh-pages`

#### A. Ensure the repository name is in lowercase.

#### B. Configure base URL information in React project. 

1. `vite.config.js`
    ```jsx
    export default defineConfig({ base: "/pseudonymization-parameters-in-action", plugins: [react()], })
    ```

2. `package.json`

    `
    ...
    "homepage": "https://cynicdog.github.io/pseudonymization-parameters-in-action",
    ...
    `

#### C. Configure the repository's deployment source branch 

<img width="100%" alt="image" src="https://github.com/user-attachments/assets/5e31f96a-b186-43f1-b4e1-7568fa9e2893" />

