/* 매미 영어판 문장. 모양은 js/data/species/cicada.js와 같고 문장만 담는다 (js/core/i18n.js overlayText) */
(function register(text) {
  if (typeof module !== 'undefined' && module.exports) module.exports = text;
  else registerTranslation('en', 'cicada', text);
})({
  "name": "Cicada",
  "place": "the roots of a zelkova tree in an apartment flower bed",
  "intro": "I lived seven years in the dirt under a zelkova tree, in an apartment flower bed. I'm a cicada nymph, the big black kind. I stuck my mouth in a root and drank the sap. For seven years, that's all I did. Up there, they say you live about a month. Tonight the dirt is soft.",
  "kidUnit": "eggs",
  "scenes": {
    "C1": {
      "title": "The First Night in Seven Years",
      "text": "I pushed through the dirt and stuck my head out. There's wind. There was no wind underground. Right next to my hole is the sidewalk. Thud, thud. It's night, and people are still walking by.",
      "choices": [
        {
          "t": "Cut across the sidewalk",
          "msg": "The sidewalk is smooth, so I crawled fast. The tree is right there.",
          "risk": {
            "msg": "Thud. The footsteps stopped right above me."
          }
        },
        {
          "t": "Go around through the dirt",
          "msg": "Over one clump of dirt, then another. Slow, but soft underfoot."
        },
        {
          "t": "One more sip of root sap",
          "msg": "I drank from the root in my hole one more time. The taste of seven years.",
          "hurt": {
            "msg": "An ant bit my leg hard. I shook it off, but it stings."
          }
        },
        {
          "t": "Wait for the footsteps to stop",
          "msg": "I stayed still at the mouth of the hole. The footsteps got fewer."
        }
      ]
    },
    "C2": {
      "title": "Where to Hang",
      "text": "To shed my shell, I have to hang somewhere high. The zelkova trunk is far. The boxwood is close. A line of ants runs up and down the bottom of the zelkova.",
      "choices": [
        {
          "t": "Climb the nearby boxwood",
          "msg": "I hung from the tip of a low branch, but it swayed too much, so I moved to the zelkova.",
          "risk": {
            "msg": "Something is climbing my leg. One, ten, a hundred."
          }
        },
        {
          "t": "Climb the back of the trunk",
          "msg": "I went around the back, away from the ants, and climbed a long way. About as high as a person's knee. This will do."
        },
        {
          "t": "Hang from a bench leg",
          "msg": "The metal is cold and slippery. In the end I moved to the zelkova.",
          "hurt": {
            "msg": "I slipped off the metal leg twice."
          }
        },
        {
          "t": "Crawl to a first-floor screen",
          "msg": "I hung on the window screen. Behind it, a TV was on. Too loud. I went back to the tree.",
          "hurt": {
            "msg": "My claw got stuck in the screen mesh. I barely pulled it out."
          }
        }
      ]
    },
    "C3": {
      "title": "Flashlight",
      "text": "My back splits open. White and soft, I lean my body out of the shell. Then a round light shines on me. A boy in shorts is squatting there. From a first-floor window: \"Junho, come inside!\" He says, \"I'm watching a cicada come out,\" and doesn't move.",
      "choices": [
        {
          "t": "Pull out one leg at a time",
          "msg": "It took an hour. Junho didn't leave for an hour either. He scratched his mosquito bites the whole time."
        },
        {
          "t": "Hurry and get out",
          "msg": "I was out fast. I rested on my empty shell while my wings opened.",
          "risk": {
            "msg": "I'm slipping off the shell. My wings are drying folded."
          }
        },
        {
          "t": "Turn away behind a leaf",
          "msg": "I turned my body behind a leaf. The light followed, then stopped. \"Okay. I won't look.\"",
          "hurt": {
            "msg": "Moving half out of my shell, one leg slipped free."
          }
        },
        {
          "t": "Hang upside down and breathe",
          "msg": "I hung upside down and caught my breath. In the flashlight, my wings open little by little."
        }
      ]
    },
    "C4": {
      "title": "My Old Shell",
      "text": "It's morning. My wings are still pale green, and my body is still soft. Junho came back. He snapped my empty shell off the tree and put it in a clear box. There are already about ten shells in there. A magpie is flying low over the flower bed.",
      "choices": [
        {
          "t": "Try flying right now",
          "msg": "Flutter flutter. I barely made it to the next tree.",
          "risk": {
            "msg": "My wings still bend. Plop. Right into the middle of the flower bed."
          }
        },
        {
          "t": "Hide behind a leaf and dry",
          "msg": "I didn't move behind a big leaf. Little by little, my body turns dark and hard."
        },
        {
          "t": "Watch Junho box my shell",
          "msg": "I wore that for seven years. In the box it got mixed up with the others. Now even I can't tell which one is mine.",
          "hurt": {
            "msg": "The magpie swept the flower bed and clipped me with a wingtip. I barely held on."
          }
        },
        {
          "t": "Climb higher up the trunk",
          "msg": "I crawled almost to the top. I'm above the magpie now."
        }
      ]
    },
    "C5": {
      "title": "First Sap",
      "text": "I stuck my mouth into a cherry tree in the park next to the complex. Trunk sap is sweeter than root sap. The monsoon rain is pouring, and a bulbul hops from branch to branch going pee-eek, pee-eek.",
      "choices": [
        {
          "t": "Drink all I want in the rain",
          "msg": "My belly is full. The rain hides the sound of me.",
          "hurt": {
            "msg": "A raindrop knocked me off the trunk. My wings barely caught me."
          }
        },
        {
          "t": "Drink from a twig under leaves",
          "msg": "A thin twig with leaves over it like a roof. The sap is a little watery, but I stay dry."
        },
        {
          "t": "Climb to the top branch",
          "msg": "The top branch is the sweetest. The bulbul was too busy hiding from the rain.",
          "risk": {
            "msg": "Pee-eek! The bulbul comes straight through the rain."
          }
        },
        {
          "t": "Rest till the rain stops",
          "msg": "I pressed into a crack in the trunk and let the rain run past."
        }
      ]
    },
    "C6": {
      "title": "Bug Nets",
      "text": "\"A cicada! There!\" The kids from the complex came running with bug nets. At the end of a long pole, a green net wobbles closer. Junho is behind them. He sets his shell box down by his feet and looks up at the tree.",
      "choices": [
        {
          "t": "Lie flat like tree bark",
          "msg": "I kept my mouth in the tree and pressed flat, the same color as the bark. The net brushed right past me. I think Junho saw me. He didn't say anything."
        },
        {
          "t": "Fly to the tree across the way",
          "msg": "I hopped over to the top of the other tree. The kids go, \"Aw, it got away.\"",
          "hurt": {
            "msg": "The edge of the net grazed my wing. I wobbled."
          }
        },
        {
          "t": "Sing loud to scare them",
          "msg": "Zzzrrrrr! A kid jumped and dropped the net.",
          "risk": {
            "msg": "\"Found it!\" The green net comes down over my head."
          }
        },
        {
          "t": "Drop into the grass",
          "msg": "I hid in the grass, but a small hand picked me right up. Junho's hand."
        }
      ]
    },
    "K1": {
      "title": "In the Shell Box",
      "text": "I'm inside the clear box. About ten shells roll around on the bottom. One of them is mine. The box is on the floor by the front door, between the shoes. Through the door: \"Let it go first thing tomorrow.\" Junho says, \"Okay.\"",
      "choices": [
        {
          "t": "Keep scratching at the lid",
          "msg": "I scratched all night. The lid lifted a little, and there was a gap. In the morning, when the front door opened, I got out."
        },
        {
          "t": "Sing and sing",
          "msg": "Zzzrrrrrr! \"Ugh, so loud. Let it go now!\" Junho came out in his pajamas and let me go in the flower bed."
        },
        {
          "t": "Rest among the shells",
          "msg": "In the morning, Junho opened the lid and tipped the box. I spilled into the flower bed with the shells. I left the shells and flew.",
          "risk": {
            "msg": "One day. Two days. Nobody opens the lid. They say Junho went to his grandma's."
          }
        },
        {
          "t": "Smell the shells and hold on",
          "msg": "They smell like dirt. Like the place I lived for seven years. In the morning Junho let me go in the flower bed.",
          "hurt": {
            "msg": "The box shook, and I hit my head on the wall."
          }
        }
      ]
    },
    "C7": {
      "title": "First Song",
      "text": "The drum in my belly itches. It's time to sing. The zelkova is already packed with males. They say if you sit on Junho's first-floor window screen, your song rings out loud. The big window on the next building reflects the trees.",
      "choices": [
        {
          "t": "Sing with the other males",
          "msg": "I joined the chorus. My voice gets lost, but when we all sing, it carries far."
        },
        {
          "t": "Sing on Junho's screen",
          "msg": "The screen worked like a drum. Twice as loud. Inside, Junho shouts, \"Mom, a cicada's on our house!\"",
          "hurt": {
            "msg": "\"Ugh, so loud!\" Junho's mom slapped the screen. I fell, then barely flew."
          }
        },
        {
          "t": "Fly to the tree in the glass",
          "msg": "Right before the glass, I swerved. It was a reflection.",
          "risk": {
            "msg": "That tree looks cool and shady. Straight at it — bonk."
          }
        },
        {
          "t": "Fill up on sap first",
          "msg": "I'll sing tomorrow. Today I stuck my mouth in the trunk and drank all I wanted."
        }
      ]
    },
    "C8": {
      "title": "The Night That Never Goes Dark",
      "text": "I moved to a tree by a streetlight in the alley behind the complex. But night doesn't come. The light is bright as day, so my belly shakes on its own. The other males sing all night too.",
      "choices": [
        {
          "t": "Just sing all night",
          "msg": "I sang till morning. My throat is raw.",
          "risk": {
            "msg": "Four in the morning. My voice cracks and my legs go weak."
          }
        },
        {
          "t": "Go back to the dark flower bed",
          "msg": "I found a dark branch away from the light. Finally my body goes quiet. I had a sip of sap, too."
        },
        {
          "t": "Rest on the warm lamppost",
          "msg": "The post is still warm. I nod off.",
          "hurt": {
            "msg": "A cat leapt up from under the post. Its claws grazed my leg."
          }
        },
        {
          "t": "Drink sap at night too",
          "msg": "Sap is sweet at night too. But I can't sleep, and my head feels fuzzy."
        }
      ]
    },
    "C9": {
      "title": "White Smoke",
      "text": "Vroom, a truck. White smoke rolls along the flower bed. It's for killing mosquitoes. It smells sharp, and I can't breathe. The male on the next branch dropped. Plop.",
      "choices": [
        {
          "t": "Fly to the treetop",
          "msg": "The smoke stays low. It can't reach the top. The sap up here is still clean."
        },
        {
          "t": "Hold my breath behind a leaf",
          "msg": "I held on until the smoke passed.",
          "hurt": {
            "msg": "The smoke seeped in between the leaves. My legs are tingling."
          }
        },
        {
          "t": "Keep singing anyway",
          "msg": "I sang right through the smoke. It cleared quickly.",
          "risk": {
            "msg": "In the middle of my song, I can't breathe."
          }
        },
        {
          "t": "Leave for the park woods",
          "msg": "I flew over the wall toward the park. The sharp smell fades."
        }
      ]
    },
    "K2": {
      "title": "The Park Sycamore",
      "text": "There are way more cicadas in the park. Dozens sing on a single sycamore, so you can't even hear me. There's plenty of sap. Over the wall, the zelkova back at the complex looks tiny.",
      "choices": [
        {
          "t": "Stay here and sing",
          "msg": "It's summer here too. I sang as loud as I could among the loud males."
        },
        {
          "t": "Go back to the zelkova",
          "msg": "The smoke is gone. I flew back over the wall to the complex."
        },
        {
          "t": "Fill up on sap first",
          "msg": "I drank all I wanted. With a full belly, I kept looking at the zelkova. So I went back."
        },
        {
          "t": "Take the spot by a big male",
          "msg": "After a fight for a spot, I got a branch. But I kept looking toward the complex, so I went back.",
          "hurt": {
            "msg": "The big male shoved me with his wing. I almost fell off."
          }
        }
      ]
    },
    "C10": {
      "title": "Popsicle Stick",
      "text": "A heat wave. I slipped off a branch and fell on the parking lot asphalt. My back hit the ground. I'm upside down. The ground is hot. In the shade under a car, a cat's eyes shine. Somewhere, slippers come shuffling closer.",
      "choices": [
        {
          "t": "Beat my wings to flip over",
          "msg": "I beat the ground with my wings, tap tap, and barely flipped over. My back is hot."
        },
        {
          "t": "Wriggle to the shade",
          "msg": "The shade is cool. The cat was asleep.",
          "risk": {
            "msg": "A paw shot out of the shade."
          }
        },
        {
          "t": "Kick my legs and sing",
          "msg": "Zzzrrr. Someone squatted down. A popsicle stick slid under my back, and — tip. I was right side up. Junho. He walked off licking the stick."
        },
        {
          "t": "Wait for the wind",
          "msg": "A gust came and rolled me right side up.",
          "risk": {
            "msg": "No wind comes. The sun just keeps climbing."
          }
        }
      ]
    },
    "C11": {
      "title": "A Cracking Voice",
      "text": "Summer is winding down. I sing on the zelkova with all I have left. A female landed on my branch. She must have heard my song. But my voice keeps cracking.",
      "choices": [
        {
          "t": "Sing to the end, no rest",
          "msg": "My voice cracked, and I kept singing. She crept closer along the branch. We became mates."
        },
        {
          "t": "Sing a little, rest a little",
          "msg": "I sang, then rested, then sang. She's still there. At sunset we became mates.",
          "hurt": {
            "msg": "While I rested, another male came and shoved me with his wing."
          }
        },
        {
          "t": "Fly over next to her",
          "msg": "I landed right next to her, and she got scared and flew away."
        },
        {
          "t": "Have a sip of sap first",
          "msg": "My belly is full. I look around. She's gone. She must have followed some other song."
        }
      ]
    },
    "C12": {
      "title": "Pruning",
      "text": "My mate laid her eggs in a row under the bark of a dry twig. About four hundred. My legs barely work now. Then the man from the management office starts cutting dry branches with long shears. Snip. The twig with the eggs fell into the flower bed.",
      "choices": [
        {
          "t": "Go down by the fallen twig",
          "msg": "I landed on the dirt next to the twig. Junho squats down and looks from the twig to me and back."
        },
        {
          "t": "Sing loud one last time",
          "msg": "Zzzrrrr. Junho looked up. He looked where the sound came from, then picked up the fallen twig."
        },
        {
          "t": "Fly up away from the shears",
          "msg": "I got away to a high branch. From up there, I see the man sweeping up the dry branches."
        },
        {
          "t": "Hold on to the twig",
          "msg": "I held on and fell with it. The dirt is soft. Junho's sneakers came and stopped right in front of me."
        }
      ]
    }
  },
  "endings": {
    "H1": {
      "title": "A Twig in the Flower Bed",
      "cause": "old age",
      "line": "Junho stuck the twig with our eggs into the dirt, right by the hole I came out of. When our kids climb out in seven years, Junho will be in high school. I wonder if he'll still collect shells."
    },
    "N1": {
      "title": "A Song Sung Alone",
      "cause": "old age",
      "line": "I never found a mate. But I sang all summer long. My voice was part of the sound of summer in this complex."
    },
    "N2": {
      "title": "The Park Sycamore",
      "cause": "old age",
      "line": "I found a mate in the park and finished my summer there. Our kids will go down into the park dirt. Over the wall, the zelkova looked tiny."
    },
    "N3": {
      "title": "Dustpan",
      "cause": "old age",
      "line": "The twig with our eggs went away in the man's dustpan. My mate probably laid eggs on other twigs too. Probably."
    },
    "D1": {
      "title": "Sidewalk",
      "cause": "a footstep",
      "line": "Seven years underground. One minute above."
    },
    "D2": {
      "title": "The Ant Line",
      "cause": "ants",
      "line": "I never even got out of my shell. Every night, the ants wait under this tree."
    },
    "D3": {
      "title": "Crumpled Wings",
      "cause": "a failed molt",
      "line": "My wings dried crumpled. My empty shell is still on the branch. Junho will probably take it."
    },
    "D4": {
      "title": "The Morning Magpie",
      "cause": "a magpie",
      "line": "I should have waited until my wings were hard."
    },
    "D5": {
      "title": "The Top Branch",
      "cause": "a bulbul",
      "line": "The bulbul knew which branch was sweetest, too."
    },
    "D6": {
      "title": "The Shell Box",
      "cause": "trapped in a bug box",
      "line": "Summer went by on the other side of the clear wall. Junho was at his grandma's."
    },
    "D7": {
      "title": "The Green Net",
      "cause": "a bug net",
      "line": "\"Whoa, I got it!\" I sang loud inside the net. The kids got even more excited."
    },
    "D8": {
      "title": "The Night That Never Goes Dark",
      "cause": "exhaustion under a streetlight",
      "line": "I sang to the end, thinking it was still day."
    },
    "D9": {
      "title": "The Tree in the Glass",
      "cause": "a window",
      "line": "I thought the zelkova in the glass was a real tree."
    },
    "D10": {
      "title": "White Smoke",
      "cause": "mosquito fog",
      "line": "They said the smoke was for mosquitoes. The smoke didn't care who was a mosquito and who was a cicada."
    },
    "D11": {
      "title": "Upside Down",
      "cause": "heat and asphalt",
      "line": "Upside down, all I could see was the sky. I never saw that underground."
    },
    "D12": {
      "title": "Shade Under a Car",
      "cause": "a stray cat",
      "line": "The shade was the cat's spot."
    },
    "W0": {
      "title": "Worn Out",
      "cause": "weakness",
      "line": "My drum won't shake anymore. I'll just rest a little."
    },
    "W1": {
      "title": "A Dry Mouth",
      "cause": "starvation",
      "line": "If only I'd had one more sip of sap."
    }
  }
});
