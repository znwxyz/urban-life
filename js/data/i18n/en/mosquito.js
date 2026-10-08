/* 모기 영어판 문장. 모양은 js/data/species/mosquito.js와 같고 문장만 담는다 (js/core/i18n.js overlayText) */
(function register(text) {
  if (typeof module !== 'undefined' && module.exports) module.exports = text;
  else registerTranslation('en', 'mosquito', text);
})({
  "name": "Mosquito",
  "place": "a red basin by the apartment guardhouse",
  "intro": "I grew up in rainwater in a red rubber basin, by the tap next to the apartment guardhouse. The old guard uses it to water the flower beds. I'm a female house mosquito. We live a month at most, they say. Before then, I have to drink blood and lay my eggs.",
  "kidUnit": "eggs",
  "scenes": {
    "M1": {
      "title": "The Red Basin",
      "text": "Standing on the water, I slip out of my pupa skin. My wings are still wet. Then a big hand grabs the rim of the basin. \"The health center said to dump standing water.\" It's the old guard. The basin slowly tips.",
      "choices": [
        {
          "t": "Take off on wet wings",
          "msg": "Wobbly, but I'm up. Below me the water pours out onto the flower bed. My little wriggler brothers and sisters go with it.",
          "risk": {
            "msg": "My wings weren't dry yet. The pouring water pulls me in."
          }
        },
        {
          "t": "Hold tight to my pupa skin",
          "msg": "The water carries me, skin and all, onto the dirt of the flower bed. I dry my wings there, slowly.",
          "hurt": {
            "msg": "The current flips the skin over. I flail around in the muddy water a long time."
          }
        },
        {
          "t": "Climb up the side of the basin",
          "msg": "I grip the slippery rubber with all six legs and climb. I'm right next to his thumb. He just dumps the water and goes back to the guardhouse."
        },
        {
          "t": "Hide under a floating leaf",
          "msg": "I pour out with the leaf, and it covers me like an umbrella. I drink a little of the water beaded on it.",
          "hurt": {
            "msg": "The leaf hits a rock in the flower bed and one of my legs bends."
          }
        }
      ]
    },
    "M2": {
      "title": "Watermelon Rind",
      "text": "I'm hungry. Everyone starts with sweet juice, they say. A watermelon rind lies by the food-waste bins at the recycling area. It smells so sweet. Under the roof, a red dragonfly darts back and forth.",
      "choices": [
        {
          "t": "Land on the red flesh",
          "msg": "Sweet juice seeps out of the red flesh. I've never had anything this sweet.",
          "risk": {
            "msg": "A red shadow drops down. Four wings, whirr—"
          }
        },
        {
          "t": "Lick the mouth of a crushed can",
          "msg": "There's dried soda left on the can. Sweet enough to sting.",
          "hurt": {
            "msg": "My legs stick in something gooey. I pull them free one by one."
          }
        },
        {
          "t": "Go to the balsam flowers",
          "msg": "I stick my head inside a balsam flower. Just a little, but it's sweet. The dragonfly keeps circling the recycling roof."
        },
        {
          "t": "Rest in the bin's shade",
          "msg": "Behind the bin it smells sour, but it's cool. I stay there till my wings are completely dry."
        }
      ]
    },
    "M3": {
      "title": "Wing Song",
      "text": "At sunset the males swarm and whine above the playground slide. You match your wing sounds, and when they line up just right, that's your mate, they say. Over by the streetlight, bats swoop past.",
      "choices": [
        {
          "t": "Fly into the middle of the swarm",
          "msg": "One male's hum matches mine exactly. We fly together, joined, for a moment. Males don't drink blood. They only live a few days."
        },
        {
          "t": "Go to the warm streetlight",
          "msg": "It's warm under the light. A male follows me and matches my sound.",
          "risk": {
            "msg": "Swoosh. Black wings block out the light."
          }
        },
        {
          "t": "Just hum along at the edge",
          "msg": "At the edge of the swarm, I try matching sounds. The third male matches."
        },
        {
          "t": "Hide in the bushes tonight",
          "msg": "I spend the night behind a leaf in the bushes. The next evening, I find a mate at the edge of the swarm."
        }
      ]
    },
    "M4": {
      "title": "The Guardhouse",
      "text": "Eleven at night. The guardhouse window is half open. The old guard dozes in his chair. Old songs play on the radio, and a mosquito coil burns by his feet. Even half asleep, he slaps his own knee now and then.",
      "choices": [
        {
          "t": "Sneak onto his ankle",
          "msg": "I put my needle in beside his anklebone. Warm. My very first blood. In his sleep, he slaps his knee. I'm already on the windowsill.",
          "hurt": {
            "msg": "He shakes his leg. The breeze sends me rolling across the floor."
          }
        },
        {
          "t": "Go straight for his neck",
          "msg": "One sip from the back of his neck. He scratches his head and falls back asleep.",
          "risk": {
            "msg": "Eeeee— the moment I pass his ear, his eyes snap open."
          }
        },
        {
          "t": "Fly around the coil smoke to his hand",
          "msg": "I circle around the smoke and land on the back of his hand. I put my needle in between the wrinkles.",
          "hurt": {
            "msg": "I breathe in some smoke. My legs go numb, and I crawl for a long time."
          }
        },
        {
          "t": "Wait on the sill till he's deep asleep",
          "msg": "I wait till his snoring gets loud. Then I drink slowly from the top of his foot."
        }
      ]
    },
    "M5": {
      "title": "Underground Parking",
      "text": "My belly's red and full, and I'm heavy. To turn blood into eggs, I have to rest for two days somewhere dark and damp. The underground parking lot is cool even in midsummer. There are cobwebs in every corner of every pillar.",
      "choices": [
        {
          "t": "Go dark by the ceiling pipes",
          "msg": "A corner of the ceiling where the heating pipes run. Water drops bead on them. I don't move for two whole days."
        },
        {
          "t": "Cling to a pillar corner",
          "msg": "The corner of the pillar is cool and quiet. I spend two days there.",
          "risk": {
            "msg": "The thread under my feet trembles. Something's coming."
          }
        },
        {
          "t": "Shade under a parked car",
          "msg": "Under the car it's dark and smells of oil. I hold on there for two days.",
          "hurt": {
            "msg": "The engine starts. A hot blast knocks me to the ground."
          }
        },
        {
          "t": "Hide in a rubber wheel stop",
          "msg": "The gap in the yellow rubber is narrow and damp. A tire rolls up right in front of me, then backs out again."
        }
      ]
    },
    "M6": {
      "title": "Water for Eggs",
      "text": "My belly is heavy. The blood has become eggs. I go back to the red basin, but it's dry to the bottom. The old guard dumps it every week. There's black water pooled under the parking lot drain, and a thrown-out coffee cup on the flower-bed curb is full of rain.",
      "choices": [
        {
          "t": "Lay in the black drain water",
          "msg": "I go down through the grate. It stinks, but this water will never dry up. I lay a hundred and eighty eggs, stuck together like a raft."
        },
        {
          "t": "Lay in the coffee cup",
          "msg": "It's quiet and lukewarm in the cup. I float a hundred and fifty eggs. The next morning, the cleaning lady throws out the whole cup."
        },
        {
          "t": "Lay in the pond skater puddle",
          "msg": "The puddle is wide and lukewarm. I keep away from the pond skaters and float two hundred eggs on the far side.",
          "risk": {
            "msg": "The moment I touch the water, it ripples. Long legs come my way."
          }
        },
        {
          "t": "Hold on till the basin fills",
          "msg": "I wait, eggs still inside me. The rain doesn't come. In the end I drop them in the bottom of a bone-dry gutter."
        }
      ]
    },
    "M7": {
      "title": "Fogging",
      "text": "\"This evening at seven, there will be pest fogging throughout the complex.\" When the announcement ends, the old guard straps on a fogging machine and walks the flower beds. With a loud brrrrm, white smoke rolls right into the bushes.",
      "choices": [
        {
          "t": "Fly far away from the smoke",
          "msg": "With the wind at my back, I fly past the playground. I look back. The flower beds are all white."
        },
        {
          "t": "Get behind him, to his ankle",
          "msg": "The smoke only goes forward. Right behind him, the air is clear. One sip of bare skin above his rubber boot.",
          "risk": {
            "msg": "He turns around. All the white smoke comes down on me at once."
          }
        },
        {
          "t": "Climb to the top of the zelkova",
          "msg": "I go all the way to the top of the zelkova tree. The smoke spreads out over the flower beds.",
          "hurt": {
            "msg": "The smoke comes up higher than I thought. I hang on a long time, wings shaking."
          }
        },
        {
          "t": "Slip into an open balcony",
          "msg": "I suck the damp out of a towel on the drying rack. The smoke stops at the screen.",
          "hurt": {
            "msg": "The window slides shut and catches the tips of my wings."
          }
        }
      ]
    },
    "M8": {
      "title": "Kid's Room, 15th Floor",
      "text": "To make a second batch of eggs, I need blood again. I ride the elevator on a mom's shoulder. In the kid's room on the fifteenth floor there's a mosquito net, and a plug-in repellent blinks green in the outlet. One bottom corner of the net is lifted a little.",
      "choices": [
        {
          "t": "Slip in through the gap in the net",
          "msg": "I slip right in. Inside, it's full of the smell of a child's breath."
        },
        {
          "t": "Land on a toe sticking out",
          "msg": "One toe is poking out of the net. I drink from it slowly.",
          "hurt": {
            "msg": "The kid kicks in their sleep. I almost get squashed under the blanket."
          }
        },
        {
          "t": "Go by the warm repellent",
          "msg": "It's warm by the outlet. But my head feels funny, so I get out fast.",
          "risk": {
            "msg": "Every time the green light blinks, another leg gives out."
          }
        },
        {
          "t": "Just ride the elevator down",
          "msg": "I think the kid might wake up, so I just leave. In the elevator mirror, my belly looks thin."
        }
      ]
    },
    "K1": {
      "title": "Inside the Net",
      "text": "The kid sleeps sprawled out like a starfish. The foot sticking out from under the blanket is soft. I could drink all I want. But I can't remember where the gap was. White netting closes me in on every side.",
      "choices": [
        {
          "t": "Drink my fill, then feel for the gap",
          "msg": "I drink till I'm about to burst. I feel along the net for a long time and find the lifted corner.",
          "hurt": {
            "msg": "My leg catches in the net, and I struggle a long time."
          }
        },
        {
          "t": "Cling to the top of the net till morning",
          "msg": "In the morning the mom pulls the net back. I slip out.",
          "risk": {
            "msg": "\"Mom, there's a mosquito in the net!\" A hand with a tissue reaches in."
          }
        },
        {
          "t": "Just a sip, then get out",
          "msg": "One sip, then I find the corner of the net. The kid's toes wiggle."
        },
        {
          "t": "Go eeeee in the kid's ear",
          "msg": "The kid wakes up and yanks the net open. \"Mom, a mosquito!\" I slip out.",
          "hurt": {
            "msg": "The wind from the kid's slap throws me into the wall."
          }
        }
      ]
    },
    "M9": {
      "title": "Downpour",
      "text": "A sudden downpour hits the park. One raindrop weighs fifty times what I do. By a bench, someone is waiting out the rain under an umbrella. I can see bare legs.",
      "choices": [
        {
          "t": "Hang under a leaf",
          "msg": "The underside of the leaf is dry. I hold on to a vein with my legs and rest till the rain stops."
        },
        {
          "t": "Fly between the raindrops",
          "msg": "If one hits, I just bounce off. I take a few hits and live.",
          "risk": {
            "msg": "One raindrop comes straight down on me."
          }
        },
        {
          "t": "Go to the calf under the umbrella",
          "msg": "No rain under the umbrella. I drink slowly from a calf.",
          "hurt": {
            "msg": "The person shakes out the umbrella. A water drop knocks me into the grass."
          }
        },
        {
          "t": "Wait under the bench",
          "msg": "The ground under the bench is dry. I keep my legs folded till the rain stops."
        }
      ]
    },
    "M10": {
      "title": "Electric Swatter",
      "text": "Back at the guardhouse. While I was gone, the old guard bought an electric swatter. It leans against the desk and sometimes sparks blue. His ankle smells of itch cream. That's where I bit him first.",
      "choices": [
        {
          "t": "The other ankle, no cream",
          "msg": "One sip from the other ankle. In his sleep, he slaps his knee again.",
          "hurt": {
            "msg": "He swings the swatter. A blue spark snaps right beside me."
          }
        },
        {
          "t": "Past his ear to his neck",
          "msg": "Eeeee— he swings the swatter and only hits the radio. Meanwhile, one sip from his neck.",
          "risk": {
            "msg": "He opens his eyes. The mesh is right in front of me."
          }
        },
        {
          "t": "Wait in the shade under the desk",
          "msg": "I wait till he snores. I drink a little from a toe poking out of his slipper."
        },
        {
          "t": "Rest on the windowsill today",
          "msg": "I cling to the sill and listen to the radio. He and I both nod off."
        }
      ]
    },
    "M11": {
      "title": "The Red Basin Again",
      "text": "My wing tips are worn through. The monsoon rain has filled the red basin again. The basin I was born in. The old guard dozes in a chair beside it, holding a paper fan. His hand hangs down over the basin. My last eggs are inside me.",
      "choices": [
        {
          "t": "Land on the back of his hand",
          "msg": "I land on his hand. This time I don't bite. He opens his eyes a crack and looks at me. His hand goes up, and he slaps his own knee. I go down to the basin and lay my eggs."
        },
        {
          "t": "Lay my eggs in the basin now",
          "msg": "Standing on the water, I stick my eggs together one by one. A little raft of a hundred and forty."
        },
        {
          "t": "Go to the blue light by the guardhouse",
          "msg": "It's warm by the blue light. I warm up, then go down to the basin and lay my eggs.",
          "risk": {
            "msg": "The blue light is close. Inside the mesh, something goes zzt."
          }
        },
        {
          "t": "Go down by the parking garage pipes",
          "msg": "I want to rest somewhere cool. I follow the stairs slowly down."
        }
      ]
    }
  },
  "endings": {
    "H1": {
      "title": "His Blood",
      "cause": "old age",
      "line": "I fold my wings on the edge of the basin. Under the drain, my first babies are wriggling. Babies made from his blood. Tonight, he'll slap his own knee again."
    },
    "N1": {
      "title": "Eggs in the Basin",
      "cause": "old age",
      "line": "A single raft of eggs floats on the basin water. Next week he'll dump it out again. But tonight the basin is still."
    },
    "N2": {
      "title": "By the Pipes",
      "cause": "old age",
      "line": "It's cool and quiet by the pipes. I never laid my last eggs. From the top of the stairs, the sound of his radio drifts down."
    },
    "D1": {
      "title": "Poured Out",
      "cause": "a dumped basin",
      "line": "I poured out onto the flower bed with my brothers and sisters. My wings never dried."
    },
    "D2": {
      "title": "Red Dragonfly",
      "cause": "a red dragonfly",
      "line": "There was still watermelon juice on my mouth."
    },
    "D3": {
      "title": "Under the Streetlight",
      "cause": "a bat",
      "line": "All the little bugs under the light. The bats could see them too."
    },
    "D4": {
      "title": "Slap!",
      "cause": "a hand",
      "line": "That night, his hand hit his neck instead of his knee."
    },
    "D5": {
      "title": "Pillar Corner",
      "cause": "a house spider",
      "line": "Spiders like cool, quiet places too."
    },
    "D6": {
      "title": "Legs on the Water",
      "cause": "a pond skater",
      "line": "I thought I was the only one who could stand on water."
    },
    "D7": {
      "title": "White Flower Beds",
      "cause": "pest fogging",
      "line": "The flower beds are all white. He didn't know I was in there."
    },
    "D8": {
      "title": "Green Light",
      "cause": "a plug-in repellent",
      "line": "The kid never woke up. The green light blinked until morning."
    },
    "D9": {
      "title": "One Tissue",
      "cause": "a tissue",
      "line": "The mom folded the tissue tight. There was one red dot on it."
    },
    "D10": {
      "title": "Raindrop",
      "cause": "a downpour",
      "line": "My wings stuck to the water and wouldn't come off. The rain stopped soon after."
    },
    "D11": {
      "title": "Blue Spark",
      "cause": "an electric swatter",
      "line": "Zzt. His first catch ever."
    },
    "D12": {
      "title": "Blue Lamp",
      "cause": "a bug zapper",
      "line": "I only went because it was warm. The basin was right there."
    },
    "W0": {
      "title": "Worn Out",
      "cause": "exhaustion",
      "line": "I shake my wings, but no whine comes out."
    },
    "W1": {
      "title": "Empty Belly",
      "cause": "starvation",
      "line": "I can smell breath nearby, but I don't have the strength to fly to it."
    }
  }
});
