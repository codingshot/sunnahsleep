import { ChecklistItem, DuaItem } from '@/types/checklist';

export const checklistItems: ChecklistItem[] = [
  // === PHASE 1: EVENING (Isha Prayer) ===
  {
    id: 'pray-isha',
    title: 'Pray Isha',
    titleArabic: 'صلاة العشاء',
    description: 'Perform the obligatory Isha prayer',
    detailedExplanation: 'Isha prayer is the final obligatory prayer of the day. The Prophet ﷺ recommended praying it early and then preparing for sleep. Praying Isha in congregation equals half the night in prayer, and praying Fajr in congregation completes the full night.',
    hadithSource: 'Muslim',
    hadithReference: {
      collection: 'muslim',
      bookNumber: 5,
      hadithNumber: 656,
      narrator: 'Uthman bin Affan',
      arabicText: 'مَنْ صَلَّى الْعِشَاءَ فِي جَمَاعَةٍ فَكَأَنَّمَا قَامَ نِصْفَ اللَّيْلِ',
      englishText: 'Whoever prays Isha in congregation, it is as if he prayed half the night.'
    },
    completed: false,
    category: 'isha',
    phase: 'evening',
    linkedAlarmType: 'isha',
  },

  // === PHASE 2: BEDTIME (After Isha) ===
  {
    id: 'wudu',
    title: 'Perform Wudu',
    titleArabic: 'الوضوء',
    description: 'Perform ablution before going to bed',
    detailedExplanation: 'The Prophet ﷺ instructed believers to make wudu before sleeping, just as they would for prayer. This purification prepares the soul for its journey during sleep and ensures one sleeps in a state of ritual purity. If one passes away during sleep, they would meet Allah in a purified state.',
    hadithSource: 'Bukhari and Muslim',
    hadithReference: {
      collection: 'bukhari',
      bookNumber: 4,
      hadithNumber: 247,
      narrator: "Al-Bara' bin 'Azib",
      arabicText: 'إِذَا أَتَيْتَ مَضْجَعَكَ فَتَوَضَّأْ وُضُوءَكَ لِلصَّلاَةِ',
      englishText: 'When you go to your bed, perform ablution like that for the prayer.'
    },
    completed: false,
    category: 'preparation',
    phase: 'bedtime',
  },
  {
    id: 'dust-bed',
    title: 'Dust the Bed',
    titleArabic: 'نفض الفراش',
    description: 'Dust your bed three times with the edge of your garment',
    detailedExplanation: 'Before lying down, the Prophet ﷺ would dust his bed three times with the inside of his lower garment. This removes any insects, dirt, or harmful creatures that may have settled on the bed during the day. It is a practical Sunnah that combines hygiene with spiritual preparation.',
    hadithSource: 'Bukhari and Muslim',
    hadithReference: {
      collection: 'bukhari',
      bookNumber: 80,
      hadithNumber: 6320,
      narrator: 'Abu Hurairah',
      arabicText: 'إِذَا أَوَى أَحَدُكُمْ إِلَى فِرَاشِهِ فَلْيَنْفُضْ فِرَاشَهُ بِدَاخِلَةِ إِزَارِهِ',
      englishText: 'When any one of you goes to bed, let him dust off his bed with the inside edge of his lower garment.'
    },
    completed: false,
    category: 'preparation',
    phase: 'bedtime',
  },
  {
    id: 'right-side',
    title: 'Sleep on Right Side',
    titleArabic: 'النوم على الجنب الأيمن',
    description: 'Lie down on your right side as recommended by the Prophet ﷺ',
    detailedExplanation: 'Sleeping on the right side is a recommended Sunnah with both spiritual and health benefits. It aids digestion, keeps the heart elevated, and the Prophet ﷺ would place his right hand under his right cheek. Modern medicine confirms benefits for heart health and digestion.',
    hadithSource: 'Bukhari and Muslim',
    hadithReference: {
      collection: 'bukhari',
      bookNumber: 80,
      hadithNumber: 6315,
      narrator: "Al-Bara' bin 'Azib",
      arabicText: 'ثُمَّ اضْطَجِعْ عَلَى شِقِّكَ الأَيْمَنِ',
      englishText: 'Then lie down on your right side.'
    },
    completed: false,
    category: 'position',
    phase: 'bedtime',
  },
  {
    id: 'ayat-kursi',
    title: 'Recite Ayat al-Kursi',
    titleArabic: 'آية الكرسي',
    description: 'Recite Ayat al-Kursi for protection throughout the night',
    detailedExplanation: 'Ayat al-Kursi (The Throne Verse, Quran 2:255) is the greatest verse in the Quran. When recited before sleep, Allah assigns a guardian angel to protect you throughout the night, and no devil can come near you until morning.',
    hadithSource: 'Bukhari',
    hadithReference: {
      collection: 'bukhari',
      bookNumber: 59,
      hadithNumber: 3275,
      narrator: 'Abu Hurairah',
      arabicText: 'إِذَا أَوَيْتَ إِلَى فِرَاشِكَ فَاقْرَأْ آيَةَ الْكُرْسِيِّ',
      englishText: 'When you go to your bed, recite Ayat al-Kursi, for there will remain over you a guardian from Allah, and no devil will come near you until morning.'
    },
    quranReference: {
      surah: 2,
      ayahStart: 255,
      surahName: 'Al-Baqarah',
      surahNameArabic: 'البقرة'
    },
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/262.mp3',
    completed: false,
    category: 'recitation',
    phase: 'bedtime',
  },
  {
    id: 'last-two-baqarah',
    title: 'Last Two Verses of Al-Baqarah',
    titleArabic: 'آخر آيتين من سورة البقرة',
    description: 'Recite the last two verses of Surah Al-Baqarah',
    detailedExplanation: 'The last two verses of Surah Al-Baqarah (2:285-286) are among the most virtuous verses. The Prophet ﷺ said whoever recites them at night, they will suffice him - meaning they provide protection, blessings, and reward equivalent to praying the whole night.',
    hadithSource: 'Bukhari and Muslim',
    hadithReference: {
      collection: 'bukhari',
      bookNumber: 66,
      hadithNumber: 5009,
      narrator: 'Abu Masud',
      arabicText: 'مَنْ قَرَأَ بِالآيَتَيْنِ مِنْ آخِرِ سُورَةِ الْبَقَرَةِ فِي لَيْلَةٍ كَفَتَاهُ',
      englishText: 'Whoever recites the last two verses of Surah Al-Baqarah at night, they will suffice him.'
    },
    quranReference: {
      surah: 2,
      ayahStart: 285,
      ayahEnd: 286,
      surahName: 'Al-Baqarah',
      surahNameArabic: 'البقرة'
    },
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/292.mp3',
    completed: false,
    category: 'recitation',
    phase: 'bedtime',
  },
  {
    id: 'three-quls',
    title: 'Recite Three Quls',
    titleArabic: 'المعوذات',
    description: 'Recite Al-Ikhlas, Al-Falaq, and An-Nas, blow into hands and wipe over body',
    detailedExplanation: 'The Prophet ﷺ would recite Surah Al-Ikhlas, Al-Falaq, and An-Nas three times each before sleeping, then blow gently into his cupped hands and wipe them over his entire body, starting with the head and face. This provides protection from evil and harm.',
    hadithSource: 'Bukhari',
    hadithReference: {
      collection: 'bukhari',
      bookNumber: 66,
      hadithNumber: 5017,
      narrator: 'Aisha',
      arabicText: 'كَانَ إِذَا أَوَى إِلَى فِرَاشِهِ كُلَّ لَيْلَةٍ جَمَعَ كَفَّيْهِ ثُمَّ نَفَثَ فِيهِمَا',
      englishText: 'Whenever the Prophet ﷺ went to bed every night, he used to cup his hands together and blow over them after reciting Surat Al-Ikhlas, Surat Al-Falaq, and Surat An-Nas, and then rub his hands over whatever parts of his body he was able to rub.'
    },
    quranReference: {
      surah: 112,
      ayahStart: 1,
      ayahEnd: 4,
      surahName: 'Al-Ikhlas',
      surahNameArabic: 'الإخلاص'
    },
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6222.mp3',
    completed: false,
    category: 'recitation',
    phase: 'bedtime',
  },
  {
    id: 'bedtime-dua',
    title: 'Bedtime Dua',
    titleArabic: 'دعاء النوم',
    description: 'Recite "Bismika Allahumma amutu wa ahya"',
    detailedExplanation: 'This dua acknowledges that sleep is like a minor death - the soul is taken by Allah and returned upon waking. By saying "In Your name, O Allah, I die and I live," we submit ourselves completely to Allah and recognize His control over our life and death.',
    hadithSource: 'Bukhari',
    hadithReference: {
      collection: 'bukhari',
      bookNumber: 80,
      hadithNumber: 6324,
      narrator: 'Hudhaifa',
      arabicText: 'كَانَ النَّبِيُّ صلى الله عليه وسلم إِذَا أَرَادَ أَنْ يَنَامَ قَالَ بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
      englishText: 'When the Prophet ﷺ wanted to sleep, he would say: "In Your name, O Allah, I die and I live."'
    },
    completed: false,
    category: 'dhikr',
    phase: 'bedtime',
  },
  {
    id: 'tasbih-33',
    title: 'Tasbih of Fatimah',
    titleArabic: 'تسبيح فاطمة',
    description: 'Say SubhanAllah 33x, Alhamdulillah 33x, Allahu Akbar 34x',
    detailedExplanation: 'The Prophet ﷺ taught his daughter Fatimah (RA) this dhikr when she asked for a servant to help with housework. He said this is better than a servant and will strengthen you. This tasbih before sleep brings immense blessings and energy for the next day.',
    hadithSource: 'Bukhari and Muslim',
    hadithReference: {
      collection: 'bukhari',
      bookNumber: 80,
      hadithNumber: 6318,
      narrator: 'Ali ibn Abi Talib',
      arabicText: 'أَلاَ أَدُلُّكُمَا عَلَى مَا هُوَ خَيْرٌ لَكُمَا مِنْ خَادِمٍ',
      englishText: 'Shall I not guide you to something better than a servant?'
    },
    completed: false,
    category: 'dhikr',
    phase: 'bedtime',
  },

  // === PHASE 3: WAKE UP (Before Fajr) ===
  {
    id: 'wake-tahajjud',
    title: 'Wake for Tahajjud',
    titleArabic: 'الاستيقاظ للتهجد',
    description: 'Wake up in the last third of the night for night prayer',
    detailedExplanation: 'The last third of the night is the most blessed time when Allah descends to the lowest heaven. This is when duas are readily accepted. The Prophet ﷺ never missed Tahajjud and encouraged believers to pray even if just two rakaat.',
    hadithSource: 'Bukhari and Muslim',
    hadithReference: {
      collection: 'bukhari',
      bookNumber: 19,
      hadithNumber: 1145,
      narrator: 'Abu Hurairah',
      arabicText: 'يَنْزِلُ رَبُّنَا تَبَارَكَ وَتَعَالَى كُلَّ لَيْلَةٍ إِلَى السَّمَاءِ الدُّنْيَا',
      englishText: 'Our Lord descends every night to the lowest heaven when the last third of the night remains, saying: "Who is calling upon Me that I may answer him?"'
    },
    completed: false,
    category: 'wake-up',
    phase: 'morning',
    linkedAlarmType: 'tahajjud',
  },
  {
    id: 'wake-dua',
    title: 'Dua Upon Waking',
    titleArabic: 'دعاء الاستيقاظ',
    description: 'Say "Alhamdulillah alladhi ahyana" upon waking',
    detailedExplanation: 'When waking, thank Allah for returning your soul. The Prophet ﷺ would say: "All praise is for Allah who gave us life after having taken it from us, and unto Him is the resurrection." This reminds us that each morning is a new gift from Allah.',
    hadithSource: 'Bukhari',
    hadithReference: {
      collection: 'bukhari',
      bookNumber: 80,
      hadithNumber: 6325,
      narrator: 'Hudhaifa',
      arabicText: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
      englishText: 'All praise is for Allah who gave us life after having taken it from us, and unto Him is the resurrection.'
    },
    completed: false,
    category: 'wake-up',
    phase: 'morning',
  },
  {
    id: 'rub-face',
    title: 'Rub Face & Look at Sky',
    titleArabic: 'مسح الوجه والنظر للسماء',
    description: 'Wipe sleep from your face and look at the sky',
    detailedExplanation: 'The Prophet ﷺ would wipe sleep from his face with his hands and look at the sky, reciting the last verses of Surah Aal-Imran (3:190-200). This practice helps awaken the body gently while immediately turning to the remembrance of Allah.',
    hadithSource: 'Bukhari and Muslim',
    hadithReference: {
      collection: 'bukhari',
      bookNumber: 19,
      hadithNumber: 1154,
      narrator: 'Ibn Abbas',
      arabicText: 'فَجَعَلَ يَمْسَحُ النَّوْمَ عَنْ وَجْهِهِ بِيَدَيْهِ ثُمَّ نَظَرَ إِلَى السَّمَاءِ',
      englishText: 'He began wiping sleep from his face with his hands, then he looked at the sky.'
    },
    completed: false,
    category: 'wake-up',
    phase: 'morning',
  },
  {
    id: 'miswak-wudu',
    title: 'Miswak & Fresh Wudu',
    titleArabic: 'السواك والوضوء',
    description: 'Use miswak and perform fresh wudu upon waking',
    detailedExplanation: 'The Prophet ﷺ said: "Were it not for the hardship on my Ummah, I would have commanded them to use the miswak before every prayer." Using miswak upon waking cleanses the mouth and pleases Allah. Fresh wudu removes the effects of sleep.',
    hadithSource: 'Bukhari and Muslim',
    hadithReference: {
      collection: 'bukhari',
      bookNumber: 4,
      hadithNumber: 245,
      narrator: 'Hudhaifa',
      arabicText: 'كَانَ النَّبِيُّ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ إِذَا قَامَ مِنَ اللَّيْلِ يَشُوصُ فَاهُ بِالسِّوَاكِ',
      englishText: 'When the Prophet ﷺ got up at night, he would clean his mouth with the miswak.'
    },
    completed: false,
    category: 'wake-up',
    phase: 'morning',
  },
  {
    id: 'tahajjud-prayer',
    title: 'Pray Tahajjud',
    titleArabic: 'صلاة التهجد',
    description: 'Pray voluntary night prayer (minimum 2 rakaat)',
    detailedExplanation: 'Tahajjud is prayed in sets of two rakaat. Start with two light rakaat to warm up, then pray as many as you wish. The Prophet ﷺ would pray 11 rakaat including Witr. Even 2 rakaat is immensely rewarding at this blessed time.',
    hadithSource: 'Muslim',
    hadithReference: {
      collection: 'muslim',
      bookNumber: 6,
      hadithNumber: 1691,
      narrator: 'Abdullah ibn Umar',
      arabicText: 'صَلاَةُ اللَّيْلِ مَثْنَى مَثْنَى',
      englishText: 'The night prayer is two by two (rakaat).'
    },
    completed: false,
    category: 'wake-up',
    phase: 'morning',
    linkedAlarmType: 'tahajjud',
  },
  {
    id: 'witr',
    title: 'Pray Witr',
    titleArabic: 'صلاة الوتر',
    description: 'End the night with Witr prayer (odd number)',
    detailedExplanation: 'Witr is a highly emphasized Sunnah that should be prayed after Tahajjud. It can be 1, 3, 5, 7, 9, or 11 rakaat. If you fear missing it, pray it before sleeping. The Prophet ﷺ said: "Make Witr the last of your night prayer."',
    hadithSource: 'Bukhari and Muslim',
    hadithReference: {
      collection: 'bukhari',
      bookNumber: 14,
      hadithNumber: 998,
      narrator: 'Abdullah ibn Umar',
      arabicText: 'اجْعَلُوا آخِرَ صَلاَتِكُمْ بِاللَّيْلِ وِتْرًا',
      englishText: 'Make Witr the last of your night prayer.'
    },
    completed: false,
    category: 'wake-up',
    phase: 'morning',
  },
  {
    id: 'suhoor-snack',
    title: 'Light Pre-Fajr Meal',
    titleArabic: 'السحور',
    description: 'Have a light snack or drink before Fajr (especially if fasting)',
    detailedExplanation: 'The Prophet ﷺ encouraged eating suhoor, even if just a sip of water or a date. He said: "Take suhoor, for indeed there is blessing in it." This provides energy for the day and is a blessed Sunnah.',
    hadithSource: 'Bukhari and Muslim',
    hadithReference: {
      collection: 'bukhari',
      bookNumber: 30,
      hadithNumber: 1923,
      narrator: 'Anas bin Malik',
      arabicText: 'تَسَحَّرُوا فَإِنَّ فِي السُّحُورِ بَرَكَةً',
      englishText: 'Take suhoor, for indeed there is blessing in it.'
    },
    completed: false,
    category: 'wake-up',
    phase: 'morning',
  },
  {
    id: 'pray-fajr',
    title: 'Pray Fajr on Time',
    titleArabic: 'صلاة الفجر',
    description: 'Pray Fajr as soon as the time enters',
    detailedExplanation: 'Fajr prayer is the most difficult prayer but has immense rewards. The Prophet ﷺ said: "The two rakaat of Fajr are better than the world and everything in it." Praying Fajr in congregation completes the reward of praying the whole night.',
    hadithSource: 'Muslim',
    hadithReference: {
      collection: 'muslim',
      bookNumber: 5,
      hadithNumber: 725,
      narrator: 'Aisha',
      arabicText: 'رَكْعَتَا الْفَجْرِ خَيْرٌ مِنَ الدُّنْيَا وَمَا فِيهَا',
      englishText: 'The two rakaat of Fajr are better than the world and everything in it.'
    },
    completed: false,
    category: 'wake-up',
    phase: 'morning',
    linkedAlarmType: 'fajr',
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
    hadithReference: {
      collection: 'bukhari',
      bookNumber: 80,
      hadithNumber: 6324,
      narrator: 'Hudhaifa',
    },
  },
  {
    id: 'rabbi-wada',
    title: 'Before Sleeping',
    arabic: 'بِاسْمِكَ رَبِّي وَضَعْتُ جَنْبِي، وَبِكَ أَرْفَعُهُ، فَإِنْ أَمْسَكْتَ نَفْسِي فَارْحَمْهَا، وَإِنْ أَرْسَلْتَهَا فَاحْفَظْهَا، بِمَا تَحْفَظُ بِهِ عِبَادَكَ الصَّالِحِينَ',
    transliteration: "Bismika Rabbi wada'tu janbi, wa bika arfa'uhu, in amsakta nafsi farhamha, wa in arsaltaha fahfazha bima tahfazu bihi 'ibadaka as-salihin",
    translation: 'In Your name, my Lord, I lay down my side and in Your name I raise it. If You take my soul, have mercy on it, and if You send it back, protect it as You protect Your righteous slaves.',
    source: 'Bukhari and Muslim',
    hadithReference: {
      collection: 'bukhari',
      bookNumber: 80,
      hadithNumber: 6320,
      narrator: 'Abu Hurairah',
    },
  },
  {
    id: 'allahumma-aslamtu',
    title: 'Submitting to Allah',
    arabic: 'اللَّهُمَّ أَسْلَمْتُ نَفْسِي إِلَيْكَ، وَفَوَّضْتُ أَمْرِي إِلَيْكَ، وَوَجَّهْتُ وَجْهِي إِلَيْكَ، وَأَلْجَأْتُ ظَهْرِي إِلَيْكَ',
    transliteration: "Allahumma aslamtu nafsi ilayk, wa fawwadtu amri ilayk, wa wajjahtu wajhi ilayk, wa alja'tu zahri ilayk",
    translation: 'O Allah, I submit myself to You, and I entrust my affairs to You, and I turn my face to You, and I rely completely on You.',
    source: 'Bukhari and Muslim',
    hadithReference: {
      collection: 'bukhari',
      bookNumber: 80,
      hadithNumber: 6311,
      narrator: "Al-Bara' bin 'Azib",
    },
  },
  {
    id: 'wake-dua',
    title: 'Upon Waking',
    arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
    transliteration: 'Alhamdulillah alladhi ahyana ba\'da ma amatana wa ilayhi an-nushur',
    translation: 'All praise is for Allah who gave us life after having taken it from us, and unto Him is the resurrection.',
    source: 'Bukhari',
    hadithReference: {
      collection: 'bukhari',
      bookNumber: 80,
      hadithNumber: 6325,
      narrator: 'Hudhaifa',
    },
  },
];

export const ayatKursi = {
  arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ',
  transliteration: "Allahu la ilaha illa Huwa, Al-Hayyul-Qayyum. La ta'khuzuhu sinatun wa la nawm. Lahu ma fis-samawati wa ma fil-ard. Man zal-ladhi yashfa'u 'indahu illa bi-idhnih. Ya'lamu ma bayna aydihim wa ma khalfahum. Wa la yuhituna bi-shay'im-min 'ilmihi illa bima sha'. Wasi'a Kursiyyuhus-samawati wal-ard. Wa la ya'uduhu hifzuhuma. Wa Huwal-'Aliyyul-'Azim.",
  translation: 'Allah - there is no deity except Him, the Ever-Living, the Sustainer of existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth. Who is it that can intercede with Him except by His permission? He knows what is before them and what will be after them, and they encompass not a thing of His knowledge except for what He wills. His Kursi extends over the heavens and the earth, and their preservation tires Him not. And He is the Most High, the Most Great.',
  reference: 'Surah Al-Baqarah (2:255)',
  quranReference: {
    surah: 2,
    ayahStart: 255,
    surahName: 'Al-Baqarah',
    surahNameArabic: 'البقرة'
  },
  audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/262.mp3'
};

export const lastTwoAyahBaqarah = {
  verses: [
    {
      ayah: 285,
      arabic: 'آمَنَ الرَّسُولُ بِمَا أُنزِلَ إِلَيْهِ مِن رَّبِّهِ وَالْمُؤْمِنُونَ ۚ كُلٌّ آمَنَ بِاللَّهِ وَمَلَائِكَتِهِ وَكُتُبِهِ وَرُسُلِهِ لَا نُفَرِّقُ بَيْنَ أَحَدٍ مِّن رُّسُلِهِ ۚ وَقَالُوا سَمِعْنَا وَأَطَعْنَا ۖ غُفْرَانَكَ رَبَّنَا وَإِلَيْكَ الْمَصِيرُ',
      transliteration: "Amanar-Rasulu bima unzila ilayhi min Rabbihi wal-mu'minun. Kullun amana billahi wa mala'ikatihi wa kutubihi wa Rusulihi. La nufarriqu bayna ahadim-min Rusulih. Wa qalu sami'na wa ata'na. Ghufranaka Rabbana wa ilaykal-masir.",
      translation: 'The Messenger has believed in what was revealed to him from his Lord, and so have the believers. All of them have believed in Allah and His angels and His books and His messengers, saying, "We make no distinction between any of His messengers." And they say, "We hear and we obey. Grant us Your forgiveness, our Lord, and to You is the final destination."',
      audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/292.mp3'
    },
    {
      ayah: 286,
      arabic: 'لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا ۚ لَهَا مَا كَسَبَتْ وَعَلَيْهَا مَا اكْتَسَبَتْ ۗ رَبَّنَا لَا تُؤَاخِذْنَا إِن نَّسِينَا أَوْ أَخْطَأْنَا ۚ رَبَّنَا وَلَا تَحْمِلْ عَلَيْنَا إِصْرًا كَمَا حَمَلْتَهُ عَلَى الَّذِينَ مِن قَبْلِنَا ۚ رَبَّنَا وَلَا تُحَمِّلْنَا مَا لَا طَاقَةَ لَنَا بِهِ ۖ وَاعْفُ عَنَّا وَاغْفِرْ لَنَا وَارْحَمْنَا ۚ أَنتَ مَوْلَانَا فَانصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ',
      transliteration: "La yukalliful-lahu nafsan illa wus'aha. Laha ma kasabat wa 'alayha maktasabat. Rabbana la tu'akhidhna in nasina aw akhta'na. Rabbana wa la tahmil 'alayna isran kama hamaltahu 'alalladhina min qablina. Rabbana wa la tuhammilna ma la taqata lana bih. Wa'fu 'anna waghfir lana warhamna. Anta Mawlana fansurna 'alal-qawmil-kafirin.",
      translation: 'Allah does not burden a soul beyond that it can bear. It will have the consequence of what it has gained, and it will bear the consequence of what it has earned. "Our Lord, do not impose blame upon us if we have forgotten or erred. Our Lord, and lay not upon us a burden like that which You laid upon those before us. Our Lord, and burden us not with that which we have no ability to bear. And pardon us; and forgive us; and have mercy upon us. You are our protector, so give us victory over the disbelieving people."',
      audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/293.mp3'
    }
  ],
  reference: 'Surah Al-Baqarah (2:285-286)'
};

export const threeQuls = [
  {
    id: 'ikhlas',
    surah: 112,
    name: 'Al-Ikhlas',
    nameArabic: 'الإخلاص',
    arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ ﴿١﴾ اللَّهُ الصَّمَدُ ﴿٢﴾ لَمْ يَلِدْ وَلَمْ يُولَدْ ﴿٣﴾ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ ﴿٤﴾',
    transliteration: "Qul Huwa Allahu Ahad. Allahus-Samad. Lam yalid wa lam yulad. Wa lam yakun lahu kufuwan ahad.",
    translation: 'Say, "He is Allah, the One. Allah, the Eternal Refuge. He neither begets nor is born. Nor is there to Him any equivalent."',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6222.mp3'
  },
  {
    id: 'falaq',
    surah: 113,
    name: 'Al-Falaq',
    nameArabic: 'الفلق',
    arabic: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ﴿١﴾ مِن شَرِّ مَا خَلَقَ ﴿٢﴾ وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ ﴿٣﴾ وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ ﴿٤﴾ وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ ﴿٥﴾',
    transliteration: "Qul a'udhu bi Rabbi al-Falaq. Min sharri ma khalaq. Wa min sharri ghasiqin idha waqab. Wa min sharrin-naffathati fil-'uqad. Wa min sharri hasidin idha hasad.",
    translation: 'Say, "I seek refuge in the Lord of daybreak. From the evil of that which He created. And from the evil of darkness when it settles. And from the evil of the blowers in knots. And from the evil of an envier when he envies."',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6227.mp3'
  },
  {
    id: 'nas',
    surah: 114,
    name: 'An-Nas',
    nameArabic: 'الناس',
    arabic: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ ﴿١﴾ مَلِكِ النَّاسِ ﴿٢﴾ إِلَٰهِ النَّاسِ ﴿٣﴾ مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ﴿٤﴾ الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ ﴿٥﴾ مِنَ الْجِنَّةِ وَالنَّاسِ ﴿٦﴾',
    transliteration: "Qul a'udhu bi Rabbi an-Nas. Maliki an-Nas. Ilahi an-Nas. Min sharril-waswasil-khannas. Alladhi yuwaswisu fi sudurin-nas. Minal-jinnati wan-nas.",
    translation: 'Say, "I seek refuge in the Lord of mankind. The King of mankind. The God of mankind. From the evil of the retreating whisperer. Who whispers in the breasts of mankind. From among the jinn and mankind."',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6233.mp3'
  }
];

export const qailulahInfo = {
  title: 'Qailulah',
  titleArabic: 'القيلولة',
  description: 'The Sunnah midday rest taken before or after Dhuhr prayer',
  detailedExplanation: 'Qailulah is a short rest or nap taken around midday, typically between Dhuhr and Asr prayers. The Prophet ﷺ and his Companions practiced this, as it helps rejuvenate the body for night worship (Tahajjud). The ideal duration is 20-30 minutes.',
  hadithReference: {
    collection: 'bukhari',
    hadithNumber: 6279,
    narrator: 'Sahl bin Sa\'d',
    arabicText: 'كُنَّا نَقِيلُ وَنَتَغَدَّى بَعْدَ الْجُمُعَةِ',
    englishText: 'We used to have a midday nap and take our meals after the Jumu\'ah (prayer).'
  }
};

export const tahajjudInfo = {
  title: 'Tahajjud',
  titleArabic: 'التهجد',
  description: 'The voluntary night prayer performed in the last third of the night',
  detailedExplanation: 'Tahajjud is a special prayer performed after sleeping and waking up in the last third of the night. This is the time when Allah descends to the lowest heaven and responds to supplications. It is one of the most beloved acts of worship.',
  hadithReference: {
    collection: 'bukhari',
    bookNumber: 19,
    hadithNumber: 1145,
    narrator: 'Abu Hurairah',
    arabicText: 'يَنْزِلُ رَبُّنَا تَبَارَكَ وَتَعَالَى كُلَّ لَيْلَةٍ إِلَى السَّمَاءِ الدُّنْيَا حِينَ يَبْقَى ثُلُثُ اللَّيْلِ الآخِرُ',
    englishText: 'Our Lord descends every night to the lowest heaven when the last third of the night remains.'
  }
};

// Hadith about sleeping early after Isha
export const sleepAfterIshaInfo = {
  title: 'Sleep Early After Isha',
  titleArabic: 'النوم بعد صلاة العشاء',
  description: 'The Prophet ﷺ disliked talking after Isha prayer and recommended sleeping early',
  hadithReference: {
    collection: 'bukhari',
    bookNumber: 9,
    hadithNumber: 568,
    narrator: 'Abu Barza',
    arabicText: 'كَانَ يَكْرَهُ النَّوْمَ قَبْلَهَا وَالْحَدِيثَ بَعْدَهَا',
    englishText: 'The Prophet ﷺ disliked sleeping before Isha and talking after it.'
  }
};
