import { app, BrowserWindow, Menu, session, shell } from "electron";
import { join, resolve } from "node:path";

const APP_ORIGIN = "kite://desktop";
const DEV_SERVER_URL = process.env.KITE_DESKTOP_DEV_SERVER;

function getWebIndexPath(): string {
  if (app.isPackaged) {
    return join(app.getAppPath(), "web", "index.html");
  }

  return resolve(__dirname, "../../web/dist/index.html");
}

function registerCrossOriginIsolationHeaders(): void {
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    const responseHeaders = {
      ...details.responseHeaders,
      "Cross-Origin-Embedder-Policy": ["require-corp"],
      "Cross-Origin-Opener-Policy": ["same-origin"],
    };

    callback({ responseHeaders });
  });
}

function registerPermissionPolicy(): void {
  const allowedPermissions = new Set(["media", "display-capture"]);

  session.defaultSession.setPermissionRequestHandler((_webContents, permission, callback) => {
    callback(allowedPermissions.has(permission));
  });
}

function buildApplicationMenu(): void {
  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: "Kite",
      submenu: [
        { role: "about" },
        { type: "separator" },
        { role: "services" },
        { type: "separator" },
        { role: "hide" },
        { role: "hideOthers" },
        { role: "unhide" },
        { type: "separator" },
        { role: "quit" },
      ],
    },
    {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        { role: "selectAll" },
      ],
    },
    {
      label: "View",
      submenu: [
        { role: "reload" },
        { role: "forceReload" },
        { role: "toggleDevTools" },
        { type: "separator" },
        { role: "resetZoom" },
        { role: "zoomIn" },
        { role: "zoomOut" },
        { type: "separator" },
        { role: "togglefullscreen" },
      ],
    },
    {
      label: "Window",
      submenu: [{ role: "minimize" }, { role: "zoom" }, { role: "front" }],
    },
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

async function loadKite(window: BrowserWindow): Promise<void> {
  if (DEV_SERVER_URL) {
    await window.loadURL(DEV_SERVER_URL);
    return;
  }

  await window.loadFile(getWebIndexPath(), { hash: "/welcome" });
}

function createWindow(): BrowserWindow {
  const window = new BrowserWindow({
    backgroundColor: "#0B1020",
    height: 920,
    minHeight: 720,
    minWidth: 1024,
    show: false,
    title: "Kite",
    titleBarStyle: "hiddenInset",
    trafficLightPosition: { x: 18, y: 18 },
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: join(__dirname, "preload.js"),
      sandbox: true,
      webSecurity: true,
    },
    width: 1440,
  });

  window.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith(APP_ORIGIN)) {
      return { action: "allow" };
    }

    void shell.openExternal(url);
    return { action: "deny" };
  });

  window.once("ready-to-show", () => {
    window.show();
  });

  void loadKite(window);
  return window;
}

app.setName("Kite");
app.commandLine.appendSwitch("enable-features", "SharedArrayBuffer");

void app.whenReady().then(() => {
  registerCrossOriginIsolationHeaders();
  registerPermissionPolicy();
  buildApplicationMenu();

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
