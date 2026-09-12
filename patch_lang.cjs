const fs = require('fs');
let code = fs.readFileSync('src/contexts/LanguageContext.tsx', 'utf8');

const missingTranslations = `
    'Total Points': { en: 'Total Points', fr: 'Points Totaux', es: 'Puntos Totales', ar: 'إجمالي النقاط' },
    'Games Viewed': { en: 'Games Viewed', fr: 'Jeux Vus', es: 'Juegos Vistos', ar: 'الألعاب التي تم عرضها' },
    'Games Liked': { en: 'Games Liked', fr: 'Jeux Aimés', es: 'Juegos que te gustaron', ar: 'الألعاب المفضلة' },
    'Badges Earned': { en: 'Badges Earned', fr: 'Badges Gagnés', es: 'Insignias Ganadas', ar: 'الشارات المكتسبة' },
    'No recent activity in the last 24 hours.': { en: 'No recent activity in the last 24 hours.', fr: 'Aucune activité récente dans les dernières 24 heures.', es: 'No hay actividad reciente en las últimas 24 horas.', ar: 'لا يوجد نشاط حديث في آخر 24 ساعة.' },
    'Liked': { en: 'Liked', fr: 'Aimé', es: 'Me Gusta', ar: 'أعجبني' },
    'Library': { en: 'Library', fr: 'Bibliothèque', es: 'Biblioteca', ar: 'المكتبة' },
    'Game history': { en: 'Game history', fr: 'Historique des jeux', es: 'Historial de juegos', ar: 'سجل الألعاب' },
    'Favorites': { en: 'Favorites', fr: 'Favoris', es: 'Favoritos', ar: 'المفضلة' },
    'Overview': { en: 'Overview', fr: 'Aperçu', es: 'Resumen', ar: 'نظرة عامة' },
    'Playing': { en: 'Playing', fr: 'En cours', es: 'Jugando', ar: 'ألعب حالياً' },
    'Plan to Play': { en: 'Plan to Play', fr: 'À jouer', es: 'Plan para jugar', ar: 'أنوي اللعب' },
    'Completed': { en: 'Completed', fr: 'Terminé', es: 'Completado', ar: 'مكتمل' },
    'On Hold': { en: 'On Hold', fr: 'En pause', es: 'En espera', ar: 'مؤجل' },
    'Dropped': { en: 'Dropped', fr: 'Abandonné', es: 'Abandonado', ar: 'متروك' },
    'No games in this list yet.': { en: 'No games in this list yet.', fr: 'Aucun jeu dans cette liste pour le moment.', es: 'Aún no hay juegos en esta lista.', ar: 'لا توجد ألعاب في هذه القائمة بعد.' },
    'Showing': { en: 'Showing', fr: 'Affichage', es: 'Mostrando', ar: 'عرض' },
    'to': { en: 'to', fr: 'à', es: 'a', ar: 'إلى' },
    'of': { en: 'of', fr: 'sur', es: 'de', ar: 'من' },
    'User Management': { en: 'User Management', fr: 'Gestion des utilisateurs', es: 'Gestión de Usuarios', ar: 'إدارة المستخدمين' },
    'Total Users': { en: 'Total Users', fr: 'Utilisateurs Totaux', es: 'Usuarios Totales', ar: 'إجمالي المستخدمين' },
    'User': { en: 'User', fr: 'Utilisateur', es: 'Usuario', ar: 'المستخدم' },
    'Email': { en: 'Email', fr: 'Email', es: 'Correo electrónico', ar: 'البريد الإلكتروني' },
    'Role': { en: 'Role', fr: 'Rôle', es: 'Rol', ar: 'الدور' },
    'Joined': { en: 'Joined', fr: 'Inscrit le', es: 'Unido el', ar: 'تاريخ الانضمام' },
    'Action': { en: 'Action', fr: 'Action', es: 'Acción', ar: 'إجراء' },
    'admin': { en: 'Admin', fr: 'Admin', es: 'Admin', ar: 'مسؤول' },
    'visitor': { en: 'Visitor', fr: 'Visiteur', es: 'Visitante', ar: 'زائر' },
    'Back to Dashboard': { en: 'Back to Dashboard', fr: 'Retour au tableau de bord', es: 'Volver al panel', ar: 'العودة إلى لوحة القيادة' },
    'Are you sure you want to remove this user profile?': { en: 'Are you sure you want to remove this user profile?', fr: 'Voulez-vous vraiment supprimer ce profil utilisateur ?', es: '¿Estás seguro de que deseas eliminar este perfil de usuario?', ar: 'هل أنت متأكد أنك تريد إزالة ملف تعريف المستخدم هذا؟' },
    'Error removing user.': { en: 'Error removing user.', fr: 'Erreur lors de la suppression de l\\'utilisateur.', es: 'Error al eliminar usuario.', ar: 'حدث خطأ أثناء إزالة المستخدم.' },
    'Admin Users': { en: 'Admin Users', fr: 'Admin Utilisateurs', es: 'Admin Usuarios', ar: 'إدارة المستخدمين' },
`;

code = code.replace(
    "const translations: Record<string, Record<Language, string>> = {",
    "const translations: Record<string, Record<Language, string>> = {\n" + missingTranslations
);

fs.writeFileSync('src/contexts/LanguageContext.tsx', code);
