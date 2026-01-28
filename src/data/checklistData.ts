import { ChecklistItem, DuaItem } from '@/types/checklist';

export const checklistItems: ChecklistItem[] = [
  {
    id: 'wudu',
    title: 'Perform Wudu',
    titleArabic: 'الوضوء',
    description: 'Perform ablution before going to bed',
    hadithSource: 'Bukhari and Muslim',
    completed: false,
    category: 'preparation',
  },
  {
    id: 'dust-bed',
    title: 'Dust the Bed',
    titleArabic: 'نفض الفراش',
    description: 'Dust your bed three times with the edge of your garment',
    hadithSource: 'Bukhari and Muslim',
    completed: false,
    category: 'preparation',
  },
  {
    id: 'right-side',
    title: 'Sleep on Right Side',
    titleArabic: 'النوم على الجنب الأيمن',
    description: 'Lie down on your right side as recommended by the Prophet ﷺ',
    hadithSource: 'Bukhari and Muslim',
    completed: false,
    category: 'position',
  },
  {
    id: 'ayat-kursi',
    title: 'Recite Ayat al-Kursi',
    titleArabic: 'آية الكرسي',
    description: 'Recite Ayat al-Kursi for protection throughout the night',
    hadithSource: 'Bukhari',
    completed: false,
    category: 'recitation',
  },
  {
    id: 'last-two-baqarah',
    title: 'Last Two Verses of Al-Baqarah',
    titleArabic: 'آخر آيتين من سورة البقرة',
    description: 'Recite the last two verses of Surah Al-Baqarah',
    hadithSource: 'Bukhari and Muslim',
    completed: false,
    category: 'recitation',
  },
  {
    id: 'three-quls',
    title: 'Recite Three Quls',
    titleArabic: 'المعوذات',
    description: 'Recite Al-Ikhlas, Al-Falaq, and An-Nas, blow into hands and wipe over body',
    hadithSource: 'Bukhari',
    completed: false,
    category: 'recitation',
  },
  {
    id: 'bedtime-dua',
    title: 'Bedtime Dua',
    titleArabic: 'دعاء النوم',
    description: 'Recite "Bismika Allahumma amutu wa ahya"',
    hadithSource: 'Bukhari',
    completed: false,
    category: 'dhikr',
  },
];

export const duas: DuaItem[] = [
  {
    id: 'bismika',
    title: 'Main Bedtime Dua',
    arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
    transliteration: 'Bismika Allahumma amutu wa ahya',
    translation: 'In Your name, O Allah, I die and I live',
    source: 'Bukhari',
  },
  {
    id: 'rabbi-wada',
    title: 'Before Sleeping',
    arabic: 'بِاسْمِكَ رَبِّي وَضَعْتُ جَنْبِي، وَبِكَ أَرْفَعُهُ، فَإِنْ أَمْسَكْتَ نَفْسِي فَارْحَمْهَا، وَإِنْ أَرْسَلْتَهَا فَاحْفَظْهَا، بِمَا تَحْفَظُ بِهِ عِبَادَكَ الصَّالِحِينَ',
    transliteration: "Bismika Rabbi wada'tu janbi, wa bika arfa'uhu, in amsakta nafsi farhamha, wa in arsaltaha fahfazha bima tahfazu bihi 'ibadaka as-salihin",
    translation: 'In Your name, my Lord, I lay down my side and in Your name I raise it. If You take my soul, have mercy on it, and if You send it back, protect it as You protect Your righteous slaves.',
    source: 'Bukhari and Muslim',
  },
  {
    id: 'allahumma-aslamtu',
    title: 'Submitting to Allah',
    arabic: 'اللَّهُمَّ أَسْلَمْتُ نَفْسِي إِلَيْكَ، وَفَوَّضْتُ أَمْرِي إِلَيْكَ، وَوَجَّهْتُ وَجْهِي إِلَيْكَ، وَأَلْجَأْتُ ظَهْرِي إِلَيْكَ',
    transliteration: "Allahumma aslamtu nafsi ilayk, wa fawwadtu amri ilayk, wa wajjahtu wajhi ilayk, wa alja'tu zahri ilayk",
    translation: 'O Allah, I submit myself to You, and I entrust my affairs to You, and I turn my face to You, and I rely completely on You.',
    source: 'Bukhari and Muslim',
  },
];

export const ayatKursi = {
  arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ',
  transliteration: "Allahu la ilaha illa Huwa, Al-Hayyul-Qayyum. La ta'khuzuhu sinatun wa la nawm. Lahu ma fis-samawati wa ma fil-ard. Man zal-ladhi yashfa'u 'indahu illa bi-idhnih. Ya'lamu ma bayna aydihim wa ma khalfahum. Wa la yuhituna bi-shay'im-min 'ilmihi illa bima sha'. Wasi'a Kursiyyuhus-samawati wal-ard. Wa la ya'uduhu hifzuhuma. Wa Huwal-'Aliyyul-'Azim.",
  translation: 'Allah - there is no deity except Him, the Ever-Living, the Sustainer of existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth. Who is it that can intercede with Him except by His permission? He knows what is before them and what will be after them, and they encompass not a thing of His knowledge except for what He wills. His Kursi extends over the heavens and the earth, and their preservation tires Him not. And He is the Most High, the Most Great.',
  reference: 'Surah Al-Baqarah (2:255)',
};
