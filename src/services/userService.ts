import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  onSnapshot, 
  serverTimestamp,
  collection,
  getDocs 
} from 'firebase/firestore';
import { updateProfile, User } from 'firebase/auth';
import { db, auth } from '../firebase';
import { 
  getDeviceInformation, 
  recordDeviceBan, 
  isCurrentDeviceBanned 
} from './deviceService';

export interface UserActivity {
  id: string;
  type: 'view_game' | 'like_game' | 'unlike_game' | 'favorite_game' | 'unfavorite_game' | 'library_update' | 'hardware_update' | 'profile_update' | 'navigation';
  title: string;
  description?: string;
  timestamp: string;
  gameId?: string;
  gameName?: string;
  gameImage?: string;
  link?: string;
}

export interface GameItemRef {
  id: string;
  name: string;
  coverImage: string;
  timestamp: string;
  status?: string;
  category?: string;
}

export type UserRole = 'admin' | 'user';

export const PRIMARY_ADMIN_EMAIL = 'secretarea1337@gmail.com';
export const ADMIN_EMAILS = ['secretarea1337@gmail.com'];

export function resolveUserRole(email?: string | null, currentDocRole?: string | null): 'admin' | 'user' {
  if (currentDocRole && (currentDocRole.toLowerCase() === 'admin')) {
    return 'admin';
  }
  if (!email) return 'user';
  const clean = email.trim().toLowerCase();
  if (clean === PRIMARY_ADMIN_EMAIL.toLowerCase()) {
    return 'admin';
  }
  return 'user';
}

export function isUserAdmin(email?: string | null, role?: string | null): boolean {
  // Role-based admin check from Firestore user document
  if (role && (role === 'admin' || role.toLowerCase() === 'admin')) {
    return true;
  }
  // Primary fallback for root administrator
  if (email && email.trim().toLowerCase() === PRIMARY_ADMIN_EMAIL.toLowerCase()) {
    return true;
  }
  return false;
}

export function computeUserBadge(profile: Partial<UserProfileData>): string {
  if (profile.badge && profile.badge.trim()) return profile.badge;
  if (isUserAdmin(profile.email, profile.role)) {
    return 'Admin 🛡️';
  }
  const xp = profile.points || 0;
  if (xp >= 50000) return 'Fenrir 🐺';
  if (xp >= 20000) return 'Alpha Wolf 👑';
  if (xp >= 5000) return 'Lone Wolf ⚔️';
  if (xp >= 1000) return 'Hunter Wolf 🎯';
  if (xp >= 250) return 'Pup Wolf 🐾';
  return 'Novice Scout 🏕️';
}

export interface UserProfileData {
  uid?: string;
  email: string;
  displayName: string;
  username: string;
  bio: string;
  photoURL?: string;
  bannerURL?: string;
  role: 'admin' | 'user' | string;
  status?: 'active' | 'blocked' | 'blacklisted';
  isBlocked?: boolean;
  isBlacklisted?: boolean;
  blockCount?: number;
  blockedReason?: string;
  blockedAt?: string;
  blockedUntil?: string;
  blacklistedAt?: string;
  deviceFingerprint?: string;
  ipAddress?: string;
  badge?: string;
  points: number;
  gamesViewed: number;
  contentLiked: number;
  createdAt: string;
  lastActive?: string;
  lastLogin?: string;
  pcSpecs?: {
    gpuModel: string;
    cpuModel: string;
    ram: number;
    os: string;
    isActive: boolean;
  };
  recentGames: GameItemRef[];
  likedGames: GameItemRef[];
  libraryGames: GameItemRef[];
  favoriteGames: GameItemRef[];
  stash?: string[];
  activities: UserActivity[];
}

export const DEFAULT_PROFILE: UserProfileData = {
  displayName: 'SecretArea Gamer',
  email: '',
  username: 'gamer',
  bio: 'Exploring games and roadmaps in SecretArea.',
  photoURL: '',
  bannerURL: '/images/userprofile.png',
  role: 'user',
  status: 'active',
  isBlocked: false,
  isBlacklisted: false,
  blockCount: 0,
  badge: 'Recruit 🎮',
  points: 0,
  gamesViewed: 0,
  contentLiked: 0,
  createdAt: new Date().toISOString(),
  lastActive: new Date().toISOString(),
  lastLogin: new Date().toISOString(),
  pcSpecs: {
    gpuModel: 'GeForce RTX 3060',
    cpuModel: 'Core i5-12400',
    ram: 16,
    os: '10',
    isActive: true
  },
  recentGames: [],
  likedGames: [],
  libraryGames: [],
  favoriteGames: [],
  stash: [],
  activities: []
};

const PROFILE_STORAGE_KEY_PREFIX = 'secretarea_profile_';
const PROFILE_EVENT_NAME = 'secretarea_profile_sync';

export function getLocalProfile(uid: string): UserProfileData | null {
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY_PREFIX + uid);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    // ignore
  }
  return null;
}

export function saveLocalProfile(uid: string, profile: Partial<UserProfileData>): UserProfileData {
  try {
    const existing = getLocalProfile(uid) || DEFAULT_PROFILE;
    const merged: UserProfileData = {
      ...existing,
      ...profile,
      recentGames: profile.recentGames || existing.recentGames || [],
      likedGames: profile.likedGames || existing.likedGames || [],
      libraryGames: profile.libraryGames || existing.libraryGames || [],
      favoriteGames: profile.favoriteGames || existing.favoriteGames || [],
      stash: profile.stash !== undefined ? profile.stash : (existing.stash || []),
      activities: profile.activities || existing.activities || []
    };
    localStorage.setItem(PROFILE_STORAGE_KEY_PREFIX + uid, JSON.stringify(merged));
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        try {
          window.dispatchEvent(new CustomEvent(PROFILE_EVENT_NAME, { detail: { uid, profile: merged } }));
        } catch (e) {}
      }, 0);
    }
    return merged;
  } catch (e) {
    return { ...DEFAULT_PROFILE, ...profile };
  }
}

// Track permission notice so console isn't flooded
let permissionNoticeLogged = false;
let isPermissionBlocked = false;

export function getFirestorePermissionBlocked(): boolean {
  return isPermissionBlocked;
}

function handleFirestoreNotice(context: string, err: any) {
  const isPermDenied = err?.code === 'permission-denied' || 
                       err?.message?.includes('Missing or insufficient permissions') || 
                       err?.message?.includes('permission-denied');
  if (isPermDenied) {
    isPermissionBlocked = true;
    if (!permissionNoticeLogged) {
      permissionNoticeLogged = true;
      console.info(
        `%c[SecretArea Firestore] Firebase Firestore rules in project 'secretarea-1337' are awaiting 'allow read, write: if true;'. Data is safely preserved in local storage and will sync automatically once rules are published in Firebase Console: https://console.firebase.google.com/project/secretarea-1337/firestore/rules`,
        'color: #0284c7; font-weight: bold;'
      );
      if (typeof window !== 'undefined') {
        setTimeout(() => {
          try {
            window.dispatchEvent(new CustomEvent('firestore_rules_status', { detail: { blocked: true, projectId: 'secretarea-1337' } }));
          } catch (e) {}
        }, 0);
      }
    }
    return;
  }
  console.warn(`[Firestore] ${context}:`, err?.message || err);
}

// Helper to write to users collection in Firestore
export async function writeToFirestore(uid: string, payload: Partial<UserProfileData>): Promise<void> {
  if (!uid || uid === 'guest') return;
  try {
    const userDocRef = doc(db, 'users', uid);
    await setDoc(userDocRef, payload, { merge: true });
    isPermissionBlocked = false;
  } catch (err: any) {
    handleFirestoreNotice('write', err);
  }
}

// Create or initialize a user profile with Firestore as primary source of truth
export async function ensureUserProfile(user: User): Promise<UserProfileData> {
  const defaultUsername = user.email ? user.email.split('@')[0] : (user.displayName ? user.displayName.toLowerCase().replace(/\s+/g, '') : 'gamer');
  const isOwnerAdmin = (user.email && user.email.toLowerCase() === PRIMARY_ADMIN_EMAIL.toLowerCase());
  const assignedRole: 'admin' | 'user' = isOwnerAdmin ? 'admin' : 'user';
  const now = new Date().toISOString();
  
  // 1. Check if Firestore already has the user profile stored
  try {
    const docRef = doc(db, 'users', user.uid);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const cloudData = snap.data() as UserProfileData;
      const effectiveRole: 'admin' | 'user' = (cloudData.role && cloudData.role.toLowerCase() === 'admin') || isOwnerAdmin ? 'admin' : 'user';
      const updates: Partial<UserProfileData> = {
        lastActive: now,
        lastLogin: now,
        role: effectiveRole
      };
      if (user.email && cloudData.email !== user.email) {
        updates.email = user.email;
      }
      if (user.photoURL && (!cloudData.photoURL || cloudData.photoURL === DEFAULT_PROFILE.photoURL)) {
        updates.photoURL = user.photoURL;
      }
      if (user.displayName && (!cloudData.displayName || cloudData.displayName === DEFAULT_PROFILE.displayName)) {
        updates.displayName = user.displayName;
      }
      
      const merged: UserProfileData = {
        ...DEFAULT_PROFILE,
        ...cloudData,
        ...updates,
        uid: user.uid,
        role: effectiveRole,
        badge: cloudData.badge || computeUserBadge({ ...cloudData, role: effectiveRole, email: user.email || cloudData.email })
      };
      
      saveLocalProfile(user.uid, merged);
      if (Object.keys(updates).length > 0) {
        await writeToFirestore(user.uid, updates);
      }

      if (isOwnerAdmin) {
        const adminAvatar = user.photoURL || merged.photoURL || '';
        const adminName = user.displayName || merged.displayName || 'Wolf';
        if (adminAvatar && typeof window !== 'undefined') {
          localStorage.setItem(ADMIN_AVATAR_KEY, adminAvatar);
          localStorage.setItem(ADMIN_NAME_KEY, adminName);
        }
        try {
          setDoc(doc(db, 'settings', 'admin_profile'), {
            avatarURL: adminAvatar,
            displayName: adminName,
            email: user.email,
            updatedAt: now
          }, { merge: true }).catch(() => {});
        } catch (e) {}
      }

      return merged;
    }
  } catch (err: any) {
    handleFirestoreNotice("ensureUserProfile", err);
  }

  // 2. If new user in Firestore, check if they had guest data to migrate
  let guestProfile: Partial<UserProfileData> = {};
  let guestStash: string[] = [];
  try {
    const rawGuest = localStorage.getItem('nexa_guest_profile');
    if (rawGuest) {
      guestProfile = JSON.parse(rawGuest);
    }
    const rawStash = localStorage.getItem('myStash') || localStorage.getItem('stash');
    if (rawStash) {
      guestStash = JSON.parse(rawStash);
    }
  } catch (e) {}

  const initialProfile: UserProfileData = {
    ...DEFAULT_PROFILE,
    uid: user.uid,
    email: user.email || '',
    displayName: user.displayName || user.email?.split('@')[0] || 'SecretArea Gamer',
    username: defaultUsername,
    bio: guestProfile.bio || 'Explorer in SecretArea.',
    photoURL: user.photoURL || guestProfile.photoURL || '',
    bannerURL: guestProfile.bannerURL || '/images/userprofile.png',
    role: assignedRole,
    status: 'active',
    isBlocked: false,
    isBlacklisted: false,
    badge: assignedRole === 'admin' ? 'Admin 🛡️' : 'Recruit 🎮',
    createdAt: now,
    lastActive: now,
    lastLogin: now,
    points: guestProfile.points || 0,
    gamesViewed: guestProfile.gamesViewed || 0,
    contentLiked: guestProfile.contentLiked || 0,
    pcSpecs: guestProfile.pcSpecs || DEFAULT_PROFILE.pcSpecs,
    recentGames: guestProfile.recentGames || [],
    likedGames: guestProfile.likedGames || [],
    libraryGames: guestProfile.libraryGames || [],
    favoriteGames: guestProfile.favoriteGames || [],
    stash: guestStash.length > 0 ? guestStash : (guestProfile.stash || []),
    activities: guestProfile.activities && guestProfile.activities.length > 0 ? guestProfile.activities : [
      {
        id: 'init_' + Date.now(),
        type: 'profile_update',
        title: 'Joined SecretArea',
        description: `Account initialized with ${user.email || 'Google'} (${assignedRole})`,
        timestamp: now
      }
    ]
  };

  // 3. Immediately persist new user profile to Firestore database
  saveLocalProfile(user.uid, initialProfile);
  await writeToFirestore(user.uid, initialProfile);

  if (isOwnerAdmin) {
    const adminAvatar = initialProfile.photoURL || '';
    const adminName = initialProfile.displayName || 'Wolf';
    if (adminAvatar && typeof window !== 'undefined') {
      localStorage.setItem(ADMIN_AVATAR_KEY, adminAvatar);
      localStorage.setItem(ADMIN_NAME_KEY, adminName);
    }
    try {
      setDoc(doc(db, 'settings', 'admin_profile'), {
        avatarURL: adminAvatar,
        displayName: adminName,
        email: user.email,
        updatedAt: now
      }, { merge: true }).catch(() => {});
    } catch (e) {}
  }

  return initialProfile;
}

// Real-time listener for user profile from Firestore
export function subscribeUserProfile(
  uid: string, 
  onUpdate: (data: UserProfileData) => void,
  fallbackUser?: User | null
): () => void {
  // 1. Emit cached data immediately for instant responsive rendering
  const cached = getLocalProfile(uid);
  if (cached) {
    onUpdate(cached);
  } else if (fallbackUser) {
    const fallbackProfile: UserProfileData = {
      ...DEFAULT_PROFILE,
      email: fallbackUser.email || '',
      displayName: fallbackUser.displayName || fallbackUser.email?.split('@')[0] || DEFAULT_PROFILE.displayName,
      photoURL: fallbackUser.photoURL || '',
      username: fallbackUser.email ? fallbackUser.email.split('@')[0] : 'gamer'
    };
    saveLocalProfile(uid, fallbackProfile);
    onUpdate(fallbackProfile);
  } else {
    onUpdate(DEFAULT_PROFILE);
  }

  // 2. Listen to local event updates across browser components
  const handleLocalSync = (e: Event) => {
    const custom = e as CustomEvent;
    if (custom.detail?.uid === uid && custom.detail?.profile) {
      onUpdate(custom.detail.profile);
    }
  };
  if (typeof window !== 'undefined') {
    window.addEventListener(PROFILE_EVENT_NAME, handleLocalSync);
  }

  // 3. Attach Firestore real-time snapshot listener
  let unsubscribeFirestore: (() => void) | null = null;
  try {
    const docRef = doc(db, 'users', uid);
    unsubscribeFirestore = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as UserProfileData;
        const completeData = saveLocalProfile(uid, {
          ...DEFAULT_PROFILE,
          ...data,
          recentGames: data.recentGames || [],
          likedGames: data.likedGames || [],
          libraryGames: data.libraryGames || [],
          favoriteGames: data.favoriteGames || [],
          stash: data.stash || [],
          activities: data.activities || []
        });
        onUpdate(completeData);
      } else if (fallbackUser) {
        ensureUserProfile(fallbackUser).then((ensured) => {
          onUpdate(ensured);
        }).catch(() => {
          const current = getLocalProfile(uid) || DEFAULT_PROFILE;
          onUpdate(current);
        });
      }
    }, (err) => {
      handleFirestoreNotice("subscribeUserProfile", err);
      const localData = getLocalProfile(uid);
      if (localData) {
        onUpdate(localData);
      }
    });
  } catch (err: any) {
    handleFirestoreNotice("subscribeUserProfile setup", err);
  }

  return () => {
    if (unsubscribeFirestore) {
      try {
        unsubscribeFirestore();
      } catch (e) {}
    }
    if (typeof window !== 'undefined') {
      window.removeEventListener(PROFILE_EVENT_NAME, handleLocalSync);
    }
  };
}

// Save User Stash (Favorites) directly to Firestore
export async function saveUserStash(uid: string, stash: string[]) {
  saveLocalProfile(uid, { stash });
  if (uid === 'guest') {
    try {
      localStorage.setItem('myStash', JSON.stringify(stash));
      localStorage.setItem('stash', JSON.stringify(stash));
    } catch (e) {}
    return;
  }
  await writeToFirestore(uid, {
    stash,
    lastActive: new Date().toISOString()
  });
}

// Record an activity / user movement in real-time
export async function trackUserMovement(
  uid: string,
  activity: Omit<UserActivity, 'id' | 'timestamp'>
) {
  const current = getLocalProfile(uid) || DEFAULT_PROFILE;
  const existingActivities: UserActivity[] = current.activities || [];
  
  const newActivity: UserActivity = {
    ...activity,
    id: 'act_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    timestamp: new Date().toISOString()
  };

  const updatedActivities = [newActivity, ...existingActivities].slice(0, 30);
  saveLocalProfile(uid, {
    activities: updatedActivities,
    lastActive: new Date().toISOString()
  });

  await writeToFirestore(uid, {
    activities: updatedActivities,
    lastActive: new Date().toISOString()
  });
}

// Track full game interaction (view, like, favorite, library) with points & live feed
export async function recordGameInteraction(
  uid: string,
  game: { id: string; name: string; coverImage: string; category?: string },
  interaction: 'view' | 'like' | 'unlike' | 'favorite' | 'unfavorite' | 'library',
  libraryStatus?: string
) {
  // Read current from local cache first to ensure offline/restricted resilience
  let currentProfile = getLocalProfile(uid) || DEFAULT_PROFILE;

  let points = currentProfile.points || 0;
  let rawGamesViewed = currentProfile.gamesViewed || 0;
  // If gamesViewed has dummy 9,999 or 99,999, sanitize it to real recentGames count
  let gamesViewed = (rawGamesViewed === 9999 || rawGamesViewed === 99999)
    ? (currentProfile.recentGames?.length || 0)
    : rawGamesViewed;
  let contentLiked = currentProfile.contentLiked || 0;
  let recentGames = [...(currentProfile.recentGames || [])];
  let likedGames = [...(currentProfile.likedGames || [])];
  let favoriteGames = [...(currentProfile.favoriteGames || [])];
  let libraryGames = [...(currentProfile.libraryGames || [])];
  let activities = [...(currentProfile.activities || [])];

  const itemRef: GameItemRef = {
    id: game.id,
    name: game.name,
    coverImage: game.coverImage,
    timestamp: new Date().toISOString(),
    category: game.category || 'Game'
  };

  let activityTitle = '';
  let activityDesc = '';
  let actType: UserActivity['type'] = 'view_game';

  if (interaction === 'view') {
    actType = 'view_game';
    activityTitle = `Explored "${game.name}"`;
    activityDesc = `Earned +5 XP for exploring game detail.`;
    
    const existingIdx = recentGames.findIndex(g => g.id === game.id);
    if (existingIdx !== -1) {
      recentGames.splice(existingIdx, 1);
    }
    // Always increment real-time view telemetry
    gamesViewed += 1;
    points += 1;
    recentGames.unshift(itemRef);
    if (recentGames.length > 50) recentGames = recentGames.slice(0, 50);

  } else if (interaction === 'like') {
    actType = 'like_game';
    activityTitle = `Liked "${game.name}"`;
    activityDesc = `Added to liked games (+2 XP).`;
    
    if (!likedGames.some(g => g.id === game.id)) {
      likedGames.unshift(itemRef);
      contentLiked += 1;
      points += 2;
    }

  } else if (interaction === 'unlike') {
    actType = 'unlike_game';
    activityTitle = `Unliked "${game.name}"`;
    activityDesc = `Removed from liked games.`;
    
    likedGames = likedGames.filter(g => g.id !== game.id);
    contentLiked = Math.max(0, contentLiked - 1);
    points = Math.max(0, points - 2);

  } else if (interaction === 'favorite') {
    actType = 'favorite_game';
    activityTitle = `Favorited "${game.name}"`;
    activityDesc = `Saved to personal favorites (+2 XP).`;
    
    if (!favoriteGames.some(g => g.id === game.id)) {
      favoriteGames.unshift(itemRef);
      points += 2;
    }

  } else if (interaction === 'unfavorite') {
    actType = 'unfavorite_game';
    activityTitle = `Unfavorited "${game.name}"`;
    activityDesc = `Removed from favorites.`;
    
    favoriteGames = favoriteGames.filter(g => g.id !== game.id);
    points = Math.max(0, points - 2);

  } else if (interaction === 'library' && libraryStatus) {
    actType = 'library_update';
    activityTitle = `Updated Library: "${game.name}"`;
    activityDesc = `Status set to [${libraryStatus}] (+5 XP).`;

    libraryGames = libraryGames.filter(g => g.id !== game.id);
    libraryGames.unshift({ ...itemRef, status: libraryStatus });
    points += 5;
  }

  // Add activity
  activities = [
    {
      id: 'act_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      type: actType,
      title: activityTitle,
      description: activityDesc,
      timestamp: new Date().toISOString(),
      gameId: game.id,
      gameName: game.name,
      gameImage: game.coverImage,
      link: `/roadmap/${game.id}`
    },
    ...activities
  ].slice(0, 30);

  const updatePayload: Partial<UserProfileData> = {
    points,
    gamesViewed,
    contentLiked,
    recentGames,
    likedGames,
    favoriteGames,
    libraryGames,
    activities,
    lastActive: new Date().toISOString()
  };

  // Immediate local update
  const savedProfile = saveLocalProfile(uid, updatePayload);
  if (uid === 'guest') {
    try {
      localStorage.setItem('nexa_guest_profile', JSON.stringify(savedProfile));
    } catch (e) {}
    return;
  }

  // Sync to Firestore database
  await writeToFirestore(uid, updatePayload);
}

// Remove game from library
export async function removeGameFromLibrary(uid: string, gameId: string) {
  const current = getLocalProfile(uid) || DEFAULT_PROFILE;
  const library = (current.libraryGames || []).filter((g: any) => g.id !== gameId);
  const savedProfile = saveLocalProfile(uid, { libraryGames: library });

  if (uid === 'guest') {
    try {
      localStorage.setItem('nexa_guest_profile', JSON.stringify(savedProfile));
    } catch (e) {}
    return;
  }

  await writeToFirestore(uid, { libraryGames: library });
}

// Update status of a game in library
export async function updateGameLibraryStatus(uid: string, gameId: string, newStatus: string) {
  const current = getLocalProfile(uid) || DEFAULT_PROFILE;
  const library = [...(current.libraryGames || [])];
  const targetIdx = library.findIndex((g: any) => g.id === gameId);
  if (targetIdx !== -1) {
    library[targetIdx] = { ...library[targetIdx], status: newStatus };
    const savedProfile = saveLocalProfile(uid, { libraryGames: library });

    if (uid === 'guest') {
      try {
        localStorage.setItem('nexa_guest_profile', JSON.stringify(savedProfile));
      } catch (e) {}
      return;
    }

    await writeToFirestore(uid, { libraryGames: library });
  }
}

// Clear game history
export async function clearGameHistory(uid: string) {
  saveLocalProfile(uid, { recentGames: [] });
  await writeToFirestore(uid, { recentGames: [] });
}

// Save user profile info
export async function saveUserProfileInfo(
  uid: string,
  user: User | null,
  info: { displayName: string; username: string; bio: string; photoURL?: string; bannerURL?: string }
) {
  // Update Auth Profile if user is logged in
  if (user) {
    try {
      await updateProfile(user, {
        displayName: info.displayName,
        photoURL: info.photoURL || user.photoURL
      });
    } catch (e: any) {
      console.warn("Firebase Auth updateProfile note:", e?.message);
    }
  }

  const cleanUsername = info.username.replace(/^@/, '').trim();
  const updatePayload: Partial<UserProfileData> = {
    displayName: info.displayName,
    username: cleanUsername,
    bio: info.bio,
    photoURL: info.photoURL,
    bannerURL: info.bannerURL || '/images/userprofile.png',
    lastActive: new Date().toISOString()
  };

  saveLocalProfile(uid, updatePayload);

  await trackUserMovement(uid, {
    type: 'profile_update',
    title: 'Updated Profile Info',
    description: `Changed display name and bio.`
  });

  // Sync to Firestore database
  await writeToFirestore(uid, updatePayload);

  // If this user is Admin and updated bannerURL, save as global banner
  if (isUserAdmin(user?.email) && info.bannerURL) {
    await saveGlobalBanner(info.bannerURL, user?.email || 'admin');
  }

  // If this user is Admin, also sync admin avatar and display name for public cards
  if (isUserAdmin(user?.email)) {
    const avatar = info.photoURL || user?.photoURL || '';
    const name = info.displayName || user?.displayName || 'Wolf';
    if (typeof window !== 'undefined') {
      if (avatar) localStorage.setItem(ADMIN_AVATAR_KEY, avatar);
      localStorage.setItem(ADMIN_NAME_KEY, name);
    }
    try {
      setDoc(doc(db, 'settings', 'admin_profile'), {
        avatarURL: avatar,
        displayName: name,
        updatedAt: new Date().toISOString()
      }, { merge: true }).catch(() => {});
    } catch (e) {}
  }
}

// Save hardware specs
export async function updateUserProfileData(
  uid: string,
  fields: Partial<UserProfileData>
): Promise<void> {
  if (!uid) return;
  saveLocalProfile(uid, fields);
  await writeToFirestore(uid, fields);
}

export async function saveUserHardwareSpecs(
  uid: string,
  specs: {
    gpuModel: string;
    cpuModel: string;
    ram: number;
    os: string;
    isActive: boolean;
  }
) {
  const updatePayload: Partial<UserProfileData> = {
    pcSpecs: specs,
    lastActive: new Date().toISOString()
  };

  saveLocalProfile(uid, updatePayload);

  await trackUserMovement(uid, {
    type: 'hardware_update',
    title: 'Updated PC Hardware Settings',
    description: `Specs: ${specs.gpuModel}, ${specs.cpuModel}, ${specs.ram}GB RAM.`
  });

  // Sync to Firestore database
  await writeToFirestore(uid, updatePayload);
}

// Global Banner Storage & Realtime Synchronization
const GLOBAL_BANNER_KEY = 'secretarea_global_banner';

export async function saveGlobalBanner(bannerUrl: string, adminEmail: string): Promise<void> {
  const cleanUrl = bannerUrl.trim() || '/images/userprofile.png';
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(GLOBAL_BANNER_KEY, cleanUrl);
      setTimeout(() => {
        try {
          window.dispatchEvent(new CustomEvent('secretarea_global_banner_update', { detail: cleanUrl }));
        } catch (e) {}
      }, 0);
    }
    const bannerDocRef = doc(db, 'settings', 'global_banner');
    await setDoc(bannerDocRef, {
      globalBannerURL: cleanUrl,
      updatedAt: new Date().toISOString(),
      updatedBy: adminEmail
    }, { merge: true });
  } catch (err) {
    console.warn("Could not save global banner to Firestore:", err);
  }
}

export function subscribeGlobalBanner(onUpdate: (url: string) => void): () => void {
  // Emit locally cached banner first if present
  if (typeof window !== 'undefined') {
    const local = localStorage.getItem(GLOBAL_BANNER_KEY);
    if (local) {
      setTimeout(() => {
        onUpdate(local);
      }, 0);
    }
  }

  const handleCustomEvent = (e: any) => {
    if (e.detail) {
      onUpdate(e.detail);
    }
  };
  if (typeof window !== 'undefined') {
    window.addEventListener('secretarea_global_banner_update', handleCustomEvent);
  }

  let unsubscribeFirestore: (() => void) | null = null;
  try {
    const bannerDocRef = doc(db, 'settings', 'global_banner');
    unsubscribeFirestore = onSnapshot(bannerDocRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        if (data?.globalBannerURL) {
          if (typeof window !== 'undefined') {
            localStorage.setItem(GLOBAL_BANNER_KEY, data.globalBannerURL);
          }
          onUpdate(data.globalBannerURL);
        }
      }
    }, (err) => {
      // ignore
    });
  } catch (e) {}

  return () => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('secretarea_global_banner_update', handleCustomEvent);
    }
    if (unsubscribeFirestore) {
      try {
        unsubscribeFirestore();
      } catch (e) {}
    }
  };
}

export const ADMIN_AVATAR_KEY = 'secretarea_admin_avatar';
export const ADMIN_NAME_KEY = 'secretarea_admin_name';

export function getCachedAdminAvatar(): string {
  if (typeof window !== 'undefined') {
    if (auth.currentUser && isUserAdmin(auth.currentUser.email)) {
      const local = getLocalProfile(auth.currentUser.uid);
      if (local?.photoURL) return local.photoURL;
      if (auth.currentUser.photoURL) return auth.currentUser.photoURL;
    }
    const cached = localStorage.getItem(ADMIN_AVATAR_KEY);
    if (cached) return cached;
  }
  return '';
}

export function getCachedAdminName(): string {
  if (typeof window !== 'undefined') {
    if (auth.currentUser && isUserAdmin(auth.currentUser.email)) {
      const local = getLocalProfile(auth.currentUser.uid);
      if (local?.displayName) return local.displayName;
      if (auth.currentUser.displayName) return auth.currentUser.displayName;
    }
    const cached = localStorage.getItem(ADMIN_NAME_KEY);
    if (cached) return cached;
  }
  return 'Wolf';
}

export function subscribeAdminPublicProfile(
  onUpdate: (data: { avatarURL: string; displayName: string }) => void
): () => void {
  // 1. Initial cached update
  const initialAvatar = getCachedAdminAvatar();
  const initialName = getCachedAdminName();
  if (initialAvatar || initialName) {
    onUpdate({ avatarURL: initialAvatar, displayName: initialName });
  }

  // 2. Auth listener to capture admin login dynamically
  const unsubAuth = auth.onAuthStateChanged((user) => {
    if (user && isUserAdmin(user.email)) {
      const local = getLocalProfile(user.uid);
      const photo = local?.photoURL || user.photoURL || '';
      const name = local?.displayName || user.displayName || 'Wolf';
      if (typeof window !== 'undefined') {
        if (photo) localStorage.setItem(ADMIN_AVATAR_KEY, photo);
        localStorage.setItem(ADMIN_NAME_KEY, name);
      }
      onUpdate({ avatarURL: photo, displayName: name });
      if (photo) {
        try {
          setDoc(doc(db, 'settings', 'admin_profile'), {
            avatarURL: photo,
            displayName: name,
            email: user.email,
            updatedAt: new Date().toISOString()
          }, { merge: true }).catch(() => {});
        } catch (e) {}
      }
    }
  });

  // 3. Firestore snapshot on public settings/admin_profile
  let unsubFirestore: (() => void) | null = null;
  try {
    const adminDocRef = doc(db, 'settings', 'admin_profile');
    unsubFirestore = onSnapshot(adminDocRef, (snap) => {
      if (snap.exists()) {
        const d = snap.data();
        const avatar = d?.avatarURL || '';
        const name = d?.displayName || 'Wolf';
        if (typeof window !== 'undefined') {
          if (avatar) localStorage.setItem(ADMIN_AVATAR_KEY, avatar);
          if (name) localStorage.setItem(ADMIN_NAME_KEY, name);
        }
        onUpdate({ avatarURL: avatar, displayName: name });
      }
    }, () => {});
  } catch (e) {}

  return () => {
    unsubAuth();
    if (unsubFirestore) {
      try { unsubFirestore(); } catch (e) {}
    }
  };
}

// Admin Realtime User Directory & Telemetry Listener
export function subscribeAllUsers(onUpdate: (users: UserProfileData[]) => void): () => void {
  let unsubscribeFirestore: (() => void) | null = null;

  // Emit cached list if available
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem('secretarea_all_users_cache') : null;
    if (raw) {
      setTimeout(() => {
        try {
          onUpdate(JSON.parse(raw));
        } catch (e) {}
      }, 0);
    }
  } catch (e) {}

  try {
    const usersCol = collection(db, 'users');
    unsubscribeFirestore = onSnapshot(usersCol, (snap) => {
      const list: UserProfileData[] = [];
      snap.forEach((docSnap) => {
        const d = docSnap.data() as UserProfileData;
        const isRootAdmin = (d.email && d.email.toLowerCase() === PRIMARY_ADMIN_EMAIL.toLowerCase());
        const role = (d.role && d.role.toLowerCase() === 'admin') || isRootAdmin ? 'admin' : 'user';
        const isBlocked = d.isBlocked === true || d.status === 'blocked';
        const isBlacklisted = d.isBlacklisted === true || d.status === 'blacklisted';
        const status = isBlacklisted ? 'blacklisted' : (isBlocked ? 'blocked' : 'active');

        list.push({
          ...DEFAULT_PROFILE,
          ...d,
          uid: docSnap.id,
          role: role,
          isBlocked,
          isBlacklisted,
          status,
          badge: d.badge || computeUserBadge({ ...d, role })
        });
      });

      // Sort by latest active or login timestamp
      list.sort((a, b) => {
        const timeA = new Date(a.lastActive || a.lastLogin || a.createdAt || 0).getTime();
        const timeB = new Date(b.lastActive || b.lastLogin || b.createdAt || 0).getTime();
        return timeB - timeA;
      });

      if (list.length > 0) {
        try {
          if (typeof window !== 'undefined') {
            localStorage.setItem('secretarea_all_users_cache', JSON.stringify(list));
          }
        } catch (e) {}
        onUpdate(list);
      }
    }, (err) => {
      console.warn("subscribeAllUsers firestore warning, fallback to cache:", err);
      try {
        const raw = typeof window !== 'undefined' ? localStorage.getItem('secretarea_all_users_cache') : null;
        if (raw) {
          onUpdate(JSON.parse(raw));
        }
      } catch (e) {}
    });
  } catch (e) {
    console.warn("subscribeAllUsers setup error:", e);
  }

  return () => {
    if (unsubscribeFirestore) {
      try {
        unsubscribeFirestore();
      } catch (e) {}
    }
  };
}

// ==========================================
// Device Fingerprint & Hardware Ban Utilities
// ==========================================
export function getOrCreateDeviceId(): string {
  if (typeof window === 'undefined') return 'server_device';
  try {
    let deviceId = localStorage.getItem('secretarea_device_id');
    if (!deviceId) {
      deviceId = 'dev_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now().toString(36);
      localStorage.setItem('secretarea_device_id', deviceId);
    }
    return deviceId;
  } catch (e) {
    return 'fallback_device';
  }
}

export function isDeviceLocallyBanned(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem('secretarea_device_removed') === 'true' || 
           localStorage.getItem('secretarea_device_blacklisted') === 'true';
  } catch (e) {
    return false;
  }
}

export function markDeviceLocallyBanned(type: 'removed' | 'blacklisted' = 'removed'): void {
  if (typeof window === 'undefined') return;
  try {
    if (type === 'removed') {
      localStorage.setItem('secretarea_device_removed', 'true');
    } else {
      localStorage.setItem('secretarea_device_blacklisted', 'true');
    }
    localStorage.removeItem('secret_area_unlocked');
    localStorage.removeItem('nexa_guest_mode');
  } catch (e) {}
}

export function clearDeviceLocalBan(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem('secretarea_device_removed');
    localStorage.removeItem('secretarea_device_blacklisted');
  } catch (e) {}
}

// ==========================================
// Removed / Permanently Banned Registry Types
// ==========================================
export interface RemovedAccountRecord {
  uid: string;
  email: string;
  username?: string;
  displayName?: string;
  removedAt: string;
  removedBy: string;
  reason?: string;
  deviceId?: string;
}

export interface RemovedRegistry {
  emails: string[];
  uids: string[];
  deviceIds: string[];
  records: RemovedAccountRecord[];
}

// ==========================================
// Admin Moderation Actions (ONLY BLOCK and REMOVE)
// ==========================================

export interface BlockActionResult {
  autoBlacklisted: boolean;
  blockCount: number;
  blockedUntil?: string;
  reason?: string;
}

// Helper to update local users cache
function updateLocalUsersCache(uid: string, changes: Partial<UserProfileData>): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem('secretarea_all_users_cache');
    if (raw) {
      const list: UserProfileData[] = JSON.parse(raw);
      const updated = list.map(u => u.uid === uid ? { ...u, ...changes } : u);
      localStorage.setItem('secretarea_all_users_cache', JSON.stringify(updated));
    }
  } catch (e) {}
}

// Admin Moderation Action 1: BLOCK
// - When admin blocks a user:
//   - User CAN log in
//   - User can ONLY access "My Profile"
//   - If user clicks anything (game, content, etc), show "Blocked" message with admin-set TIMER
//   - Tracks blockCount: each block increments blockCount
//   - AUTO BLACKLIST: If blockCount >= 3 -> permanently blacklisted automatically
export async function blockUser(
  uid: string, 
  reason?: string, 
  durationHours: number = 24
): Promise<BlockActionResult> {
  if (!uid || uid === 'guest') {
    return { autoBlacklisted: false, blockCount: 0 };
  }

  const userRef = doc(db, 'users', uid);
  const now = new Date();
  const until = new Date(now.getTime() + durationHours * 3600 * 1000);

  // 1. Fetch current profile to get latest blockCount and identifiers
  let currentBlockCount = 0;
  let targetEmail = '';
  let targetFingerprint = '';

  try {
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      const data = snap.data() as UserProfileData;
      currentBlockCount = typeof data.blockCount === 'number' ? data.blockCount : 0;
      targetEmail = (data.email || '').trim().toLowerCase();
      targetFingerprint = data.deviceFingerprint || '';
    }
  } catch (err) {
    console.warn('Could not read user profile for blockCount check:', err);
  }

  // Increment blockCount
  const newBlockCount = currentBlockCount + 1;

  if (newBlockCount >= 3) {
    // ==========================================
    // AUTO BLACKLIST TRIGGERED (3 or more blocks)
    // ==========================================
    const autoBlacklistPayload = {
      isBlocked: true,
      isBlacklisted: true,
      status: 'blacklisted' as const,
      blockCount: newBlockCount,
      blockedReason: reason || 'Account automatically and permanently blacklisted after receiving 3 blocks.',
      blacklistedAt: now.toISOString(),
      blockedAt: now.toISOString(),
      blockedUntil: ''
    };

    await updateDoc(userRef, autoBlacklistPayload);

    // Register ban in Firestore bannedDevices collection
    try {
      const devInfo = await getDeviceInformation();
      const fp = targetFingerprint || devInfo.fingerprint;
      await recordDeviceBan({
        fingerprint: fp,
        ip: devInfo.ip,
        reason: 'Auto-blacklisted after 3 blocks',
        userId: uid,
        email: targetEmail,
        blockCount: newBlockCount
      });
    } catch (bErr) {
      console.warn('Could not record device ban for auto-blacklist:', bErr);
    }

    // Also register in settings/removed_identifiers for permanent login denial
    try {
      const regRef = doc(db, 'settings', 'removed_identifiers');
      const snap = await getDoc(regRef);
      let existingReg: RemovedRegistry = { emails: [], uids: [], deviceIds: [], records: [] };
      if (snap.exists()) {
        existingReg = { ...existingReg, ...(snap.data() as RemovedRegistry) };
      }
      const devInfo = await getDeviceInformation();
      await setDoc(regRef, {
        emails: Array.from(new Set([...(existingReg.emails || []), targetEmail].filter(Boolean))),
        uids: Array.from(new Set([...(existingReg.uids || []), uid].filter(Boolean))),
        deviceIds: Array.from(new Set([...(existingReg.deviceIds || []), devInfo.fingerprint].filter(Boolean))),
        updatedAt: now.toISOString()
      }, { merge: true });
    } catch (e) {}

    updateLocalUsersCache(uid, autoBlacklistPayload);

    return {
      autoBlacklisted: true,
      blockCount: newBlockCount,
      reason: autoBlacklistPayload.blockedReason
    };
  } else {
    // Standard temporary block with admin-set timer
    const tempBlockPayload = {
      isBlocked: true,
      isBlacklisted: false,
      status: 'blocked' as const,
      blockCount: newBlockCount,
      blockedReason: reason || `Account temporarily restricted by administrator (Infraction ${newBlockCount}/3)`,
      blockedAt: now.toISOString(),
      blockedUntil: until.toISOString()
    };

    await updateDoc(userRef, tempBlockPayload);
    updateLocalUsersCache(uid, tempBlockPayload);

    return {
      autoBlacklisted: false,
      blockCount: newBlockCount,
      blockedUntil: until.toISOString(),
      reason: tempBlockPayload.blockedReason
    };
  }
}

// Admin Moderation: Unblock User (Lift restriction)
export async function unblockUser(uid: string): Promise<void> {
  if (!uid || uid === 'guest') return;
  const userRef = doc(db, 'users', uid);
  const payload = {
    isBlocked: false,
    isBlacklisted: false,
    status: 'active' as const,
    blockedReason: '',
    blockedAt: '',
    blockedUntil: '',
    blacklistedAt: ''
  };
  await updateDoc(userRef, payload);
  updateLocalUsersCache(uid, payload);
}

// Backward compatibility alias for legacy call sites
export async function removeFromBlacklist(uid: string): Promise<void> {
  return unblockUser(uid);
}

// Backward compatibility alias for legacy call sites
export async function blacklistUser(uid: string, reason?: string): Promise<any> {
  if (!uid || uid === 'guest') return;
  const userRef = doc(db, 'users', uid);
  const now = new Date();
  const autoBlacklistPayload = {
    isBlocked: true,
    isBlacklisted: true,
    status: 'blacklisted' as const,
    blockCount: 3,
    blockedReason: reason || 'Account permanently blacklisted',
    blacklistedAt: now.toISOString(),
    blockedAt: now.toISOString(),
    blockedUntil: ''
  };
  await updateDoc(userRef, autoBlacklistPayload);
  updateLocalUsersCache(uid, autoBlacklistPayload);
  return { autoBlacklisted: true, blockCount: 3 };
}

// Admin Moderation Action 2: REMOVE
// - When admin removes a user:
//   - User is completely deleted from:
//     -> Firestore (users collection)
//     -> authentication (Firebase Auth)
//   - User loses EVERYTHING: points, badges, history, profile data
//   - Device / IP banned in bannedDevices collection
//   - User cannot log in again with same account
export async function removeUserAndBanIdentifiers(
  targetUser: UserProfileData,
  adminEmail: string,
  reason?: string
): Promise<void> {
  if (!targetUser.uid || targetUser.uid === 'guest') return;
  const uid = targetUser.uid;
  const email = (targetUser.email || '').trim().toLowerCase();
  
  // 1. Get browser device fingerprint & IP info
  let devInfo = { fingerprint: 'unknown_dev', ip: '127.0.0.1' };
  try {
    devInfo = await getDeviceInformation();
  } catch (e) {}

  const finalFingerprint = targetUser.deviceFingerprint || devInfo.fingerprint;

  // 2. Call backend server to delete user from Firebase Auth
  try {
    await fetch('/api/admin/remove-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid, email })
    });
  } catch (authErr) {
    console.warn('Could not call /api/admin/remove-user:', authErr);
  }

  // 3. Record permanent device and IP ban in bannedDevices collection
  try {
    await recordDeviceBan({
      fingerprint: finalFingerprint,
      ip: devInfo.ip,
      reason: reason || 'Permanently removed from SecretArea by administrator',
      userId: uid,
      email: email,
      blockCount: targetUser.blockCount || 3
    });
  } catch (bErr) {
    console.warn('Could not record banned device in Firestore:', bErr);
  }

  const record: RemovedAccountRecord = {
    uid,
    email,
    username: targetUser.username,
    displayName: targetUser.displayName,
    removedAt: new Date().toISOString(),
    removedBy: adminEmail || PRIMARY_ADMIN_EMAIL,
    reason: reason || 'Permanently deleted and banned by administrator',
    deviceId: finalFingerprint
  };

  // 4. Update Global Removed Identifiers in settings/removed_identifiers
  try {
    const regRef = doc(db, 'settings', 'removed_identifiers');
    const snap = await getDoc(regRef);
    let existingReg: RemovedRegistry = {
      emails: [],
      uids: [],
      deviceIds: [],
      records: []
    };
    if (snap.exists()) {
      existingReg = { ...existingReg, ...(snap.data() as RemovedRegistry) };
    }

    const updatedEmails = Array.from(new Set([...(existingReg.emails || []), email].filter(Boolean)));
    const updatedUids = Array.from(new Set([...(existingReg.uids || []), uid].filter(Boolean)));
    const updatedDeviceIds = Array.from(new Set([...(existingReg.deviceIds || []), finalFingerprint].filter(Boolean)));
    const updatedRecords = [
      record,
      ...(existingReg.records || []).filter(r => r.uid !== uid && r.email !== email)
    ];

    await setDoc(regRef, {
      emails: updatedEmails,
      uids: updatedUids,
      deviceIds: updatedDeviceIds,
      records: updatedRecords,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    console.warn('Could not update removed_identifiers in settings:', err);
  }

  // 5. Add audit log in removedUsers/{uid}
  try {
    const auditRef = doc(db, 'removedUsers', uid);
    await setDoc(auditRef, record);
  } catch (err) {
    console.warn('Could not write to removedUsers audit collection:', err);
  }

  // 6. Delete user document completely from Firestore (users collection)
  // This erases points, badges, stash, recent games, liked games, activities
  const userRef = doc(db, 'users', uid);
  await deleteDoc(userRef);

  // 7. Remove from local cache
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem('secretarea_all_users_cache');
      if (raw) {
        const list: UserProfileData[] = JSON.parse(raw);
        const updated = list.filter(u => u.uid !== uid);
        localStorage.setItem('secretarea_all_users_cache', JSON.stringify(updated));
      }
      // If current user matches targetUser, ban this device immediately and sign out
      if (auth.currentUser?.uid === uid || auth.currentUser?.email?.toLowerCase() === email) {
        localStorage.setItem('secretarea_device_removed', 'true');
        localStorage.setItem('secretarea_device_banned', 'true');
        localStorage.removeItem('secret_area_unlocked');
        localStorage.removeItem('nexa_guest_mode');
        try {
          await auth.signOut();
        } catch (e) {}
      }
    } catch (e) {}
  }
}

// Deprecated alias for backwards-compatibility
export async function deleteUserAccount(uid: string): Promise<void> {
  const dummyUser: UserProfileData = {
    ...DEFAULT_PROFILE,
    uid,
    email: ''
  };
  return removeUserAndBanIdentifiers(dummyUser, PRIMARY_ADMIN_EMAIL);
}

// Subscribe to real-time Removed Identifiers registry
export function subscribeRemovedRegistry(callback: (reg: RemovedRegistry) => void): () => void {
  const regRef = doc(db, 'settings', 'removed_identifiers');
  return onSnapshot(regRef, (snap) => {
    if (snap.exists()) {
      const data = snap.data() as RemovedRegistry;
      callback(data);
    } else {
      callback({ emails: [], uids: [], deviceIds: [], records: [] });
    }
  }, (err) => {
    console.warn('subscribeRemovedRegistry error (non-fatal):', err);
  });
}

// Admin action: Unban a previously removed identifier
export async function unbanRemovedIdentifier(emailOrUid: string): Promise<void> {
  const clean = (emailOrUid || '').trim().toLowerCase();
  if (!clean) return;
  const regRef = doc(db, 'settings', 'removed_identifiers');
  const snap = await getDoc(regRef);
  if (snap.exists()) {
    const data = snap.data() as RemovedRegistry;
    const updatedEmails = (data.emails || []).filter(e => e.toLowerCase() !== clean);
    const updatedUids = (data.uids || []).filter(u => u !== emailOrUid);
    const updatedRecords = (data.records || []).filter(r => r.email.toLowerCase() !== clean && r.uid !== emailOrUid);
    await setDoc(regRef, {
      ...data,
      emails: updatedEmails,
      uids: updatedUids,
      records: updatedRecords,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  }
}

// Subscribe to Removed Users audit collection for admin records
export function subscribeRemovedUsersAuditLogs(callback: (logs: RemovedAccountRecord[]) => void): () => void {
  const colRef = collection(db, 'removedUsers');
  return onSnapshot(colRef, (snap) => {
    const list: RemovedAccountRecord[] = [];
    snap.forEach((docSnap) => {
      list.push(docSnap.data() as RemovedAccountRecord);
    });
    // Sort descending by removedAt
    list.sort((a, b) => new Date(b.removedAt).getTime() - new Date(a.removedAt).getTime());
    callback(list);
  }, (err) => {
    console.warn('subscribeRemovedUsersAuditLogs error (non-fatal):', err);
  });
}

// Check a user's moderation status against device bans, removed identifiers, and Firestore document
export async function checkUserModerationStatus(user: any): Promise<{
  status: 'active' | 'blocked' | 'blacklisted' | 'removed';
  profile?: UserProfileData;
  reason?: string;
  blockedUntil?: string;
  blockCount?: number;
}> {
  // 1. Check if device is banned in bannedDevices collection or locally
  try {
    const deviceBan = await isCurrentDeviceBanned();
    if (deviceBan.isBanned) {
      return { 
        status: 'blacklisted', 
        reason: deviceBan.record?.reason || 'Account permanently banned' 
      };
    }
  } catch (e) {}

  if (!user) {
    return { status: 'active' };
  }

  const email = (user.email || '').trim().toLowerCase();
  const uid = user.uid;

  // 2. Check Removed Identifiers registry in settings/removed_identifiers
  try {
    const regRef = doc(db, 'settings', 'removed_identifiers');
    const snap = await getDoc(regRef);
    if (snap.exists()) {
      const reg = snap.data() as RemovedRegistry;
      const isEmailRemoved = email && (reg.emails || []).some(e => e.toLowerCase() === email);
      const isUidRemoved = uid && (reg.uids || []).includes(uid);

      if (isEmailRemoved || isUidRemoved) {
        const matchRecord = (reg.records || []).find(r => 
          (email && r.email?.toLowerCase() === email) || 
          (uid && r.uid === uid)
        );
        return { 
          status: 'removed', 
          reason: matchRecord?.reason || 'Account permanently removed from SecretArea by an administrator.' 
        };
      }
    }
  } catch (err) {
    console.warn('Could not check removed_identifiers:', err);
  }

  // 3. Check user profile in users/{uid}
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const profile = userSnap.data() as UserProfileData;

      // AUTO BLACKLIST CHECK: blockCount >= 3 OR isBlacklisted
      const isAutoBlacklisted = (typeof profile.blockCount === 'number' && profile.blockCount >= 3);
      if (profile.isBlacklisted || profile.status === 'blacklisted' || isAutoBlacklisted) {
        return {
          status: 'blacklisted',
          profile,
          blockCount: profile.blockCount || 3,
          reason: profile.blockedReason || 'Account permanently banned'
        };
      }

      // BLOCK CHECK
      if (profile.isBlocked || profile.status === 'blocked') {
        // Verify whether the block timer has expired
        if (profile.blockedUntil && new Date(profile.blockedUntil).getTime() <= Date.now()) {
          // Timer expired - user is active again
          return { status: 'active', profile };
        }

        return {
          status: 'blocked',
          profile,
          reason: profile.blockedReason || 'Your account is temporarily restricted by an administrator.',
          blockedUntil: profile.blockedUntil,
          blockCount: profile.blockCount || 1
        };
      }

      return { status: 'active', profile };
    }
  } catch (err) {
    console.warn('Could not check user profile for moderation:', err);
  }

  return { status: 'active' };
}

