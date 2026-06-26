"use client";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useState, useSyncExternalStore } from "react";

type Platform = "ios" | "android" | null;

interface PromptState {
  showPrompt: boolean;
  platform: Platform;
}

function detectPlatform(): PromptState {
  const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
  if (isStandalone) {
    return { showPrompt: false, platform: null };
  }

  const isIOSDevice =
    /iPad|iPhone|iPod/.test(navigator.userAgent) && !("MSStream" in window);
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  const isAndroidDevice = /Android/.test(navigator.userAgent);
  const isChrome = /Chrome/.test(navigator.userAgent);

  if (isIOSDevice && isSafari) {
    const dismissed = localStorage.getItem("pwa-install-prompt-dismissed-ios");
    if (dismissed) {
      return { showPrompt: false, platform: null };
    }
    return { showPrompt: true, platform: "ios" };
  }

  if (isAndroidDevice && isChrome) {
    const dismissed = localStorage.getItem(
      "pwa-install-prompt-dismissed-android",
    );
    if (dismissed) {
      return { showPrompt: false, platform: null };
    }
    return { showPrompt: true, platform: "android" };
  }

  return { showPrompt: false, platform: null };
}

const subscribe = () => () => {};
const serverSnapshot: PromptState = { showPrompt: false, platform: null };
const getServerSnapshot = (): PromptState => serverSnapshot;

let clientSnapshot: PromptState | null = null;
const getClientSnapshot = (): PromptState => {
  if (clientSnapshot === null) {
    clientSnapshot = detectPlatform();
  }
  return clientSnapshot;
};

export function InstallPrompt() {
  const initialState = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );

  const [dismissed, setDismissed] = useState(false);
  const state = dismissed
    ? { showPrompt: false, platform: null }
    : initialState;

  const handleDismiss = () => {
    if (state.platform === "ios") {
      localStorage.setItem("pwa-install-prompt-dismissed-ios", "true");
    } else if (state.platform === "android") {
      localStorage.setItem("pwa-install-prompt-dismissed-android", "true");
    }
    setDismissed(true);
  };

  if (!state.showPrompt) {
    return null;
  }

  if (state.platform === "ios") {
    return (
      <div className="bg-primary text-primary-foreground fixed right-0 bottom-0 left-0 z-50 p-4 shadow-lg">
        <div className="relative container mx-auto">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDismiss}
            className="hover:bg-primary-foreground/10 absolute top-0 right-0 size-4"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Dismiss</span>
          </Button>
          <div>
            <h3 className="mb-1 font-semibold">Install AirSense</h3>
            <p className="text-sm opacity-90">
              Install this app on you iOS device by tapping the{" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-0.5 mb-[5px] inline-block size-4!"
                viewBox="0 -960 960 960"
                fill="currentColor"
              >
                <path d="M240-40q-33 0-56.5-23.5T160-120v-440q0-33 23.5-56.5T240-640h120v80H240v440h480v-440H600v-80h120q33 0 56.5 23.5T800-560v440q0 33-23.5 56.5T720-40H240Zm200-280v-447l-64 64-56-57 160-160 160 160-56 57-64-64v447h-80Z" />
              </svg>
              <strong>Share</strong>, then select{" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-0.5 mb-0.5 inline-block size-4!"
                viewBox="0 -960 960 960"
                fill="currentColor"
              >
                <path d="M440-280h80v-160h160v-80H520v-160h-80v160H280v80h160v160ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z" />
              </svg>
              <strong>Add to Home Screen</strong>.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (state.platform === "android") {
    return (
      <div className="bg-primary text-primary-foreground fixed right-0 bottom-0 left-0 z-50 p-4 shadow-lg">
        <div className="relative container mx-auto">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDismiss}
            className="hover:bg-primary-foreground/10 absolute top-0 right-0 size-4"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Dismiss</span>
          </Button>
          <div>
            <h3 className="mb-1 font-semibold">Install AirSense</h3>
            <p className="text-sm opacity-90">
              Install this app on your Android device by tapping the{" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-0.5 mb-0.5 inline-block size-4!"
                viewBox="0 -960 960 960"
                fill="currentColor"
              >
                <path d="M480-160q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm0-240q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm0-240q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z" />
              </svg>
              <strong>Menu</strong>, then tap{" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-0.5 mb-0.5 inline-block size-4!"
                viewBox="0 -960 960 960"
                fill="currentColor"
              >
                <path d="M440-280h80v-160h160v-80H520v-160h-80v160H280v80h160v160ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z" />
              </svg>
              <strong>Install app</strong> or{" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-0.5 mb-0.5 inline-block size-4!"
                viewBox="0 -960 960 960"
                fill="currentColor"
              >
                <path d="M240-120v-80l40-40H160q-33 0-56.5-23.5T80-320v-440q0-33 23.5-56.5T160-840h320v80H160v440h640v-120h80v120q0 33-23.5 56.5T800-240H680l40 40v80H240Zm360-240L400-560l56-56 104 103v-327h80v327l104-103 56 56-200 200Z" />
              </svg>
              <strong>Add to home screen</strong>.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
