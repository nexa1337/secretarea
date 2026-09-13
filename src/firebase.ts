export const auth = {
    onAuthStateChanged: (cb: any) => { cb(null); return () => {}; },
    signOut: () => {},
    currentUser: null
};

export const db = {};

export const signInWithGoogle = async () => {};
export const signInWithDiscord = async () => {};
