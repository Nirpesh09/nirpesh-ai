const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;
const SESSION_KEY = "nirpesh.google.session.v1";

export type GoogleUser = {
  id: string;
  email: string;
  name: string;
  picture?: string;
  provider: "google";
};

/** Decode a JWT payload without verifying (client-side only, verification done server-side) */
function decodeJwt(token: string): Record<string, unknown> {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch {
    return {};
  }
}

/** Load the Google Identity Services script */
export function loadGoogleScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return resolve();
    if ((window as unknown as { google?: unknown }).google) return resolve();
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google Sign-In"));
    document.head.appendChild(script);
  });
}

/** Sign in with Google using One Tap / prompt */
export function signInWithGooglePopup(): Promise<GoogleUser> {
  return new Promise(async (resolve, reject) => {
    try {
      await loadGoogleScript();
      const g = (window as unknown as { google: { accounts: { id: {
        initialize: (cfg: object) => void;
        prompt: (cb?: (n: { isDisplayed: () => boolean; isNotDisplayed: () => boolean; isSkippedMoment: () => boolean; isDismissedMoment: () => boolean }) => void) => void;
        renderButton: (el: HTMLElement, cfg: object) => void;
      } } } }).google;

      g.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: (response: { credential: string }) => {
          const payload = decodeJwt(response.credential);
          const user: GoogleUser = {
            id: payload.sub as string,
            email: payload.email as string,
            name: payload.name as string,
            picture: payload.picture as string | undefined,
            provider: "google",
          };
          saveGoogleSession(user);
          resolve(user);
        },
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      g.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          reject(new Error("Google Sign-In prompt was not shown. Please check your browser settings or try the button below."));
        }
      });
    } catch (err) {
      reject(err);
    }
  });
}

/** Render a Google Sign-In button into an element */
export function renderGoogleButton(element: HTMLElement, onSuccess: (user: GoogleUser) => void, onError: (err: Error) => void) {
  loadGoogleScript().then(() => {
    const g = (window as unknown as { google: { accounts: { id: {
      initialize: (cfg: object) => void;
      renderButton: (el: HTMLElement, cfg: object) => void;
    } } } }).google;

    g.accounts.id.initialize({
      client_id: CLIENT_ID,
      callback: (response: { credential: string }) => {
        const payload = decodeJwt(response.credential);
        const user: GoogleUser = {
          id: payload.sub as string,
          email: payload.email as string,
          name: payload.name as string,
          picture: payload.picture as string | undefined,
          provider: "google",
        };
        saveGoogleSession(user);
        onSuccess(user);
      },
    });

    g.accounts.id.renderButton(element, {
      theme: "filled_black",
      size: "large",
      width: element.offsetWidth || 320,
      shape: "rectangular",
      logo_alignment: "left",
      text: "signin_with",
    });
  }).catch(onError);
}

export function saveGoogleSession(user: GoogleUser) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function loadGoogleSession(): GoogleUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as GoogleUser;
  } catch {
    return null;
  }
}

export function clearGoogleSession() {
  localStorage.removeItem(SESSION_KEY);
}
