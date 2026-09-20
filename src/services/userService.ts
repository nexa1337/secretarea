import { db } from '../firebase';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  onSnapshot, 
  collection, 
  deleteDoc, 
  increment, 
  arrayUnion, 
  arrayRemove 
} from 'firebase/firestore';

/**
 * Recursively removes undefined values and converts unsupported types so Firestore never throws
 * "Unsupported field value: undefined" errors.
 */
export function sanitizeForFirestore<T = any>(data: T): T {
  if (data === undefined) {
    return null as any;
  }
  if (data === null || typeof data !== 'object') {
    return data;
  }
  // Preserve Firestore FieldValues (increment, deleteField, serverTimestamp, arrayUnion, arrayRemove)
  if (
    ('_methodName' in (data as any)) ||
    ((data as any).constructor && (data as any).constructor.name === 'FieldValue')
  ) {
    return data;
  }
  if (Array.isArray(data)) {
    return data
      .filter((item) => item !== undefined)
      .map((item) => sanitizeForFirestore(item)) as any;
  }
  const clean: Record<string, any> = {};
  for (const [key, value] of Object.entries(data as Record<string, any>)) {
    if (value !== undefined) {
      clean[key] = sanitizeForFirestore(value);
    }
  }
  return clean as any;
}

export interface UserProfileData {
  uid: string;
  email: string;
  displayName: string;
  username: string;
  photoURL: string;
  bannerURL?: string;
  bio?: string;
  role?: 'admin' | 'user' | string;
  points?: number;
  level?: number;
  rank?: string;
  badge?: string;
  status?: 'active' | 'blocked' | 'blacklisted';
  isBlocked?: boolean;
  isBlacklisted?: boolean;
  blockCount?: number;
  blockedReason?: string;
  blockedUntil?: string | null;
  blockedAt?: string;
  blacklistedAt?: string;
  blacklistReason?: string;
  createdAt?: string;
  lastLogin?: string;
  lastActive?: string;
  gamesViewed?: number;
  contentLiked?: number;
  pcSpecs?: {
    gpuModel?: string;
    cpuModel?: string;
    ram?: number;
    os?: string;
    isActive?: boolean;
  };
  stash?: string[];
  liked?: any[];
  likedGames?: any[];
  favorites?: any[];
  favoriteGames?: any[];
  library?: Array<{
    id: string;
    name?: string;
    title?: string;
    coverImage?: string;
    status: string;
    addedAt?: string;
    category?: string;
    timestamp?: string;
  }>;
  libraryGames?: any[];
  gameHistory?: Array<{
    id: string;
    name?: string;
    coverImage?: string;
    timestamp?: string;
    type?: string;
  }>;
  recentGames?: any[];
  activities?: Array<{
    id?: string;
    type?: string;
    action?: string;
    title?: string;
    description?: string;
    details?: string;
    timestamp?: string;
    targetName?: string;
    targetId?: string;
    gameId?: string;
  }>;
  ip?: string;
}

export const DEFAULT_PROFILE: UserProfileData = {
  uid: 'guest',
  email: '',
  displayName: 'SecretArea Gamer',
  username: 'gamer',
  photoURL: '',
  bannerURL: '/images/userprofile.png',
  bio: '',
  role: 'user',
  points: 0,
  level: 1,
  rank: 'Scout',
  badge: 'Novice Scout',
  status: 'active',
  isBlocked: false,
  isBlacklisted: false,
  blockCount: 0,
  createdAt: new Date().toISOString(),
  stash: [],
  liked: [],
  favorites: [],
  library: [],
  gameHistory: [],
  activities: [],
  pcSpecs: {
    gpuModel: '',
    cpuModel: '',
    ram: 16,
    os: '10',
    isActive: true,
  }
};

const ROOT_ADMIN_EMAIL = 'secretarea1337@gmail.com';

export function isUserAdmin(email?: string | null, role?: string | null): boolean {
  if (email && email.toLowerCase() === ROOT_ADMIN_EMAIL.toLowerCase()) return true;
  if (role && role.toLowerCase() === 'admin') return true;
  return false;
}

export function computeUserRank(points: number = 0): string {
  if (points >= 5000) return 'Grandmaster';
  if (points >= 2500) return 'Legend';
  if (points >= 1000) return 'Master';
  if (points >= 500) return 'Elite';
  if (points >= 200) return 'Veteran';
  if (points >= 50) return 'Adventurer';
  return 'Scout';
}

export function computeUserLevel(points: number = 0): number {
  return Math.max(1, Math.floor(points / 100) + 1);
}

export function computeUserBadge(user: UserProfileData | any): string {
  if (!user) return 'Novice Scout';
  const role = (user.role || '').toLowerCase();
  const email = (user.email || '').toLowerCase();
  if (email === ROOT_ADMIN_EMAIL.toLowerCase() || role === 'admin') {
    return 'System Sovereign';
  }
  const pts = user.points || 0;
  if (pts >= 3000) return 'Immortal Legend';
  if (pts >= 1500) return 'Elite Vanguard';
  if (pts >= 800) return 'Master Curator';
  if (pts >= 300) return 'Active Voyager';
  if (pts >= 100) return 'Certified Explorer';
  return 'Novice Scout';
}

export function getLocalProfile(uid: string): UserProfileData | null {
  try {
    const key = uid === 'guest' ? 'nexa_guest_profile' : `secretarea_profile_${uid}`;
    const data = localStorage.getItem(key);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.warn('Error reading local profile', e);
  }
  return null;
}

export function saveLocalProfile(uid: string, profile: UserProfileData): void {
  try {
    const key = uid === 'guest' ? 'nexa_guest_profile' : `secretarea_profile_${uid}`;
    localStorage.setItem(key, JSON.stringify(profile));
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('secretarea_profile_sync', { detail: { uid, profile } }));
      }, 0);
    }
  } catch (e) {
    console.warn('Error writing local profile', e);
  }
}

export function subscribeUserProfile(
  uid: string,
  callback: (profile: UserProfileData) => void,
  currentUser?: any
): () => void {
  if (!uid || uid === 'guest') {
    const emitGuest = () => {
      const guest = getLocalProfile('guest') || DEFAULT_PROFILE;
      callback(guest);
    };
    emitGuest();
    const handleSync = (e: any) => {
      if (e.detail?.uid === 'guest') {
        callback(e.detail.profile);
      } else {
        const guest = getLocalProfile('guest') || DEFAULT_PROFILE;
        callback(guest);
      }
    };
    window.addEventListener('secretarea_profile_sync', handleSync);
    return () => {
      window.removeEventListener('secretarea_profile_sync', handleSync);
    };
  }

  // Pre-emit local cache if present
  const local = getLocalProfile(uid);
  if (local) {
    callback(local);
  }

  try {
    const userDocRef = doc(db, 'users', uid);
    const unsubscribe = onSnapshot(userDocRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data() as UserProfileData;
        const likedNorm = data.liked || data.likedGames || [];
        const libraryNorm = data.library || data.libraryGames || [];
        const historyNorm = data.gameHistory || data.recentGames || [];
        const favoritesNorm = data.favorites || data.favoriteGames || [];
        const activitiesNorm = data.activities || [];
        const merged: UserProfileData = {
          ...DEFAULT_PROFILE,
          ...data,
          uid,
          email: data.email || currentUser?.email || '',
          displayName: data.displayName || currentUser?.displayName || 'SecretArea Gamer',
          username: data.username || (data.email || currentUser?.email || '').split('@')[0] || 'gamer',
          photoURL: data.photoURL || currentUser?.photoURL || '',
          points: data.points ?? 0,
          rank: computeUserRank(data.points ?? 0),
          badge: computeUserBadge(data),
          liked: likedNorm,
          likedGames: likedNorm,
          library: libraryNorm,
          libraryGames: libraryNorm,
          gameHistory: historyNorm,
          recentGames: historyNorm,
          favorites: favoritesNorm,
          favoriteGames: favoritesNorm,
          activities: activitiesNorm
        };
        saveLocalProfile(uid, merged);
        callback(merged);
      } else if (currentUser) {
        ensureUserProfile(currentUser).then((created) => callback(created));
      }
    }, (error) => {
      console.warn('Firestore user profile snapshot note (handled):', error?.message);
      if (local) callback(local);
    });

    return unsubscribe;
  } catch (err) {
    console.warn('subscribeUserProfile subscription error (handled):', err);
    return () => {};
  }
}

export async function ensureUserProfile(user: any): Promise<UserProfileData> {
  if (!user || !user.uid) return DEFAULT_PROFILE;
  const uid = user.uid;
  const userDocRef = doc(db, 'users', uid);

  try {
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      const data = snap.data() as UserProfileData;
      const isAdmin = (user.email && user.email.toLowerCase() === ROOT_ADMIN_EMAIL.toLowerCase()) || data.role === 'admin';
      const updated: Partial<UserProfileData> = {
        lastLogin: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        role: isAdmin ? 'admin' : (data.role || 'user')
      };
      await updateDoc(userDocRef, updated);
      const merged: UserProfileData = { ...DEFAULT_PROFILE, ...data, ...updated, uid };
      saveLocalProfile(uid, merged);
      return merged;
    }
  } catch (e: any) {
    console.warn('Firestore ensureUserProfile lookup note (handled):', e?.message);
  }

  // Create new profile if not found
  const isAdmin = user.email && user.email.toLowerCase() === ROOT_ADMIN_EMAIL.toLowerCase();
  const newProfile: UserProfileData = {
    ...DEFAULT_PROFILE,
    uid,
    email: user.email || '',
    displayName: user.displayName || 'SecretArea Gamer',
    username: user.email ? user.email.split('@')[0] : 'gamer',
    photoURL: user.photoURL || '',
    bannerURL: '/images/userprofile.png',
    role: isAdmin ? 'admin' : 'user',
    points: 100, // Welcome points
    level: 1,
    rank: 'Scout',
    badge: isAdmin ? 'System Sovereign' : 'Novice Scout',
    status: 'active',
    isBlocked: false,
    isBlacklisted: false,
    blockCount: 0,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    lastActive: new Date().toISOString()
  };

  try {
    await setDoc(userDocRef, newProfile, { merge: true });
  } catch (err: any) {
    console.warn('Firestore create profile note (handled):', err?.message);
  }
  saveLocalProfile(uid, newProfile);
  return newProfile;
}

export async function updateUserProfileData(uid: string, partial: Partial<UserProfileData>): Promise<void> {
  if (!uid) return;
  const local = getLocalProfile(uid) || DEFAULT_PROFILE;
  const merged = { ...local, ...partial, uid };
  saveLocalProfile(uid, merged);

  try {
    const userDocRef = doc(db, 'users', uid);
    await updateDoc(userDocRef, sanitizeForFirestore({
      ...partial,
      lastActive: new Date().toISOString()
    }));
  } catch (err: any) {
    console.warn('Firestore update profile note (handled):', err?.message);
  }
}

export async function saveUserProfileInfo(
  uid: string,
  user: any,
  info: { displayName?: string; username?: string; bio?: string; photoURL?: string; bannerURL?: string }
): Promise<void> {
  if (!uid) return;
  const local = getLocalProfile(uid) || DEFAULT_PROFILE;
  const now = new Date().toISOString();
  const activities = [{
    id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    type: 'profile_update',
    action: 'PROFILE_UPDATE',
    title: `Updated Profile: ${info.displayName || local.displayName || 'Gamer'}`,
    timestamp: now
  }, ...(local.activities || [])].slice(0, 100);

  const updated: UserProfileData = {
    ...local,
    ...info,
    uid,
    displayName: info.displayName ?? local.displayName,
    username: info.username ?? local.username,
    bio: info.bio ?? local.bio,
    photoURL: info.photoURL ?? local.photoURL,
    bannerURL: info.bannerURL ?? local.bannerURL,
    activities
  };
  saveLocalProfile(uid, updated);

  try {
    const userDocRef = doc(db, 'users', uid);
    await setDoc(userDocRef, sanitizeForFirestore({ ...info, activities, lastActive: now }), { merge: true });
  } catch (err: any) {
    console.warn('Firestore saveUserProfileInfo note (handled):', err?.message);
  }

  // If this user is admin, sync to system/admin_profile in Firestore as well
  if (isUserAdmin(user?.email, local.role)) {
    saveAdminPublicProfile({
      displayName: info.displayName || local.displayName,
      photoURL: info.photoURL || local.photoURL,
      bannerURL: info.bannerURL || local.bannerURL
    }).catch(() => {});
  }
}

export async function saveAdminPublicProfile(data: { photoURL?: string; avatarURL?: string; displayName?: string; bannerURL?: string }): Promise<void> {
  const photo = data.photoURL || data.avatarURL;
  if (photo) localStorage.setItem('secretarea_admin_avatar', photo);
  if (data.displayName) localStorage.setItem('secretarea_admin_name', data.displayName);
  if (data.bannerURL) localStorage.setItem('secretarea_admin_banner', data.bannerURL);

  try {
    const adminDocRef = doc(db, 'system', 'admin_profile');
    await setDoc(adminDocRef, {
      ...data,
      ...(photo ? { photoURL: photo, avatarURL: photo } : {}),
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (e: any) {
    console.warn('Firestore saveAdminPublicProfile note (handled):', e?.message);
  }
}

export function getStoredHardwareSpecs(): { ram: number; os: string; cpuModel: string; gpuModel: string; isActive: boolean } {
  try {
    const raw = localStorage.getItem('secretarea_hardware_specs');
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ram: Number(parsed.ram) || 16,
        os: String(parsed.os || '10'),
        cpuModel: parsed.cpuModel || 'Core i5-12400',
        gpuModel: parsed.gpuModel || 'GeForce RTX 3060',
        isActive: Boolean(parsed.isActive)
      };
    }
  } catch (e) {}
  return {
    ram: 16,
    os: '10',
    cpuModel: 'Core i5-12400',
    gpuModel: 'GeForce RTX 3060',
    isActive: false
  };
}

export async function saveUserHardwareSpecs(uid: string, specs: any): Promise<void> {
  try {
    localStorage.setItem('secretarea_hardware_specs', JSON.stringify(specs));
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('secretarea_hardware_sync', { detail: specs }));
      }, 0);
    }
  } catch (e) {}

  if (!uid) return;
  const local = getLocalProfile(uid) || DEFAULT_PROFILE;
  const now = new Date().toISOString();
  const activities = [{
    id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    type: 'specs_update',
    action: 'HARDWARE_UPDATE',
    title: `Updated Hardware: ${specs.gpuModel || 'GPU'} / ${specs.cpuModel || 'CPU'} (${specs.ram || 16}GB)`,
    timestamp: now
  }, ...(local.activities || [])].slice(0, 100);

  const updated: UserProfileData = {
    ...local,
    pcSpecs: { ...(local.pcSpecs || {}), ...specs },
    activities
  };
  saveLocalProfile(uid, updated);

  try {
    const userDocRef = doc(db, 'users', uid);
    await setDoc(userDocRef, sanitizeForFirestore({
      pcSpecs: specs,
      activities,
      lastActive: now
    }), { merge: true });
  } catch (err: any) {
    console.warn('Firestore saveUserHardwareSpecs note (handled):', err?.message);
  }
}

export async function saveUserStash(uid: string, stash: string[]): Promise<void> {
  if (!uid) return;
  const local = getLocalProfile(uid) || DEFAULT_PROFILE;
  const now = new Date().toISOString();

  // Clean stash list (unique, non-empty strings)
  const cleanStash = Array.from(new Set((stash || []).filter(Boolean).map(String)));

  // Preserve existing rich objects for items that remain in stash
  const currentFavorites = local.favorites || local.favoriteGames || [];
  const updatedFavorites: any[] = [];

  // First keep existing rich objects that are still in stash
  currentFavorites.forEach((fav: any) => {
    const fid = typeof fav === 'string' ? fav : String(fav?.id || fav?.gameId || '');
    if (cleanStash.some(s => s.toLowerCase() === fid.toLowerCase())) {
      if (!updatedFavorites.some(u => String(u?.id || u?.gameId || u).toLowerCase() === fid.toLowerCase())) {
        updatedFavorites.push(fav);
      }
    }
  });

  // For any stash id that wasn't already an object in favorites, add a clean representation
  cleanStash.forEach(sid => {
    const exists = updatedFavorites.some(u => String(u?.id || u?.gameId || u).toLowerCase() === sid.toLowerCase());
    if (!exists) {
      updatedFavorites.push({
        id: sid,
        name: sid,
        title: sid,
        coverImage: '',
        category: 'game',
        addedAt: now,
        timestamp: now
      });
    }
  });

  try {
    localStorage.setItem('myStash', JSON.stringify(cleanStash));
    localStorage.setItem('stash', JSON.stringify(cleanStash));
  } catch (e) {}

  const updated: UserProfileData = {
    ...local,
    stash: cleanStash,
    favorites: updatedFavorites,
    favoriteGames: updatedFavorites
  };
  saveLocalProfile(uid, updated);

  try {
    const userDocRef = doc(db, 'users', uid);
    await setDoc(userDocRef, sanitizeForFirestore({
      stash: cleanStash,
      favorites: updatedFavorites,
      favoriteGames: updatedFavorites,
      lastActive: now
    }), { merge: true });
  } catch (err: any) {
    console.warn('Firestore saveUserStash note (handled):', err?.message);
  }
}

export async function awardUserXp(uid: string, xp: number, reason?: string): Promise<void> {
  if (!uid || xp <= 0) return;
  const local = getLocalProfile(uid) || DEFAULT_PROFILE;
  const newPoints = (local.points || 0) + xp;
  const updated: UserProfileData = {
    ...local,
    points: newPoints,
    level: computeUserLevel(newPoints),
    rank: computeUserRank(newPoints)
  };
  saveLocalProfile(uid, updated);

  try {
    const userDocRef = doc(db, 'users', uid);
    await setDoc(userDocRef, {
      points: increment(xp),
      lastActive: new Date().toISOString()
    }, { merge: true });
  } catch (err: any) {
    console.warn('Firestore awardUserXp note (handled):', err?.message);
  }
}

export async function recordGameInteraction(
  uid: string,
  game: any,
  interactionType: 'view' | 'like' | 'favorite' | 'unfavorite' | 'unlike' | 'remove' | 'stash' | 'library' | string = 'view',
  status?: string
): Promise<void> {
  if (!uid || !game) return;
  const rawId = typeof game === 'string' ? game : (game.id || game.gameId || game.title || 'game');
  const gameId = String(rawId);
  const gameName = String((typeof game === 'object' ? (game.name || game.title) : '') || (typeof game === 'string' ? game : 'Game Details'));
  const coverImage = (typeof game === 'object' ? (game.coverImage || game.background_image || game.image) : '') || '';
  const category = (typeof game === 'object' ? game.category : '') || 'game';
  const genres = (typeof game === 'object' ? game.genres : '') || '';
  const version = (typeof game === 'object' ? game.version : '') || 'v1.0';
  const repackSize = (typeof game === 'object' ? game.repackSize : '') || '';
  const description = (typeof game === 'object' ? game.description : '') || '';
  const links = (typeof game === 'object' ? game.links : null) || null;

  const local = getLocalProfile(uid) || DEFAULT_PROFILE;
  let liked = [...(local.liked || local.likedGames || [])];
  let favorites = [...(local.favorites || local.favoriteGames || [])];
  let stash = [...(local.stash || [])];
  let library = [...(local.library || local.libraryGames || [])];
  let history = [...(local.gameHistory || local.recentGames || [])];
  let activities = [...(local.activities || [])];
  let xpAward = 0;

  const now = new Date().toISOString();

  const isMatch = (target: any) => {
    if (!target) return false;
    if (typeof target === 'string') return target.toLowerCase() === gameId.toLowerCase();
    if (target.id && String(target.id).toLowerCase() === gameId.toLowerCase()) return true;
    if (target.gameId && String(target.gameId).toLowerCase() === gameId.toLowerCase()) return true;
    if (gameName && target.name && String(target.name).toLowerCase().trim() === gameName.toLowerCase().trim()) return true;
    return false;
  };

  const itemPayload = {
    id: gameId,
    name: gameName,
    title: gameName,
    coverImage,
    category,
    genres,
    version,
    repackSize,
    description,
    links: links ? sanitizeForFirestore(links) : null,
    addedAt: now,
    timestamp: now
  };

  if (interactionType === 'view') {
    history = [{ ...itemPayload, type: 'view' }, ...history.filter(h => !isMatch(h))].slice(0, 100);
    xpAward = 5;
  } else if (interactionType === 'like') {
    liked = [{ ...itemPayload, type: 'like' }, ...liked.filter(g => !isMatch(g))];
    xpAward = 15;
  } else if (interactionType === 'unlike') {
    liked = liked.filter(g => !isMatch(g));
  } else if (interactionType === 'favorite') {
    favorites = [{ ...itemPayload, type: 'favorite' }, ...favorites.filter(g => !isMatch(g))];
    if (!stash.some(s => (typeof s === 'string' ? s.toLowerCase() === gameId.toLowerCase() : isMatch(s)))) {
      stash = [gameId, ...stash];
    }
    xpAward = 25;
  } else if (interactionType === 'unfavorite') {
    favorites = favorites.filter(g => !isMatch(g));
    stash = stash.filter(s => (typeof s === 'string' ? s.toLowerCase() !== gameId.toLowerCase() : !isMatch(s)));
  } else if (interactionType === 'library') {
    library = [{ ...itemPayload, status: status || 'Playing' }, ...library.filter(l => !isMatch(l))];
    xpAward = 20;
  }

  try {
    localStorage.setItem('myStash', JSON.stringify(stash));
    localStorage.setItem('stash', JSON.stringify(stash));
  } catch (e) {}

  // Record movement activity with guaranteed unique ID
  const activityItem = {
    id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    type: interactionType,
    action: interactionType.toUpperCase(),
    title: `${interactionType.charAt(0).toUpperCase() + interactionType.slice(1)}: ${gameName}`,
    targetName: gameName,
    targetId: gameId,
    category,
    coverImage,
    timestamp: now
  };
  activities = [activityItem, ...activities.filter((a: any) => a.id !== activityItem.id)].slice(0, 100);

  const updated: UserProfileData = {
    ...local,
    stash,
    liked,
    likedGames: liked,
    favorites,
    favoriteGames: favorites,
    library,
    libraryGames: library,
    gameHistory: history,
    recentGames: history,
    activities,
    points: (local.points || 0) + xpAward
  };
  saveLocalProfile(uid, updated);

  try {
    const userDocRef = doc(db, 'users', uid);
    const payload: any = {
      stash,
      liked,
      likedGames: liked,
      favorites,
      favoriteGames: favorites,
      library,
      libraryGames: library,
      gameHistory: history,
      recentGames: history,
      activities,
      lastActive: now
    };
    if (xpAward > 0) {
      payload.points = increment(xpAward);
    }
    await setDoc(userDocRef, sanitizeForFirestore(payload), { merge: true });
  } catch (err: any) {
    console.warn('Firestore recordGameInteraction note (handled):', err?.message);
  }
}

export async function removeGameFromLibrary(uid: string, gameId: string): Promise<void> {
  if (!uid || !gameId) return;
  const targetId = typeof gameId === 'object' ? String((gameId as any).id || (gameId as any).gameId || '') : String(gameId);
  if (!targetId) return;
  const local = getLocalProfile(uid) || DEFAULT_PROFILE;
  const library = (local.library || local.libraryGames || []).filter((g: any) => {
    if (!g) return false;
    if (typeof g === 'string') return g.toLowerCase() !== targetId.toLowerCase();
    const gid = String(g.id || g.gameId || '');
    return gid.toLowerCase() !== targetId.toLowerCase();
  });
  const now = new Date().toISOString();
  const activities = [{
    id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    type: 'library_remove',
    action: 'LIBRARY_REMOVE',
    title: `Removed from Library: ${targetId}`,
    targetId,
    timestamp: now
  }, ...(local.activities || [])].slice(0, 100);

  const updated: UserProfileData = {
    ...local,
    library,
    libraryGames: library,
    activities
  };
  saveLocalProfile(uid, updated);

  try {
    const userDocRef = doc(db, 'users', uid);
    await setDoc(userDocRef, sanitizeForFirestore({
      library,
      libraryGames: library,
      activities,
      lastActive: now
    }), { merge: true });
  } catch (err: any) {
    console.warn('Firestore removeGameFromLibrary note (handled):', err?.message);
  }
}

export async function updateGameLibraryStatus(uid: string, gameId: string, newStatus: string): Promise<void> {
  if (!uid || !gameId) return;
  const local = getLocalProfile(uid) || DEFAULT_PROFILE;
  let library = [...(local.library || local.libraryGames || [])];
  const existingIdx = library.findIndex((g: any) => (typeof g === 'string' ? g === gameId : g.id === gameId));
  const now = new Date().toISOString();

  let targetName = gameId;
  if (existingIdx >= 0) {
    targetName = library[existingIdx].name || library[existingIdx].title || gameId;
    library[existingIdx] = { ...library[existingIdx], status: newStatus, timestamp: now };
  } else {
    library.push({
      id: gameId,
      name: gameId,
      title: gameId,
      status: newStatus,
      addedAt: now,
      timestamp: now
    });
  }

  const activities = [{
    id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    type: 'library_update',
    action: 'LIBRARY_STATUS',
    title: `Library Status: ${targetName} -> ${newStatus}`,
    targetName,
    targetId: gameId,
    timestamp: now
  }, ...(local.activities || [])].slice(0, 100);

  const updated: UserProfileData = {
    ...local,
    library,
    libraryGames: library,
    activities
  };
  saveLocalProfile(uid, updated);

  try {
    const userDocRef = doc(db, 'users', uid);
    await setDoc(userDocRef, sanitizeForFirestore({
      library,
      libraryGames: library,
      activities,
      lastActive: now
    }), { merge: true });
  } catch (err: any) {
    console.warn('Firestore updateGameLibraryStatus note (handled):', err?.message);
  }
}

export async function clearGameHistory(uid: string): Promise<void> {
  if (!uid) return;
  const local = getLocalProfile(uid) || DEFAULT_PROFILE;
  const now = new Date().toISOString();
  const updated: UserProfileData = {
    ...local,
    gameHistory: [],
    recentGames: []
  };
  saveLocalProfile(uid, updated);

  try {
    const userDocRef = doc(db, 'users', uid);
    await setDoc(userDocRef, {
      gameHistory: [],
      recentGames: [],
      lastActive: now
    }, { merge: true });
  } catch (err: any) {
    console.warn('Firestore clearGameHistory note (handled):', err?.message);
  }
}

export function trackUserMovement(activity: { action: string; targetName?: string; targetId?: string; details?: string }): void {
  try {
    const guestOrUser = localStorage.getItem('secret_area_unlocked') === 'true';
    if (!guestOrUser) return;
    const history = JSON.parse(localStorage.getItem('secretarea_movements') || '[]');
    history.unshift({
      ...activity,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('secretarea_movements', JSON.stringify(history.slice(0, 100)));
  } catch (e) {}
}

const DEFAULT_ADMIN_AVATAR = 'https://blogger.googleusercontent.com/img/a/AVvXsEg0cECd44EYPreCyyRdRXdrtpVgQ4zhKzzTRdtiusek9QZ6nOVADqxzHsfsdEmEc2uWMAzaWMRsNXcpsI3cAOarcDnfXSrFyDXvfPQbMfsFsdWRVsv0S6ZcNPDc2GsNLQhv2x9K9ftA9bthdBDkYEkCt5styw5GuPQ1R6ig_ao0lDy_8F69e5bhdQ3Px3zo';

export function getCachedAdminAvatar(): string {
  try {
    return localStorage.getItem('secretarea_admin_avatar') || DEFAULT_ADMIN_AVATAR;
  } catch (e) {
    return DEFAULT_ADMIN_AVATAR;
  }
}

export function getCachedAdminName(): string {
  try {
    return localStorage.getItem('secretarea_admin_name') || 'NEXA 1337';
  } catch (e) {
    return 'NEXA 1337';
  }
}

export function subscribeAdminPublicProfile(callback: (data: { photoURL?: string; avatarURL?: string; displayName?: string; bannerURL?: string }) => void): () => void {
  const avatar = getCachedAdminAvatar();
  const cached = {
    photoURL: avatar,
    avatarURL: avatar,
    displayName: getCachedAdminName(),
    bannerURL: localStorage.getItem('secretarea_admin_banner') || '/images/userprofile.png'
  };
  callback(cached);

  try {
    const adminDocRef = doc(db, 'system', 'admin_profile');
    const unsub = onSnapshot(adminDocRef, (snap) => {
      if (snap.exists()) {
        const d = snap.data();
        const photo = d.photoURL || d.avatarURL || cached.photoURL;
        if (photo) localStorage.setItem('secretarea_admin_avatar', photo);
        if (d.displayName) localStorage.setItem('secretarea_admin_name', d.displayName);
        if (d.bannerURL) localStorage.setItem('secretarea_admin_banner', d.bannerURL);
        callback({
          photoURL: photo,
          avatarURL: photo,
          displayName: d.displayName || cached.displayName,
          bannerURL: d.bannerURL || cached.bannerURL
        });
      }
    }, () => {});
    return unsub;
  } catch (e) {
    return () => {};
  }
}

export function subscribeGlobalBanner(callback: (url: string) => void): () => void {
  const cached = localStorage.getItem('secretarea_global_banner') || '/images/userprofile.png';
  callback(cached);

  try {
    const bannerDocRef = doc(db, 'system', 'banner');
    const unsub = onSnapshot(bannerDocRef, (snap) => {
      if (snap.exists() && snap.data()?.url) {
        const url = snap.data().url;
        localStorage.setItem('secretarea_global_banner', url);
        callback(url);
      }
    }, () => {});
    return unsub;
  } catch (e) {
    return () => {};
  }
}

export async function saveGlobalBanner(bannerURL: string, updatedBy: string): Promise<void> {
  localStorage.setItem('secretarea_global_banner', bannerURL);
  try {
    const bannerDocRef = doc(db, 'system', 'banner');
    await setDoc(bannerDocRef, {
      url: bannerURL,
      updatedBy,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (e: any) {
    console.warn('Firestore saveGlobalBanner note (handled):', e?.message);
  }
}

export function subscribeAllUsers(callback: (users: UserProfileData[]) => void): () => void {
  try {
    const usersCol = collection(db, 'users');
    const unsub = onSnapshot(usersCol, (snap) => {
      const list: UserProfileData[] = [];
      snap.forEach((docSnap) => {
        const data = docSnap.data() as UserProfileData;
        list.push({
          ...DEFAULT_PROFILE,
          ...data,
          uid: docSnap.id
        });
      });
      callback(list);
    }, (err) => {
      console.warn('Firestore subscribeAllUsers note (handled):', err?.message);
    });
    return unsub;
  } catch (e) {
    console.warn('subscribeAllUsers error:', e);
    return () => {};
  }
}

export async function blockUser(
  uid: string,
  reason: string = 'Restricted by administrator',
  durationHours: number = 24
): Promise<{ autoBlacklisted: boolean; blockCount: number }> {
  if (!uid) return { autoBlacklisted: false, blockCount: 0 };
  const local = getLocalProfile(uid) || DEFAULT_PROFILE;
  const newCount = (local.blockCount || 0) + 1;
  const isAutoBlacklist = newCount >= 3;

  const now = new Date();
  const until = new Date(now.getTime() + durationHours * 3600 * 1000).toISOString();

  const updates: Partial<UserProfileData> = {
    blockCount: newCount,
    isBlocked: !isAutoBlacklist,
    isBlacklisted: isAutoBlacklist,
    status: isAutoBlacklist ? 'blacklisted' : 'blocked',
    blockedReason: reason,
    blockedAt: now.toISOString(),
    blockedUntil: isAutoBlacklist ? null : until,
    blacklistedAt: isAutoBlacklist ? now.toISOString() : undefined,
    blacklistReason: isAutoBlacklist ? 'Exceeded maximum permitted warnings/blocks (3/3 strikes).' : undefined
  };

  const updated: UserProfileData = { ...local, ...updates };
  saveLocalProfile(uid, updated);

  try {
    const userDocRef = doc(db, 'users', uid);
    await updateDoc(userDocRef, {
      ...updates,
      blockCount: increment(1)
    });
  } catch (e: any) {
    console.warn('Firestore blockUser note (handled):', e?.message);
  }

  return { autoBlacklisted: isAutoBlacklist, blockCount: newCount };
}

export async function unblockUser(uid: string): Promise<void> {
  if (!uid) return;
  const local = getLocalProfile(uid) || DEFAULT_PROFILE;
  const updates: Partial<UserProfileData> = {
    isBlocked: false,
    status: local.isBlacklisted ? 'blacklisted' : 'active',
    blockedUntil: null,
    blockedReason: undefined
  };

  const updated: UserProfileData = { ...local, ...updates };
  saveLocalProfile(uid, updated);

  try {
    const userDocRef = doc(db, 'users', uid);
    await updateDoc(userDocRef, updates);
  } catch (e: any) {
    console.warn('Firestore unblockUser note (handled):', e?.message);
  }
}

export async function removeUserAndBanIdentifiers(
  targetUser: UserProfileData,
  adminEmail: string,
  reason: string = 'Removed by Administrator'
): Promise<void> {
  if (!targetUser?.uid) return;
  const uid = targetUser.uid;

  // Record banned identifier in system/banned collection
  try {
    if (targetUser.email) {
      const banDocRef = doc(db, 'banned_identifiers', targetUser.email.toLowerCase());
      await setDoc(banDocRef, {
        email: targetUser.email.toLowerCase(),
        uid,
        displayName: targetUser.displayName || '',
        username: targetUser.username || '',
        reason,
        bannedBy: adminEmail,
        bannedAt: new Date().toISOString()
      });
    }
  } catch (e: any) {
    console.warn('Firestore ban identifier note (handled):', e?.message);
  }

  // Delete user doc
  try {
    const userDocRef = doc(db, 'users', uid);
    await deleteDoc(userDocRef);
  } catch (e: any) {
    console.warn('Firestore delete user note (handled):', e?.message);
  }

  // Clear local profile and mark banned
  try {
    localStorage.removeItem(`secretarea_profile_${uid}`);
  } catch (e) {}
}

export async function deleteUserAccount(uid: string): Promise<void> {
  if (!uid) return;
  try {
    const userDocRef = doc(db, 'users', uid);
    await deleteDoc(userDocRef);
    localStorage.removeItem(`secretarea_profile_${uid}`);
  } catch (e: any) {
    console.warn('Firestore deleteUserAccount note (handled):', e?.message);
  }
}

export async function recordUserVisit(uid: string): Promise<void> {
  if (!uid) return;
  try {
    const userDocRef = doc(db, 'users', uid);
    await updateDoc(userDocRef, {
      lastLogin: new Date().toISOString(),
      lastActive: new Date().toISOString()
    });
  } catch (e) {}
}

export async function setUserRole(uid: string, role: string): Promise<void> {
  if (!uid) return;
  await updateUserProfileData(uid, { role });
}

export async function setUserBannedStatus(uid: string, isBanned: boolean, reason?: string): Promise<void> {
  if (!uid) return;
  await updateUserProfileData(uid, {
    isBlocked: isBanned,
    status: isBanned ? 'blocked' : 'active',
    blockedReason: reason
  });
}

export async function setUserBlacklistStatus(uid: string, isBlacklisted: boolean, reason?: string): Promise<void> {
  if (!uid) return;
  await updateUserProfileData(uid, {
    isBlacklisted,
    status: isBlacklisted ? 'blacklisted' : 'active',
    blacklistReason: reason,
    blacklistedAt: isBlacklisted ? new Date().toISOString() : undefined
  });
}
