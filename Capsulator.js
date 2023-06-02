#!/usr/bin/env node

import inquirer from "inquirer";
import { execSync } from "child_process";

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

  const { projectName, projectType, dependencies } = await inquirer.prompt([
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
      choices: ["react", "react-native", "expo"],
    },
    {
      type: "checkbox",
      name: "dependencies",
      message: "Quelles dépendances supplémentaires voulez-vous installer ?",
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

  console.log(
    `\n${
      colors.redMatrix + colors.bright
    }╰( ͡° ͜ʖ ͡° )つ──☆*:・ﾟ Création d'un nouveau projet ${projectType} nommé ${projectName}...\n`
  );

  await ensureCommandExists(`create-${projectType}-app`);

  execSync(`npx create-${projectType}-app ${projectName}`, {
    stdio: "inherit",
  });

  console.log(
    `\n${
      colors.redMatrix + colors.bright + colors.underscore
    }(づ ￣ ³￣)づ Installation des dépendances...\n`
  );

  for (const dep of projectDeps) {
    console.log(
      `\n\n${
        colors.redMatrix + colors.bright
      }Installation de ${dep}... (˵ ͡° ͜ʖ ͡°˵)\n`
    );
    execSync(`cd ${projectName} && npm install ${dep}`, { stdio: "inherit" });
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
