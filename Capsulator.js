#!/usr/bin/env node 

const inquirer = require("inquirer");
const { execSync } = require("child_process");

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
        message: `${command} n'est pas installé. Voulez-vous l'installer maintenant?`,
        default: true,
      },
    ]);

    if (install) {
      execSync(`npm install -g ${command}`, { stdio: "inherit" });
    } else {
      console.error(
        `${command} est nécessaire pour continuer. Installation annulée.`
      );
      process.exit(1);
    }
  }
}

async function main() {
  // Affiche un message de bienvenue.
  console.log("Bienvenue dans Capsulator !");

  const { projectName, projectType, dependencies } = await inquirer.prompt([
    {
      type: "input",
      name: "projectName",
      message: "Quel est le nom de votre projet?",
      default: "my-react-app",
    },
    {
      type: "list",
      name: "projectType",
      message: "Quel type de projet voulez-vous créer?",
      choices: ["react", "react-native", "expo"],
    },
    {
      type: "checkbox",
      name: "dependencies",
      message: "Quelles dépendances supplémentaires voulez-vous installer?",
      choices: [
        "@expo/webpack-config",
        "@fortawesome/fontawesome-svg-core",
        "@fortawesome/free-solid-svg-icons",
        "@fortawesome/react-native-fontawesome",
        "@react-native-async-storage/async-storage",
        "@react-native-community/datetimepicker",
        "@react-native-community/picker",
        "@react-native-community/slider",
        "@react-navigation/bottom-tabs",
        "@react-navigation/native",
        "@react-navigation/native-stack",
        "@reduxjs/toolkit",
        "expo",
        "expo-camera",
        "expo-checkbox",
        "expo-font",
        "expo-image-picker",
        "expo-linear-gradient",
        "expo-splash-screen",
        "expo-status-bar",
        "expo-updates",
        "jest",
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
        "rn-glitch-effect",
        "socket.io-client",
        "toggle-switch-react-native",
        "uuid",
      ],
    },
  ]);

  const defaultDeps = {
    react: ["react", "react-dom"],
    "react-native": ["react", "react-native"],
    expo: ["react", "react-native", "expo"],
  };

  const projectDeps = defaultDeps[projectType].concat(dependencies);

  console.log(`Création d'un nouveau projet ${projectType} nommé ${projectName}...`);

  await ensureCommandExists(`create-${projectType}-app`);

  execSync(`npx create-${projectType}-app ${projectName}`, {
    stdio: "inherit",
  });

  console.log("Installation des dépendances...");

  for (const dep of projectDeps) {
    console.log(`Installation de ${dep}...`);
    execSync(`cd ${projectName} && npm install ${dep}`, { stdio: "inherit" });
  }

  console.log("Tout est terminé !");
  console.log("© 2023 Sacha Bigou - CodeSacha. https://github.com/SBigz/Capsulator"); // Remplacez "Votre nom" par votre nom.
}

main().catch((err) => console.error(err));
