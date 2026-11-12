import { PrismaClient, DifficultyLevel } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding bilingual reading education data into Neon PostgreSQL...");

  // Clean existing seed data if any
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
      englishContent: `Once upon a time, at the edge of a quiet village in Bengal, stood an ancient banyan tree. The villagers called it the Whispering Tree because the gentle breeze made its leaves rustle like quiet voices.

Every afternoon, tired farmers and playful children would gather beneath its vast branches. The tree gave everyone cool shade and sheltered countless birds in its dense leaves. It asked for nothing in return.

One hot summer day, a weary wanderer collapsed near the roots of the tree. The tree offered its cooling breeze and whispered comforting sounds. The traveler drank sweet water from a nearby pond and rested peacefully. He realized that true greatness lies in giving selflessly to others.`,
      bengaliContent: `একদা বাংলার এক শান্ত গ্রামের প্রান্তে একটি প্রাচীন বটগাছ দাঁড়িয়ে ছিল। গ্রামবাসীরা এটিকে ফিসফিস করা গাছ বলত কারণ মৃদু বাতাসে এর পাতাগুলো শান্ত কণ্ঠের মতো মর্মর শব্দ করত।

প্রতি বিকেলে, ক্লান্ত কৃষক এবং চঞ্চল শিশুরা এর সুবিশাল ডালপালার নিচে জড়ো হতো। গাছটি সবাইকে শীতল ছায়া দিত এবং ঘন পাতায় অসংখ্য পাখির আশ্রয় তৈরি করত। বিনিময়ে এটি কিছুই চাইত না।

এক তপ্ত গ্রীষ্মের দিনে, একজন পরিশ্রান্ত পথিক গাছের শিকড়ের কাছে লুটিয়ে পড়ল। গাছটি তার শীতল বাতাস উপহার দিল এবং সান্ত্বনাময় ধ্বনি ফিসফিস করে জানাল। পথিক কাছের একটি পুকুর থেকে মিষ্টি জল পান করল এবং শান্তিতে বিশ্রাম নিল। সে বুঝতে পারল যে প্রকৃত মহত্ত্ব অন্যের জন্য নিঃস্বার্থভাবে বিলিয়ে দেওয়ার মধ্যেই নিহিত।`,
      sections: {
        create: [
          {
            orderIndex: 0,
            englishText: "Once upon a time, at the edge of a quiet village in Bengal, stood an ancient banyan tree.",
            bengaliText: "একদা বাংলার এক শান্ত গ্রামের প্রান্তে একটি প্রাচীন বটগাছ দাঁড়িয়ে ছিল।",
          },
          {
            orderIndex: 1,
            englishText: "The villagers called it the Whispering Tree because the gentle breeze made its leaves rustle like quiet voices.",
            bengaliText: "গ্রামবাসীরা এটিকে ফিসফিস করা গাছ বলত কারণ মৃদু বাতাসে এর পাতাগুলো শান্ত কণ্ঠের মতো মর্মর শব্দ করত।",
          },
          {
            orderIndex: 2,
            englishText: "Every afternoon, tired farmers and playful children would gather beneath its vast branches.",
            bengaliText: "প্রতি বিকেলে, ক্লান্ত কৃষক এবং চঞ্চল শিশুরা এর সুবিশাল ডালপালার নিচে জড়ো হতো।",
          },
          {
            orderIndex: 3,
            englishText: "The tree gave everyone cool shade and sheltered countless birds in its dense leaves. It asked for nothing in return.",
            bengaliText: "গাছটি সবাইকে শীতল ছায়া দিত এবং ঘন পাতায় অসংখ্য পাখির আশ্রয় তৈরি করত। বিনিময়ে এটি কিছুই চাইত না।",
          },
          {
            orderIndex: 4,
            englishText: "One hot summer day, a weary wanderer collapsed near the roots of the tree.",
            bengaliText: "এক তপ্ত গ্রীষ্মের দিনে, একজন পরিশ্রান্ত পথিক গাছের শিকড়ের কাছে লুটিয়ে পড়ল।",
          },
          {
            orderIndex: 5,
            englishText: "The tree offered its cooling breeze and whispered comforting sounds.",
            bengaliText: "গাছটি তার শীতল বাতাস উপহার দিল এবং সান্ত্বনাময় ধ্বনি ফিসফিস করে জানাল।",
          },
          {
            orderIndex: 6,
            englishText: "The traveler drank sweet water from a nearby pond and rested peacefully. He realized that true greatness lies in giving selflessly to others.",
            bengaliText: "পথিক কাছের একটি পুকুর থেকে মিষ্টি জল পান করল এবং শান্তিতে বিশ্রাম নিল। সে বুঝতে পারল যে প্রকৃত মহত্ত্ব অন্যের জন্য নিঃস্বার্থভাবে বিলিয়ে দেওয়ার মধ্যেই নিহিত।",
          },
        ],
      },
      vocabularies: {
        create: [
          {
            word: "ancient",
            phonetic: "/ˈeɪn.ʃənt/",
            partOfSpeech: "adjective",
            bengaliMeaning: "প্রাচীন / অনেক পুরোনো",
            englishDefinition: "Belonging to the very distant past and no longer in existence or very old.",
            exampleSentenceEn: "An ancient banyan tree stood at the edge of the village.",
            exampleSentenceBn: "গ্রামের প্রান্তে একটি প্রাচীন বটগাছ দাঁড়িয়ে ছিল।",
          },
          {
            word: "rustle",
            phonetic: "/ˈrʌs.əl/",
            partOfSpeech: "verb",
            bengaliMeaning: "মর্মর শব্দ করা / খসখস শব্দ",
            englishDefinition: "Make a soft, muffled crackling sound like dry leaves moving.",
            exampleSentenceEn: "The gentle breeze made its leaves rustle like quiet voices.",
            exampleSentenceBn: "মৃদু বাতাস এর পাতায় শান্ত কণ্ঠের মতো মর্মর শব্দ তৈরি করল।",
          },
          {
            word: "shelter",
            phonetic: "/ˈʃel.tər/",
            partOfSpeech: "verb",
            bengaliMeaning: "আশ্রয় দেওয়া / রক্ষা করা",
            englishDefinition: "Protect or shield from bad weather, danger, or attack.",
            exampleSentenceEn: "The tree sheltered countless birds in its dense leaves.",
            exampleSentenceBn: "গাছটি তার ঘন পাতায় অসংখ্য পাখিকে আশ্রয় দিত।",
          },
          {
            word: "wanderer",
            phonetic: "/ˈwɒn.dər.ər/",
            partOfSpeech: "noun",
            bengaliMeaning: "পথিক / ভবঘুরে",
            englishDefinition: "A person who travels aimlessly from place to place.",
            exampleSentenceEn: "A weary wanderer collapsed near the roots of the tree.",
            exampleSentenceBn: "একজন পরিশ্রান্ত পথিক গাছের শিকড়ের কাছে লুটিয়ে পড়ল।",
          },
          {
            word: "selflessly",
            phonetic: "/ˈself.ləs.li/",
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
      englishContent: `The Sundarbans is the world's largest contiguous mangrove forest, stretching gracefully across southern Bangladesh and eastern India. This unique ecosystem thrives where sweet freshwater rivers meet the salty waves of the Bay of Bengal.

Twice every day, high ocean tides submerge large portions of the forest. The mangrove trees, known as Sundari, have evolved specialized roots called pneumatophores that breathe above the muddy water.

This enchanting wilderness is the proud home of the iconic Royal Bengal Tiger, spotted deer, and rare aquatic species like the Irrawaddy dolphin. Protecting this green shield is essential for preserving global biodiversity and shielding coastal communities from ferocious cyclones.`,
      bengaliContent: `সুন্দরবন হলো পৃথিবীর বৃহত্তম অবিচ্ছিন্ন ম্যানগ্রোভ বন, যা দক্ষিণ বাংলাদেশ এবং পূর্ব ভারতের বুক জুড়ে অপরূপভাবে বিস্তৃত। এই অনন্য বাস্তুতন্ত্র সেখানে গড়ে উঠেছে যেখানে মিষ্টি নদীর পানি বঙ্গোপসাগরের নোনা ঢেউয়ের সাথে মেশে।

প্রতিদিন দুবার, সমুদ্রের উচ্চ জোয়ার বনের বিরাট অংশ প্লাবিত করে। সুন্দরী গাছসহ অন্যান্য ম্যানগ্রোভ উদ্ভিদ এমন বিশেষ শিকড় তৈরি করেছে যাদের নিউমাটোফোর বা শ্বাসমূল বলা হয়, যা কর্দমাক্ত পানির উপরে শ্বাস নেয়।

এই মায়াবী বনাঞ্চল বিশ্ববিখ্যাত রয়েল বেঙ্গল টাইগার, চিত্রা হরিণ এবং ইরাবতী ডলফিনের মতো বিরল জলজ প্রাণীর গর্বিত আবাস। বৈশ্বিক জীববৈচিত্র্য রক্ষা করতে এবং উপকূলীয় জনপদকে ভয়াল ঘূর্ণিঝড় থেকে রক্ষা করার জন্য এই সবুজ বর্মটি টিকিয়ে রাখা অপরিহার্য।`,
      sections: {
        create: [
          {
            orderIndex: 0,
            englishText: "The Sundarbans is the world's largest contiguous mangrove forest, stretching gracefully across southern Bangladesh and eastern India.",
            bengaliText: "সুন্দরবন হলো পৃথিবীর বৃহত্তম অবিচ্ছিন্ন ম্যানগ্রোভ বন, যা দক্ষিণ বাংলাদেশ এবং পূর্ব ভারতের বুক জুড়ে অপরূপভাবে বিস্তৃত।",
          },
          {
            orderIndex: 1,
            englishText: "This unique ecosystem thrives where sweet freshwater rivers meet the salty waves of the Bay of Bengal.",
            bengaliText: "এই অনন্য বাস্তুতন্ত্র সেখানে গড়ে উঠেছে যেখানে মিষ্টি নদীর পানি বঙ্গোপসাগরের নোনা ঢেউয়ের সাথে মেশে।",
          },
          {
            orderIndex: 2,
            englishText: "Twice every day, high ocean tides submerge large portions of the forest.",
            bengaliText: "প্রতিদিন দুবার, সমুদ্রের উচ্চ জোয়ার বনের বিরাট অংশ প্লাবিত করে।",
          },
          {
            orderIndex: 3,
            englishText: "The mangrove trees, known as Sundari, have evolved specialized roots called pneumatophores that breathe above the muddy water.",
            bengaliText: "সুন্দরী গাছসহ অন্যান্য ম্যানগ্রোভ উদ্ভিদ এমন বিশেষ শিকড় তৈরি করেছে যাদের নিউমাটোফোর বা শ্বাসমূল বলা হয়, যা কর্দমাক্ত পানির উপরে শ্বাস নেয়।",
          },
          {
            orderIndex: 4,
            englishText: "This enchanting wilderness is the proud home of the iconic Royal Bengal Tiger, spotted deer, and rare aquatic species like the Irrawaddy dolphin.",
            bengaliText: "এই মায়াবী বনাঞ্চল বিশ্ববিখ্যাত রয়েল বেঙ্গল টাইগার, চিত্রা হরিণ এবং ইরাবতী ডলফিনের মতো বিরল জলজ প্রাণীর গর্বিত আবাস।",
          },
          {
            orderIndex: 5,
            englishText: "Protecting this green shield is essential for preserving global biodiversity and shielding coastal communities from ferocious cyclones.",
            bengaliText: "বৈশ্বিক জীববৈচিত্র্য রক্ষা করতে এবং উপকূলীয় জনপদকে ভয়াল ঘূর্ণিঝড় থেকে রক্ষা করার জন্য এই সবুজ বর্মটি টিকিয়ে রাখা অপরিহার্য।",
          },
        ],
      },
      vocabularies: {
        create: [
          {
            word: "contiguous",
            phonetic: "/kənˈtɪɡ.ju.əs/",
            partOfSpeech: "adjective",
            bengaliMeaning: "অবিচ্ছিন্ন / সংলগ্ন",
            englishDefinition: "Sharing a common border; touching or unbroken.",
            exampleSentenceEn: "The Sundarbans is the world's largest contiguous mangrove forest.",
            exampleSentenceBn: "সুন্দরবন হলো বিশ্বের বৃহত্তম অবিচ্ছিন্ন ম্যানগ্রোভ বন।",
          },
          {
            word: "ecosystem",
            phonetic: "/ˈiː.kəʊˌsɪs.təm/",
            partOfSpeech: "noun",
            bengaliMeaning: "বাস্তুতন্ত্র / প্রাকৃতিক পরিবেশ ব্যবস্থা",
            englishDefinition: "A biological community of interacting organisms and their physical environment.",
            exampleSentenceEn: "This unique ecosystem thrives where sweet freshwater rivers meet the ocean.",
            exampleSentenceBn: "এই অনন্য বাস্তুতন্ত্র সেখানেই বিকশিত হয় যেখানে মিষ্টি নদীর পানি সাগরে মেলে।",
          },
          {
            word: "submerge",
            phonetic: "/səbˈmɜːdʒ/",
            partOfSpeech: "verb",
            bengaliMeaning: "নিমজ্জিত করা / ডুবিয়ে দেওয়া",
            englishDefinition: "Cause to be under water; completely cover with water.",
            exampleSentenceEn: "High ocean tides submerge large portions of the forest.",
            exampleSentenceBn: "উচ্চ জোয়ার বনের বিশাল অংশ জলমগ্ন করে।",
          },
          {
            word: "biodiversity",
            phonetic: "/ˌbaɪ.əʊ.daɪˈvɜː.sə.ti/",
            partOfSpeech: "noun",
            bengaliMeaning: "জীববৈচিত্র্য",
            englishDefinition: "The variety of plant and animal life in a particular habitat.",
            exampleSentenceEn: "Protecting this green shield is essential for preserving global biodiversity.",
            exampleSentenceBn: "বৈশ্বিক জীববৈচিত্র্য সংরক্ষণে এই সবুজ ঢাল রক্ষা করা অপরিহার্য।",
          },
          {
            word: "ferocious",
            phonetic: "/fəˈrəʊ.ʃəs/",
            partOfSpeech: "adjective",
            bengaliMeaning: "ভয়ংকর / হিংস্র / প্রবল",
            englishDefinition: "Savagely fierce, cruel, or violently intense.",
            exampleSentenceEn: "It shields coastal communities from ferocious cyclones.",
            exampleSentenceBn: "এটি উপকূলের মানুষদের ভয়াল সাইক্লোন থেকে সুরক্ষা দেয়।",
          },
        ],
      },
    },
  });

  // Passage 3: The Power of Curiosity (Advanced)
  const passage3 = await prisma.passage.create({
    data: {
      slug: "the-power-of-curiosity",
      titleEn: "The Power of Curiosity in Modern Learning",
      titleBn: "আধুনিক শিক্ষায় কৌতূহলের শক্তি",
      category: "Personal Growth",
      difficulty: DifficultyLevel.ADVANCED,
      readingTimeMinutes: 5,
      summaryEn: "An analytical perspective on how cultivating genuine curiosity stimulates intellect and unlocks lifelong educational success.",
      summaryBn: "কীভাবে আসল কৌতূহল মননকে উজ্জীবিত করে এবং জীবনব্যাপী শিক্ষার পথ উন্মোচন করে তার একটি বিশ্লেষণধর্মী দৃষ্টিভঙ্গি।",
      englishContent: `In an era defined by rapid technological innovation and overflowing information, mere memorization has become obsolete. The true differentiator in modern education is insatiable curiosity—the active desire to investigate the unknown and question conventional assumptions.

When learners approach complex concepts with genuine intrigue, cognitive engagement deepens substantially. Neural pathways light up, turning arduous study sessions into captivating journeys of intellectual discovery.

Furthermore, curious minds develop high emotional resilience. Instead of dreading errors or ambiguous outcomes, they perceive difficulties as valuable clues. Cultivating this inquisitive disposition transforms everyday reading into an empowering catalyst for personal evolution.`,
      bengaliContent: `দ্রুত প্রযুক্তিগত উদ্ভাবন এবং তথ্যের প্রাচুর্যের যুগে কেবল মুখস্থবিদ্যা অকার্যকর হয়ে পড়েছে। আধুনিক শিক্ষার আসল নিয়ামক হলো অতৃপ্ত কৌতূহল—অজানাকে অনুসন্ধান করা এবং প্রচলিত ধারণাকে প্রশ্ন করার ঐকান্তিক আগ্রহ।

শিক্ষার্থীরা যখন কোনো জটিল ধারণার প্রতি আন্তরিক আগ্রহ নিয়ে এগিয়ে যায়, তখন তাদের বোধগত সংযোগ নাটকীয়ভাবে বৃদ্ধি পায়। স্নায়বিক পথগুলো উদ্ভাসিত হয়, যা ক্লান্তিকর পাঠাভ্যাসকে মননশীল আবিষ্কারের রোমাঞ্চকর অভিজ্ঞতায় পরিণত করে।

অধিকন্তু, কৌতূহলী মানুষ গভীর মানসিক সহনশীলতা অর্জন করে। ব্যর্থতা বা অনিশ্চয়তাকে ভয় না পেয়ে তারা বাঁধাকে মূল্যবান ইঙ্গিত হিসেবে গ্রহণ করে। অনুসন্ধিৎসু এই মনোভাব গড়ে তোলার মাধ্যমে প্রাত্যহিক পড়াশোনা ব্যক্তিগত উত্তরণের এক মহাশক্তিধর অনুঘটকে রূপান্তরিত হয়।`,
      sections: {
        create: [
          {
            orderIndex: 0,
            englishText: "In an era defined by rapid technological innovation and overflowing information, mere memorization has become obsolete.",
            bengaliText: "দ্রুত প্রযুক্তিগত উদ্ভাবন এবং তথ্যের প্রাচুর্যের যুগে কেবল মুখস্থবিদ্যা অকার্যকর হয়ে পড়েছে।",
          },
          {
            orderIndex: 1,
            englishText: "The true differentiator in modern education is insatiable curiosity—the active desire to investigate the unknown and question conventional assumptions.",
            bengaliText: "আধুনিক শিক্ষার আসল নিয়ামক হলো অতৃপ্ত কৌতূহল—অজানাকে অনুসন্ধান করা এবং প্রচলিত ধারণাকে প্রশ্ন করার ঐকান্তিক আগ্রহ।",
          },
          {
            orderIndex: 2,
            englishText: "When learners approach complex concepts with genuine intrigue, cognitive engagement deepens substantially.",
            bengaliText: "শিক্ষার্থীরা যখন কোনো জটিল ধারণার প্রতি আন্তরিক আগ্রহ নিয়ে এগিয়ে যায়, তখন তাদের বোধগত সংযোগ নাটকীয়ভাবে বৃদ্ধি পায়।",
          },
          {
            orderIndex: 3,
            englishText: "Neural pathways light up, turning arduous study sessions into captivating journeys of intellectual discovery.",
            bengaliText: "স্নায়বিক পথগুলো উদ্ভাসিত হয়, যা ক্লান্তিকর পাঠাভ্যাসকে মননশীল আবিষ্কারের রোমাঞ্চকর অভিজ্ঞতায় পরিণত করে।",
          },
          {
            orderIndex: 4,
            englishText: "Furthermore, curious minds develop high emotional resilience. Instead of dreading errors or ambiguous outcomes, they perceive difficulties as valuable clues.",
            bengaliText: "অধিকন্তু, কৌতূহলী মানুষ গভীর মানসিক সহনশীলতা অর্জন করে। ব্যর্থতা বা অনিশ্চয়তাকে ভয় না পেয়ে তারা বাঁধাকে মূল্যবান ইঙ্গিত হিসেবে গ্রহণ করে।",
          },
          {
            orderIndex: 5,
            englishText: "Cultivating this inquisitive disposition transforms everyday reading into an empowering catalyst for personal evolution.",
            bengaliText: "অনুসন্ধিৎসু এই মনোভাব গড়ে তোলার মাধ্যমে প্রাত্যহিক পড়াশোনা ব্যক্তিগত উত্তরণের এক মহাশক্তিধর অনুঘটকে রূপান্তরিত হয়।",
          },
        ],
      },
      vocabularies: {
        create: [
          {
            word: "obsolete",
            phonetic: "/ˈɒb.sə.liːt/",
            partOfSpeech: "adjective",
            bengaliMeaning: "অপ্রচলিত / সেকেলে",
            englishDefinition: "No longer produced or used; out of date.",
            exampleSentenceEn: "Mere rote memorization has become obsolete.",
            exampleSentenceBn: "শুধুমাত্র মুখস্থনির্ভর শিক্ষা আজ অপ্রচলিত হয়ে গেছে।",
          },
          {
            word: "insatiable",
            phonetic: "/ɪnˈseɪ.ʃə.bəl/",
            partOfSpeech: "adjective",
            bengaliMeaning: "অতৃপ্ত / যা সহজে পূরণ হয় না",
            englishDefinition: "Impossible to satisfy; always wanting more.",
            exampleSentenceEn: "The true differentiator is insatiable curiosity.",
            exampleSentenceBn: "আসল পরিবর্তন আনে অতৃপ্ত কৌতূহল।",
          },
          {
            word: "arduous",
            phonetic: "/ˈɑː.dʒu.əs/",
            partOfSpeech: "adjective",
            bengaliMeaning: "কঠিন / শ্রমসাধ্য",
            englishDefinition: "Involving or requiring strenuous effort; difficult and tiring.",
            exampleSentenceEn: "It turns arduous study sessions into captivating journeys.",
            exampleSentenceBn: "এটি শ্রমসাধ্য পড়াশোনাকে আকর্ষণীয় এক অভিযানে পরিণত করে।",
          },
          {
            word: "resilience",
            phonetic: "/rɪˈzɪl.jəns/",
            partOfSpeech: "noun",
            bengaliMeaning: "সহনশীলতা / প্রতিকূলতা কাটিয়ে ওঠার ক্ষমতা",
            englishDefinition: "The capacity to recover quickly from difficulties; toughness.",
            exampleSentenceEn: "Curious minds develop profound emotional resilience.",
            exampleSentenceBn: "কৌতূহলী মন গভীর মানসিক সহনশীলতা অর্জন করে।",
          },
          {
            word: "inquisitive",
            phonetic: "/ɪnˈkwɪz.ə.tɪv/",
            partOfSpeech: "adjective",
            bengaliMeaning: "অনুসন্ধিৎসু / কৌতুহলী",
            englishDefinition: "Curious or inquiring; eager to investigate and learn.",
            exampleSentenceEn: "Cultivating this inquisitive disposition transforms your reading.",
            exampleSentenceBn: "এই অনুসন্ধিৎসু মনোভাব গড়ে তোলা আপনার পাঠকে রূপান্তরিত করে।",
          },
        ],
      },
    },
  });

  console.log("Database seeded successfully!");
  console.log(`- Created Passage 1: ${passage1.titleEn} (${passage1.slug})`);
  console.log(`- Created Passage 2: ${passage2.titleEn} (${passage2.slug})`);
  console.log(`- Created Passage 3: ${passage3.titleEn} (${passage3.slug})`);
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
