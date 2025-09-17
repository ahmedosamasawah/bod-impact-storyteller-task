export const COMMON = {
  ACTIONS: {
    create: "إنشاء",
    edit: "تعديل",
    delete: "حذف",
    save: "حفظ",
    cancel: "إلغاء",
    confirm: "تأكيد",
    undo: "تراجع",
    export: "تصدير",
    search: "بحث",
    filter: "تصفية",
    view: "عرض",
    close: "إغلاق",
    back: "رجوع",
    next: "التالي",
    previous: "السابق",
    submit: "إرسال",
    update: "تحديث",
    add: "إضافة",
    remove: "إزالة",
  },

  STATUS: {
    loading: "جارٍ التحميل...",
    saving: "جارٍ الحفظ...",
    deleting: "جارٍ الحذف...",
    updating: "جارٍ التحديث...",
    creating: "جارٍ الإنشاء...",
    restoring: "جارٍ الاستعادة...",
    exporting: "جارٍ التصدير...",
    success: "تم بنجاح",
    error: "حدث خطأ",
    warning: "تحذير",
    info: "معلومات",
  },

  MESSAGES: {
    noData: "لا توجد بيانات متاحة",
    connectionError: "خطأ في الاتصال",
    tryAgain: "يرجى المحاولة مرة أخرى",
    checkConnection: "يرجى فحص اتصالك والمحاولة مرة أخرى",
    required: "مطلوب",
    optional: "اختياري",
    selectOption: "اختر خيار",
    enterValue: "أدخل القيمة",
  },
} as const;

export const PROJECTS = {
  ENTITY: {
    singular: "مشروع",
    plural: "مشاريع",
    consulting: "مشاريع استشارية",
    active: "المشاريع النشطة",
    completed: "مشاريع مكتملة",
    new: "مشروع جديد",
  },

  ACTIONS: {
    create: "إنشاء مشروع",
    createNew: "مشروع جديد",
    edit: "تعديل المشروع",
    delete: "حذف المشروع",
    view: "عرض المشروع",
    export: "تصدير المشاريع",
    manage: "إدارة المشاريع",
  },

  TOASTS: {
    created: "تم إنشاء المشروع بنجاح",
    updated: "تم تحديث المشروع بنجاح",
    deleted: "تم حذف المشروع",
    restored: "تم استعادة المشروع",
    exported: "تم تصدير المشاريع بنجاح",
    createFailed: "فشل إنشاء المشروع",
    updateFailed: "فشل تحديث المشروع",
    deleteFailed: "فشل حذف المشروع",
    restoreFailed: "فشل استعادة المشروع",
    exportFailed: "فشل تصدير المشاريع",
    noDataToExport: "لا توجد مشاريع متاحة للتصدير",
  },

  FORM: {
    title: "عنوان المشروع",
    description: "وصف المشروع",
    sector: "القطاع",
    status: "حالة المشروع",
    region: "المنطقة",
    budget: "الميزانية",
    duration: "مدة المشروع",
    client: "اسم العميل",
    startDate: "تاريخ البداية",
    endDate: "تاريخ النهاية",
    consultant: "الاستشاري المسؤول",
    impactScore: "نقاط الأثر المتوقع",
  },

  CSV_HEADERS: {
    id: "رقم المشروع",
    title: "العنوان",
    description: "الوصف",
    sector: "القطاع",
    status: "الحالة",
    budget: "الميزانية",
    client: "العميل",
    startDate: "تاريخ البداية",
    endDate: "تاريخ الانتهاء",
    consultant: "المستشار",
    region: "المنطقة",
    duration: "المدة",
    impactScore: "نقاط الأثر",
  },

  DESCRIPTIONS: {
    overview:
      "إدارة ومراقبة الارتباطات الاستشارية الجارية ومخرجات المشاريع في ولادة حلم",
    dashboard: "مشاريع ولادة حلم الاستشارية",
    management: "إدارة ومتابعة مشاريع الاستشارة والبحث المتخصص",
    impact: "تقييم شامل لجودة وتأثير مشاريع ولادة حلم الاستشارية",
  },
} as const;

export const TEAM_MEMBERS = {
  ENTITY: {
    singular: "عضو الفريق",
    plural: "أعضاء الفريق",
    team: "الفريق",
    consultant: "استشاري",
    consultants: "المستشارون",
    new: "عضو جديد",
  },

  ACTIONS: {
    create: "إضافة عضو",
    createNew: "إضافة عضو",
    edit: "تعديل عضو الفريق",
    delete: "حذف عضو الفريق",
    view: "عرض ملف العضو",
    export: "تصدير بيانات الفريق",
    manage: "إدارة الفريق",
  },

  TOASTS: {
    created: "تم إضافة عضو الفريق بنجاح",
    updated: "تم تحديث بيانات عضو الفريق",
    deleted: "تم حذف عضو الفريق",
    restored: "تم استعادة عضو الفريق",
    exported: "تم تصدير بيانات الفريق بنجاح",
    createFailed: "فشل إضافة عضو الفريق",
    updateFailed: "فشل تحديث بيانات عضو الفريق",
    deleteFailed: "فشل حذف عضو الفريق",
    restoreFailed: "فشل استعادة عضو الفريق",
    exportFailed: "فشل تصدير بيانات الفريق",
    noDataToExport: "لا توجد بيانات فريق متاحة للتصدير",
  },

  FORM: {
    name: "الاسم الكامل",
    username: "اسم المستخدم",
    email: "البريد الإلكتروني",
    phone: "رقم الجوال",
    position: "المنصب",
    experience: "سنوات الخبرة",
    expertise: "مجالات الخبرة",
    certifications: "الشهادات المهنية",
    location: "موقع العمل",
    joinDate: "تاريخ الانضمام",
    website: "الموقع الإلكتروني / LinkedIn",
    address: "العنوان",
    city: "المدينة",
    zipcode: "الرمز البريدي",
    company: "الشركة",
  },

  CSV_HEADERS: {
    id: "الرقم التعريفي",
    name: "الاسم",
    username: "اسم المستخدم",
    email: "البريد الإلكتروني",
    phone: "الجوال",
    company: "الشركة",
    city: "المدينة",
    position: "المنصب",
    experience: "سنوات الخبرة",
    joinDate: "تاريخ الانضمام",
  },

  DESCRIPTIONS: {
    overview:
      "إدارة أعضاء فريق ولادة حلم الاستشاري وملفاتهم الشخصية والهيكل التنظيمي",
    management: "إدارة ومتابعة أعضاء الفريق الاستشاري",
  },
} as const;

export const NAVIGATION = {
  MAIN: {
    dashboard: "لوحة المتابعة",
    metrics: "مقاييس الأثر",
    projects: "المشاريع",
    teamMembers: "الفريق",
    settings: "الإعدادات",
  },

  DESCRIPTIONS: {
    dashboard: "نظرة عامة على لوحة التحكم",
    metrics: "متابعة مؤشرات الأثر الرئيسية",
    projects: "إدارة المشاريع النشطة",
    teamMembers: "إدارة أعضاء الفريق",
    settings: "تفضيلات النظام",
  },
} as const;

export const METRICS = {
  TITLES: {
    overview: "لوحة قياس الأثر - ولادة حلم",
    analytics: "مقاييس أداء ولادة حلم",
    impact: "النقاط الإجمالية للأثر الاستشاري",
    clientsSatisfaction: "رضا العملاء",
    consultingHours: "ساعات استشارية",
    projectsCompleted: "مشاريع استشارية مكتملة",
    clientsServed: "عملاء تم خدمتهم",
  },

  DESCRIPTIONS: {
    overview:
      "مرحباً بك في منصة ولادة حلم الاستشارية المتخصصة. تتبع وقس واعرض تأثير مشاريعنا الاستشارية والبحثية عبر المملكة العربية السعودية",
    analytics:
      "تحليلات تفصيلية ومؤشرات الأداء الرئيسية لمشاريعنا الاستشارية والبحثية عبر المملكة العربية السعودية",
    impact: "تقييم شامل لجودة وتأثير مشاريع ولادة حلم الاستشارية",
    projectsCompleted: "مشاريع استشارية وبحثية مُنجزة بنجاح عالي",
    clientsServed: "عملاء متنوعون عبر قطاعات مختلفة في المملكة",
    consultingHours: "إجمالي الساعات الاستشارية المقدمة لعملائنا",
  },
} as const;

export const ERRORS = {
  CONNECTION: {
    title: "خطأ في الاتصال",
    general: "غير قادر على الاتصال بالخادم. يرجى فحص اتصالك والمحاولة مرة أخرى",
    projects:
      "غير قادر على جلب بيانات المشاريع. يرجى فحص اتصالك والمحاولة مرة أخرى",
    teamMembers:
      "غير قادر على جلب بيانات أعضاء الفريق. يرجى فحص اتصالك والمحاولة مرة أخرى",
    retry: "إعادة المحاولة",
  },

  VALIDATION: {
    required: "هذا الحقل مطلوب",
    email: "يرجى إدخال بريد إلكتروني صالح",
    phone: "يرجى إدخال رقم جوال صالح",
    url: "يرجى إدخال رابط صالح",
    minLength: (min: number) => `يجب أن يكون ${min} أحرف على الأقل`,
    maxLength: (max: number) => `يجب ألا يزيد عن ${max} حرف`,
    completeRequired: "يرجى إكمال جميع الحقول المطلوبة",
    errorsInTab: (tabName: string) =>
      `توجد أخطاء في تبويب "${tabName}". يرجى مراجعة وإصلاح الأخطاء أولاً`,
  },
} as const;

export const CONFIRMATIONS = {
  DELETE: {
    projectTitle: "حذف المشروع",
    projectMessage: (name: string) =>
      `هل أنت متأكد من حذف المشروع "${name}"؟ لا يمكن التراجع عن هذا الإجراء`,
    teamMemberTitle: "حذف عضو الفريق",
    teamMemberMessage: (name: string) =>
      `هل أنت متأكد من حذف "${name}" من الفريق؟ لا يمكن التراجع عن هذا الإجراء`,
    confirmButton: "نعم، احذف",
    cancelButton: "إلغاء",
  },

  UNSAVED: {
    title: "تغييرات غير محفوظة",
    message: "لديك تغييرات غير محفوظة. هل تريد المتابعة بدون حفظ؟",
    discardButton: "تجاهل التغييرات",
    keepEditingButton: "متابعة التعديل",
  },
} as const;

export const UNDO = {
  ACTIONS: {
    projectRestore: "تراجع عن حذف المشروع",
    teamMemberRestore: "تراجع عن حذف عضو الفريق",
    undoButton: "تراجع",
    undoingButton: "جارٍ الاستعادة...",
  },

  DESCRIPTIONS: {
    project: (title: string) =>
      `"${title}" تم حذفه من قاعدة البيانات. يمكنك التراجع خلال 5 ثوانِ`,
    teamMember: (name: string) => `"${name}" تم حذفه من فريق ولادة حلم`,
  },
} as const;

export const SETTINGS = {
  PAGE: {
    title: "الإعدادات والمعلومات",
    subtitle: "معلومات التطبيق والنظام والبيئة التقنية",
    aboutTab: "حول التطبيق",
    systemTab: "معلومات النظام",
    apiTab: "إعدادات API",
  },

  SECTIONS: {
    appInfo: "معلومات التطبيق",
    apiConfig: "تكوين API",
    environment: "بيئة النظام",
    performance: "الأداء والذاكرة",
    browser: "معلومات المتصفح",
  },

  FIELDS: {
    version: "الإصدار",
    commitHash: "معرف البناء",
    buildDate: "تاريخ البناء",
    environment: "البيئة",

    apiMode: "وضع API",
    baseUrl: "رابط API الأساسي",
    connectionStatus: "حالة الاتصال",
    lastSync: "آخر مزامنة",

    browser: "المتصفح",
    platform: "النظام",
    viewport: "منطقة العرض",
    screenResolution: "دقة الشاشة",
    timezone: "المنطقة الزمنية",
    userAgent: "وكيل المستخدم",

    loadTime: "وقت التحميل",
    memoryUsage: "استخدام الذاكرة",
  },

  STATUS: {
    connected: "متصل",
    disconnected: "غير متصل",
    online: "متاح",
    offline: "غير متاح",
    unknown: "غير معروف",
    active: "نشط",
    inactive: "غير نشط",
  },

  ACTIONS: {
    copy: "نسخ",
    copyAll: "نسخ جميع المعلومات",
    refresh: "تحديث",
    close: "إغلاق",
    viewDetails: "عرض التفاصيل",
    hideDetails: "إخفاء التفاصيل",
  },

  COPY_MESSAGES: {
    copied: "تم النسخ بنجاح",
    copyFailed: "فشل في النسخ",
    copying: "جارٍ النسخ...",
    copyToClipboard: "نسخ إلى الحافظة",
  },

  DESCRIPTIONS: {
    appInfo: "معلومات أساسية حول إصدار التطبيق والبناء الحالي",
    apiConfig: "تفاصيل اتصال API والخدمات الخارجية المستخدمة",
    environment: "معلومات النظام والمتصفح وبيئة التشغيل",
    performance: "إحصائيات الأداء واستخدام الذاكرة",
    technicalSummary: "ملخص تقني شامل لجميع معلومات النظام",
  },

  API_MODES: {
    MockAPI: "MockAPI",
    Unknown: "غير محدد",
  },

  TECHNICAL: {
    development: "Development",
    production: "Production",
    rtl: "RTL",
    ltr: "LTR",
    arabic: "Arabic",
    english: "English",
  },
} as const;

export const COPY = {
  COMMON,
  PROJECTS,
  TEAM_MEMBERS,
  NAVIGATION,
  METRICS,
  ERRORS,
  CONFIRMATIONS,
  UNDO,
  SETTINGS,
} as const;

export default COPY;
