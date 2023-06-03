#!/usr/bin/env node

import inquirer from "inquirer";
import { execSync } from "child_process";
import { join } from "path";
import fs from "fs";

// Couleurs pour les messages.
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  underscore: "\x1b[4m",
  redMatrix: "\x1b[31;5;58m",
  blackBackground: "\x1b[40m",
  whiteText: "\x1b[37m",
  whiteBackground: "\x1b[47m",
  blackText: "\x1b[30m",
};

// Dépendances pour chaque type de projet
const dependencies = {
  react: [
    "@fortawesome/fontawesome-svg-core",
    "@fortawesome/free-solid-svg-icons",
    "@fortawesome/react-fontawesome",
    "@reduxjs/toolkit",
    "antd",
    "formik",
    "moment",
    "react",
    "react-dom",
    "react-moment",
    "react-router-dom",
    "styled-components",
    "socket.io-client",
    "uuid",
  ],
  "react-native": [
    "@fortawesome/fontawesome-svg-core",
    "@fortawesome/free-solid-svg-icons",
    "@fortawesome/react-fontawesome",
    "@reduxjs/toolkit",
    "@react-native-async-storage/async-storage",
    "@react-native-community/datetimepicker",
    "@react-native-community/picker",
    "@react-native-community/slider",
    "@react-navigation/bottom-tabs",
    "@react-navigation/native",
    "@react-navigation/native-stack",
    "antd",
    "formik",
    "lottie-react-native",
    "moment",
    "react",
    "react-dom",
    "react-native",
    "react-native-app-intro-slider",
    "react-native-gesture-handler",
    "react-native-get-random-values",
    "react-native-keyboard-aware-scroll-view",
    "react-native-modal",
    "react-native-reanimated",
    "react-native-safe-area-context",
    "react-native-screens",
    "react-native-svg",
    "react-native-vector-icons",
    "react-redux",
    "react-router-dom",
    "rn-glitch-effect",
    "styled-components",
    "socket.io-client",
    "toggle-switch-react-native",
    "uuid",
  ],
  expo: [
    "@fortawesome/fontawesome-svg-core",
    "@fortawesome/free-solid-svg-icons",
    "@fortawesome/react-fontawesome",
    "@reduxjs/toolkit",
    "@expo/webpack-config",
    "@reduxjs/toolkit",
    "@react-native-async-storage/async-storage",
    "@react-native-community/datetimepicker",
    "@react-native-community/picker",
    "@react-native-community/slider",
    "@react-navigation/bottom-tabs",
    "@react-navigation/native",
    "@react-navigation/native-stack",
    "antd",
    "formik",
    "expo",
    "expo-camera",
    "expo-checkbox",
    "expo-font",
    "expo-image-picker",
    "expo-linear-gradient",
    "expo-splash-screen",
    "expo-status-bar",
    "expo-updates",
    "lottie-react-native",
    "moment",
    "react",
    "react-dom",
    "react-moment",
    "react-native",
    "react-native-app-intro-slider",
    "react-native-gesture-handler",
    "react-native-get-random-values",
    "react-native-keyboard-aware-scroll-view",
    "react-native-modal",
    "react-native-reanimated",
    "react-native-safe-area-context",
    "react-native-screens",
    "react-native-svg",
    "react-native-vector-icons",
    "react-redux",
    "react-router-dom",
    "rn-glitch-effect",
    "styled-components",
    "socket.io-client",
    "toggle-switch-react-native",
    "uuid",
  ],
  next: [
    "@fortawesome/fontawesome-svg-core",
    "@fortawesome/free-solid-svg-icons",
    "@fortawesome/react-fontawesome",
    "@reduxjs/toolkit",
    "antd",
    "formik",
    "moment",
    "next",
    "react",
    "react-dom",
    "react-moment",
    "react-router-dom",
    "styled-components",
    "socket.io-client",
    "uuid",
  ],
};

// Fonction qui vérifie si une commande est installée sur le système.
function commandExists(command) {
  try {
    execSync(`command -v ${command}`, { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

// Fonction qui s'assure qu'une commande est installée.
async function ensureCommandExists(command) {
  if (!commandExists(command)) {
    const { install } = await inquirer.prompt([
      {
        type: "confirm",
        name: "install",
        message: `${command} n'est pas installé. Voulez-vous l'installer maintenant ? (☝ ՞ਊ ՞)☝`,
        default: true,
      },
    ]);

    if (install) {
      execSync(`sudo npm install -g ${command}`, { stdio: "inherit" });
    } else {
      console.error(
        `${command} est nécessaire pour continuer. Installation annulée. (ノಠ益ಠ)ノ彡┻━┻`
      );
      process.exit(1);
    }
  }
}

let backendProjectName;

async function main() {
  // Affiche un message de bienvenue.
  console.log(`\n${colors.redMatrix + colors.bright}
 ▄████▄   ▄▄▄       ██▓███    ██████  █    ██  ██▓    ▄▄▄     ▄▄▄█████▓ ▒█████   ██▀███  
▒██▀ ▀█  ▒████▄    ▓██░  ██▒▒██    ▒  ██  ▓██▒▓██▒   ▒████▄   ▓  ██▒ ▓▒▒██▒  ██▒▓██ ▒ ██▒
▒▓█    ▄ ▒██  ▀█▄  ▓██░ ██▓▒░ ▓██▄   ▓██  ▒██░▒██░   ▒██  ▀█▄ ▒ ▓██░ ▒░▒██░  ██▒▓██ ░▄█ ▒
▒▓▓▄ ▄██▒░██▄▄▄▄██ ▒██▄█▓▒ ▒  ▒   ██▒▓▓█  ░██░▒██░   ░██▄▄▄▄██░ ▓██▓ ░ ▒██   ██░▒██▀▀█▄  
▒ ▓███▀ ░ ▓█   ▓██▒▒██▒ ░  ░▒██████▒▒▒▒█████▓ ░██████▒▓█   ▓██▒ ▒██▒ ░ ░ ████▓▒░░██▓ ▒██▒
░ ░▒ ▒  ░ ▒▒   ▓▒█░▒▓▒░ ░  ░▒ ▒▓▒ ▒ ░░▒▓▒ ▒ ▒ ░ ▒░▓  ░▒▒   ▓▒█░ ▒ ░░   ░ ▒░▒░▒░ ░ ▒▓ ░▒▓░
  ░  ▒     ▒   ▒▒ ░░▒ ░     ░ ░▒  ░ ░░░▒░ ░ ░ ░ ░ ▒  ░ ▒   ▒▒ ░   ░      ░ ▒ ▒░   ░▒ ░ ▒░
░          ░   ▒   ░░       ░  ░  ░   ░░░ ░ ░   ░ ░    ░   ▒    ░      ░ ░ ░ ▒    ░░   ░ 
░ ░            ░  ░               ░     ░         ░  ░     ░  ░            ░ ░     ░     
░                                                                                        \n`);

  const { projectName, projectType } = await inquirer.prompt([
    {
      type: "input",
      name: "projectName",
      message: "Quel est le nom de votre projet ?",
      default: "my-capsulator-app",
    },
    {
      type: "list",
      name: "projectType",
      message: "Quel type de projet voulez-vous créer ?",
      choices: ["react", "react-native", "expo", "next"],
    },
  ]);

  const projectDeps = dependencies[projectType];

  console.log(
    `\n${
      colors.redMatrix + colors.bright
    }╰( ͡° ͜ʖ ͡° )つ──☆*:・ﾟ Création d'un nouveau projet ${projectType} nommé ${projectName}...\n`
  );

  if (projectType === "next") {
    await ensureCommandExists("create-next-app");
    execSync(`npx create-next-app ${projectName}`, { stdio: "inherit" });
  } else {
    await ensureCommandExists(`create-${projectType}-app`);
    execSync(`npx create-${projectType}-app ${projectName}`, {
      stdio: "inherit",
    });
  }

  console.log(
    `\n${
      colors.redMatrix + colors.bright + colors.underscore
    }(づ ￣ ³￣)づ Installation des dépendances...\n`
  );

  const { selectedDeps } = await inquirer.prompt([
    {
      type: "checkbox",
      name: "selectedDeps",
      message: "Quelles dépendances supplémentaires voulez-vous installer ?",
      choices: projectDeps,
    },
  ]);

  for (const dep of selectedDeps) {
    console.log(
      `\n\n${
        colors.redMatrix + colors.bright
      }Installation de ${dep}... (˵ ͡° ͜ʖ ͡°˵)\n`
    );
    execSync(`cd ${projectName} && npm install ${dep}`, { stdio: "inherit" });
  }

  // Fonction pour générer le fichier connection.js
  function generateConnectionFile(projectName) {
    const content = `
const mongoose = require('mongoose');

const connectionString = process.env.CONNECTION_STRING;

mongoose.connect(connectionString, { connectTimeoutMS: 2000 })
  .then(() => console.log('Database connected'))
  .catch(error => console.error(error));
`;

    const dirPath = join(process.cwd(), projectName, "models");
    const filePath = join(dirPath, "connection.js");

    // Créer le répertoire 'models' si il n'existe pas
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    fs.writeFileSync(filePath, content);
  }

  const backendDeps = [
    "cors",
    "node-fetch@2",
    "dotenv",
    "jest",
    "supertest",
    { name: "mongoose", postInstall: generateConnectionFile },
  ];

  const { installBackend } = await inquirer.prompt([
    {
      type: "confirm",
      name: "installBackend",
      message: "Voulez-vous installer un backend (Express) ?",
      default: false,
    },
  ]);

  if (installBackend) {
    // Assurez-vous que 'express-generator' est installé
    await ensureCommandExists("express-generator");

    console.log(
      `\n\n${
        colors.redMatrix + colors.bright
      }Création du squelette de l'application Express... (˵ ͡° ͜ʖ ͡°˵)\n`
    );

    // Demander le nom du projet backend
    const { backendProjectName: projectName } = await inquirer.prompt([
      {
        type: "input",
        name: "backendProjectName",
        message: "Quel est le nom de votre projet backend ?",
        validate: (input) => !!input,
      },
    ]);

    backendProjectName = projectName;

    // Créer le répertoire pour le backend
    fs.mkdirSync(join(process.cwd(), backendProjectName));

    // Générer le projet Express dans ce répertoire
    execSync(`cd ${backendProjectName} && express --no-view`, {
      stdio: "inherit",
    });

    const { selectedBackendDeps } = await inquirer.prompt([
      {
        type: "checkbox",
        name: "selectedBackendDeps",
        message: "Quelles dépendances de backend voulez-vous installer ?",
        choices: backendDeps.map((dep) =>
          typeof dep === "string" ? dep : dep.name
        ),
      },
    ]);

    for (const dep of backendDeps) {
      const depName = typeof dep === "string" ? dep : dep.name;
      if (selectedBackendDeps.includes(depName)) {
        console.log(
          `\n\n${
            colors.redMatrix + colors.bright
          }Installation de ${depName}... (˵ ͡° ͜ʖ ͡°˵)\n`
        );
        execSync(`cd ${backendProjectName} && npm install ${depName}`, {
          stdio: "inherit",
        });

        if (dep.postInstall) {
          dep.postInstall(backendProjectName);
        }
      }
    }
  }

  const { deployVercel } = await inquirer.prompt([
    {
      type: "confirm",
      name: "deployVercel",
      message: "Voulez-vous déployer sur Vercel ?",
      default: false,
    },
  ]);

  if (deployVercel) {
    const vercelConfig = `
{
  "version": 2,
  "builds": [
    {
      "src": "app.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "app.js"
    }
  ]
}
`;
    const filePath = join(process.cwd(), backendProjectName, "vercel.json");
    fs.writeFileSync(filePath, vercelConfig);

    console.log(
      `\n${
        colors.redMatrix + colors.bright + colors.underscore
      }Fichier vercel.json généré avec succès !\n`
    );
  }

  console.log(
    `\n${
      colors.redMatrix + colors.bright + colors.underscore
    }ʕっ•ᴥ•ʔっ Tout est Prêt !\n`
  );

  console.log(
    `\n${colors.redMatrix + colors.bright + colors.underscore}© 2023 ${
      colors.whiteText + colors.blackBackground
    }Code${colors.blackText + colors.whiteBackground}Sacha${
      colors.reset + colors.redMatrix + colors.bright + colors.underscore
    } https://github.com/SBigz/Capsulator\n`
  );
}

main().catch((err) => console.error(err));
