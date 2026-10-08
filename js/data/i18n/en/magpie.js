/* 까치 영어판 문장. 모양은 js/data/species/magpie.js와 같고 문장만 담는다 (js/core/i18n.js overlayText) */
(function register(text) {
  if (typeof module !== 'undefined' && module.exports) module.exports = text;
  else registerTranslation('en', 'magpie', text);
})({
  "name": "Magpie",
  "place": "the top of a utility pole in a villa alley",
  "intro": "I hatched at the top of a utility pole in a villa alley. Our house is round, woven from twigs and wire coat hangers, with a roof on top. People say when a magpie calls, a welcome guest is coming. But our house on the pole gets torn down every year.",
  "kidUnit": "eggs",
  "scenes": {
    "M1": {
      "title": "Top of the Pole",
      "text": "It's warm when I squeeze in with my four brothers and sisters. Then a big crow comes flying at the nest. Dad fans out his tail and screams, chak-chak-chak. I didn't know Dad's voice was that loud.",
      "choices": [
        {
          "t": "Hide under the nest roof",
          "msg": "Magpie nests have roofs. Through the twigs, all I hear is Dad yelling. I don't move until it's quiet."
        },
        {
          "t": "Peek out of the nest",
          "msg": "I watched Dad chase the crow away, the whole thing. Dad, you're so cool.",
          "risk": {
            "msg": "The crow looks right at me. Its beak is as big as my head."
          }
        },
        {
          "t": "Cry for Dad",
          "msg": "Dad chased the crow off and brought back a caterpillar. In the fight, one of his tail feathers got bent."
        },
        {
          "t": "Shove past and eat first",
          "msg": "Mom brought a grasshopper, and I got it first.",
          "hurt": {
            "msg": "I got tangled up with my brother and scraped my wing on the end of a wire."
          }
        }
      ]
    },
    "M2": {
      "title": "The Yellow Truck",
      "text": "Last night a wire in our nest touched a power line. Bang. All the lights in the alley went out. This morning a yellow truck came and stretched out its long arm. The man in the bucket says, \"Power company.\" I have all my feathers, but I've never flown.",
      "choices": [
        {
          "t": "Jump after Dad",
          "msg": "Flap flap. Half flying, half falling. Dad called me from the wall, chak-chak. I looked back. Our house was going down in the bucket.",
          "hurt": {
            "msg": "I hit my chest on the corner of the wall."
          }
        },
        {
          "t": "Hold on inside the nest",
          "msg": "The man said, \"There's a chick in here,\" and waited a long time. By evening I finally flew out.",
          "risk": {
            "msg": "The whole nest tips. There's nothing to hold on to. The ground is getting closer."
          }
        },
        {
          "t": "Hop onto the power line",
          "msg": "I just barely held on. My brothers say it's fine as long as you only sit on one wire.",
          "hurt": {
            "msg": "The wind shook me off. I landed on a car roof. Thud."
          }
        },
        {
          "t": "Hide under Mom's wing",
          "msg": "Mom pulled me over to the roof next door. Our house is gone, but Mom still smells the same."
        }
      ]
    },
    "M3": {
      "title": "Cat in the Bushes",
      "text": "My tail is still short, so I hop around on the ground. Mom and Dad take turns bringing food. But under a bush, a cat's eyes are shining. Dad is going crazy on the wall, chak-chak-chak.",
      "choices": [
        {
          "t": "Chak-chak along with Dad",
          "msg": "I chak-chakked as loud as I could. The cat flattened its ears and backed away. Dad flicks his tail.",
          "risk": {
            "msg": "I was so busy yelling, I didn't see the cat creeping up."
          }
        },
        {
          "t": "Jump up onto the wall",
          "msg": "I flapped my way up onto the wall. All by myself, for the first time! Mom gave me a grasshopper as a prize."
        },
        {
          "t": "Lie flat in the grass",
          "msg": "I lay flat in the flower bed grass. Mom snuck over and slipped me an earthworm."
        },
        {
          "t": "Grab the kimbap under the bench",
          "msg": "There was a kimbap end under the bench. Sesame oil!",
          "hurt": {
            "msg": "The cat's paw brushed my tail. Two tail feathers came out."
          }
        }
      ]
    },
    "M4": {
      "title": "Something Shiny",
      "text": "I'm pretty good at flying now. Something shines in the dirt of the flower bed. A bottle cap! When I roll it with my beak, the sunlight sparkles. I hid my leftover bread from breakfast under a leaf… but a crow saw the whole thing.",
      "choices": [
        {
          "t": "Eat all the bread now",
          "msg": "I'm full. There's nothing for tomorrow.",
          "hurt": {
            "msg": "I gulped it too fast and choked on it."
          }
        },
        {
          "t": "Take the bottle cap and hide it",
          "msg": "It's no use, but I keep wanting to look at it. I hid it in a rain gutter."
        },
        {
          "t": "Chase the crow off",
          "msg": "I fanned my tail and went at it, chak-chak. The crow flew off like I was a pest. I kept the bread, too.",
          "hurt": {
            "msg": "The crow jabbed me on the top of my head. Too much for me alone."
          }
        },
        {
          "t": "Sneak the bread somewhere else",
          "msg": "While the crow looked away, I moved the bread and buried it. Only I know the new spot."
        }
      ]
    },
    "M5": {
      "title": "The Magpie's Share",
      "text": "The wind is cold. A few red persimmons are left at the top of the tree in the park. An old man didn't pick them. He said, \"Leave some for the magpies.\" In the grass below, someone threw away a tangle of fishing line. There's bait on the end.",
      "choices": [
        {
          "t": "Peck the persimmons",
          "msg": "Sweet and soft. My beak is orange all the way to the tip. Food people left for us."
        },
        {
          "t": "Peck at the bait",
          "msg": "Carefully, carefully, I pulled off just the bait, without getting my feet in the line.",
          "risk": {
            "msg": "The moment I bite the bait, the line wraps around my foot. The more I pull, the tighter it gets."
          }
        },
        {
          "t": "Hide a persimmon for later",
          "msg": "I ate half and covered the rest with leaves. I'll dig it up in winter."
        },
        {
          "t": "Look under the bench for snacks",
          "msg": "I found a piece of rice cake cracker.",
          "hurt": {
            "msg": "A dog on a walk came at me, barking."
          }
        }
      ]
    },
    "M6": {
      "title": "Big Crows",
      "text": "The lid's off the food waste bin behind the restaurants. Meat smell! But three big crows are already here. They're a whole head bigger than me. Across the street, there's a chicken bone lying in the road.",
      "choices": [
        {
          "t": "Call the other magpies",
          "msg": "I called chak-chak, and four magpies from the neighborhood came. We're louder. The crows made room.",
          "hurt": {
            "msg": "One crow held its ground. It bit my wing."
          }
        },
        {
          "t": "Grab the bone from the road",
          "msg": "I came back to the sidewalk with the chicken bone. There's a lot of meat on it.",
          "risk": {
            "msg": "The sound of the wheels is too close."
          }
        },
        {
          "t": "Back off and wait",
          "msg": "After the crows ate and left, I picked up grains of rice soaked in broth."
        },
        {
          "t": "Squeeze under the lid",
          "msg": "I grabbed a piece of meat and ran!",
          "risk": {
            "msg": "All three crows look at me at once."
          }
        }
      ]
    },
    "M7": {
      "title": "Winter Sun",
      "text": "It's January. My feet froze overnight. When the morning sun hits the villa wall, everyone gathers there and puffs up their feathers. On the pole over there, a magpie with a bent tail feather is carrying twigs. It's Dad. He must be building there again this year.",
      "choices": [
        {
          "t": "Go back to the restaurant bin",
          "msg": "No crows this time.",
          "hurt": {
            "msg": "The crows got there first. They chased me, and I hit a sign."
          }
        },
        {
          "t": "Go see Dad",
          "msg": "Dad saw me and went chak! and chased me off. This is his turf, he says. But as he flew away, he dropped one of the twigs he was carrying.",
          "hurt": {
            "msg": "Dad's beak was sharper than I thought."
          }
        },
        {
          "t": "Find the food I hid",
          "msg": "I found the food I covered with leaves in the fall. It's frozen solid, like sherbet. I'm proud of myself for remembering.",
          "hurt": {
            "msg": "Flying back and forth in the cold wind made my wings stiff."
          }
        },
        {
          "t": "Doze in the sun",
          "msg": "The sun pours down on my back. My eyes slowly close. So winter has this too."
        }
      ]
    },
    "M8": {
      "title": "Chak— chak-chak",
      "text": "My second winter is almost over. Every morning lately, someone calls from the ginkgo tree in the flower bed. Chak— chak-chak. One long, two short. A different beat from everyone else. It sounds like it's calling me.",
      "choices": [
        {
          "t": "Give my hidden bottle cap",
          "msg": "I brought the bottle cap from the gutter. She rolled it around for a long time. I have a mate.",
          "hurt": {
            "msg": "On my way to get the bottle cap, I got into a fight with another male."
          }
        },
        {
          "t": "Call back the same way",
          "msg": "Chak— chak-chak. She tilted her head and came to the branch next to mine. From that day on, we go everywhere together. She even shared the peanuts she'd hidden."
        },
        {
          "t": "Chase off the male hanging around",
          "msg": "I chased off the guy who was hanging around. I have a mate.",
          "hurt": {
            "msg": "We rolled around biting tails, and I lost a beakful of feathers."
          }
        },
        {
          "t": "Pretend not to hear and eat",
          "msg": "I filled my belly first. A few days later, the calling stopped."
        }
      ]
    },
    "M9": {
      "title": "Wire Coat Hangers",
      "text": "My mate and I are looking for a nest spot. Behind the dry cleaner's, there's a pile of old wire hangers. Strong, and they bend easily. A pole top is too high for cats. But I keep remembering the day our house left in the yellow truck's bucket.",
      "choices": [
        {
          "t": "Build in the park ginkgo",
          "msg": "I wove it one twig at a time. I picked up caterpillars on the way. My mate brought mud to line the inside. The roof took a month. We have five eggs."
        },
        {
          "t": "Build on a pole with hangers",
          "msg": "With hangers for a frame, it's done in no time. We have six eggs.",
          "risk": {
            "msg": "The end of a hanger touches a power line. Flash."
          }
        },
        {
          "t": "Build on the pole next to Dad's",
          "msg": "It's the pole right next to Dad's. I used only twigs. We have five eggs.",
          "hurt": {
            "msg": "Dad didn't like the new neighbors. His beak is still sharp."
          }
        },
        {
          "t": "Eat first, then build",
          "msg": "I ate, then built on a low branch of a zelkova tree in the park. We have four eggs.",
          "hurt": {
            "msg": "We got into a big fight with another magpie couple over the spot."
          }
        }
      ]
    },
    "B1": {
      "title": "The Yellow Truck Again",
      "text": "Day ten of sitting on the eggs. The yellow truck came. The bucket is rising. Just like the day it took our house when I was little. The man mutters, \"When the power goes out, the whole block suffers.\" My mate is crying chak-chak-chak.",
      "choices": [
        {
          "t": "Move to the park",
          "msg": "We left the eggs behind. My mate and I started over in the park ginkgo. We have four eggs.",
          "hurt": {
            "msg": "I wore myself out hauling twigs in a hurry."
          }
        },
        {
          "t": "Block the bucket",
          "msg": "The man watched me for a long time. Then he said, \"I'll take it down after they hatch and grow up,\" and went back down.",
          "risk": {
            "msg": "Dodging the bucket, I fly in between two power lines."
          }
        },
        {
          "t": "Build in the same spot again",
          "msg": "As soon as the yellow truck took the nest, we built it again in the same spot. We're stubborn."
        },
        {
          "t": "Move to the next pole",
          "msg": "It's the very next pole. Someday the yellow truck will come there too.",
          "hurt": {
            "msg": "Dragging a hanger over, I almost broke my wing."
          }
        }
      ]
    },
    "B2": {
      "title": "The Evening Flock",
      "text": "It's spring, so everyone is building nests with their mates. Only I'm alone. Every evening, dozens of magpies without mates gather in the park trees, chatter, and scatter. Not one of them calls with that beat, chak— chak-chak.",
      "choices": [
        {
          "t": "Stay with the flock",
          "msg": "It's loud and warm. At least I'm not alone."
        },
        {
          "t": "Try calling chak— chak-chak",
          "msg": "Chak— chak-chak. I copied that beat. Someone on a branch over there answered the same way. I have a mate."
        },
        {
          "t": "Fix up an empty nest",
          "msg": "I tried fixing up an empty nest, but I can't get the roof on alone.",
          "hurt": {
            "msg": "The couple who owned it came back and both pecked me at once."
          }
        },
        {
          "t": "Just focus on eating",
          "msg": "I'm full. The days are getting longer.",
          "hurt": {
            "msg": "Picking something up in the road, a horn scared me and I hit a wall."
          }
        }
      ]
    },
    "M10": {
      "title": "The Magpie in the Glass",
      "text": "My mate sits on the eggs. I bring the food. But there's a magpie in the glass of a first-floor balcony. When I spread my wings, it spreads its wings too. Right in front of our nest, too.",
      "choices": [
        {
          "t": "Teach the glass magpie a lesson",
          "msg": "We fought a long time. I guess it got tired too, because it went still. My head is ringing.",
          "risk": {
            "msg": "I flew at it as hard as I could and kicked. The glass didn't even budge."
          }
        },
        {
          "t": "Sit on the eggs for my mate",
          "msg": "My mate spread her wings and rested for a bit. The eggs are warmer than I thought. Something inside goes tap-tap."
        },
        {
          "t": "Ignore it and bring food",
          "msg": "I decided to forget about the one in the glass. I kept bringing earthworms and grubs. The eggs started to hatch.",
          "hurt": {
            "msg": "Looking for food, I got soaked in the spring rain."
          }
        },
        {
          "t": "Dig through the flower bed trash",
          "msg": "I pulled some batter scraps out of a fried chicken box.",
          "hurt": {
            "msg": "The security guard hit me on the back with his broom."
          }
        }
      ]
    },
    "M11": {
      "title": "Like Dad",
      "text": "The chicks hatched. The nest is all peep-peep. But a big crow is sitting on the branch above the nest. I remember Dad fanning out his tail and screaming when I was little. My mate looks at me.",
      "choices": [
        {
          "t": "Take on the crow alone",
          "msg": "I pecked it on the head and pulled back. The crow ran away!",
          "risk": {
            "msg": "The crow's beak turns toward me."
          }
        },
        {
          "t": "Chase it with my mate",
          "msg": "Chak-chak-chak! Me from above, my mate from the side. Just like Dad used to. The crow finally flew off. All five chicks are safe.",
          "hurt": {
            "msg": "The crow's claws scratched my back."
          }
        },
        {
          "t": "Call the other magpies",
          "msg": "The neighborhood magpies came and made a huge racket. The crow left, but one chick is missing."
        },
        {
          "t": "Block the nest with my body",
          "msg": "I blocked the nest entrance with my body. Three chicks made it.",
          "hurt": {
            "msg": "The crow's beak jabbed me in the back."
          }
        }
      ]
    }
  },
  "endings": {
    "H1": {
      "title": "First Flight",
      "cause": "old age",
      "line": "One by one, the chicks jump off the edge of the nest. Half flying, half falling. I was like that too. On the pole across the street, a magpie with a bent tail feather calls, chak-chak. Dad, did you see?"
    },
    "N1": {
      "title": "Stubborn Pole",
      "cause": "old age",
      "line": "Every year I built a nest on the pole, and every year they took it down. Still, every spring I carried hangers again. That's what magpies do."
    },
    "N2": {
      "title": "The Evening Flock",
      "cause": "old age",
      "line": "I never had a mate, but every evening there was plenty of company to chatter with. I never forgot that call, chak— chak-chak."
    },
    "D1": {
      "title": "Outside the Nest",
      "cause": "a big crow",
      "line": "Dad told me to stay under the roof."
    },
    "D2": {
      "title": "Cat on the Ground",
      "cause": "a stray cat",
      "line": "One more day of wings and I could have flown."
    },
    "D3": {
      "title": "Fishing Line",
      "cause": "fishing line",
      "line": "My toes turned black. I can't hold on to a branch anymore."
    },
    "D4": {
      "title": "Chicken Bone in the Road",
      "cause": "a car",
      "line": "It was just a bone."
    },
    "D5": {
      "title": "The Magpie in the Glass",
      "cause": "a window",
      "line": "The magpie glaring at me from the glass was me. I never knew."
    },
    "D6": {
      "title": "Flash",
      "cause": "electrocution",
      "line": "Now I know why the yellow truck took our house away."
    },
    "D7": {
      "title": "Three Crows",
      "cause": "big crows",
      "line": "They were hungry too."
    },
    "D8": {
      "title": "The Day I Fought Alone",
      "cause": "a big crow",
      "line": "Kids, stay close under the nest roof. My dad told me the same thing."
    },
    "W0": {
      "title": "Worn Out",
      "cause": "weakness",
      "line": "My tail is heavy. I can't make it up to the power line anymore."
    },
    "W1": {
      "title": "Starving",
      "cause": "starvation",
      "line": "I checked every place I hid food. There's nothing left."
    }
  }
});
