import { PrismaClient, DifficultyLevel } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding bilingual reading education data into Neon PostgreSQL...");

  await prisma.vocabulary.deleteMany();
  await prisma.passageSection.deleteMany();
  await prisma.passage.deleteMany();

  // Passage 1: The Whispering Banyan Tree (Beginner)
  const passage1 = await prisma.passage.create({
    data: {
      slug: "the-whispering-banyan-tree",
      titleEn: "The Whispering Banyan Tree",
      titleBn: "ফিসফিস করা বটগাছ",
      category: "Moral Story",
      difficulty: DifficultyLevel.BEGINNER,
      readingTimeMinutes: 3,
      summaryEn: "A story about a grand banyan tree in a rural village that teaches the power of kindness and quiet resilience.",
      summaryBn: "একটি গ্রামীণ গ্রামের এক বিশাল বটগাছের গল্প যা দয়া এবং নীরব সহনশীলতার শক্তি শেখায়।",
      englishContent: `Once upon a time, at the edge of a quiet village in Bengal, stood an ancient banyan tree.

The villagers called it the Whispering Tree because the gentle breeze made its leaves rustle like quiet voices.

Every afternoon, tired farmers and playful children would gather beneath its vast branches.

The tree gave everyone cool shade and sheltered countless birds in its dense leaves. It asked for nothing in return.

One hot summer day, a weary wanderer collapsed near the roots of the tree.

The tree offered its cooling breeze and whispered comforting sounds.

The traveler drank sweet water from a nearby pond and rested peacefully. He realized that true greatness lies in giving selflessly to others.`,
      bengaliContent: `একদা বাংলার এক শান্ত গ্রামের প্রান্তে একটি প্রাচীন বটগাছ দাঁড়িয়ে ছিল।

গ্রামবাসীরা এটিকে ফিসফিস করা গাছ বলত কারণ মৃদু বাতাসে এর পাতাগুলো শান্ত কণ্ঠের মতো মর্মর শব্দ করত।

প্রতি বিকেলে, ক্লান্ত কৃষক এবং চঞ্চল শিশুরা এর সুবিশাল ডালপালার নিচে জড়ো হতো।

গাছটি সবাইকে শীতল ছায়া দিত এবং ঘন পাতায় অসংখ্য পাখির আশ্রয় তৈরি করত। বিনিময়ে এটি কিছুই চাইত না।

এক তপ্ত গ্রীষ্মের দিনে, একজন পরিশ্রান্ত পথিক গাছের শিকড়ের কাছে লুটিয়ে পড়ল।

গাছটি তার শীতল বাতাস উপহার দিল এবং সান্ত্বনাময় ধ্বনি ফিসফিস করে জানাল।

পথিক কাছের একটি পুকুর থেকে মিষ্টি জল পান করল এবং শান্তিতে বিশ্রাম নিল। সে বুঝতে পারল যে প্রকৃত মহত্ত্ব অন্যের জন্য নিঃস্বার্থভাবে বিলিয়ে দেওয়ার মধ্যেই নিহিত।`,
      sections: {
        create: [
          {
            orderIndex: 0,
            englishText: "Once upon a time, at the edge of a quiet village in Bengal, stood an ancient banyan tree.",
            banglaPronunciation: "ওয়ান্স আপন আ টাইম, অ্যাট দ্য এজ অফ আ কোয়াইট ভিলেজ ইন বেঙ্গল, স্টুড অ্যান অ্যানশেন্ট ব্যানিয়ান ট্রি।",
            bengaliText: "একদা বাংলার এক শান্ত গ্রামের প্রান্তে একটি প্রাচীন বটগাছ দাঁড়িয়ে ছিল।",
          },
          {
            orderIndex: 1,
            englishText: "The villagers called it the Whispering Tree because the gentle breeze made its leaves rustle like quiet voices.",
            banglaPronunciation: "দ্য ভিলেজার্স কল্ড ইট দ্য হুইসপারিং ট্রি বিকজ দ্য জেন্টল ব্রিজ মেইড ইটস লিভস রাসেল লাইক কোয়াইট ভয়েসেস।",
            bengaliText: "গ্রামবাসীরা এটিকে ফিসফিস করা গাছ বলত কারণ মৃদু বাতাসে এর পাতাগুলো শান্ত কণ্ঠের মতো মর্মর শব্দ করত।",
          },
          {
            orderIndex: 2,
            englishText: "Every afternoon, tired farmers and playful children would gather beneath its vast branches.",
            banglaPronunciation: "এভরি আফটারনুন, টায়ার্ড ফারমার্স অ্যান্ড প্লেফুল চিলড্রেন উড গ্যাদার বিনিথ ইটস ভাস্ট ব্রাঞ্চেস।",
            bengaliText: "প্রতি বিকেলে, ক্লান্ত কৃষক এবং চঞ্চল শিশুরা এর সুবিশাল ডালপালার নিচে জড়ো হতো।",
          },
          {
            orderIndex: 3,
            englishText: "The tree gave everyone cool shade and sheltered countless birds in its dense leaves. It asked for nothing in return.",
            banglaPronunciation: "দ্য ট্রি গেইভ এভরিওয়ান কুল শেইড অ্যান্ড শেল্টার্ড কাউন্টলেস বার্ডস ইন ইটস ডেন্স লিভস। ইট আস্কড ফর নাথিং ইন রিটার্ন।",
            bengaliText: "গাছটি সবাইকে শীতল ছায়া দিত এবং ঘন পাতায় অসংখ্য পাখির আশ্রয় তৈরি করত। বিনিময়ে এটি কিছুই চাইত না।",
          },
          {
            orderIndex: 4,
            englishText: "One hot summer day, a weary wanderer collapsed near the roots of the tree.",
            banglaPronunciation: "ওয়ান হট সামার ডেই, আ উইরি ওয়ান্ডারার কোল্যাপ্সড নিয়ার দ্য রুটস অফ দ্য ট্রি।",
            bengaliText: "এক তপ্ত গ্রীষ্মের দিনে, একজন পরিশ্রান্ত পথিক গাছের শিকড়ের কাছে লুটিয়ে পড়ল।",
          },
          {
            orderIndex: 5,
            englishText: "The tree offered its cooling breeze and whispered comforting sounds.",
            banglaPronunciation: "দ্য ট্রি অফার্ড ইটস কুলিং ব্রিজ অ্যান্ড হুইসপার্ড কম্ফর্টিং সাউন্ডস।",
            bengaliText: "গাছটি তার শীতল বাতাস উপহার দিল এবং সান্ত্বনাময় ধ্বনি ফিসফিস করে জানাল।",
          },
          {
            orderIndex: 6,
            englishText: "The traveler drank sweet water from a nearby pond and rested peacefully. He realized that true greatness lies in giving selflessly to others.",
            banglaPronunciation: "দ্য ট্রাভেলার ড্র্যাংক সুইট ওয়াটার ফ্রম আ নিয়ারবাই পন্ড অ্যান্ড রেস্টেড পিসফুলি। হি রিয়ালাইজড দ্যাট ট্রু গ্রেইটনেস লাইজ ইন গিভিং সেলফলেসলি টু আদার্স।",
            bengaliText: "পথিক কাছের একটি পুকুর থেকে মিষ্টি জল পান করল এবং শান্তিতে বিশ্রাম নিল। সে বুঝতে পারল যে প্রকৃত মহত্ত্ব অন্যের জন্য নিঃস্বার্থভাবে বিলিয়ে দেওয়ার মধ্যেই নিহিত।",
          },
        ],
      },
      vocabularies: {
        create: [
          {
            word: "ancient",
            cleanWord: "ancient",
            phonetic: "/ˈeɪn.ʃənt/",
            banglaPronunciation: "অ্যানশেন্ট",
            partOfSpeech: "adjective",
            bengaliMeaning: "প্রাচীন / বহু পুরোনো",
            englishDefinition: "Belonging to the very distant past and no longer in existence or very old.",
            exampleSentenceEn: "An ancient banyan tree stood at the edge of the village.",
            exampleSentenceBn: "গ্রামের প্রান্তে একটি প্রাচীন বটগাছ দাঁড়িয়ে ছিল।",
          },
          {
            word: "rustle",
            cleanWord: "rustle",
            phonetic: "/ˈrʌs.əl/",
            banglaPronunciation: "রাসেল",
            partOfSpeech: "verb",
            bengaliMeaning: "মর্মর শব্দ করা / খসখস শব্দ",
            englishDefinition: "Make a soft, muffled crackling sound like dry leaves moving.",
            exampleSentenceEn: "The gentle breeze made its leaves rustle like quiet voices.",
            exampleSentenceBn: "মৃদু বাতাস এর পাতায় শান্ত কণ্ঠের মতো মর্মর শব্দ তৈরি করল।",
          },
          {
            word: "shelter",
            cleanWord: "shelter",
            phonetic: "/ˈʃel.tər/",
            banglaPronunciation: "শেল্টার",
            partOfSpeech: "verb",
            bengaliMeaning: "আশ্রয় দেওয়া / রক্ষা করা",
            englishDefinition: "Protect or shield from bad weather, danger, or attack.",
            exampleSentenceEn: "The tree sheltered countless birds in its dense leaves.",
            exampleSentenceBn: "গাছটি তার ঘন পাতায় অসংখ্য পাখিকে আশ্রয় দিত।",
          },
          {
            word: "wanderer",
            cleanWord: "wanderer",
            phonetic: "/ˈwɒn.dər.ər/",
            banglaPronunciation: "ওয়ান্ডারার",
            partOfSpeech: "noun",
            bengaliMeaning: "পথিক / ভবঘুরে",
            englishDefinition: "A person who travels aimlessly from place to place.",
            exampleSentenceEn: "A weary wanderer collapsed near the roots of the tree.",
            exampleSentenceBn: "একজন পরিশ্রান্ত পথিক গাছের শিকড়ের কাছে লুটিয়ে পড়ল।",
          },
          {
            word: "selflessly",
            cleanWord: "selflessly",
            phonetic: "/ˈself.ləs.li/",
            banglaPronunciation: "সেলফলেসলি",
            partOfSpeech: "adverb",
            bengaliMeaning: "নিঃস্বার্থভাবে",
            englishDefinition: "With more concern for others than for oneself.",
            exampleSentenceEn: "He realized that true greatness lies in giving selflessly.",
            exampleSentenceBn: "সে উপলব্ধি করল প্রকৃত মহত্ত্ব নিঃস্বার্থভাবে দান করার মাঝেই থাকে।",
          },
        ],
      },
    },
  });

  // Passage 2: The Wonders of the Sundarbans (Intermediate)
  const passage2 = await prisma.passage.create({
    data: {
      slug: "wonders-of-the-sundarbans",
      titleEn: "The Wonders of the Sundarbans",
      titleBn: "সুন্দরবনের অপার বিস্ময়",
      category: "Nature & Ecology",
      difficulty: DifficultyLevel.INTERMEDIATE,
      readingTimeMinutes: 4,
      summaryEn: "Explore the extraordinary biodiversity, tidal rivers, and Royal Bengal Tigers inhabiting the world's largest mangrove forest.",
      summaryBn: "বিশ্বের বৃহত্তম ম্যানগ্রোভ বন সুন্দরবনের অসাধারণ জীববৈচিত্র্য, জোয়ার-ভাটার নদী ও রয়েল বেঙ্গল টাইগার সম্পর্কে জানুন।",
      englishContent: `The Sundarbans is the world's largest contiguous mangrove forest, stretching gracefully across southern Bangladesh and eastern India.

This unique ecosystem thrives where sweet freshwater rivers meet the salty waves of the Bay of Bengal.

Twice every day, high ocean tides submerge large portions of the forest.

The mangrove trees, known as Sundari, have evolved specialized roots called pneumatophores that breathe above the muddy water.

This enchanting wilderness is the proud home of the iconic Royal Bengal Tiger, spotted deer, and rare aquatic species like the Irrawaddy dolphin.

Protecting this green shield is essential for preserving global biodiversity and shielding coastal communities from ferocious cyclones.`,
      bengaliContent: `সুন্দরবন হলো পৃথিবীর বৃহত্তম অবিচ্ছিন্ন ম্যানগ্রোভ বন, যা দক্ষিণ বাংলাদেশ এবং পূর্ব ভারতের বুক জুড়ে অপরূপভাবে বিস্তৃত।

এই অনন্য বাস্তুতন্ত্র সেখানে গড়ে উঠেছে যেখানে মিষ্টি নদীর পানি বঙ্গোপসাগরের নোনা ঢেউয়ের সাথে মেশে।

প্রতিদিন দুবার, সমুদ্রের উচ্চ জোয়ার বনের বিরাট অংশ প্লাবিত করে।

সুন্দরী গাছসহ অন্যান্য ম্যানগ্রোভ উদ্ভিদ এমন বিশেষ শিকড় তৈরি করেছে যাদের নিউমাটোফোর বা শ্বাসমূল বলা হয়, যা কর্দমাক্ত পানির উপরে শ্বাস নেয়।

এই মায়াবী বনাঞ্চল বিশ্ববিখ্যাত রয়েল বেঙ্গল টাইগার, চিত্রা হরিণ এবং ইরাবতী ডলফিনের মতো বিরল জলজ প্রাণীর গর্বিত আবাস।

বৈশ্বিক জীববৈচিত্র্য রক্ষা করতে এবং উপকূলীয় জনপদকে ভয়াল ঘূর্ণিঝড় থেকে রক্ষা করার জন্য এই সবুজ বর্মটি টিকিয়ে রাখা অপরিহার্য।`,
      sections: {
        create: [
          {
            orderIndex: 0,
            englishText: "The Sundarbans is the world's largest contiguous mangrove forest, stretching gracefully across southern Bangladesh and eastern India.",
            banglaPronunciation: "দ্য সুন্দরবানস ইজ দ্য ওয়ার্ল্ডস লার্জেস্ট কনটিগুয়াস ম্যানগ্রোভ ফরেস্ট, স্ট্রেচিং গ্রেইসফুলি অ্যাক্রস সাউদার্ন বাংলাদেশ অ্যান্ড ইস্টার্ন ইন্ডিয়া।",
            bengaliText: "সুন্দরবন হলো পৃথিবীর বৃহত্তম অবিচ্ছিন্ন ম্যানগ্রোভ বন, যা দক্ষিণ বাংলাদেশ এবং পূর্ব ভারতের বুক জুড়ে অপরূপভাবে বিস্তৃত।",
          },
          {
            orderIndex: 1,
            englishText: "This unique ecosystem thrives where sweet freshwater rivers meet the salty waves of the Bay of Bengal.",
            banglaPronunciation: "দিস ইউনিক ইকোসিস্টেম থ্রাইভস হোয়্যার সুইট ফ্রেশওয়াটার রিভার্স মিট দ্য সল্টি ওয়েভস অফ দ্য বে অফ বেঙ্গল।",
            bengaliText: "এই অনন্য বাস্তুতন্ত্র সেখানে গড়ে উঠেছে যেখানে মিষ্টি নদীর পানি বঙ্গোপসাগরের নোনা ঢেউয়ের সাথে মেশে।",
          },
          {
            orderIndex: 2,
            englishText: "Twice every day, high ocean tides submerge large portions of the forest.",
            banglaPronunciation: "টোয়াইস এভরি ডেই, হাই ওশান টাইডস সাবমার্জ লার্জ পোরশনস অফ দ্য ফরেস্ট।",
            bengaliText: "প্রতিদিন দুবার, সমুদ্রের উচ্চ জোয়ার বনের বিরাট অংশ প্লাবিত করে।",
          },
          {
            orderIndex: 3,
            englishText: "The mangrove trees, known as Sundari, have evolved specialized roots called pneumatophores that breathe above the muddy water.",
            banglaPronunciation: "দ্য ম্যানগ্রোভ ট্রিজ, নোন অ্যাজ সুন্দরী, হ্যাভ ইভলভড স্পেশালাইজড রুটস কল্ড নিউমাটোফোরস দ্যাট ব্রিথ অ্যাবাভ দ্য মাডি ওয়াটার।",
            bengaliText: "সুন্দরী গাছসহ অন্যান্য ম্যানগ্রোভ উদ্ভিদ এমন বিশেষ শিকড় তৈরি করেছে যাদের নিউমাটোফোর বা শ্বাসমূল বলা হয়, যা কর্দমাক্ত পানির উপরে শ্বাস নেয়।",
          },
          {
            orderIndex: 4,
            englishText: "This enchanting wilderness is the proud home of the iconic Royal Bengal Tiger, spotted deer, and rare aquatic species like the Irrawaddy dolphin.",
            banglaPronunciation: "দিস এনচ্যান্টিং ওয়াইল্ডারনেস ইজ দ্য প্রাউড হোম অফ দি আইকনিক রয়েল বেঙ্গল টাইগার, স্পটেড ডিয়ার, অ্যান্ড রেয়ার অ্যাকোয়াটিক স্পিসিস লাইক দি ইরাবতী ডলফিন।",
            bengaliText: "এই মায়াবী বনাঞ্চল বিশ্ববিখ্যাত রয়েল বেঙ্গল টাইগার, চিত্রা হরিণ এবং ইরাবতী ডলফিনের মতো বিরল জলজ প্রাণীর গর্বিত আবাস।",
          },
          {
            orderIndex: 5,
            englishText: "Protecting this green shield is essential for preserving global biodiversity and shielding coastal communities from ferocious cyclones.",
            banglaPronunciation: "প্রোটেক্টিং দিস গ্রিন শিল্ড ইজ এসেনশিয়াল ফর প্রিজারভিং গ্লোবাল বায়োডাইভারসিটি অ্যান্ড শিল্ডিং কোস্টাল কমিউনিটিস ফ্রম ফেরোশাস সাইক্লোনস।",
            bengaliText: "বৈশ্বিক জীববৈচিত্র্য রক্ষা করতে এবং উপকূলীয় জনপদকে ভয়াল ঘূর্ণিঝড় থেকে রক্ষা করার জন্য এই সবুজ বর্মটি টিকিয়ে রাখা অপরিহার্য।",
          },
        ],
      },
      vocabularies: {
        create: [
          {
            word: "contiguous",
            cleanWord: "contiguous",
            phonetic: "/kənˈtɪɡ.ju.əs/",
            banglaPronunciation: "কনটিগুয়াস",
            partOfSpeech: "adjective",
            bengaliMeaning: "অবিচ্ছিন্ন / সংলগ্ন",
            englishDefinition: "Sharing a common border; touching or unbroken.",
            exampleSentenceEn: "The Sundarbans is the world's largest contiguous mangrove forest.",
            exampleSentenceBn: "সুন্দরবন হলো বিশ্বের বৃহত্তম অবিচ্ছিন্ন ম্যানগ্রোভ বন।",
          },
          {
            word: "ecosystem",
            cleanWord: "ecosystem",
            phonetic: "/ˈiː.kəʊˌsɪs.təm/",
            banglaPronunciation: "ইকোসিস্টেম",
            partOfSpeech: "noun",
            bengaliMeaning: "বাস্তুতন্ত্র / পরিবেশ ব্যবস্থা",
            englishDefinition: "A biological community of interacting organisms.",
            exampleSentenceEn: "This unique ecosystem thrives where sweet freshwater rivers meet the ocean.",
            exampleSentenceBn: "এই অনন্য বাস্তুতন্ত্র সেখানেই বিকশিত হয় যেখানে মিষ্টি নদীর পানি সাগরে মেলে।",
          },
          {
            word: "submerge",
            cleanWord: "submerge",
            phonetic: "/səbˈmɜːdʒ/",
            banglaPronunciation: "সাবমার্জ",
            partOfSpeech: "verb",
            bengaliMeaning: "নিমজ্জিত করা / ডুবিয়ে দেওয়া",
            englishDefinition: "Cause to be under water; completely cover with water.",
            exampleSentenceEn: "High ocean tides submerge large portions of the forest.",
            exampleSentenceBn: "উচ্চ জোয়ার বনের বিশাল অংশ জলমগ্ন করে।",
          },
          {
            word: "biodiversity",
            cleanWord: "biodiversity",
            phonetic: "/ˌbaɪ.əʊ.daɪˈvɜː.sə.ti/",
            banglaPronunciation: "বায়োডাইভারসিটি",
            partOfSpeech: "noun",
            bengaliMeaning: "জীববৈচিত্র্য",
            englishDefinition: "The variety of plant and animal life in a particular habitat.",
            exampleSentenceEn: "Protecting this green shield is essential for preserving global biodiversity.",
            exampleSentenceBn: "বৈশ্বিক জীববৈচিত্র্য সংরক্ষণে এই সবুজ ঢাল রক্ষা করা অপরিহার্য।",
          },
          {
            word: "ferocious",
            cleanWord: "ferocious",
            phonetic: "/fəˈrəʊ.ʃəs/",
            banglaPronunciation: "ফেরোশাস",
            partOfSpeech: "adjective",
            bengaliMeaning: "ভয়ংকর / প্রবল / হিংস্র",
            englishDefinition: "Savagely fierce, cruel, or violently intense.",
            exampleSentenceEn: "It shields coastal communities from ferocious cyclones.",
            exampleSentenceBn: "এটি উপকূলের মানুষদের ভয়াল সাইক্লোন থেকে সুরক্ষা দেয়।",
          },
        ],
      },
    },
  });

  console.log("Database seeded with pronunciation data successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
