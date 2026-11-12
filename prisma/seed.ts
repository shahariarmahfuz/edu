import { PrismaClient, DifficultyLevel } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding bilingual reading education data into Neon PostgreSQL...");

  await prisma.vocabulary.deleteMany();
  await prisma.passageSection.deleteMany();
  await prisma.passage.deleteMany();

  // Passage 1: The Whispering Banyan Tree (Beginner)
  await prisma.passage.create({
    data: {
      slug: "the-whispering-banyan-tree",
      titleEn: "The Whispering Banyan Tree",
      titleBn: "ফিসফিস করা বটগাছ",
      category: "Moral Story",
      difficulty: DifficultyLevel.BEGINNER,
      readingTimeMinutes: 3,
      summaryEn:
        "A story about a grand banyan tree in a rural village that teaches the power of kindness and quiet resilience.",
      summaryBn:
        "একটি গ্রামীণ গ্রামের এক বিশাল বটগাছের গল্প যা দয়া এবং নীরব সহনশীলতার শক্তি শেখায়।",
      englishContent: `Once upon a time, at the edge of a quiet village in Bengal, stood an ancient banyan tree. The villagers called it the Whispering Tree because the gentle breeze made its leaves rustle like quiet voices. Every afternoon, tired farmers and playful children would gather beneath its vast branches. The tree gave everyone cool shade and sheltered countless birds in its dense leaves. It asked for nothing in return.

One hot summer day, a weary wanderer collapsed near the roots of the tree. The tree offered its cooling breeze and whispered comforting sounds. The traveler drank sweet water from a nearby pond and rested peacefully. He realized that true greatness lies in giving selflessly to others.`,
      bengaliContent: `একদা বাংলার এক শান্ত গ্রামের প্রান্তে একটি প্রাচীন বটগাছ দাঁড়িয়ে ছিল। গ্রামবাসীরা এটিকে ফিসফিস করা গাছ বলত কারণ মৃদু বাতাসে এর পাতাগুলো শান্ত কণ্ঠের মতো মর্মর শব্দ করত। প্রতি বিকেলে, ক্লান্ত কৃষক এবং চঞ্চল শিশুরা এর সুবিশাল ডালপালার নিচে জড়ো হতো। গাছটি সবাইকে শীতল ছায়া দিত এবং ঘন পাতায় অসংখ্য পাখির আশ্রয় তৈরি করত। বিনিময়ে এটি কিছুই চাইত না।

এক তপ্ত গ্রীষ্মের দিনে, একজন পরিশ্রান্ত পথিক গাছের শিকড়ের কাছে লুটিয়ে পড়ল। গাছটি তার শীতল বাতাস উপহার দিল এবং সান্ত্বনাময় ধ্বনি ফিসফিস করে জানাল। পথিক কাছের একটি পুকুর থেকে মিষ্টি জল পান করল এবং শান্তিতে বিশ্রাম নিল। সে বুঝতে পারল যে প্রকৃত মহত্ত্ব অন্যের জন্য নিঃস্বার্থভাবে বিলিয়ে দেওয়ার মধ্যেই নিহিত।`,
      sections: {
        create: [
          {
            orderIndex: 0,
            englishText:
              "Once upon a time, at the edge of a quiet village in Bengal, stood an ancient banyan tree. The villagers called it the Whispering Tree because the gentle breeze made its leaves rustle like quiet voices. Every afternoon, tired farmers and playful children would gather beneath its vast branches. The tree gave everyone cool shade and sheltered countless birds in its dense leaves. It asked for nothing in return.",
            banglaPronunciation:
              "ওয়ান্স আপন আ টাইম, অ্যাট দ্য এজ অফ আ কোয়াইট ভিলেজ ইন বেঙ্গল, স্টুড অ্যান অ্যানশেন্ট ব্যানিয়ান ট্রি। দ্য ভিলেজার্স কল্ড ইট দ্য হুইসপারিং ট্রি বিকজ দ্য জেন্টল ব্রিজ মেইড ইটস লিভস রাসেল লাইক কোয়াইট ভয়েসেস। এভরি আফটারনুন, টায়ার্ড ফারমার্স অ্যান্ড প্লেফুল চিলড্রেন উড গ্যাদার বিনিথ ইটস ভাস্ট ব্রাঞ্চেস। দ্য ট্রি গেইভ এভরিওয়ান কুল শেইড অ্যান্ড শেল্টার্ড কাউন্টলেস বার্ডস ইন ইটস ডেন্স লিভস। ইট আস্কড ফর নাথিং ইন রিটার্ন।",
            bengaliText:
              "একদা বাংলার এক শান্ত গ্রামের প্রান্তে একটি প্রাচীন বটগাছ দাঁড়িয়ে ছিল। গ্রামবাসীরা এটিকে ফিসফিস করা গাছ বলত কারণ মৃদু বাতাসে এর পাতাগুলো শান্ত কণ্ঠের মতো মর্মর শব্দ করত। প্রতি বিকেলে, ক্লান্ত কৃষক এবং চঞ্চল শিশুরা এর সুবিশাল ডালপালার নিচে জড়ো হতো। গাছটি সবাইকে শীতল ছায়া দিত এবং ঘন পাতায় অসংখ্য পাখির আশ্রয় তৈরি করত। বিনিময়ে এটি কিছুই চাইত না।",
            sentences: [
              {
                en: "Once upon a time, at the edge of a quiet village in Bengal, stood an ancient banyan tree.",
                bnPronounce:
                  "ওয়ান্স আপন আ টাইম, অ্যাট দ্য এজ অফ আ কোয়াইট ভিলেজ ইন বেঙ্গল, স্টুড অ্যান অ্যানশেন্ট ব্যানিয়ান ট্রি।",
                bn: "একদা বাংলার এক শান্ত গ্রামের প্রান্তে একটি প্রাচীন বটগাছ দাঁড়িয়ে ছিল।",
              },
              {
                en: "The villagers called it the Whispering Tree because the gentle breeze made its leaves rustle like quiet voices.",
                bnPronounce:
                  "দ্য ভিলেজার্স কল্ড ইট দ্য হুইসপারিং ট্রি বিকজ দ্য জেন্টল ব্রিজ মেইড ইটস লিভস রাসেল লাইক কোয়াইট ভয়েসেস।",
                bn: "গ্রামবাসীরা এটিকে ফিসফিস করা গাছ বলত কারণ মৃদু বাতাসে এর পাতাগুলো শান্ত কণ্ঠের মতো মর্মর শব্দ করত।",
              },
              {
                en: "Every afternoon, tired farmers and playful children would gather beneath its vast branches.",
                bnPronounce:
                  "এভরি আফটারনুন, টায়ার্ড ফারমার্স অ্যান্ড প্লেফুল চিলড্রেন উড গ্যাদার বিনিথ ইটস ভাস্ট ব্রাঞ্চেস।",
                bn: "প্রতি বিকেলে, ক্লান্ত কৃষক এবং চঞ্চল শিশুরা এর সুবিশাল ডালপালার নিচে জড়ো হতো।",
              },
              {
                en: "The tree gave everyone cool shade and sheltered countless birds in its dense leaves.",
                bnPronounce:
                  "দ্য ট্রি গেইভ এভরিওয়ান কুল শেইড অ্যান্ড শেল্টার্ড কাউন্টলেস বার্ডস ইন ইটস ডেন্স লিভস।",
                bn: "গাছটি সবাইকে শীতল ছায়া দিত এবং ঘন পাতায় অসংখ্য পাখির আশ্রয় তৈরি করত।",
              },
              {
                en: "It asked for nothing in return.",
                bnPronounce: "ইট আস্কড ফর নাথিং ইন রিটার্ন।",
                bn: "বিনিময়ে এটি কিছুই চাইত না।",
              },
            ],
          },
          {
            orderIndex: 1,
            englishText:
              "One hot summer day, a weary wanderer collapsed near the roots of the tree. The tree offered its cooling breeze and whispered comforting sounds. The traveler drank sweet water from a nearby pond and rested peacefully. He realized that true greatness lies in giving selflessly to others.",
            banglaPronunciation:
              "ওয়ান হট সামার ডেই, আ উইরি ওয়ান্ডারার কোল্যাপ্সড নিয়ার দ্য রুটস অফ দ্য ট্রি। দ্য ট্রি অফার্ড ইটস কুলিং ব্রিজ অ্যান্ড হুইসপার্ড কম্ফর্টিং সাউন্ডস। দ্য ট্রাভেলার ড্র্যাংক সুইট ওয়াটার ফ্রম আ নিয়ারবাই পন্ড অ্যান্ড রেস্টেড পিসফুলি। হি রিয়ালাইজড দ্যাট ট্রু গ্রেইটনেস লাইজ ইন গিভিং সেলফলেসলি টু আদার্স।",
            bengaliText:
              "এক তপ্ত গ্রীষ্মের দিনে, একজন পরিশ্রান্ত পথিক গাছের শিকড়ের কাছে লুটিয়ে পড়ল। গাছটি তার শীতল বাতাস উপহার দিল এবং সান্ত্বনাময় ধ্বনি ফিসফিস করে জানাল। পথিক কাছের একটি পুকুর থেকে মিষ্টি জল পান করল এবং শান্তিতে বিশ্রাম নিল। সে বুঝতে পারল যে প্রকৃত মহত্ত্ব অন্যের জন্য নিঃস্বার্থভাবে বিলিয়ে দেওয়ার মধ্যেই নিহিত।",
            sentences: [
              {
                en: "One hot summer day, a weary wanderer collapsed near the roots of the tree.",
                bnPronounce:
                  "ওয়ান হট সামার ডেই, আ উইরি ওয়ান্ডারার কোল্যাপ্সড নিয়ার দ্য রুটস অফ দ্য ট্রি।",
                bn: "এক তপ্ত গ্রীষ্মের দিনে, একজন পরিশ্রান্ত পথিক গাছের শিকড়ের কাছে লুটিয়ে পড়ল।",
              },
              {
                en: "The tree offered its cooling breeze and whispered comforting sounds.",
                bnPronounce:
                  "দ্য ট্রি অফার্ড ইটস কুলিং ব্রিজ অ্যান্ড হুইসপার্ড কম্ফর্টিং সাউন্ডস।",
                bn: "গাছটি তার শীতল বাতাস উপহার দিল এবং সান্ত্বনাময় ধ্বনি ফিসফিস করে জানাল।",
              },
              {
                en: "The traveler drank sweet water from a nearby pond and rested peacefully.",
                bnPronounce:
                  "দ্য ট্রাভেলার ড্র্যাংক সুইট ওয়াটার ফ্রম আ নিয়ারবাই পন্ড অ্যান্ড রেস্টেড পিসফুলি।",
                bn: "পথিক কাছের একটি পুকুর থেকে মিষ্টি জল পান করল এবং শান্তিতে বিশ্রাম নিল।",
              },
              {
                en: "He realized that true greatness lies in giving selflessly to others.",
                bnPronounce:
                  "হি রিয়ালাইজড দ্যাট ট্রু গ্রেইটনেস লাইজ ইন গিভিং সেলফলেসলি টু আদার্স।",
                bn: "সে বুঝতে পারল যে প্রকৃত মহত্ত্ব অন্যের জন্য নিঃস্বার্থভাবে বিলিয়ে দেওয়ার মধ্যেই নিহিত।",
              },
            ],
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
            englishDefinition:
              "Belonging to the very distant past and no longer in existence or very old.",
            exampleSentenceEn:
              "An ancient banyan tree stood at the edge of the village.",
            exampleSentenceBn: "গ্রামের প্রান্তে একটি প্রাচীন বটগাছ দাঁড়িয়ে ছিল।",
          },
          {
            word: "rustle",
            cleanWord: "rustle",
            phonetic: "/ˈrʌs.əl/",
            banglaPronunciation: "রাসেল",
            partOfSpeech: "verb",
            bengaliMeaning: "মর্মর শব্দ করা / খসখস শব্দ",
            englishDefinition:
              "Make a soft, muffled crackling sound like dry leaves moving.",
            exampleSentenceEn:
              "The gentle breeze made its leaves rustle like quiet voices.",
            exampleSentenceBn:
              "মৃদু বাতাস এর পাতায় শান্ত কণ্ঠের মতো মর্মর শব্দ তৈরি করল।",
          },
          {
            word: "shelter",
            cleanWord: "shelter",
            phonetic: "/ˈʃel.tər/",
            banglaPronunciation: "শেল্টার",
            partOfSpeech: "verb",
            bengaliMeaning: "আশ্রয় দেওয়া / রক্ষা করা",
            englishDefinition:
              "Protect or shield from bad weather, danger, or attack.",
            exampleSentenceEn:
              "The tree sheltered countless birds in its dense leaves.",
            exampleSentenceBn:
              "গাছটি তার ঘন পাতায় অসংখ্য পাখিকে আশ্রয় দিত।",
          },
          {
            word: "wanderer",
            cleanWord: "wanderer",
            phonetic: "/ˈwɒn.dər.ər/",
            banglaPronunciation: "ওয়ান্ডারার",
            partOfSpeech: "noun",
            bengaliMeaning: "পথিক / ভবঘুরে",
            englishDefinition:
              "A person who travels aimlessly from place to place.",
            exampleSentenceEn:
              "A weary wanderer collapsed near the roots of the tree.",
            exampleSentenceBn:
              "একজন পরিশ্রান্ত পথিক গাছের শিকড়ের কাছে লুটিয়ে পড়ল।",
          },
          {
            word: "selflessly",
            cleanWord: "selflessly",
            phonetic: "/ˈself.ləs.li/",
            banglaPronunciation: "সেলফলেসলি",
            partOfSpeech: "adverb",
            bengaliMeaning: "নিঃস্বার্থভাবে",
            englishDefinition:
              "With more concern for others than for oneself.",
            exampleSentenceEn:
              "He realized that true greatness lies in giving selflessly.",
            exampleSentenceBn:
              "সে উপলব্ধি করল প্রকৃত মহত্ত্ব নিঃস্বার্থভাবে দান করার মাঝেই থাকে।",
          },
        ],
      },
    },
  });

  // Passage 2: The Wonders of the Sundarbans (Intermediate)
  await prisma.passage.create({
    data: {
      slug: "wonders-of-the-sundarbans",
      titleEn: "The Wonders of the Sundarbans",
      titleBn: "সুন্দরবনের অপার বিস্ময়",
      category: "Nature & Ecology",
      difficulty: DifficultyLevel.INTERMEDIATE,
      readingTimeMinutes: 4,
      summaryEn:
        "Explore the extraordinary biodiversity, tidal rivers, and Royal Bengal Tigers inhabiting the world's largest mangrove forest.",
      summaryBn:
        "বিশ্বের বৃহত্তম ম্যানগ্রোভ বন সুন্দরবনের অসাধারণ জীববৈচিত্র্য, জোয়ার-ভাটার নদী ও রয়েল বেঙ্গল টাইগার সম্পর্কে জানুন।",
      englishContent: `The Sundarbans is the world's largest contiguous mangrove forest, stretching gracefully across southern Bangladesh and eastern India. This unique ecosystem thrives where sweet freshwater rivers meet the salty waves of the Bay of Bengal. Twice every day, high ocean tides submerge large portions of the forest.

The mangrove trees, known as Sundari, have evolved specialized roots called pneumatophores that breathe above the muddy water. This enchanting wilderness is the proud home of the iconic Royal Bengal Tiger, spotted deer, and rare aquatic species like the Irrawaddy dolphin. Protecting this green shield is essential for preserving global biodiversity and shielding coastal communities from ferocious cyclones.`,
      bengaliContent: `সুন্দরবন হলো পৃথিবীর বৃহত্তম অবিচ্ছিন্ন ম্যানগ্রোভ বন, যা দক্ষিণ বাংলাদেশ এবং পূর্ব ভারতের বুক জুড়ে অপরূপভাবে বিস্তৃত। এই অনন্য বাস্তুতন্ত্র সেখানে গড়ে উঠেছে যেখানে মিষ্টি নদীর পানি বঙ্গোপসাগরের নোনা ঢেউয়ের সাথে মেশে। প্রতিদিন দুবার, সমুদ্রের উচ্চ জোয়ার বনের বিরাট অংশ প্লাবিত করে।

সুন্দরী গাছসহ অন্যান্য ম্যানগ্রোভ উদ্ভিদ এমন বিশেষ শিকড় তৈরি করেছে যাদের নিউমাটোফোর বা শ্বাসমূল বলা হয়, যা কর্দমাক্ত পানির উপরে শ্বাস নেয়। এই মায়াবী বনাঞ্চল বিশ্ববিখ্যাত রয়েল বেঙ্গল টাইগার, চিত্রা হরিণ এবং ইরাবতী ডলফিনের মতো বিরল জলজ প্রাণীর গর্বিত আবাস। বৈশ্বিক জীববৈচিত্র্য রক্ষা করতে এবং উপকূলীয় জনপদকে ভয়াল ঘূর্ণিঝড় থেকে রক্ষা করার জন্য এই সবুজ বর্মটি টিকিয়ে রাখা অপরিহার্য।`,
      sections: {
        create: [
          {
            orderIndex: 0,
            englishText:
              "The Sundarbans is the world's largest contiguous mangrove forest, stretching gracefully across southern Bangladesh and eastern India. This unique ecosystem thrives where sweet freshwater rivers meet the salty waves of the Bay of Bengal. Twice every day, high ocean tides submerge large portions of the forest.",
            banglaPronunciation:
              "দ্য সুন্দরবানস ইজ দ্য ওয়ার্ল্ডস লার্জেস্ট কনটিগুয়াস ম্যানগ্রোভ ফরেস্ট, স্ট্রেচিং গ্রেইসফুলি অ্যাক্রস সাউদার্ন বাংলাদেশ অ্যান্ড ইস্টার্ন ইন্ডিয়া। দিস ইউনিক ইকোসিস্টেম থ্রাইভস হোয়্যার সুইট ফ্রেশওয়াটার রিভার্স মিট দ্য সল্টি ওয়েভস অফ দ্য বে অফ বেঙ্গল। টোয়াইস এভরি ডেই, হাই ওশান টাইডস সাবমার্জ লার্জ পোরশনস অফ দ্য ফরেস্ট।",
            bengaliText:
              "সুন্দরবন হলো পৃথিবীর বৃহত্তম অবিচ্ছিন্ন ম্যানগ্রোভ বন, যা দক্ষিণ বাংলাদেশ এবং পূর্ব ভারতের বুক জুড়ে অপরূপভাবে বিস্তৃত। এই অনন্য বাস্তুতন্ত্র সেখানে গড়ে উঠেছে যেখানে মিষ্টি নদীর পানি বঙ্গোপসাগরের নোনা ঢেউয়ের সাথে মেশে। প্রতিদিন দুবার, সমুদ্রের উচ্চ জোয়ার বনের বিরাট অংশ প্লাবিত করে।",
            sentences: [
              {
                en: "The Sundarbans is the world's largest contiguous mangrove forest, stretching gracefully across southern Bangladesh and eastern India.",
                bnPronounce:
                  "দ্য সুন্দরবানস ইজ দ্য ওয়ার্ল্ডস লার্জেস্ট কনটিগুয়াস ম্যানগ্রোভ ফরেস্ট, স্ট্রেচিং গ্রেইসফুলি অ্যাক্রস সাউদার্ন বাংলাদেশ অ্যান্ড ইস্টার্ন ইন্ডিয়া।",
                bn: "সুন্দরবন হলো পৃথিবীর বৃহত্তম অবিচ্ছিন্ন ম্যানগ্রোভ বন, যা দক্ষিণ বাংলাদেশ এবং পূর্ব ভারতের বুক জুড়ে অপরূপভাবে বিস্তৃত।",
              },
              {
                en: "This unique ecosystem thrives where sweet freshwater rivers meet the salty waves of the Bay of Bengal.",
                bnPronounce:
                  "দিস ইউনিক ইকোসিস্টেম থ্রাইভস হোয়্যার সুইট ফ্রেশওয়াটার রিভার্স মিট দ্য সল্টি ওয়েভস অফ দ্য বে অফ বেঙ্গল।",
                bn: "এই অনন্য বাস্তুতন্ত্র সেখানে গড়ে উঠেছে যেখানে মিষ্টি নদীর পানি বঙ্গোপসাগরের নোনা ঢেউয়ের সাথে মেশে।",
              },
              {
                en: "Twice every day, high ocean tides submerge large portions of the forest.",
                bnPronounce:
                  "টোয়াইস এভরি ডেই, হাই ওশান টাইডস সাবমার্জ লার্জ পোরশনস অফ দ্য ফরেস্ট।",
                bn: "প্রতিদিন দুবার, সমুদ্রের উচ্চ জোয়ার বনের বিরাট অংশ প্লাবিত করে।",
              },
            ],
          },
          {
            orderIndex: 1,
            englishText:
              "The mangrove trees, known as Sundari, have evolved specialized roots called pneumatophores that breathe above the muddy water. This enchanting wilderness is the proud home of the iconic Royal Bengal Tiger, spotted deer, and rare aquatic species like the Irrawaddy dolphin. Protecting this green shield is essential for preserving global biodiversity and shielding coastal communities from ferocious cyclones.",
            banglaPronunciation:
              "দ্য ম্যানগ্রোভ ট্রিজ, নোন অ্যাজ সুন্দরী, হ্যাভ ইভলভড স্পেশালাইজড রুটস কল্ড নিউমাটোফোরস দ্যাট ব্রিথ অ্যাবাভ দ্য মাডি ওয়াটার। দিস এনচ্যান্টিং ওয়াইল্ডারনেস ইজ দ্য প্রাউড হোম অফ দি আইকনিক রয়েল বেঙ্গল টাইগার, স্পটেড ডিয়ার, অ্যান্ড রেয়ার অ্যাকোয়াটিক স্পিসিস লাইক দি ইরাবতী ডলফিন। প্রোটেক্টিং দিস গ্রিন শিল্ড ইজ এসেনশিয়াল ফর প্রিজারভিং গ্লোবাল বায়োডাইভারসিটি অ্যান্ড শিল্ডিং কোস্টাল কমিউনিটিস ফ্রম ফেরোশাস সাইক্লোনস।",
            bengaliText:
              "সুন্দরী গাছসহ অন্যান্য ম্যানগ্রোভ উদ্ভিদ এমন বিশেষ শিকড় তৈরি করেছে যাদের নিউমাটোফোর বা শ্বাসমূল বলা হয়, যা কর্দমাক্ত পানির উপরে শ্বাস নেয়। এই মায়াবী বনাঞ্চল বিশ্ববিখ্যাত রয়েল বেঙ্গল টাইগার, চিত্রা হরিণ এবং ইরাবতী ডলফিনের মতো বিরল জলজ প্রাণীর গর্বিত আবাস। বৈশ্বিক জীববৈচিত্র্য রক্ষা করতে এবং উপকূলীয় জনপদকে ভয়াল ঘূর্ণিঝড় থেকে রক্ষা করার জন্য এই সবুজ বর্মটি টিকিয়ে রাখা অপরিহার্য।",
            sentences: [
              {
                en: "The mangrove trees, known as Sundari, have evolved specialized roots called pneumatophores that breathe above the muddy water.",
                bnPronounce:
                  "দ্য ম্যানগ্রোভ ট্রিজ, নোন অ্যাজ সুন্দরী, হ্যাভ ইভলভড স্পেশালাইজড রুটস কল্ড নিউমাটোফোরস দ্যাট ব্রিথ অ্যাবাভ দ্য মাডি ওয়াটার।",
                bn: "সুন্দরী গাছসহ অন্যান্য ম্যানগ্রোভ উদ্ভিদ এমন বিশেষ শিকড় তৈরি করেছে যাদের নিউমাটোফোর বা শ্বাসমূল বলা হয়, যা কর্দমাক্ত পানির উপরে শ্বাস নেয়।",
              },
              {
                en: "This enchanting wilderness is the proud home of the iconic Royal Bengal Tiger, spotted deer, and rare aquatic species like the Irrawaddy dolphin.",
                bnPronounce:
                  "দিস এনচ্যান্টিং ওয়াইল্ডারনেস ইজ দ্য প্রাউড হোম অফ দি আইকনিক রয়েল বেঙ্গল টাইগার, স্পটেড ডিয়ার, অ্যান্ড রেয়ার অ্যাকোয়াটিক স্পিসিস লাইক দি ইরাবতী ডলফিন।",
                bn: "এই মায়াবী বনাঞ্চল বিশ্ববিখ্যাত রয়েল বেঙ্গল টাইগার, চিত্রা হরিণ এবং ইরাবতী ডলফিনের মতো বিরল জলজ প্রাণীর গর্বিত আবাস।",
              },
              {
                en: "Protecting this green shield is essential for preserving global biodiversity and shielding coastal communities from ferocious cyclones.",
                bnPronounce:
                  "প্রোটেক্টিং দিস গ্রিন শিল্ড ইজ এসেনশিয়াল ফর প্রিজারভিং গ্লোবাল বায়োডাইভারসিটি অ্যান্ড শিল্ডিং কোস্টাল কমিউনিটিস ফ্রম ফেরোশাস সাইক্লোনস।",
                bn: "বৈশ্বিক জীববৈচিত্র্য রক্ষা করতে এবং উপকূলীয় জনপদকে ভয়াল ঘূর্ণিঝড় থেকে রক্ষা করার জন্য এই সবুজ বর্মটি টিকিয়ে রাখা অপরিহার্য।",
              },
            ],
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
            exampleSentenceEn:
              "The Sundarbans is the world's largest contiguous mangrove forest.",
            exampleSentenceBn:
              "সুন্দরবন হলো বিশ্বের বৃহত্তম অবিচ্ছিন্ন ম্যানগ্রোভ বন।",
          },
          {
            word: "ecosystem",
            cleanWord: "ecosystem",
            phonetic: "/ˈiː.kəʊˌsɪs.təm/",
            banglaPronunciation: "ইকোসিস্টেম",
            partOfSpeech: "noun",
            bengaliMeaning: "বাস্তুতন্ত্র / পরিবেশ ব্যবস্থা",
            englishDefinition:
              "A biological community of interacting organisms.",
            exampleSentenceEn:
              "This unique ecosystem thrives where sweet freshwater rivers meet the ocean.",
            exampleSentenceBn:
              "এই অনন্য বাস্তুতন্ত্র সেখানেই বিকশিত হয় যেখানে মিষ্টি নদীর পানি সাগরে মেলে।",
          },
          {
            word: "submerge",
            cleanWord: "submerge",
            phonetic: "/səbˈmɜːdʒ/",
            banglaPronunciation: "সাবমার্জ",
            partOfSpeech: "verb",
            bengaliMeaning: "নিমজ্জিত করা / ডুবিয়ে দেওয়া",
            englishDefinition:
              "Cause to be under water; completely cover with water.",
            exampleSentenceEn:
              "High ocean tides submerge large portions of the forest.",
            exampleSentenceBn:
              "উচ্চ জোয়ার বনের বিশাল অংশ জলমগ্ন করে।",
          },
          {
            word: "biodiversity",
            cleanWord: "biodiversity",
            phonetic: "/ˌbaɪ.əʊ.daɪˈvɜː.sə.ti/",
            banglaPronunciation: "বায়োডাইভারসিটি",
            partOfSpeech: "noun",
            bengaliMeaning: "জীববৈচিত্র্য",
            englishDefinition:
              "The variety of plant and animal life in a particular habitat.",
            exampleSentenceEn:
              "Protecting this green shield is essential for preserving global biodiversity.",
            exampleSentenceBn:
              "বৈশ্বিক জীববৈচিত্র্য সংরক্ষণে এই সবুজ ঢাল রক্ষা করা অপরিহার্য।",
          },
          {
            word: "ferocious",
            cleanWord: "ferocious",
            phonetic: "/fəˈrəʊ.ʃəs/",
            banglaPronunciation: "ফেরোশাস",
            partOfSpeech: "adjective",
            bengaliMeaning: "ভয়ংকর / প্রবল / হিংস্র",
            englishDefinition:
              "Savagely fierce, cruel, or violently intense.",
            exampleSentenceEn:
              "It shields coastal communities from ferocious cyclones.",
            exampleSentenceBn:
              "এটি উপকূলের মানুষদের ভয়াল সাইক্লোন থেকে সুরক্ষা দেয়।",
          },
        ],
      },
    },
  });

  // Passage 3: The Gift of the Magi (O. Henry)
  await prisma.passage.create({
    data: {
      slug: "the-gift-of-the-magi",
      titleEn: "The Gift of the Magi",
      titleBn: "দ্য গিফট অব দ্য মেজাই",
      category: "Classic Literature / Moral Story",
      difficulty: DifficultyLevel.BEGINNER,
      readingTimeMinutes: 4,
      summaryEn:
        "A touching story about a young, impoverished couple, Della and Jim, who secretly sacrifice their most prized possessions to buy each other Christmas gifts.",
      summaryBn:
        "এক দরিদ্র তরুণ দম্পতি ডেলা ও জিমের হৃদয়স্পর্শী গল্প, যারা বড়দিনে একে অপরকে বিশেষ উপহার দিতে নিজেদের সবচেয়ে প্রিয় ও মূল্যবান সম্পদ নিঃস্বার্থভাবে বিসর্জন দেয়।",
      englishContent: `One dollar and eighty-seven cents. That was all. And sixty cents of it was in pennies. Pennies saved one and two at a time by bulldozing the grocer and the vegetable man and the butcher. Three times Della counted it, and the next day would be Christmas. There was clearly nothing to do but flop down on the shabby little couch and howl. So Della did it.

Now, there were two possessions of the James Dillingham Youngs in which they both took a mighty pride: Jim's gold watch and Della's beautiful hair. Della sold her hair for twenty dollars to buy a platinum fob chain for Jim. Meanwhile, Jim sold his gold watch to buy a set of precious combs for Della. They unwisely sacrificed the greatest treasures of their house, but of all who give gifts, these two were the wisest.`,
      bengaliContent: `এক ডলার সাতাশী সেন্ট। এই ছিল সর্বসাকুল্যে। আর এর মধ্যে ষাট সেন্টই ছিল এক পয়সার খুচরা মুদ্রা। মুদি দোকানদার, সবজি বিক্রেতা এবং কসাইয়ের সাথে কঠোর দরকষাকষি করে এক-দুই পয়সা করে জমানো। ডেলা তিনবার এটি গুনল, আর পরের দিনই ছিল বড়দিন। জীর্ণ ছোট সোফাটায় ধপাস করে বসে কান্নায় ভেঙে পড়া ছাড়া স্পষ্টতই আর কিছুই করার ছিল না। ডেলা তা-ই করল।

জেমস ডিলিংহাম ইয়াং পরিবারের এমন দুটি মূল্যবান সম্পদ ছিল যা নিয়ে তারা দুজনই অত্যন্ত গর্বিত ছিল: জিমের সোনার ঘড়ি এবং ডেলার অপূর্ব সুন্দর চুল। ডেলা জিমের জন্য একটি প্ল্যাটিনামের ঘড়ির চেইন কিনতে বিশ ডলারে নিজের চুল বিক্রি করে দিল। অন্যদিকে, জিম ডেলার চুলের জন্য একসেট মূল্যবান চিরুনি কিনতে নিজের সোনার ঘড়িটি বিক্রি করে দিল। তারা জাগতিক দৃষ্টিতে নিজেদের ঘরের সর্বশ্রেষ্ঠ সম্পদ দুটি বিসর্জন দিয়েছিল, কিন্তু উপহারদাতাদের মধ্যে এরাই ছিল সর্বকালের সবচেয়ে জ্ঞানী।`,
      sections: {
        create: [
          {
            orderIndex: 0,
            englishText:
              "One dollar and eighty-seven cents. That was all. And sixty cents of it was in pennies. Pennies saved one and two at a time by bulldozing the grocer and the vegetable man and the butcher. Three times Della counted it, and the next day would be Christmas. There was clearly nothing to do but flop down on the shabby little couch and howl. So Della did it.",
            banglaPronunciation:
              "ওয়ান ডলার অ্যান্ড এইটি-সেভেন সেন্টস। দ্যাট ওয়াজ অল। অ্যান্ড সিক্সটি সেন্টস অব ইট ওয়াজ ইন পেনিজ। পেনিজ সেভড ওয়ান অ্যান্ড টু অ্যাট আ টাইম বাই বুলডোজিং দ্য গ্রোসার অ্যান্ড দ্য ভেজিটেবল ম্যান অ্যান্ড দ্য বুচার। থ্রি টাইমস ডেলা কাউন্টেড ইট, অ্যান্ড দ্য নেক্সট ডে উড বি ক্রিসমাস। দেয়ার ওয়াজ ক্লিয়ারলি নাথিং টু ডু বাট ফ্লপ ডাউন অন দ্য শ্যাবি লিটল কাউচ অ্যান্ড হাউল। সো ডেলা ডিড ইট।",
            bengaliText:
              "এক ডলার সাতাশী সেন্ট। এই ছিল সর্বসাকুল্যে। আর এর মধ্যে ষাট সেন্টই ছিল এক পয়সার খুচরা মুদ্রা। মুদি দোকানদার, সবজি বিক্রেতা এবং কসাইয়ের সাথে কঠোর দরকষাকষি করে এক-দুই পয়সা করে জমানো। ডেলা তিনবার এটি গুনল, আর পরের দিনই ছিল বড়দিন। জীর্ণ ছোট সোফাটায় ধপাস করে বসে কান্নায় ভেঙে পড়া ছাড়া স্পষ্টতই আর কিছুই করার ছিল না। ডেলা তা-ই করল।",
            sentences: [
              {
                en: "One dollar and eighty-seven cents. That was all.",
                bnPronounce:
                  "ওয়ান ডলার অ্যান্ড এইটি-সেভেন সেন্টস। দ্যাট ওয়াজ অল।",
                bn: "এক ডলার সাতাশী সেন্ট। এই ছিল সর্বসাকুল্যে।",
              },
              {
                en: "And sixty cents of it was in pennies.",
                bnPronounce:
                  "অ্যান্ড সিক্সটি সেন্টস অব ইট ওয়াজ ইন পেনিজ।",
                bn: "আর এর মধ্যে ষাট সেন্টই ছিল এক পয়সার খুচরা মুদ্রা।",
              },
              {
                en: "Pennies saved one and two at a time by bulldozing the grocer and the vegetable man and the butcher.",
                bnPronounce:
                  "পেনিজ সেভড ওয়ান অ্যান্ড টু অ্যাট আ টাইম বাই বুলডোজিং দ্য গ্রোসার অ্যান্ড দ্য ভেজিটেবল ম্যান অ্যান্ড দ্য বুচার।",
                bn: "মুদি দোকানদার, সবজি বিক্রেতা এবং কসাইয়ের সাথে কঠোর দরকষাকষি করে এক-দুই পয়সা করে জমানো।",
              },
              {
                en: "Three times Della counted it, and the next day would be Christmas.",
                bnPronounce:
                  "থ্রি টাইমস ডেলা কাউন্টেড ইট, অ্যান্ড দ্য নেক্সট ডে উড বি ক্রিসমাস।",
                bn: "ডেলা তিনবার এটি গুনল, আর পরের দিনই ছিল বড়দিন।",
              },
              {
                en: "There was clearly nothing to do but flop down on the shabby little couch and howl.",
                bnPronounce:
                  "দেয়ার ওয়াজ ক্লিয়ারলি নাথিং টু ডু বাট ফ্লপ ডাউন অন দ্য শ্যাবি লিটল কাউচ অ্যান্ড হাউল।",
                bn: "জীর্ণ ছোট সোফাটায় ধপাস করে বসে কান্নায় ভেঙে পড়া ছাড়া স্পষ্টতই আর কিছুই করার ছিল না।",
              },
              {
                en: "So Della did it.",
                bnPronounce: "সো ডেলা ডিড ইট।",
                bn: "ডেলা তা-ই করল।",
              },
            ],
          },
          {
            orderIndex: 1,
            englishText:
              "Now, there were two possessions of the James Dillingham Youngs in which they both took a mighty pride: Jim's gold watch and Della's beautiful hair. Della sold her hair for twenty dollars to buy a platinum fob chain for Jim. Meanwhile, Jim sold his gold watch to buy a set of precious combs for Della. They unwisely sacrificed the greatest treasures of their house, but of all who give gifts, these two were the wisest.",
            banglaPronunciation:
              "নাউ, দেয়ার ওয়ার টু পজেশনস অব দ্য জেমস ডিলিংহাম ইয়াংস ইন হুইচ দে বোথ টুক আ মাইটি প্রাইড: জিমস গোল্ড ওয়াচ অ্যান্ড ডেলাস বিউটিফুল হেয়ার। ডেলা সোল্ড হার হেয়ার ফর টোয়েন্টি ডলারস টু বাই আ প্ল্যাটিনাম ফব চেইন ফর জিম। মিনহোয়াইল, জিম সোল্ড হিজ গোল্ড ওয়াচ টু বাই আ সেট অব প্রেশাস কোমবস ফর ডেলা। দে আনওয়াইজলি স্যাক্রিফাইসড দ্য গ্রেটেস্ট ট্রেজারস অব দেয়ার হাউস, বাট অব অল হু গিভ গিফটস, দিজ টু ওয়ার দ্য ওয়াইজেস্ট।",
            bengaliText:
              "জেমস ডিলিংহাম ইয়াং পরিবারের এমন দুটি মূল্যবান সম্পদ ছিল যা নিয়ে তারা দুজনই অত্যন্ত গর্বিত ছিল: জিমের সোনার ঘড়ি এবং ডেলার অপূর্ব সুন্দর চুল। ডেলা জিমের জন্য একটি প্ল্যাটিনামের ঘড়ির চেইন কিনতে বিশ ডলারে নিজের চুল বিক্রি করে দিল। অন্যদিকে, জিম ডেলার চুলের জন্য একসেট মূল্যবান চিরুনি কিনতে নিজের সোনার ঘড়িটি বিক্রি করে দিল। তারা জাগতিক দৃষ্টিতে নিজেদের ঘরের সর্বশ্রেষ্ঠ সম্পদ দুটি বিসর্জন দিয়েছিল, কিন্তু উপহারদাতাদের মধ্যে এরাই ছিল সর্বকালের সবচেয়ে জ্ঞানী।",
            sentences: [
              {
                en: "Now, there were two possessions of the James Dillingham Youngs in which they both took a mighty pride: Jim's gold watch and Della's beautiful hair.",
                bnPronounce:
                  "নাউ, দেয়ার ওয়ার টু পজেশনস অব দ্য জেমস ডিলিংহাম ইয়াংস ইন হুইচ দে বোথ টুক আ মাইটি প্রাইড: জিমস গোল্ড ওয়াচ অ্যান্ড ডেলাস বিউটিফুল হেয়ার।",
                bn: "জেমস ডিলিংহাম ইয়াং পরিবারের এমন দুটি মূল্যবান সম্পদ ছিল যা নিয়ে তারা দুজনই অত্যন্ত গর্বিত ছিল: জিমের সোনার ঘড়ি এবং ডেলার অপূর্ব সুন্দর চুল।",
              },
              {
                en: "Della sold her hair for twenty dollars to buy a platinum fob chain for Jim.",
                bnPronounce:
                  "ডেলা সোল্ড হার হেয়ার ফর টোয়েন্টি ডলারস টু বাই আ প্ল্যাটিনাম ফব চেইন ফর জিম।",
                bn: "ডেলা জিমের জন্য একটি প্ল্যাটিনামের ঘড়ির চেইন কিনতে বিশ ডলারে নিজের চুল বিক্রি করে দিল।",
              },
              {
                en: "Meanwhile, Jim sold his gold watch to buy a set of precious combs for Della.",
                bnPronounce:
                  "মিনহোয়াইল, জিম সোল্ড হিজ গোল্ড ওয়াচ টু বাই আ সেট অব প্রেশাস কোমবস ফর ডেলা।",
                bn: "অন্যদিকে, জিম ডেলার চুলের জন্য একসেট মূল্যবান চিরুনি কিনতে নিজের সোনার ঘড়িটি বিক্রি করে দিল।",
              },
              {
                en: "They unwisely sacrificed the greatest treasures of their house, but of all who give gifts, these two were the wisest.",
                bnPronounce:
                  "দে আনওয়াইজলি স্যাক্রিফাইসড দ্য গ্রেটেস্ট ট্রেজারস অব দেয়ার হাউস, বাট অব অল হু গিভ গিফটস, দিজ টু ওয়ার দ্য ওয়াইজেস্ট।",
                bn: "তারা জাগতিক দৃষ্টিতে নিজেদের ঘরের সর্বশ্রেষ্ঠ সম্পদ দুটি বিসর্জন দিয়েছিল, কিন্তু উপহারদাতাদের মধ্যে এরাই ছিল সর্বকালের সবচেয়ে জ্ঞানী।",
              },
            ],
          },
        ],
      },
      vocabularies: {
        create: [
          {
            word: "bulldozing",
            cleanWord: "bulldozing",
            phonetic: "/ˈbʊlˌdoʊ.zɪŋ/",
            banglaPronunciation: "বুলডোজিং",
            partOfSpeech: "verb (participle)",
            bengaliMeaning: "কঠোর দরকষাকষি করা / চাপ সৃষ্টি করা",
            englishDefinition:
              "Bargaining hard or insisting persistently to lower prices.",
            exampleSentenceEn:
              "She saved pennies by bulldozing the shopkeepers.",
            exampleSentenceBn:
              "দোকানদারদের সাথে কঠোর দরকষাকষি করে সে পয়সা জমিয়েছিল।",
          },
          {
            word: "parsimony",
            cleanWord: "parsimony",
            phonetic: "/ˈpɑːr.səˌmoʊ.ni/",
            banglaPronunciation: "পারসিমোনি",
            partOfSpeech: "noun",
            bengaliMeaning: "কৃপণতা / চরম মিতব্যয়িতা",
            englishDefinition:
              "Extreme unwillingness to spend money; stinginess.",
            exampleSentenceEn:
              "Her cheeks burned with the silent imputation of parsimony.",
            exampleSentenceBn:
              "কৃপণতার নীরব অপবাদে তার গাল লজ্জায় লাল হয়ে উঠেছিল।",
          },
          {
            word: "shabby",
            cleanWord: "shabby",
            phonetic: "/ˈʃæb.i/",
            banglaPronunciation: "শ্যাবি",
            partOfSpeech: "adjective",
            bengaliMeaning: "জীর্ণ / মলিন / বেহাল",
            englishDefinition:
              "In poor condition through long use or lack of care.",
            exampleSentenceEn: "Della sat on the shabby little couch.",
            exampleSentenceBn: "ডেলা জীর্ণ ছোট সোফাটিতে গিয়ে বসল।",
          },
          {
            word: "cascade",
            cleanWord: "cascade",
            phonetic: "/kæˈskeɪd/",
            banglaPronunciation: "ক্যাসকেড",
            partOfSpeech: "noun",
            bengaliMeaning: "ছোট জলপ্রপাত / ঢল",
            englishDefinition:
              "A small waterfall, or something falling in abundance like water.",
            exampleSentenceEn:
              "Her beautiful hair fell like a cascade of brown waters.",
            exampleSentenceBn:
              "তার সুন্দর চুল বাদামি জলের জলপ্রপাতের মতো নেমে এসেছিল।",
          },
          {
            word: "sacrificed",
            cleanWord: "sacrificed",
            phonetic: "/ˈsæk.rəˌfaɪst/",
            banglaPronunciation: "স্যাক্রিফাইসড",
            partOfSpeech: "verb",
            bengaliMeaning: "উৎসর্গ করেছিল / ত্যাগ করেছিল",
            englishDefinition:
              "Gave up something highly valued for the sake of love or duty.",
            exampleSentenceEn:
              "They sacrificed their greatest treasures for each other.",
            exampleSentenceBn:
              "তারা একে অপরের জন্য নিজেদের সর্বশ্রেষ্ঠ সম্পদ বিসর্জন দিয়েছিল।",
          },
        ],
      },
    },
  });

  console.log(
    "Database seeded with rich multi-sentence paragraphs and pronunciation data successfully!"
  );
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
