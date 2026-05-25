import { contextBridge } from "electron";

contextBridge.exposeInMainWorld("kiteDesktop", {
  platform: process.platform,
  version: process.versions.electron,
});
