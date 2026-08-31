import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'fr' | 'es' | 'ar';

interface Translations {
    [key: string]: {
        [lang in Language]: string;
    };
}

export const translations: Translations = {









    'Community': { en: 'Community', fr: 'Communauté', es: 'Comunidad', ar: 'مجتمعنا' },

    'Join Our': { en: 'Join Our', fr: 'Rejoignez notre', es: 'Únete a nuestra', ar: 'انضم إلى' },

    'Why waste hours searching when we’ve already done it for you? We handpicked some of the best and most popular games from the best game studios, so you can skip the searching and get straight to playing. 🎮😎': { en: 'Why waste hours searching when we’ve already done it for you? We handpicked some of the best and most popular games from the best game studios, so you can skip the searching and get straight to playing. 🎮😎', fr: 'Pourquoi perdre des heures à chercher quand nous l\'avons déjà fait pour vous ? Nous avons sélectionné quelques-uns des meilleurs jeux des meilleurs studios, pour que vous puissiez passer la recherche et jouer directement. 🎮😎', es: '¿Por qué perder horas buscando cuando ya lo hemos hecho por ti? Seleccionamos algunos de los mejores y más populares juegos de los mejores estudios de juegos, para que puedas saltarte la búsqueda y jugar de inmediato. 🎮😎', ar: 'لماذا تضيع ساعات في البحث بينما قمنا بذلك نيابة عنك؟ لقد اخترنا بعضًا من أفضل الألعاب وأكثرها شعبية من أفضل استوديوهات الألعاب، حتى تتمكن من تخطي البحث والبدء في اللعب مباشرة. 🎮😎' },

    'We brought the best games from the best studios.': { en: 'We brought the best games from the best studios.', fr: 'Nous avons rassemblé les meilleurs jeux des meilleurs studios.', es: 'Trajimos los mejores juegos de los mejores estudios.', ar: 'جلبنا أفضل الألعاب من أفضل الاستوديوهات.' },

    'Your Free Time Called.': { en: 'Your Free Time Called.', fr: 'Votre temps libre a appelé.', es: 'Tu tiempo libre llamó.', ar: 'وقت فراغك يناديك.' },

    'Most popular repacks': { en: 'Most popular repacks', fr: 'Repacks les plus populaires', es: 'Repacks más populares', ar: 'أشهر الريباك' },

    'he use Ads': { en: 'he use Ads', fr: 'il utilise des pubs', es: 'usa anuncios', ar: 'يستخدم إعلانات' },

    'Our goal is simple: bring the best games together in one place, so you can spend less time searching and more time playing.': { en: 'Our goal is simple: bring the best games together in one place, so you can spend less time searching and more time playing.', fr: 'Notre objectif est simple : rassembler les meilleurs jeux au même endroit, pour que vous passiez moins de temps à chercher et plus de temps à jouer.', es: 'Nuestro objetivo es simple: reunir los mejores juegos en un solo lugar, para que pases menos tiempo buscando y más tiempo jugando.', ar: 'هدفنا بسيط: جمع أفضل الألعاب في مكان واحد، لتتمكن من قضاء وقت أقل في البحث ومزيد من الوقت في اللعب.' },

    'We focus on games from trusted sources, with no annoying ads and no viruses. We’re also gamers ourselves, and we created SecretArea because we used to spend too much time searching for good games instead of actually playing them.': { en: 'We focus on games from trusted sources, with no annoying ads and no viruses. We’re also gamers ourselves, and we created SecretArea because we used to spend too much time searching for good games instead of actually playing them.', fr: 'Nous nous concentrons sur les jeux provenant de sources fiables, sans publicités ennuyeuses et sans virus. Nous sommes aussi des joueurs, et nous avons créé SecretArea car nous passions trop de temps à chercher de bons jeux au lieu d\'y jouer.', es: 'Nos enfocamos en juegos de fuentes confiables, sin anuncios molestos y sin virus. También somos jugadores y creamos SecretArea porque solíamos pasar demasiado tiempo buscando buenos juegos en lugar de jugarlos.', ar: 'نحن نركز على الألعاب من مصادر موثوقة، بدون إعلانات مزعجة وبدون فيروسات. نحن أيضًا لاعبون، وقد أنشأنا SecretArea لأننا كنا نقضي الكثير من الوقت في البحث عن ألعاب جيدة بدلاً من لعبها بالفعل.' },

    'SecretArea is all about bringing together the best and most popular games in one place — not every game, but only the ones that are worth your time and are actually good.': { en: 'SecretArea is all about bringing together the best and most popular games in one place — not every game, but only the ones that are worth your time and are actually good.', fr: 'SecretArea consiste à rassembler les meilleurs jeux et les plus populaires au même endroit — pas tous les jeux, seulement ceux qui valent votre temps et sont vraiment bons.', es: 'SecretArea se trata de reunir los mejores y más populares juegos en un solo lugar: no todos los juegos, solo los que valen tu tiempo y son realmente buenos.', ar: 'تهدف SecretArea إلى جمع أفضل الألعاب وأكثرها شعبية في مكان واحد — ليس كل لعبة، بل فقط الألعاب التي تستحق وقتك وتكون جيدة بالفعل.' },

    'The idea behind': { en: 'The idea behind', fr: 'L\'idée derrière', es: 'La idea detrás de', ar: 'الفكرة وراء' },

    "What's SecretArea?": { en: 'What\'s SecretArea?', fr: 'Qu\'est-ce que SecretArea ?', es: '¿Qué es SecretArea?', ar: 'ما هي SecretArea؟' },

    'Help us maintain the servers and continue delivering premium content. Every contribution makes a huge difference.': { en: 'Help us maintain the servers and continue delivering premium content. Every contribution makes a huge difference.', fr: 'Aidez-nous à maintenir les serveurs et à continuer de fournir du contenu premium. Chaque contribution fait une énorme différence.', es: 'Ayúdanos a mantener los servidores y continuar entregando contenido premium. Cada contribución hace una gran diferencia.', ar: 'ساعدنا في الحفاظ على الخوادم ومواصلة تقديم محتوى متميز. كل مساهمة تحدث فرقًا كبيرًا.' },

    'Alive': { en: 'Alive', fr: 'En vie', es: 'Vivos', ar: 'على قيد الحياة' },

    'Keep Us': { en: 'Keep Us', fr: 'Gardez-nous', es: 'Mantennos', ar: 'أبقنا' },

    'Support The Community': { en: 'Support The Community', fr: 'Soutenez la communauté', es: 'Apoya a la comunidad', ar: 'ادعم المجتمع' },

    'Join Our Community': { en: 'Join Our Community', fr: 'Rejoignez notre communauté', es: 'Únete a nuestra comunidad', ar: 'انضم إلى مجتمعنا' },
    'Connect with us on Discord, Telegram, and Reddit for the latest updates and exclusive drops.': { en: 'Connect with us on Discord, Telegram, and Reddit for the latest updates and exclusive drops.', fr: 'Connectez-vous avec nous sur Discord, Telegram et Reddit pour les dernières mises à jour et des cadeaux exclusifs.', es: 'Conéctate con nosotros en Discord, Telegram y Reddit para obtener las últimas actualizaciones y entregas exclusivas.', ar: 'تواصل معنا على ديسكورد، تيليجرام، وريديت للحصول على أحدث التحديثات والحصريات.' },
    'Discord': { en: 'Discord', fr: 'Discord', es: 'Discord', ar: 'ديسكورد' },
    'Telegram': { en: 'Telegram', fr: 'Telegram', es: 'Telegram', ar: 'تيليجرام' },
    'Reddit': { en: 'Reddit', fr: 'Reddit', es: 'Reddit', ar: 'ريديت' },
    'Unlock Exclusive': { en: 'Unlock Exclusive', fr: 'Débloquez des exclusivités', es: 'Desbloquea exclusivas', ar: 'افتح حصريًا' },
    'Rewards': { en: 'Rewards', fr: 'Récompenses', es: 'Recompensas', ar: 'المكافآت' },
    'Get access to premium mastergifts and free accounts. Elevate your gaming experience with our exclusive collection.': { en: 'Get access to premium mastergifts and free accounts. Elevate your gaming experience with our exclusive collection.', fr: 'Accédez à des mastergifts premium et des comptes gratuits. Améliorez votre expérience de jeu avec notre collection exclusive.', es: 'Obtén acceso a mastergifts premium y cuentas gratuitas. Eleva tu experiencia de juego con nuestra colección exclusiva.', ar: 'احصل على وصول إلى هدايا مميزة وحسابات مجانية. ارتقِ بتجربة اللعب الخاصة بك مع مجموعتنا الحصرية.' },
    'Mastergift': { en: 'Mastergift', fr: 'Mastergift', es: 'Mastergift', ar: 'هدية الماستر' },
    'Your system comfortably meets all requirements. Experience optimal gameplay with high frame rates.': { en: 'Your system comfortably meets all requirements. Experience optimal gameplay with high frame rates.', fr: 'Votre système répond confortablement à toutes les exigences. Profitez d\'un jeu optimal avec des fréquences d\'images élevées.', es: 'Tu sistema cumple cómodamente con todos los requisitos. Experimenta un juego óptimo con altas tasas de cuadros.', ar: 'يلبي نظامك جميع المتطلبات بشكل مريح. جرب اللعب الأمثل مع معدلات إطارات عالية.' },
    'Your system comfortably meets most requirements. You should be able to play at high settings with stable performance.': { en: 'Your system comfortably meets most requirements. You should be able to play at high settings with stable performance.', fr: 'Votre système répond confortablement à la plupart des exigences. Vous devriez pouvoir jouer avec des paramètres élevés avec des performances stables.', es: 'Tu sistema cumple cómodamente con la mayoría de los requisitos. Deberías poder jugar con ajustes altos con un rendimiento estable.', ar: 'يلبي نظامك معظم المتطلبات بشكل مريح. يجب أن تكون قادرًا على اللعب بإعدادات عالية مع أداء مستقر.' },
    'Your system falls below the recommended requirements. You may experience performance issues, and an upgrade is recommended.': { en: 'Your system falls below the recommended requirements. You may experience performance issues, and an upgrade is recommended.', fr: 'Votre système est en dessous des exigences recommandées. Vous pouvez rencontrer des problèmes de performances et une mise à niveau est recommandée.', es: 'Tu sistema está por debajo de los requisitos recomendados. Puedes experimentar problemas de rendimiento y se recomienda una actualización.', ar: 'نظامك أقل من المتطلبات الموصى بها. قد تواجه مشكلات في الأداء، ويوصى بالترقية.' },
    'EXCELLENT': { en: 'EXCELLENT', fr: 'EXCELLENT', es: 'EXCELENTE', ar: 'ممتاز' },
    'GOOD': { en: 'GOOD', fr: 'BON', es: 'BUENO', ar: 'جيد' },
    'POOR': { en: 'POOR', fr: 'FAIBLE', es: 'POBRE', ar: 'ضعيف' },
    'Graphics Card': { en: 'Graphics Card', fr: 'Carte graphique', es: 'Tarjeta gráfica', ar: 'بطاقة الرسومات' },
    'Processor': { en: 'Processor', fr: 'Processeur', es: 'Procesador', ar: 'المعالج' },
    'Memory': { en: 'Memory', fr: 'Mémoire', es: 'Memoria', ar: 'الذاكرة' },
    'Storage': { en: 'Storage', fr: 'Stockage', es: 'Almacenamiento', ar: 'التخزين' },
    'Can I Run It?': { en: 'Can I Run It?', fr: 'Puis-je le faire tourner ?', es: '¿Puedo ejecutarlo?', ar: 'هل يمكنني تشغيلها؟' },
    'Add your GPU, CPU, and RAM to get a compatibility score': { en: 'Add your GPU, CPU, and RAM to get a compatibility score', fr: 'Ajoutez votre GPU, CPU et RAM pour obtenir un score de compatibilité', es: 'Añade tu GPU, CPU y RAM para obtener una puntuación de compatibilidad', ar: 'أضف بطاقة الرسومات والمعالج والذاكرة للحصول على نتيجة التوافق' },
    'View hardware analysis': { en: 'View hardware analysis', fr: 'Voir l\'analyse matérielle', es: 'Ver análisis de hardware', ar: 'عرض تحليل الأجهزة' },
    'System requirements are based on the global filter': { en: 'System requirements are based on the global filter', fr: 'Les exigences du système sont basées sur le filtre global', es: 'Los requisitos del sistema se basan en el filtro global', ar: 'تعتمد متطلبات النظام على الفلتر العالمي' },
    'PASSES': { en: 'PASSES', fr: 'RÉUSSIT', es: 'PASA', ar: 'يجتاز' },
    'FAILS': { en: 'FAILS', fr: 'ÉCHOUE', es: 'FALLA', ar: 'يفشل' },
    'savegame': { en: 'savegame', fr: 'Sauvegarde', es: 'Guardado', ar: 'حفظ اللعبة' },
    'Everything is fine! 🎉': { en: 'Everything is fine! 🎉', fr: 'Tout va bien ! 🎉', es: '¡Todo está bien! 🎉', ar: 'كل شيء على ما يرام! 🎉' },
    'Now you can have it thanks for respect N E X A 1337 Guidelines and instructions, all this for you. 🥳': { en: 'Now you can have it thanks for respect N E X A 1337 Guidelines and instructions, all this for you. 🥳', fr: 'Maintenant, vous pouvez l\'avoir grâce au respect des directives et instructions de N E X A 1337, tout ça pour vous. 🥳', es: 'Ahora puedes tenerlo gracias por respetar las directrices e instrucciones de N E X A 1337, todo esto para ti. 🥳', ar: 'الآن يمكنك الحصول عليه بفضل احترام إرشادات وتعليمات N E X A 1337، كل هذا من أجلك. 🥳' },
    'Get Files ⚡': { en: 'Get Files ⚡', fr: 'Obtenir les fichiers ⚡', es: 'Obtener archivos ⚡', ar: 'احصل على الملفات ⚡' },
    'Watch Trailer': { en: 'Watch Trailer', fr: 'Regarder la bande-annonce', es: 'Ver el tráiler', ar: 'شاهد المقطع الدعائي' },
    'RATE & REVIEW': { en: 'RATE & REVIEW', fr: 'ÉVALUER ET NOTER', es: 'CALIFICAR Y RESEÑAR', ar: 'التقييم والمراجعة' },
    'reviews': { en: 'reviews', fr: 'avis', es: 'reseñas', ar: 'مراجعات' },
    'Repacker': { en: 'Repacker', fr: 'Repacker', es: 'Repacker', ar: 'معيد الحزم' },
    'Report': { en: 'Report', fr: 'Signaler', es: 'Reportar', ar: 'إبلاغ' },
    'Share Link': { en: 'Share Link', fr: 'Partager le lien', es: 'Compartir enlace', ar: 'مشاركة الرابط' },
    'Release Group': { en: 'Release Group', fr: 'Groupe de publication', es: 'Grupo de lanzamiento', ar: 'مجموعة الإصدار' },
    'Released': { en: 'Released', fr: 'Sorti le', es: 'Publicado', ar: 'تاريخ الإصدار' },
    'Game Studio': { en: 'Game Studio', fr: 'Studio de jeu', es: 'Estudio de juegos', ar: 'استوديو اللعبة' },
    'Genres': { en: 'Genres', fr: 'Genres', es: 'Géneros', ar: 'الأنواع' },
    'Get it on SteamDB': { en: 'Get it on SteamDB', fr: 'Obtenez-le sur SteamDB', es: 'Consíguelo en SteamDB', ar: 'احصل عليه على SteamDB' },
    'Game Features': { en: 'Game Features', fr: 'Caractéristiques du jeu', es: 'Características del juego', ar: 'مميزات اللعبة' },
    'Game Screenshots Gallery': { en: 'Game Screenshots Gallery', fr: 'Galerie de captures d\'écran', es: 'Galería de capturas de pantalla', ar: 'معرض صور اللعبة' },
    'Minimum specifications needed': { en: 'Minimum specifications needed', fr: 'Spécifications minimales requises', es: 'Especificaciones mínimas requeridas', ar: 'الحد الأدنى من المواصفات المطلوبة' },
    'REQUIRES A 64-BIT PROCESSOR AND OPERATING SYSTEM': { en: 'REQUIRES A 64-BIT PROCESSOR AND OPERATING SYSTEM', fr: 'NÉCESSITE UN PROCESSEUR ET UN SYSTÈME D\'EXPLOITATION 64 BITS', es: 'REQUIERE UN PROCESADOR Y SISTEMA OPERATIVO DE 64 BITS', ar: 'يتطلب معالج ونظام تشغيل 64-بت' },
    'Follow these steps to safely install and set up your Games and Apps.': { en: 'Follow these steps to safely install and set up your Games and Apps.', fr: 'Suivez ces étapes pour installer et configurer vos jeux et applications en toute sécurité.', es: 'Sigue estos pasos para instalar y configurar tus juegos y aplicaciones de forma segura.', ar: 'اتبع هذه الخطوات لتثبيت وإعداد ألعابك وتطبيقاتك بأمان.' },
    'Wait a minute! 🛑': { en: 'Wait a minute! 🛑', fr: 'Attendez une minute ! 🛑', es: '¡Espera un minuto! 🛑', ar: 'انتظر دقيقة! 🛑' },
    'YES, I HAVE IT 🚀': { en: 'YES, I HAVE IT 🚀', fr: 'OUI, JE L\'AI 🚀', es: 'SÍ, LO TENGO 🚀', ar: 'نعم، لدي البرنامج 🚀' },
    'Not Yet 😅': { en: 'Not Yet 😅', fr: 'Pas encore 😅', es: 'Aún no 😅', ar: 'ليس بعد 😅' },
    'To use this method, you need <strong className="text-blue-600 dark:text-blue-400">qBittorrent</strong> to download uTorrent files without problems. Do you already have it installed? 🤔': { en: 'To use this method, you need <strong className="text-blue-600 dark:text-blue-400">qBittorrent</strong> to download uTorrent files without problems. Do you already have it installed? 🤔', fr: 'Pour utiliser cette méthode, vous avez besoin de <strong className="text-blue-600 dark:text-blue-400">qBittorrent</strong> pour télécharger les fichiers uTorrent sans problème. L\'avez-vous déjà installé ? 🤔', es: 'Para usar este método, necesitas <strong className="text-blue-600 dark:text-blue-400">qBittorrent</strong> para descargar archivos uTorrent sin problemas. ¿Ya lo tienes instalado? 🤔', ar: 'لاستخدام هذه الطريقة، تحتاج إلى <strong className="text-blue-600 dark:text-blue-400">qBittorrent</strong> لتنزيل ملفات uTorrent بدون مشافل. هل قمت بتثبيته بالفعل؟ 🤔' },
    'Operating System': { en: 'Operating System', fr: 'Système d\'exploitation', es: 'Sistema operativo', ar: 'نظام التشغيل' },
    'RAM (GB)': { en: 'RAM (GB)', fr: 'RAM (Go)', es: 'RAM (GB)', ar: 'ذاكرة الوصول العشوائي (جيجابايت)' },
    'Processor (CPU)': { en: 'Processor (CPU)', fr: 'Processeur (CPU)', es: 'Procesador (CPU)', ar: 'المعالج (CPU)' },
    'Graphics (GPU)': { en: 'Graphics (GPU)', fr: 'Graphiques (GPU)', es: 'Gráficos (GPU)', ar: 'بطاقة الرسومات (GPU)' },
    'You can use ': { en: 'You can use ', fr: 'Vous pouvez utiliser ', es: 'Puedes usar ', ar: 'يمكنك استخدام ' },
    ' or another wallet to exchange and send.': { en: ' or another wallet to exchange and send.', fr: ' ou un autre portefeuille pour échanger et envoyer.', es: ' u otra billetera para intercambiar y enviar.', ar: ' أو محفظة أخرى للتبادل والإرسال.' },
    'What are Hypervisor Cracks?': { en: 'What are Hypervisor Cracks?', fr: 'Qu\'est-ce que les cracks d\'hyperviseur ?', es: '¿Qué son los cracks de hipervisor?', ar: 'ما هي شروخ الهايبرفايزر؟' },
    'Windows virtualization-based security components': { en: 'Windows virtualization-based security components', fr: 'Composants de sécurité basés sur la virtualisation de Windows', es: 'Componentes de seguridad basados en virtualización de Windows', ar: 'مكونات الأمان المستندة إلى المحاكاة الافتراضية في ويندوز' },
    'I want to play that new Denuvo-protected game, is it safe to disable all this and use a hypervisor crack?': { en: 'I want to play that new Denuvo-protected game, is it safe to disable all this and use a hypervisor crack?', fr: 'Je veux jouer à ce nouveau jeu protégé par Denuvo, est-il sûr de désactiver tout cela et d\'utiliser un crack d\'hyperviseur ?', es: 'Quiero jugar a ese nuevo juego protegido por Denuvo, ¿es seguro desactivar todo esto y usar un crack de hipervisor?', ar: 'أريد أن ألعب تلك اللعبة الجديدة المحمية بواسطة Denuvo، هل من الآمن تعطيل كل هذا واستخدام شرخ هايبرفايزر؟' },
    'What’s inside those cracks?': { en: 'What’s inside those cracks?', fr: 'Qu\'y a-t-il à l\'intérieur de ces cracks ?', es: '¿Qué hay dentro de esos cracks?', ar: 'ماذا يوجد داخل تلك الشروخ؟' },
    'Pre-requirements': { en: 'Pre-requirements', fr: 'Pré-requis', es: 'Requisitos previos', ar: 'المتطلبات الأساسية' },
    'Do I need to disable Secure Boot or use EfiGuard?': { en: 'Do I need to disable Secure Boot or use EfiGuard?', fr: 'Dois-je désactiver le Secure Boot ou utiliser EfiGuard ?', es: '¿Necesito desactivar Secure Boot o usar EfiGuard?', ar: 'هل أحتاج إلى تعطيل الإقلاع الآمن أو استخدام EfiGuard؟' },
    'N E X A 1337 Says': { en: 'N E X A 1337 Says', fr: 'N E X A 1337 dit', es: 'N E X A 1337 dice', ar: 'يقول N E X A 1337' },
    'Direct Link': { en: 'Direct Link', fr: 'Lien direct', es: 'Enlace directo', ar: 'رابط مباشر' },
    'Recommendation': { en: 'Recommendation', fr: 'Recommandation', es: 'Recomendación', ar: 'توصية' },
    'Game Files': { en: 'Game Files', fr: 'Fichiers du jeu', es: 'Archivos del juego', ar: 'ملفات اللعبة' },
    'Full project': { en: 'Full project', fr: 'Projet complet', es: 'Proyecto completo', ar: 'المشروع الكامل' },
    'Master File Magnet': { en: 'Master File Magnet', fr: 'Fichier Magnet Principal', es: 'Archivo Magnet Principal', ar: 'ملف ماجنت رئيسي' },
    'Check database stats and info': { en: 'Check database stats and info', fr: 'Vérifier les statistiques et les infos de la base de données', es: 'Revisar estadísticas e información de la base de datos', ar: 'تحقق من إحصائيات ومعلومات قاعدة البيانات' },
    'Please review these important details before installation': { en: 'Please review these important details before installation', fr: 'Veuillez vérifier ces détails importants avant l\'installation', es: 'Por favor revisa estos detalles importantes antes de la instalación', ar: 'يرجى مراجعة هذه التفاصيل المهمة قبل التثبيت' },
    'Can your PC run this game?': { en: 'Can your PC run this game?', fr: 'Votre PC peut-il faire tourner ce jeu ?', es: '¿Puede tu PC ejecutar este juego?', ar: 'هل يمكن لجهازك تشغيل هذه اللعبة؟' },
    'Requires a 64-bit': { en: 'Requires a 64-bit', fr: 'Nécessite un 64 bits', es: 'Requiere 64 bits', ar: 'يتطلب 64-بت' },
    'Watch trailer': { en: 'Watch trailer', fr: 'Regarder la bande-annonce', es: 'Ver el tráiler', ar: 'شاهد المقطع الدعائي' },
    "View Details": { "en": "View Details", "fr": "Voir les détails", "es": "Ver detalles", "ar": "عرض التفاصيل" },

    'GAME OF THE DAY': {'en':'GAME OF THE DAY','fr':'JEU DU JOUR','es':'JUEGO DEL DÍA','ar':'لعبة اليوم'},
    'DOWNLOADS': {'en':'DOWNLOADS','fr':'TÉLÉCHARGEMENTS','es':'DESCARGAS','ar':'التحميلات'},
    'LIKES': {'en':'LIKES','fr':'AIMENT','es':'ME GUSTA','ar':'الإعجابات'},
    'size': {'en':'size','fr':'taille','es':'tamaño','ar':'الحجم'},
    'views': {'en':'views','fr':'vues','es':'vistas','ar':'المشاهدات'},
    'score': {'en':'score','fr':'score','es':'puntuación','ar':'التقييم'},
    'Trailer': {'en':'Trailer','fr':'Bande-annonce','es':'Tráiler','ar':'العرض الدعائي'},

    'Dark Mode': { en: 'Dark Mode', fr: 'Mode Sombre', es: 'Modo Oscuro', ar: 'الوضع المظلم' },
    'Light Mode': { en: 'Light Mode', fr: 'Mode Clair', es: 'Modo Claro', ar: 'الوضع الفاتح' },
    'Logout': { en: 'Logout', fr: 'Déconnexion', es: 'Cerrar sesión', ar: 'تسجيل الخروج' },

    'SecretTitle1': { en: 'Secret', fr: 'Secret', es: 'Secreta', ar: 'المنطقة' },
    'SecretTitle2': { en: 'Area', fr: 'Zone', es: 'Área', ar: 'السرية' },
    'NODES ACTIVE': { en: 'NODES ACTIVE', fr: 'NŒUDS ACTIFS', es: 'NODOS ACTIVOS', ar: 'عقدة نشطة' },
    'ANALYZING CONNECTION...': { en: 'ANALYZING CONNECTION...', fr: 'ANALYSE DE LA CONNEXION...', es: 'ANALIZANDO CONEXIÓN...', ar: 'جاري تحليل الاتصال...' },
    'CONNECTION UNSTABLE': { en: 'CONNECTION UNSTABLE', fr: 'CONNEXION INSTABLE', es: 'CONEXIÓN INESTABLE', ar: 'اتصال غير مستقر' },
    'SECURE CONNECTION ESTABLISHED': { en: 'SECURE CONNECTION ESTABLISHED', fr: 'CONNEXION SÉCURISÉE ÉTABLIE', es: 'CONEXIÓN SEGURA ESTABLECIDA', ar: 'تم إنشاء اتصال آمن' },
    'ANALYZING': { en: 'ANALYZING', fr: 'ANALYSE', es: 'ANALIZANDO', ar: 'تحليل' },
    'UNSTABLE': { en: 'UNSTABLE', fr: 'INSTABLE', es: 'INESTABLE', ar: 'غير مستقر' },
    'SECURE': { en: 'SECURE', fr: 'SÉCURISÉ', es: 'SEGURO', ar: 'آمن' },
    'GUEST MODE': { en: 'GUEST MODE', fr: 'MODE INVITÉ', es: 'MODO INVITADO', ar: 'وضع الضيف' },

    'Sponsored': { en: 'Sponsored', fr: 'Sponsorisé', es: 'Patrocinado', ar: 'إعلان ممول' },

    'Backup Server': { en: 'Backup Server', fr: 'Serveur de secours', es: 'Servidor de respaldo', ar: 'سيرفر احتياطي' },
    'FuckingFast (REALLY Fucking Fast 🙂) - Link': { en: 'FuckingFast (REALLY Fucking Fast 🙂) - Link', fr: 'FuckingFast (VRAIMENT très rapide 🙂) - Lien', es: 'FuckingFast (REALMENTE muy rápido 🙂) - Enlace', ar: 'FuckingFast (سريع جداً 🙂) - رابط' },
    'Mirror Link': { en: 'Mirror Link', fr: 'Lien miroir', es: 'Enlace espejo', ar: 'رابط بديل' },

    'ThirdPartyDisclaimer': { en: 'This game requires an external launcher or account verification (EA Account). As this game also has Denuvo, it might be impossible to play in any case.', fr: 'Ce jeu nécessite un lanceur externe ou une vérification de compte (Compte EA). Comme ce jeu a aussi Denuvo, il pourrait être impossible d\'y jouer dans tous les cas.', es: 'Este juego requiere un lanzador externo o verificación de cuenta (Cuenta EA). Como este juego también tiene Denuvo, podría ser imposible jugarlo en cualquier caso.', ar: 'تتطلب هذه اللعبة مشغلًا خارجيًا أو التحقق من الحساب (حساب EA). نظرًا لأن هذه اللعبة تحتوي أيضًا على Denuvo، فقد يكون من المستحيل لعبها بأي حال من الأحوال.' },
    'Primary Server': { en: 'Primary Server', fr: 'Serveur primaire', es: 'Servidor primario', ar: 'السيرفر الأساسي' },
    'Pre-installed': { en: 'Pre-installed', fr: 'Pré-installé', es: 'Preinstalado', ar: 'مثبت مسبقاً' },

    'SHOW': { en: 'SHOW', fr: 'AFFICHER', es: 'MOSTRAR', ar: 'عرض' },
    'HIDE': { en: 'HIDE', fr: 'MASQUER', es: 'OCULTAR', ar: 'إخفاء' },
    'Pre-installation:': { en: 'Pre-installation:', fr: 'Pré-installation:', es: 'Preinstalación:', ar: 'تثبيت مسبق:' },
    'These games are already pre-installed. You don\'t need to run a setup. Just download, extract, and play instantly!': { en: 'These games are already pre-installed. You don\'t need to run a setup. Just download, extract, and play instantly!', fr: 'Ces jeux sont déjà pré-installés. Vous n\'avez pas besoin de lancer une configuration. Téléchargez, extrayez et jouez instantanément !', es: 'Estos juegos ya están preinstalados. No necesitas ejecutar una configuración. ¡Solo descarga, extrae y juega al instante!', ar: 'هذه الألعاب مثبتة مسبقًا. لا تحتاج إلى تشغيل التثبيت. فقط قم بالتحميل وفك الضغط والعب فورًا!' },
    'AnkerGames Server - Part': { en: 'AnkerGames Server - Part', fr: 'Serveur AnkerGames - Partie', es: 'Servidor AnkerGames - Parte', ar: 'سيرفر AnkerGames - جزء' },
    'Pre-installed Server': { en: 'Pre-installed Server', fr: 'Serveur pré-installé', es: 'Servidor preinstalado', ar: 'سيرفر مثبت مسبقًا' },

    'Watch Tutorial': { en: 'Watch Tutorial', fr: 'Regarder le tutoriel', es: 'Ver tutorial', ar: 'شاهد الشرح' },
    'Get DLCs / Updates': { en: 'Get DLCs / Updates', fr: 'Obtenir les DLC / Mises à jour', es: 'Obtener DLCs / Actualizaciones', ar: 'الحصول على الإضافات / التحديثات' },

    'Follow these steps to safely install and set up your application.': { en: 'Follow these steps to safely install and set up your application.', fr: 'Suivez ces étapes pour installer et configurer votre application en toute sécurité.', es: 'Sigue estos pasos para instalar y configurar tu aplicación de forma segura.', ar: 'اتبع هذه الخطوات لتثبيت وإعداد تطبيقك بأمان.' },

    'NexaMessage1': { en: 'Support the original developers and creators by purchasing legitimate copies of their products.', fr: 'Soutenez les développeurs et créateurs originaux en achetant des copies légitimes de leurs produits.', es: 'Apoya a los desarrolladores y creadores originales comprando copias legítimas de sus productos.', ar: 'ادعم المطورين والمبدعين الأصليين من خلال شراء نسخ شرعية من منتجاتهم.' },
    'NexaMessage2': { en: 'All trademarks, copyrights, and intellectual property belong to their respective owners.', fr: 'Toutes les marques, droits d\'auteur et propriétés intellectuelles appartiennent à leurs propriétaires respectifs.', es: 'Todas las marcas comerciales, derechos de autor y propiedad intelectual pertenecen a sus respectivos dueños.', ar: 'جميع العلامات التجارية وحقوق النشر والملكية الفكرية هي ملك لأصحابها.' },
    'NexaMessage3': { en: 'If you are a rights holder and wish to request content removal, please contact us.', fr: 'Si vous êtes titulaire de droits et souhaitez demander la suppression de contenu, veuillez nous contacter.', es: 'Si usted es un titular de derechos y desea solicitar la eliminación de contenido, contáctenos.', ar: 'إذا كنت صاحب حقوق وترغب في طلب إزالة المحتوى، يرجى التواصل معنا.' },
    'Community Score': { en: 'Community Score', fr: 'Score de la communauté', es: 'Puntuación de la comunidad', ar: 'تقييم المجتمع' },
    'VERIFIED': { en: 'VERIFIED', fr: 'VÉRIFIÉ', es: 'VERIFICADO', ar: 'تم التحقق' },

    'Reply': { en: 'Reply', fr: 'Répondre', es: 'Responder', ar: 'رد' },
    'Replies': { en: 'Replies', fr: 'Réponses', es: 'Respuestas', ar: 'ردود' },
    'Post': { en: 'Post', fr: 'Publier', es: 'Publicar', ar: 'نشر' },
    'Add a reply...': { en: 'Add a reply...', fr: 'Ajouter une réponse...', es: 'Añadir una respuesta...', ar: 'أضف رداً...' },

    'Post Intel': { en: 'Post Intel', fr: 'Publier les informations', es: 'Publicar información', ar: 'نشر المعلومات' },

    'Your Alias (Optional)...': { en: 'Your Alias (Optional)...', fr: 'Votre alias (Optionnel)...', es: 'Tu alias (Opcional)...', ar: 'اسمك المستعار (اختياري)...' },
    'Drop your intel, review, or funny thoughts here...': { en: 'Drop your intel, review, or funny thoughts here...', fr: 'Déposez vos informations, critiques ou pensées amusantes ici...', es: 'Deja tu información, reseña o pensamientos divertidos aquí...', ar: 'اترك معلوماتك، مراجعتك، أو أفكارك المضحكة هنا...' },

    'N E X A 1337 Says :': { en: 'N E X A 1337 Says :', fr: 'N E X A 1337 Dit :', es: 'N E X A 1337 Dice :', ar: 'N E X A 1337 يقول :' },
    'Game Size Info': { en: 'Game Size Info', fr: 'Informations sur la taille du jeu', es: 'Información del tamaño del juego', ar: 'معلومات حجم اللعبة' },
    'Overview': { en: 'Overview', fr: 'Aperçu', es: 'Resumen', ar: 'نظرة عامة' },
    'System Requirements': { en: 'System Requirements', fr: 'Exigences du système', es: 'Requisitos del sistema', ar: 'متطلبات النظام' },
    'Can I Run It? (Smart Check)': { en: 'Can I Run It? (Smart Check)', fr: 'Puis-je l\'exécuter ? (Vérification intelligente)', es: '¿Puedo ejecutarlo? (Verificación inteligente)', ar: 'هل يمكنني تشغيله؟ (فحص ذكي)' },
    'Tools You Need': { en: 'Tools You Need', fr: 'Outils dont vous avez besoin', es: 'Herramientas que necesitas', ar: 'الأدوات التي تحتاجها' },
    'Steps You Need': { en: 'Steps You Need', fr: 'Étapes dont vous avez besoin', es: 'Pasos que necesitas', ar: 'الخطوات التي تحتاجها' },
    'Installation Guide': { en: 'Installation Guide', fr: 'Guide d\'installation', es: 'Guía de instalación', ar: 'دليل التثبيت' },
    'Download Channels': { en: 'Download Channels', fr: 'Canaux de téléchargement', es: 'Canales de descarga', ar: 'قنوات التحميل' },
    'Download Channels / Via Telegram': { en: 'Download Channels / Via Telegram', fr: 'Canaux de téléchargement / Via Telegram', es: 'Canales de descarga / Vía Telegram', ar: 'قنوات التحميل / عبر تليجرام' },
    'Game Trailer': { en: 'Game Trailer', fr: 'Bande-annonce du jeu', es: 'Tráiler del juego', ar: 'مقطع اللعبة' },
    'Close Trailer': { en: 'Close Trailer', fr: 'Fermer la bande-annonce', es: 'Cerrar tráiler', ar: 'إغلاق المقطع' },
    'Report Broken Link': { en: 'Report Broken Link', fr: 'Signaler un lien brisé', es: 'Reportar enlace roto', ar: 'الإبلاغ عن رابط معطل' },
    'Join the Conversation': { en: 'Join the Conversation', fr: 'Rejoindre la conversation', es: 'Únete a la conversación', ar: 'انضم إلى المحادثة' },
    'File Size': { en: 'File Size', fr: 'Taille du fichier', es: 'Tamaño del archivo', ar: 'حجم الملف' },
    'Status by %': { en: 'Status by %', fr: 'Statut en %', es: 'Estado por %', ar: 'الحالة بـ %' },
    'Downloads': { en: 'Downloads', fr: 'Téléchargements', es: 'Descargas', ar: 'التنزيلات' },
    'Repack Size': { en: 'Repack Size', fr: 'Taille du Repack', es: 'Tamaño del Repack', ar: 'حجم النسخة المضغوطة' },
    'Original Size': { en: 'Original Size', fr: 'Taille originale', es: 'Tamaño original', ar: 'الحجم الأصلي' },
    'Languages': { en: 'Languages', fr: 'Langues', es: 'Idiomas', ar: 'اللغات' },
    'Denuvo DRM Detected': { en: 'Denuvo DRM Detected', fr: 'Denuvo DRM Détecté', es: 'Denuvo DRM Detectado', ar: 'تم اكتشاف حماية Denuvo' },
    'Download at your own risk.': { en: 'Download at your own risk.', fr: 'Téléchargez à vos propres risques.', es: 'Descarga bajo tu propio riesgo.', ar: 'حمل على مسؤوليتك الخاصة.' },
    'In Game': { en: 'In Game', fr: 'En jeu', es: 'En el juego', ar: 'في اللعبة' },
    'Join Channel': { en: 'Join Channel', fr: 'Rejoindre le canal', es: 'Unirse al canal', ar: 'انضم للقناة' },
    'Download Via Telegram': { en: 'Download Via Telegram', fr: 'Télécharger via Telegram', es: 'Descargar Vía Telegram', ar: 'التحميل عبر تليجرام' },
    'Master File': { en: 'Master File', fr: 'Fichier maître', es: 'Archivo maestro', ar: 'الملف الرئيسي' },
    'Read': { en: 'Read', fr: 'Lire', es: 'Leer', ar: 'اقرأ' },
    'Third-Party Account Required': { en: 'Third-Party Account Required', fr: 'Compte tiers requis', es: 'Se requiere cuenta de terceros', ar: 'يتطلب حساب جهة خارجية' },

    'Decrypting Data Stream...': { en: 'Decrypting Data Stream...', fr: 'Décryptage du flux de données...', es: 'Descifrando el flujo de datos...', ar: 'جاري فك تشفير البيانات...' },
    'Request This Item': { en: 'Request This Item', fr: 'Demander cet article', es: 'Solicitar este artículo', ar: 'طلب هذا العنصر' },

    'All Studios': { en: 'All Studios', fr: 'Tous les studios', es: 'Todos los estudios', ar: 'جميع الاستوديوهات' },
    'All Companies': { en: 'All Companies', fr: 'Toutes les entreprises', es: 'Todas las empresas', ar: 'جميع الشركات' },
    'Total Found': { en: 'Total Found', fr: 'Trouvés au total', es: 'Total Encontrado', ar: 'الإجمالي الموجود' },
    'SEARCH PROFILES...': { en: 'SEARCH PROFILES...', fr: 'RECHERCHE DE PROFILS...', es: 'BUSCAR PERFILES...', ar: 'ابحث عن الملفات الشخصية...' },
    'Item': { en: 'Item', fr: 'Article', es: 'Artículo', ar: 'عنصر' },
    'Items': { en: 'Items', fr: 'Articles', es: 'Artículos', ar: 'عناصر' },
    'No Profiles Found': { en: 'No Profiles Found', fr: 'Aucun profil trouvé', es: 'No se encontraron perfiles', ar: 'لم يتم العثور على ملفات شخصية' },
    'Try adjusting your search criteria.': { en: 'Try adjusting your search criteria.', fr: 'Essayez de modifier vos critères de recherche.', es: 'Intenta ajustar tus criterios de búsqueda.', ar: 'حاول تعديل معايير البحث الخاصة بك.' },

    'We found a similar item in that section. Are you sure you want to request it?': { en: 'We found a similar item in that section. Are you sure you want to request it?', fr: 'Nous avons trouvé un article similaire dans cette section. Êtes-vous sûr de vouloir le demander ?', es: 'Encontramos un artículo similar en esa sección. ¿Estás seguro de que quieres solicitarlo?', ar: 'لقد وجدنا عنصراً مشابهاً في هذا القسم. هل أنت متأكد أنك تريد طلبه؟' },
    'Auto-categorized based on title': { en: 'Auto-categorized based on title', fr: 'Auto-catégorisé selon le titre', es: 'Autocategorizado basado en el título', ar: 'تم التصنيف تلقائياً بناءً على العنوان' },
    'Section': { en: 'Section', fr: 'Section', es: 'Sección', ar: 'القسم' },
    'Message to Admin (Optional)': { en: 'Message to Admin (Optional)', fr: 'Message à l\'administrateur (Facultatif)', es: 'Mensaje al Administrador (Opcional)', ar: 'رسالة للمسؤول (اختياري)' },

    'Games in Series': { en: 'Games in Series', fr: 'Jeux de la série', es: 'Juegos en la serie', ar: 'الألعاب في السلسلة' },
    'Best': { en: 'Best', fr: 'Meilleur', es: 'Mejor', ar: 'الأفضل' },
    'No additional images available for this series.': { en: 'No additional images available for this series.', fr: 'Aucune image supplémentaire disponible pour cette série.', es: 'No hay imágenes adicionales disponibles para esta serie.', ar: 'لا توجد صور إضافية متاحة لهذه السلسلة.' },

    'Includes:': { en: 'Includes:', fr: 'Comprend:', es: 'Incluye:', ar: 'يشمل:' },
    'Please do not change passwords. These are community accounts.': { en: 'Please do not change passwords. These are community accounts.', fr: 'Veuillez ne pas changer les mots de passe. Ce sont des comptes communautaires.', es: 'Por favor, no cambie las contraseñas. Estas son cuentas comunitarias.', ar: 'يرجى عدم تغيير كلمات المرور. هذه حسابات مجتمعية المشتركة.' },
    'Copy Username': { en: 'Copy Username', fr: 'Copier le nom d\'utilisateur', es: 'Copiar nombre de usuario', ar: 'نسخ اسم المستخدم' },
    'Email / Username': { en: 'Email / Username', fr: 'E-mail / Nom d\'utilisateur', es: 'Correo / Nombre de usuario', ar: 'البريد الإلكتروني / اسم المستخدم' },
    'Copy Email': { en: 'Copy Email', fr: 'Copier l\'e-mail', es: 'Copiar correo', ar: 'نسخ البريد الإلكتروني' },
    'Visit Service': { en: 'Visit Service', fr: 'Visiter le service', es: 'Visitar servicio', ar: 'زيارة الخدمة' },
    'Showing': { en: 'Showing', fr: 'Affichage de', es: 'Mostrando', ar: 'عرض' },
    'to': { en: 'to', fr: 'à', es: 'a', ar: 'إلى' },
    'of': { en: 'of', fr: 'sur', es: 'de', ar: 'من' },
    'gifts': { en: 'gifts', fr: 'cadeaux', es: 'regalos', ar: 'هدايا' },
    'Loading Gateway': { en: 'Loading Gateway', fr: 'Chargement de la passerelle', es: 'Cargando pasarela', ar: 'جاري تحميل البوابة' },
    'Leading developers by released items': { en: 'Leading developers by released items', fr: 'Principaux développeurs par articles publiés', es: 'Principales desarrolladores por artículos publicados', ar: 'أبرز المطورين حسب الإصدارات' },
    'View Directory': { en: 'View Directory', fr: 'Voir l\'annuaire', es: 'Ver directorio', ar: 'عرض الدليل' },
    'Download for': { en: 'Download for', fr: 'Télécharger pour', es: 'Descargar para', ar: 'تحميل لـ' },
    'Desktop App': { en: 'Desktop App', fr: 'Application de bureau', es: 'Aplicación de escritorio', ar: 'تطبيق سطح المكتب' },
    'Android App': { en: 'Android App', fr: 'Application Android', es: 'Aplicación de Android', ar: 'تطبيق أندرويد' },
    'All rights reserved.': { en: 'All rights reserved.', fr: 'Tous droits réservés.', es: 'Todos los derechos reservados.', ar: 'جميع الحقوق محفوظة.' },
    'Built by :': { en: 'Built by :', fr: 'Construit par :', es: 'Construido por :', ar: 'تم التطوير بواسطة :' },
    'N E X A 1337 Ecosystem': { en: 'N E X A 1337 Ecosystem', fr: 'Écosystème N E X A 1337', es: 'Ecosistema N E X A 1337', ar: 'نظام N E X A 1337' },
    'clicks': { en: 'clicks', fr: 'clics', es: 'clics', ar: 'نقرة' },

    'OPEN WORLD': { en: 'OPEN WORLD', fr: 'MONDE OUVERT', es: 'MUNDO ABIERTO', ar: 'عالم مفتوح' },
    'YOU MUST PLAY': { en: 'YOU MUST PLAY', fr: 'VOUS DEVEZ JOUER', es: 'DEBES JUGAR', ar: 'يجب أن تلعبها' },
    'From Fantasy Kingdoms to Chaotic Cities': { en: 'From Fantasy Kingdoms to Chaotic Cities', fr: 'Des royaumes fantastiques aux villes chaotiques', es: 'Desde reinos de fantasía hasta ciudades caóticas', ar: 'من الممالك الخيالية إلى المدن الفوضوية' },
    'The Best Game Series On PC': { en: 'The Best Game Series On PC', fr: 'Les meilleures séries de jeux sur PC', es: 'Las mejores series de juegos para PC', ar: 'أفضل سلاسل الألعاب على الكمبيوتر' },
    'Explore the most iconic and critically acclaimed gaming franchises of all time.': { en: 'Explore the most iconic and critically acclaimed gaming franchises of all time.', fr: 'Explorez les franchises de jeux les plus emblématiques et les plus saluées par la critique de tous les temps.', es: 'Explora las franquicias de juegos más icónicas y aclamadas por la crítica de todos los tiempos.', ar: 'استكشف أشهر سلاسل الألعاب وأكثرها استحساناً في كل العصور.' },

    'View Profile': { en: 'View Profile', fr: 'Voir le profil', es: 'Ver Perfil', ar: 'عرض الحساب' },
    'Remove from Stash': { en: 'Remove from Stash', fr: 'Retirer de la Réserve', es: 'Quitar del Alijo', ar: 'إزالة من المفضلة' },
    'Add to Stash': { en: 'Add to Stash', fr: 'Ajouter à la Réserve', es: 'Añadir al Alijo', ar: 'إضافة للمفضلة' },
    'MY STASH': { en: 'MY STASH', fr: 'MA RÉSERVE', es: 'MI ALIJO', ar: 'مفضلتي' },
    'Download Now': { en: 'Download Now', fr: 'Télécharger', es: 'Descargar Ahora', ar: 'تحميل الآن' },
    'Download Part': { en: 'Download Part', fr: 'Télécharger la Partie', es: 'Descargar Parte', ar: 'تحميل الجزء' },
    'DataNodes (Speed & Usability)': { en: 'DataNodes (Speed & Usability)', fr: 'DataNodes (Vitesse et Convivialité)', es: 'DataNodes (Velocidad y Usabilidad)', ar: 'داتا نودز (سرعة وسهولة استخدام)' },
    'Part': { en: 'Part', fr: 'Partie', es: 'Parte', ar: 'جزء' },
    'Details': { en: 'Details', fr: 'Détails', es: 'Detalles', ar: 'التفاصيل' },
    'Item Title *': { en: 'Item Title *', fr: 'Titre de l\'article *', es: 'Título del artículo *', ar: 'عنوان العنصر *' },
    'Already in Area?': { en: 'Already in Area?', fr: 'Déjà dans la zone ?', es: '¿Ya en el Área?', ar: 'موجود مسبقاً؟' },
    'Image URL (Optional)': { en: 'Image URL (Optional)', fr: 'URL de l\'image (Optionnel)', es: 'URL de la imagen (Opcional)', ar: 'رابط الصورة (اختياري)' },
    'Information / Instructions': { en: 'Information / Instructions', fr: 'Informations / Instructions', es: 'Información / Instrucciones', ar: 'معلومات / تعليمات' },
    'Any specific version or details?': { en: 'Any specific version or details?', fr: 'Une version ou des détails spécifiques ?', es: '¿Alguna versión o detalles específicos?', ar: 'أي إصدار أو تفاصيل محددة؟' },
    'Keep the servers alive': { en: 'Keep the servers alive', fr: 'Gardez les serveurs en vie', es: 'Mantenga los servidores vivos', ar: 'أبقِ الخوادم تعمل' },
    'Updated Daily': { en: 'Updated Daily', fr: 'Mis à jour quotidiennement', es: 'Actualizado a diario', ar: 'يتم التحديث يومياً' },
    'No accounts available right now. Check back later!': { en: 'No accounts available right now. Check back later!', fr: 'Aucun compte disponible pour le moment. Revenez plus tard !', es: 'No hay cuentas disponibles en este momento. ¡Vuelva a consultar más tarde!', ar: 'لا توجد حسابات متاحة الآن. تحقق مرة أخرى لاحقاً!' },
    'Exclusive Premium Accounts': { en: 'Exclusive Premium Accounts', fr: 'Comptes Premium Exclusifs', es: 'Cuentas Premium Exclusivas', ar: 'حسابات مدفوعة حصرية' },
    'No Gifts Right Now': { en: 'No Gifts Right Now', fr: 'Aucun Cadeau pour le Moment', es: 'No Hay Regalos en Este Momento', ar: 'لا توجد هدايا الآن' },
    'We continuously restock new premium accounts. Check back later!': { en: 'We continuously restock new premium accounts. Check back later!', fr: 'Nous réapprovisionnons continuellement. Revenez plus tard !', es: 'Reposicionamos continuamente. ¡Vuelva a consultar más tarde!', ar: 'نقوم بتجديد الحسابات المدفوعة باستمرار. تحقق مرة أخرى لاحقاً!' },
    'Show Telemetry View': { en: 'Show Telemetry View', fr: 'Afficher la télémétrie', es: 'Mostrar vista de telemetría', ar: 'عرض حالة الشبكة' },
    'Hide Telemetry View': { en: 'Hide Telemetry View', fr: 'Masquer la télémétrie', es: 'Ocultar vista de telemetría', ar: 'إخفاء حالة الشبكة' },
    'LIVE TELEMETRY': { en: 'LIVE TELEMETRY', fr: 'TÉLÉMÉTRIE EN DIRECT', es: 'TELEMETRÍA EN VIVO', ar: 'حالة الشبكة الحية' },

    'Free': { en: 'Free', fr: 'Gratuit', es: 'Gratis', ar: 'مجاني' },
    'Syncing Data...': { en: 'Syncing Data...', fr: 'Synchronisation des données...', es: 'Sincronizando datos...', ar: 'جاري مزامنة البيانات...' },
    'No Upcoming Games Found': { en: 'No Upcoming Games Found', fr: 'Aucun jeu à venir trouvé', es: 'No se encontraron juegos próximos', ar: 'لم يتم العثور على ألعاب قادمة' },
    'Backend Mismatch': { en: 'Backend Mismatch', fr: 'Incohérence du backend', es: 'Incoincidencia del backend', ar: 'عدم تطابق الخلفية' },
    'Invalid API response.': { en: 'Invalid API response.', fr: 'Réponse API invalide.', es: 'Respuesta de API no válida.', ar: 'استجابة API غير صالحة.' },
    'upcoming tab not found.': { en: 'upcoming tab not found.', fr: 'onglet à venir introuvable.', es: 'pestaña próximamente no encontrada.', ar: 'علامة تبويب القادمة غير موجودة.' },


    'Most Popular Repacks': { en: 'Most Popular Repacks', fr: 'Repacks les plus populaires', es: 'Repacks más populares', ar: 'الأكثر شعبية' },
    'Top community favorites this year': { en: 'Top community favorites this year', fr: 'Favoris de la communauté cette année', es: 'Favoritos de la comunidad este año', ar: 'الألعاب المفضلة للمجتمع هذا العام' },
    'All Top': { en: 'All Top', fr: 'Tous les', es: 'Todos los', ar: 'أفضل' },
    'Games': { en: 'Games', fr: 'Jeux', es: 'Juegos', ar: 'ألعاب' },
    'SEE MORE GAMES': { en: 'SEE MORE GAMES', fr: 'VOIR PLUS DE JEUX', es: 'VER MÁS JUEGOS', ar: 'عرض المزيد من الألعاب' },
    'Positive': { en: 'Positive', fr: 'Positif', es: 'Positivo', ar: 'إيجابي' },
    'Mixed': { en: 'Mixed', fr: 'Mixte', es: 'Mixto', ar: 'مختلط' },
    'Negative': { en: 'Negative', fr: 'Négatif', es: 'Negativo', ar: 'سلبي' },
    'Release Date': { en: 'Release Date', fr: 'Date de sortie', es: 'Fecha de lanzamiento', ar: 'تاريخ الإصدار' },
    'Size': { en: 'Size', fr: 'Taille', es: 'Tamaño', ar: 'الحجم' },
    'Description': { en: 'Description', fr: 'Description', es: 'Descripción', ar: 'الوصف' },
    'Requirements': { en: 'Requirements', fr: 'Configuration', es: 'Requisitos', ar: 'متطلبات التشغيل' },
    'Installation Steps': { en: 'Installation Steps', fr: 'Étapes d\'installation', es: 'Pasos de instalación', ar: 'خطوات التثبيت' },
    'Screenshots': { en: 'Screenshots', fr: 'Captures d\'écran', es: 'Capturas de pantalla', ar: 'صور من اللعبة' },
    'Similar Items': { en: 'Similar Items', fr: 'Articles similaires', es: 'Artículos similares', ar: 'عناصر مشابهة' },
    'Information': { en: 'Information', fr: 'Information', es: 'Información', ar: 'معلومات' },
    'Required': { en: 'Required', fr: 'Requis', es: 'Requerido', ar: 'مطلوب' },
    'Links': { en: 'Links', fr: 'Liens', es: 'Enlaces', ar: 'الروابط' },
    'Mirrors': { en: 'Mirrors', fr: 'Miroirs', es: 'Espejos', ar: 'روابط بديلة' },


    'No Data Found': { en: 'No Data Found', fr: 'Aucune donnée trouvée', es: 'No se encontraron datos', ar: 'لا توجد بيانات' },
    'Try adjusting your search or category.': { en: 'Try adjusting your search or category.', fr: 'Essayez d\'ajuster votre recherche ou catégorie.', es: 'Intente ajustar su búsqueda o categoría.', ar: 'حاول تعديل البحث أو الفئة.' },


    'Request Item': { en: 'Request Item', fr: 'Demander un élément', es: 'Solicitar artículo', ar: 'طلب عنصر' },
    'Request a game or tool not listed here': { en: 'Request a game or tool not listed here', fr: 'Demander un jeu ou un outil non répertorié ici', es: 'Solicitar un juego no listado', ar: 'طلب لعبة أو أداة غير مدرجة هنا' },
    'Global System Filter': { en: 'Global System Filter', fr: 'Filtre Système Global', es: 'Filtro de Sistema Global', ar: 'فحص متطلبات التشغيل' },
    'Enable Filter': { en: 'Enable Filter', fr: 'Activer le filtre', es: 'Habilitar filtro', ar: 'تفعيل الفلتر' },
    'SEARCH': { en: 'SEARCH', fr: 'RECHERCHE', es: 'BUSCAR', ar: 'البحث عن' },
    'SAVEGAMES': { en: 'SAVEGAMES', fr: 'SAUVEGARDES', es: 'PARTIDAS GUARDADAS', ar: 'ملفات الحفظ' },
    'PAGE': { en: 'PAGE', fr: 'PAGE', es: 'PÁGINA', ar: 'الصفحة' },
    'OF': { en: 'OF', fr: 'SUR', es: 'DE', ar: 'من' },


    'Copy Password': { en: 'Copy Password', fr: 'Copier le mot de passe', es: 'Copiar Contraseña', ar: 'نسخ كلمة المرور' },
    'Copy Download Link': { en: 'Copy Download Link', fr: 'Copier le lien', es: 'Copiar enlace', ar: 'نسخ رابط التحميل' },


    'Transmitting...': { en: 'Transmitting...', fr: 'Transmission...', es: 'Transmitiendo...', ar: 'جاري الإرسال...' },
    'Send Request': { en: 'Send Request', fr: 'Envoyer la demande', es: 'Enviar solicitud', ar: 'إرسال الطلب' },


    'Unknown date': { en: 'Unknown date', fr: 'Date inconnue', es: 'Fecha desconocida', ar: 'تاريخ غير معروف' },
    'Just now': { en: 'Just now', fr: 'À l\'instant', es: 'Justo ahora', ar: 'الآن' },
    's ago': { en: 's ago', fr: 's', es: 's', ar: 'ث' },
    'm ago': { en: 'm ago', fr: 'm', es: 'm', ar: 'د' },
    'h ago': { en: 'h ago', fr: 'h', es: 'h', ar: 'س' },
    'd ago': { en: 'd ago', fr: 'd', es: 'd', ar: 'ي' },


    'GENRES': { en: 'GENRES', fr: 'GENRES', es: 'GÉNEROS', ar: 'الأنواع' },
    'Featured Genres': { en: 'Featured Genres', fr: 'Genres en vedette', es: 'Géneros destacados', ar: 'الأنواع المميزة' },
    'Curated categories from your navigation menu.': { en: 'Curated categories from your navigation menu.', fr: 'Catégories sélectionnées à partir de votre menu de navigation.', es: 'Categorías seleccionadas de su menú de navegación.', ar: 'الفئات المنسقة من قائمة التنقل الخاصة بك.' },


    'Script Error': { en: 'Script Error', fr: 'Erreur de script', es: 'Error de script', ar: 'خطأ في السكربت' },
    'Show All': { en: 'Show All', fr: 'Tout afficher', es: 'Mostrar todo', ar: 'عرض الكل' },
    'Show Less': { en: 'Show Less', fr: 'Afficher moins', es: 'Mostrar menos', ar: 'عرض أقل' },


    'Secret': { en: 'Secret', fr: 'Secret', es: 'Secreto', ar: 'سري' },
    'Area': { en: 'Area', fr: 'Zone', es: 'Área', ar: 'المنطقة' },
    'Everything you need, from games to tools, collected from trusted sources and presented in a clean experience ad-free.': { en: 'Everything you need, from games to tools, collected from trusted sources and presented in a clean experience ad-free.', fr: 'Tout ce dont vous avez besoin, des jeux aux outils, collecté à partir de sources fiables et présenté dans une expérience propre et sans publicité.', es: 'Todo lo que necesitas, desde juegos hasta herramientas, recopilado de fuentes confiables y presentado en una experiencia limpia y sin anuncios.', ar: 'كل ما تحتاجه، من الألعاب إلى الأدوات، تم جمعه من مصادر موثوقة وتم تقديمه في تجربة نظيفة وخالية من الإعلانات.' },
    'Free Accounts': { en: 'Free Accounts', fr: 'Comptes Gratuits', es: 'Cuentas Gratis', ar: 'حسابات مجانية' },
    'Master Gift': { en: 'Master Gift', fr: 'Cadeau Master', es: 'Regalo Maestro', ar: 'هدايا مميزة' },
    'Join Community': { en: 'Join Community', fr: 'Rejoindre la Communauté', es: 'Unirse a la Comunidad', ar: 'انضم لمجتمعنا' },
    'Channel': { en: 'Channel', fr: 'Canal', es: 'Canal', ar: 'القناة' },
    'Support Us': { en: 'Support Us', fr: 'Soutenez-nous', es: 'Apóyanos', ar: 'ادعمنا' },
    'RELEASES': { en: 'RELEASES', fr: 'SORTIES', es: 'LANZAMIENTOS', ar: 'الإصدارات' },
    'No upcoming': { en: 'No upcoming', fr: 'Aucun(e) à venir', es: 'No hay próximos', ar: 'لا يوجد قادمة' },
    'listed.': { en: 'listed.', fr: 'listé.', es: 'listado.', ar: 'مدرجة.' },
    'game': { en: 'game', fr: 'jeu', es: 'juego', ar: 'لعبة' },
    'hypervisor': { en: 'hypervisor', fr: 'hyperviseur', es: 'hipervisor', ar: 'هايبرفايزر' },
    'steamtools': { en: 'steamtools', fr: 'outils steam', es: 'herramientas steam', ar: 'أدوات ستيم' },
    'tools': { en: 'tools', fr: 'outils', es: 'herramientas', ar: 'أدوات' },
    'savegames': { en: 'savegames', fr: 'sauvegardes', es: 'partidas guardadas', ar: 'ملفات الحفظ' },

    'Upcoming Games': { en: 'Upcoming Games', fr: 'Jeux à venir', es: 'Juegos Próximos', ar: 'الألعاب القادمة' },
    'Recent': { en: 'Recent', fr: 'Récent', es: 'Reciente', ar: 'الأحدث' },
    'Products': { en: 'Products', fr: 'Produits', es: 'Productos', ar: 'المنتجات' },
    'Curating Recent Products...': { en: 'Curating Recent Products...', fr: 'Préparation des produits récents...', es: 'Curando productos recientes...', ar: 'جاري تنسيق المنتجات الأحدث...' },

    'Back': { en: 'Back', fr: 'Retour', es: 'Volver', ar: 'رجوع' },
    'Personal Finance Dashboard': { en: 'Personal Finance Dashboard', fr: 'Tableau de bord des finances personnelles', es: 'Panel de finanzas personales', ar: 'لوحة تحكم التمويل الشخصي' },
    'Total Balance': { en: 'Total Balance', fr: 'Solde total', es: 'Saldo Total', ar: 'الرصيد الإجمالي' },
    'Monthly Income': { en: 'Monthly Income', fr: 'Revenu mensuel', es: 'Ingreso mensual', ar: 'الدخل الشهري' },
    'Monthly Expenses': { en: 'Monthly Expenses', fr: 'Dépenses mensuelles', es: 'Gastos mensuales', ar: 'المصروفات الشهرية' },
    'Savings Goal': { en: 'Savings Goal', fr: 'Objectif d\'épargne', es: 'Meta de ahorro', ar: 'هدف الادخار' },
    'Recent Transactions': { en: 'Recent Transactions', fr: 'Transactions récentes', es: 'Transacciones recientes', ar: 'المعاملات الأخيرة' },
    'Date': { en: 'Date', fr: 'Date', es: 'Fecha', ar: 'التاريخ' },
    'Category': { en: 'Category', fr: 'Catégorie', es: 'Categoría', ar: 'الفئة' },
    'Amount': { en: 'Amount', fr: 'Montant', es: 'Monto', ar: 'المبلغ' },
    'NEXA 1337 Development Roadmap': { en: 'NEXA 1337 Development Roadmap', fr: 'Feuille de route de développement NEXA 1337', es: 'Hoja de ruta de desarrollo NEXA 1337', ar: 'خارطة طريق تطوير NEXA 1337' },
    'Explore the tools, frameworks, and skills driving our ecosystem.': { en: 'Explore the tools, frameworks, and skills driving our ecosystem.', fr: 'Explorez les outils, frameworks et compétences qui animent notre écosystème.', es: 'Explore las herramientas, marcos y habilidades que impulsan nuestro ecosistema.', ar: 'استكشف الأدوات وأطر العمل والمهارات التي تدفع منظومتنا البيئية.' },
    'Select a Category': { en: 'Select a Category', fr: 'Sélectionnez une catégorie', es: 'Seleccione una categoría', ar: 'اختر فئة' },

    'Secret Area': { en: 'Secret Area', fr: 'Zone Secrète', es: 'Área Secreta', ar: 'المنطقة السرية' },
    'Personal Space': { en: 'Personal Space', fr: 'Espace Personnel', es: 'Espacio Personal', ar: 'المساحة الشخصية' },
    'Roadmap': { en: 'Roadmap', fr: 'Feuille de route', es: 'Hoja de ruta', ar: 'خارطة الطريق' },

    'Welcome to the Secret Area': { en: 'Welcome to the Secret Area', fr: 'Bienvenue dans la zone secrète', es: 'Bienvenido al Área Secreta', ar: 'مرحبًا بك في المنطقة السرية' },
    'Here you can find all the hidden gems and exclusive content.': { en: 'Here you can find all the hidden gems and exclusive content.', fr: 'Ici, vous pouvez trouver tous les joyaux cachés et contenus exclusifs.', es: 'Aquí puedes encontrar todas las joyas ocultas y contenido exclusivo.', ar: 'هنا يمكنك العثور على جميع الجواهر الخفية والمحتوى الحصري.' },
    'Enter Access Code': { en: 'Enter Access Code', fr: 'Entrez le code d\'accès', es: 'Ingrese el código de acceso', ar: 'أدخل رمز الوصول' },
    'Unlock': { en: 'Unlock', fr: 'Déverrouiller', es: 'Desbloquear', ar: 'فتح' },
    'All Profiles': { en: 'All Profiles', fr: 'Tous les profils', es: 'Todos los perfiles', ar: 'جميع الملفات الشخصية' },
    'Explore Companies': { en: 'Explore Companies', fr: 'Explorer les entreprises', es: 'Explorar empresas', ar: 'اكتشف الشركات' },
    'Explore Game Studios': { en: 'Explore Game Studios', fr: 'Explorer les studios de jeux', es: 'Explorar estudios de juegos', ar: 'اكتشف استوديوهات الألعاب' },
    'Discover amazing teams behind your favorite experiences.': { en: 'Discover amazing teams behind your favorite experiences.', fr: 'Découvrez des équipes incroyables derrière vos expériences préférées.', es: 'Descubre equipos increíbles detrás de tus experiencias favoritas.', ar: 'اكتشف الفرق الرائعة وراء تجاربك المفضلة.' },

    // English (Default), fransh, spain, arabic
    'Back to Dashboard': { en: 'Back to Dashboard', fr: 'Retour au tableau de bord', es: 'Volver al panel', ar: 'العودة إلى لوحة القيادة' },
    'Total Games': { en: 'Total Games', fr: 'Jeux totaux', es: 'Juegos totales', ar: 'إجمالي الألعاب' },
    'Scroll For Updates': { en: 'Scroll For Updates', fr: 'Faites défiler pour les mises à jour', es: 'Desplácese para ver actualizaciones', ar: 'قم بالتمرير للحصول على التحديثات' },
    'Dive into the best': { en: 'Dive into the best', fr: 'Plongez dans les meilleurs', es: 'Sumérgete en los mejores', ar: 'اغص في أفضل' },
    'games available. Explore, download, and enjoy hand-picked titles!': { en: 'games available. Explore, download, and enjoy hand-picked titles!', fr: 'jeux disponibles. Explorez, téléchargez et profitez de titres triés sur le volet !', es: 'juegos disponibles. ¡Explora, descarga y disfruta de títulos seleccionados a mano!', ar: 'الألعاب المتاحة. استكشف وحمل واستمتع بالعناوين المختارة بعناية!' },
    'GAMES': { en: 'GAMES', fr: 'JEUX', es: 'JUEGOS', ar: 'ألعاب' },
    'SecretArea': { en: 'SecretArea', fr: 'SecretArea', es: 'SecretArea', ar: 'المنطقة السرية' },
    'Internet For Everyone': { en: 'Internet For Everyone', fr: 'Internet pour tous', es: 'Internet para todos', ar: 'إنترنت للجميع' },
    'Made in Morocco': { en: 'Made in Morocco 🇲🇦', fr: 'Fabriqué au Maroc 🇲🇦', es: 'Hecho en Marruecos 🇲🇦', ar: 'صنع في المغرب 🇲🇦' },
    'Solidarity with Palestine': { en: 'Solidarity with Palestine 🇵🇸', fr: 'Solidarité avec la Palestine 🇵🇸', es: 'Solidaridad con Palestina 🇵🇸', ar: 'تضامن مع فلسطين 🇵🇸' },
    'Discover a random game': { en: 'Discover a random game', fr: 'Découvrir un jeu au hasard', es: 'Descubrir un juego aleatorio', ar: 'اكتشف لعبة عشوائية' },
    'Featured': { en: 'Featured', fr: 'En vedette', es: 'Destacado', ar: 'مميز' },

    'ALL': {"en":"ALL","fr":"TOUT","es":"TODO","ar":"الكل"},
    'GAME': {"en":"GAME","fr":"JEU","es":"JUEGO","ar":"لعبة"},
    'HYPERVISOR': {"en":"HYPERVISOR","fr":"HYPERVISEUR","es":"HIPERVISOR","ar":"هايبرفايزر"},
    'STEAMTOOLS': {"en":"STEAMTOOLS","fr":"OUTILS STEAM","es":"HERRAMIENTAS STEAM","ar":"أدوات ستيم"},
    'ARCHITECT': {"en":"ARCHITECT","fr":"ARCHITECTE","es":"ARQUITECTO","ar":"مهندس"},
    'EXTRA': {"en":"EXTRA","fr":"EXTRA","es":"EXTRA","ar":"إضافي"},
    'UPCOMING': {"en":"UPCOMING","fr":"À VENIR","es":"PRÓXIMO","ar":"قادم"},
    'Access the Area': {"en":"Access the Area","fr":"Accéder à la Zone","es":"Acceder al Área","ar":"الدخول إلى المنطقة"},
    'Total Items': {"en":"Total Items","fr":"Articles Totaux","es":"Artículos Totales","ar":"إجمالي العناصر"},
    'Filter by': {"en":"Filter by","fr":"Filtrer par","es":"Filtrar por","ar":"تصفية حسب"},
    'Search': {"en":"Search","fr":"Recherche","es":"Buscar","ar":"بحث"},
    'Search...': {"en":"Search...","fr":"Recherche...","es":"Buscar...","ar":"بحث..."},
    'Platform': {"en":"Platform","fr":"Plateforme","es":"Plataforma","ar":"المنصة"},
    'Added on': {"en":"Added on","fr":"Ajouté le","es":"Añadido el","ar":"تمت الإضافة في"},
    'Version': {"en":"Version","fr":"Version","es":"Versión","ar":"الإصدار"},
    'Download': {"en":"Download","fr":"Télécharger","es":"Descargar","ar":"تحميل"},
    'Play': {"en":"Play","fr":"Jouer","es":"Jugar","ar":"العب"},
    'Close': {"en":"Close","fr":"Fermer","es":"Cerrar","ar":"إغلاق"},
    'Copied': {"en":"Copied","fr":"Copié","es":"Copiado","ar":"تم النسخ"},
    'Copy': {"en":"Copy","fr":"Copier","es":"Copiar","ar":"نسخ"},
    'Latest Intel': {"en":"Latest Intel","fr":"Dernières Infos","es":"Última Información","ar":"أحدث المعلومات"},
    'Live Changelog Feed': {"en":"Live Changelog Feed","fr":"Flux de Modifications en Direct","es":"Feed de Cambios en Vivo","ar":"تغذية سجل التغييرات المباشر"},
    'No items found.': {"en":"No items found.","fr":"Aucun article trouvé.","es":"No se encontraron artículos.","ar":"لم يتم العثور على عناصر."},

    'Disclaimer': {"en":"Disclaimer","fr":"Avertissement","es":"Descargo de responsabilidad","ar":"إخلاء المسؤولية"},
    'Products & More': {"en":"Products & More","fr":"Produits et plus","es":"Productos y más","ar":"منتجات والمزيد"},
    'Home': {"en":"Home","fr":"Accueil","es":"Inicio","ar":"الرئيسية"},

    'Accept & Continue': {"en":"Accept & Continue","fr":"Accepter et Continuer","es":"Aceptar y Continuar","ar":"قبول ومتابعة"},
    'Decline': {"en":"Decline","fr":"Refuser","es":"Rechazar","ar":"رفض"},
    'Educational Purpose Only': {"en":"Educational Purpose Only","fr":"À des fins éducatives uniquement","es":"Solo con fines educativos","ar":"للأغراض التعليمية فقط"},
    'Security Research': {"en":"Security Research","fr":"Recherche en Sécurité","es":"Investigación de Seguridad","ar":"أبحاث الأمن"},
    'No Warranty': {"en":"No Warranty","fr":"Aucune Garantie","es":"Sin Garantía","ar":"لا توجد ضمانات"},
    'User Responsibility': {"en":"User Responsibility","fr":"Responsabilité de l'utilisateur","es":"Responsabilidad del Usuario","ar":"مسؤولية المستخدم"},

    'Password': {"en":"Password","fr":"Mot de passe","es":"Contraseña","ar":"كلمة المرور"},
    'Username': {"en":"Username","fr":"Nom d'utilisateur","es":"Nombre de usuario","ar":"اسم المستخدم"},
    'Available': {"en":"Available","fr":"Disponible","es":"Disponible","ar":"متاح"},
    'Loading': {"en":"Loading","fr":"Chargement","es":"Cargando","ar":"جاري التحميل"},
    'Loading...': {"en":"Loading...","fr":"Chargement...","es":"Cargando...","ar":"جاري التحميل..."},
    'PlayStation 5': {"en":"PlayStation 5","fr":"PlayStation 5","es":"PlayStation 5","ar":"بلاي ستيشن 5"},
    'Xbox S/X': {"en":"Xbox S/X","fr":"Xbox S/X","es":"Xbox S/X","ar":"إكس بوكس S/X"},
    'Steam': {"en":"Steam","fr":"Steam","es":"Steam","ar":"ستيم"},

    'SteamTools': {"en":"SteamTools","fr":"Outils Steam","es":"Herramientas Steam","ar":"أدوات ستيم"},
    'TOOLS': {"en":"TOOLS","fr":"OUTILS","es":"HERRAMIENTAS","ar":"أدوات"},
    'SAVEGAME': { en: 'SAVEGAME', fr: 'SAUVEGARDE', es: 'PARTIDA GUARDADA', ar: 'ملفات الحفظ' },
    'Top Studios': {"en":"Top Studios","fr":"Meilleurs Studios","es":"Mejores Estudios","ar":"أفضل الاستوديوهات"},
    'Top Tech Companies': {"en":"Top Tech Companies","fr":"Meilleures Entreprises Tech","es":"Mejores Empresas Tech","ar":"أفضل شركات التقنية"},
};

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
    dir: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>(() => {
        const stored = localStorage.getItem('app_language') as Language;
        return stored || 'en';
    });

    useEffect(() => {
        localStorage.setItem('app_language', language);
        const dir = language === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.dir = dir;
        document.documentElement.lang = language;
        
        if (language === 'ar') {
            document.documentElement.classList.add('font-arabic');
        } else {
            document.documentElement.classList.remove('font-arabic');
        }

    }, [language]);

    const t = (key: string): string => {
        if (translations[key] && translations[key][language]) {
            return translations[key][language];
        }
        return key; // Fallback to key
    };

    const dir = language === 'ar' ? 'rtl' : 'ltr';

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
