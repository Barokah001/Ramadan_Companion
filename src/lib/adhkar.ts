// src/lib/adhkar.ts - FIXED: All duplicate IDs removed

export interface DhikrItem {
  id: string;
  arabic: string;
  transliteration: string;
  translation: string;
  repetitions: number;
  category:
    | "protection"
    | "gratitude"
    | "seeking_forgiveness"
    | "general"
    | "quran";
  reference?: string;
}

export const morningAdhkar: DhikrItem[] = [
  {
    id: "ayatul-kursi-morning",
    arabic:
      "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ. اللَّهُ لاَ إِلَهَ إِلاَّ هُوَ الْحَيُّ الْقَيُّومُ لاَ تَأْخُذُهُ سِنَةٌ وَلاَ نَوْمٌ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الأَرْضِ مَن ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلاَّ بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلاَ يُحِيطُونَ بِشَىْءٍ مِّنْ عِلْمِهِ إِلاَّ بِمَا شَاءَ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالأَرْضَ وَلاَ يَؤُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ",
    transliteration:
      "'A'oothu billaahi minash-Shaytaanir-rajeem. Allaahu laa 'ilaaha 'illaa Huwal-Hayyul-Qayyoom, laa ta'khuthuhu sinatun wa laa nawm, lahu maa fis-samaawaati wa maa fil-'ardh, man thai-lathee yashfa'u 'indahu 'illaa bi'ithnih, ya'lamu maa bayna 'aydeehim wa maa khalfahum, wa laa yuheetoona bishay'im-min 'ilmihi 'illaa bimaa shaa'a, wasi'a kursiyyuhus samaawaati wal'ardh, wa laa ya'ooduhu hifdhuhumaa, wa Huwal-'Aliyyul-'Adheem.",
    translation:
      "I seek refuge in Allah from Satan, the expelled. Allah - there is no deity except Him, the Ever-Living, the Sustainer of existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth.",
    repetitions: 1,
    category: "quran",
    reference: "Al-Baqarah 2:255",
  },
  {
    id: "ikhlas-falaq-nas",
    arabic: "Recite Surat Al-Ikhlas, Al-Falaq, and An-Nas",
    transliteration: "Qul Huwa Allahu Ahad... (Al-Ikhlas, Al-Falaq, An-Nas)",
    translation:
      'Say, "He is Allah, [who is] One..." Recite the three protective chapters',
    repetitions: 3,
    category: "quran",
    reference: "Quran 112, 113, 114",
  },
  {
    id: "morning-evening-general",
    arabic:
      "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِيْ هَذَا الْيَوْمِ وَخَيْرَ مَا بَعْدَهُ، وَأَعُوْذُ بِكَ مِنْ شَرِّ مَا فِي هَذَا الْيَوْمِ وَشَرِّ مَا بَعْدَهُ",
    transliteration:
      "'Asbahnaa wa 'asbahal-mulku lillaahi walhamdu lillaahi, laa 'ilaaha 'illallaahu wahdahu laa shareeka lahu, lahul-mulku wa lahul-hamdu wa Huwa 'alaa kulli shay'in Qadeer. Rabbi 'as'aluka khayra maa fee haathal-yawmi wa khayra maa ba'dahu wa 'a'oothu bika min sharri maa fee haathal-yawmi wa sharri maa ba'dahu",
    translation:
      "We have reached the morning and at this very time all sovereignty belongs to Allah. All praise is for Allah. None has the right to be worshipped except Allah, alone, without partner. To Him belongs all sovereignty and praise and He is over all things omnipotent. My Lord, I ask You for the good of this day and the good of what follows it, and I seek refuge in You from the evil of this day and the evil of what follows it.",
    repetitions: 1,
    category: "general",
  },
  {
    id: "morning-with-allah",
    arabic:
      "اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ",
    transliteration:
      "Allaahumma bika 'asbahnaa, wa bika 'amsaynaa, wa bika nahyaa, wa bika namootu wa 'ilaykan-nushoor.",
    translation:
      "O Allah, by Your leave we have reached the morning and by Your leave we have reached the evening, by Your leave we live and die and unto You is our resurrection.",
    repetitions: 1,
    category: "general",
  },
  {
    id: "master-of-forgiveness",
    arabic:
      "اللَّهُمَّ أَنْتَ رَبِّي لَّا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِر لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ",
    transliteration:
      "Allaahumma 'Anta Rabbee laa 'ilaaha 'illaa 'Anta, khalaqtanee wa 'anaa 'abduka, wa 'anaa 'alaa 'ahdika wa wa'dika mas-tata'tu, 'a'oothu bika min sharri maa sana'tu, 'aboo'u laka bini'matika 'alayya, wa 'aboo'u bithanbee faghfir lee fa'innahu laa yaghfiruth-thunooba 'illaa 'Anta.",
    translation:
      "O Allah, You are my Lord, none has the right to be worshipped except You. You created me and I am Your servant and I abide by Your covenant and promise as best I can. I seek refuge in You from the evil of what I have done. I acknowledge Your favor upon me and I acknowledge my sin, so forgive me, for verily none can forgive sin except You.",
    repetitions: 1,
    category: "seeking_forgiveness",
  },
  {
    id: "witness-allah",
    arabic:
      "اللَّهُمَّ إِنِّي أَصْبَحْتُ أُشْهِدُكَ وَأُشْهِدُ حَمَلَةَ عَرْشِكَ، وَمَلَائِكَتَكَ وَجَمِيعَ خَلْقِكَ، أَنَّكَ أَنْتَ اللَّهُ لَا إِلَهَ إِلَّا أَنْتَ وَحْدَكَ لَا شَرِيكَ لَكَ، وَأَنَّ مُحَمَّداً عَبْدُكَ وَرَسُولُكَ",
    transliteration:
      "Allaahumma 'innee 'asbahtu 'ush-hiduka wa 'ush-hidu hamalata 'arshika, wa malaa'ikataka wajamee'a khalqika, 'annaka 'Antallaahu laa 'ilaaha 'illaa 'Anta wahdaka laa shareeka laka, wa 'anna Muhammadan 'abduka wa Rasooluka.",
    translation:
      "O Allah, verily I have reached the morning and call on You, the bearers of Your throne, Your angels, and all of Your creation to witness that You are Allah, none has the right to be worshipped except You, alone, without partner and that Muhammad is Your servant and Messenger.",
    repetitions: 4,
    category: "general",
  },
  {
    id: "gratitude-morning",
    arabic:
      "اللَّهُمَّ مَا أَصْبَحَ بِي مِنْ نِعْمَةٍ أَوْ بِأَحَدٍ مِنْ خَلْقِكَ فَمِنْكَ وَحْدَكَ لَا شَرِيكَ لَكَ، فَلَكَ الْحَمْدُ وَلَكَ الشُّكْرُ",
    transliteration:
      "Allaahumma maa 'asbaha bee min ni'matin 'aw bi'ahadin min khalqika faminka wahdaka laa shareeka laka, falakal-hamdu wa lakash-shukru.",
    translation:
      "O Allah, what blessing I or any of Your creation have risen upon, is from You alone, without partner, so for You is all praise and unto You all thanks.",
    repetitions: 1,
    category: "gratitude",
  },
  {
    id: "health-protection",
    arabic:
      "اللَّهُمَّ عَافِـني فِي بَدَنِي، اللَّهُمَّ عَافِـنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لَا إِلَهَ إلاَّ أَنْتَ. اللَّهُمَّ إِنِّي أَعُوذُبِكَ مِنَ الْكُفْر، وَالفَقْرِ، وَأَعُوذُبِكَ مِنْ عَذَابِ الْقَبْرِ ، لَا إلَهَ إلاَّ أَنْتَ",
    transliteration:
      "Allaahumma 'aafinee fee badanee, Allaahumma 'aafinee fee sam'ee, Allaahumma 'aafinee fee basaree, laa 'ilaaha 'illaa 'Anta (three times). Allaahumma 'innee 'a'oothu bika minal-kufri, walfaqri, wa 'a'oothu bika min 'athaabil-qabri, laa 'ilaaha 'illaa 'Anta.",
    translation:
      "O Allah, grant my body health. O Allah, grant my hearing health. O Allah, grant my sight health. None has the right to be worshipped except You. O Allah, I take refuge in You from disbelief and poverty, and I take refuge in You from the punishment of the grave. None has the right to be worshipped except You.",
    repetitions: 3,
    category: "protection",
  },
  {
    id: "sufficient-allah",
    arabic:
      "حَسْبِيَ اللَّهُ لَآ إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ",
    transliteration:
      "Hasbiyallaahu laa 'ilaaha 'illaa Huwa 'alayhi tawakkaltu wa Huwa Rabbul-'Arshil-'Adheem.",
    translation:
      "Allah is Sufficient for me, none has the right to be worshipped except Him, upon Him I rely and He is Lord of the exalted throne.",
    repetitions: 7,
    category: "protection",
  },
  {
    id: "subhan-allah-100",
    arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
    transliteration: "Subhaanallaahi wa bihamdihi.",
    translation: "How perfect Allah is and I praise Him.",
    repetitions: 100,
    category: "general",
  },
  {
    id: "subhan-allah-creation",
    arabic:
      "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ عَدَدَ خَلْقِهِ، وَرِضَا نَفْسِهِ، وَزِنَةَ عَرْشِهِ وَمِدَادَ كَلِمَاتِهِ",
    transliteration:
      "Subhaanallaahi wa bihamdihi: 'Adada khalqihi, wa ridhaa nafsihi, wa zinata 'arshihi wa midaada kalimaatihi.",
    translation:
      "How perfect Allah is and I praise Him by the number of His creation and His pleasure, and by the weight of His throne, and the ink of His words.",
    repetitions: 3,
    category: "general",
  },
  {
    id: "morning-protection-forgiveness",
    arabic:
      "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ، اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي دِينِي، وَدُنْيَايَ، وَأَهْلِي، وَمَالِي...",
    transliteration:
      "Allaahumma 'innee 'as'alukal-'afwa wal'aafiyata fid-dunyaa wal'aakhirati...",
    translation:
      "O Allah, I ask You for pardon and well-being in this world and the next. O Allah, I ask You for pardon and well-being in my religious and worldly affairs, and my family and my wealth.",
    repetitions: 1,
    category: "protection",
  },
  {
    id: "protection-evil-self",
    arabic:
      "اللَّهُمَّ عَالِمَ الْغَيْبِ وَالشَّهَادَةِ فَاطِرَ السَّماوَاتِ وَالْأَرْضِ، رَبَّ كُلِّ شَيْءٍ وَمَلِيكَهُ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا أَنْتَ، أَعُوذُ بِكَ مِنْ شَرِّ نَفْسِي، وَمِنْ شَرِّ الشَّيْطَانِ وَشِرْكِهِ",
    transliteration:
      "Allaahumma 'Aalimal-ghaybi wash-shahaadati faatiras-samaawaati wal'ardhi, Rabba kulli shay'in wa maleekahu...",
    translation:
      "O Allah, Knower of the unseen and the evident, Maker of the heavens and the earth, Lord of everything and its Possessor... I seek refuge in You from the evil of my soul and from the evil of Satan and his shirk.",
    repetitions: 1,
    category: "protection",
  },
  {
    id: "morning-blessings-request",
    arabic:
      "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ رَبِّ الْعَالَمِينَ، اللَّهُمَّ إِنِّـي أَسْأَلُكَ خَـيْرَ هَذَا الْـيَوْمِ ، فَتْحَهُ، وَنَصْرَهُ، وَنُورَهُ وَبَرَكَتَهُ، وَهُدَاهُ",
    transliteration:
      "Asbahnaa wa 'asbahal-mulku lillaahi Rabbil-'aalameen, Allaahumma 'innee 'as'aluka khayra haathal-yawmi , Fathahu wa nasrahu wa noorahu...",
    translation:
      "We have reached the morning and all sovereignty belongs to Allah, Lord of the worlds. O Allah, I ask You for the good of this day, its triumphs and its successes, its light and its blessings and its guidance.",
    repetitions: 1,
    category: "general",
  },
  {
    id: "useful-knowledge",
    arabic:
      "اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْماً نَافِعاً، وَ رِزْقاً طَيِّباً، وَ عَمَلاً مُتَقَبَّلاً",
    transliteration:
      "Allaahumma 'innee 'as'aluka 'ilman naafi'an, wa rizqan tayyiban, wa 'amalan mutaqabbalan.",
    translation:
      "O Allah, I ask You for knowledge that is of benefit, a good provision, and deeds that will be accepted.",
    repetitions: 1,
    category: "general",
  },
  {
    id: "salutation-prophet",
    arabic: "اللَّهُمَّ صَلِّ وَسَلَّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ",
    transliteration: "Allahumma salli wa sallim 'alaa nabiyyinaa Muhammadin",
    translation: "O Allah, send prayers and peace upon our Prophet Muhammad.",
    repetitions: 10,
    category: "general",
  },
  {
    id: "ya-hayyu-ya-qayyum",
    arabic:
      "يَاحَيُّ، يَا قَيُّومُ، بِرَحْمَتِكَ أَسْتَغِيثُ، أَصْلِحْ لِي شَأْنِي كُلَّهُ، وَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ",
    transliteration:
      "Yaa Hayyu yaa Qayyoomu birahmatika 'astagheethu 'aslih lee sha'nee kullahu wa laa takilnee 'ilaa nafsee tarfata 'aynin.",
    translation:
      "O Ever Living One, O Self-Sustaining One, in Your mercy I seek relief...",
    repetitions: 1,
    category: "general",
  },
];

export const eveningAdhkar: DhikrItem[] = [
  {
    id: "ayatul-kursi-evening",
    arabic:
      "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ. اللَّهُ لاَ إِلَهَ إِلاَّ هُوَ الْحَيُّ الْقَيُّومُ...",
    transliteration:
      "'A'oothu billaahi minash-Shaytaanir-rajeem. Allaahu laa 'ilaaha 'illaa Huwal-Hayyul-Qayyoom...",
    translation:
      "I seek refuge in Allah from Satan, the expelled. Allah - there is no deity except Him, the Ever-Living, the Sustainer of existence...",
    repetitions: 1,
    category: "quran",
    reference: "Al-Baqarah 2:255",
  },
  {
    id: "evening-general",
    arabic:
      "اَمْسَيْنَا وَاَمْسَ الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
    transliteration:
      "'Amsaynaa wa'amsal-mulku lillaahi walhamdu lillaahi, laa 'ilaaha 'illallaahu wahdahu laa shareeka lahu, lahul-mulku wa lahul-hamdu wa Huwa 'alaa kulli shay'in Qadeer.",
    translation:
      "We have reached the evening and at this very time all sovereignty belongs to Allah. All praise is for Allah. None has the right to be worshipped except Allah, alone, without partner.",
    repetitions: 1,
    category: "general",
  },
  {
    id: "evening-with-allah",
    arabic:
      "اللَّهُمَّ بِكَ أَمْسَـينا ، وَبِكَ أَصْبَحْنَا ، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ المصير",
    transliteration:
      "Allaahumma bika 'amsaynaa, wa bika 'asbahnaa, wa bika nahyaa, wa bika namootu wa 'ilaykan-masheer",
    translation:
      "O Allah, by Your leave we have reached the evening and by Your leave we have reached the morning, by Your leave we live and die and unto You is our return.",
    repetitions: 1,
    category: "general",
  },
  {
    id: "bismillah-protection",
    arabic:
      "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الَْأرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
    transliteration:
      "Bismillaahil-lathee laa yadhurru ma'as-mihi shay'un fil-'ardhi wa laa fis-samaa'i wa Huwas-Samee'ul-'Aleem.",
    translation:
      "In the name of Allah with whose name nothing is harmed on earth nor in the heavens and He is The All-Seeing, The All-Knowing.",
    repetitions: 3,
    category: "protection",
  },
  {
    id: "pleased-with-allah",
    arabic:
      "رَضِيتُ باللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِيناً، وَبِمُحَمَّدٍ صَلَى اللَّهُ عَلِيهِ وَسَلَّمَ نَبِيَّاً",
    transliteration:
      "Radheetu billaahi Rabban, wa bil-'Islaami deenan, wa bi-Muhammadin (sallallaahu 'alayhi wa sallama) Nabiyyan.",
    translation:
      "I am pleased with Allah as a Lord, and Islam as a religion and Muhammad (peace be upon him) as a Prophet.",
    repetitions: 3,
    category: "general",
  },
  {
    id: "evening-protection-forgiveness",
    arabic:
      "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ...",
    transliteration:
      "Allaahumma 'innee 'as'alukal-'afwa wal'aafiyata fid-dunyaa wal'aakhirati...",
    translation:
      "O Allah, I ask You for pardon and well-being in this world and the next...",
    repetitions: 1,
    category: "protection",
  },
  {
    id: "evening-ya-hayyu-ya-qayyum",
    arabic:
      "يَاحَيُّ، يَا قَيُّومُ، بِرَحْمَتِكَ أَسْتَغِيثُ، أَصْلِحْ لِي شَأْنِي كُلَّهُ، وَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ",
    transliteration:
      "Yaa Hayyu yaa Qayyoomu birahmatika 'astagheethu 'aslih lee sha'nee kullahu wa laa takilnee 'ilaa nafsee tarfata 'aynin.",
    translation:
      "O Ever Living One, O Self-Sustaining One, in Your mercy I seek relief. Set all my affairs right and do not leave me to myself even for the blink of an eye.",
    repetitions: 1,
    category: "general",
  },
  {
    id: "evening-blessings-request",
    arabic:
      "أَمْسَيْنا وَأَمْسَى الْمُلْكُ لِلَّهِ رَبِّ الْعَالَمِينَ، اللَّهُمَّ إِنِّـي أَسْأَلُكَ خَـيْرَ هَذَه اللَّـيْلَة، فَتْحَهُ، وَنَصْرَهُ، وَنُورَهُ وَبَرَكَتَهُ، وَهُدَاهُ",
    transliteration:
      "Amsaynaa wa 'amsal-mulku lillaahi Rabbil-'aalameen, Allaahumma 'innee 'as'aluka khayra hathee-layla, Fathahu wa nasrahu...",
    translation:
      "We have reached the evening and all sovereignty belongs to Allah, Lord of the worlds. O Allah, I ask You for the good of this night...",
    repetitions: 1,
    category: "general",
  },
  {
    id: "evening-fitrat-islam",
    arabic:
      "أَمْسَيْنَا عَلَى فِطْرَةِ الْإِسْلَامِ، وَعَلَى كَلِمَةِ الإِخْلَاصِ، وَعَلَى دِينِ نَبِـيِّنَا مُحَمَّدٍ...",
    transliteration:
      "Amsaynaa 'alaa fitratil-'Islaami wa 'alaa kalimatil-'ikhlaasi, wa 'alaa deeni Nabiyyinaa Muhammadin...",
    translation:
      "We have reached the evening upon the natural religion of Islam and the word of pure faith and the religion of our Prophet Muhammad...",
    repetitions: 1,
    category: "general",
  },
  {
    id: "evening-protection-creation",
    arabic: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
    transliteration:
      "'A'oothu bikalimaatil-laahit-taammaati min sharri maa khalaqa.",
    translation:
      "I seek refuge in the perfect words of Allah from the evil of what He has created.",
    repetitions: 3,
    category: "protection",
  },
];

// Helper function to get total repetitions
export const getTotalRepetitions = (adhkar: DhikrItem[]): number => {
  return adhkar.reduce((total, item) => total + item.repetitions, 0);
};

// Helper to get adhkar by category
export const getAdhkarByCategory = (
  adhkar: DhikrItem[],
  category: DhikrItem["category"],
): DhikrItem[] => {
  return adhkar.filter((item) => item.category === category);
};