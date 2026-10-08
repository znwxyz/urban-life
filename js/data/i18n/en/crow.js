/* 까마귀 영어판 문장. 모양은 js/data/species/crow.js와 같고 문장만 담는다 (js/core/i18n.js overlayText) */
(function register(text) {
  if (typeof module !== 'undefined' && module.exports) module.exports = text;
  else registerTranslation('en', 'crow', text);
})({
  "name": "Crow",
  "place": "a nest at the top of a zelkova tree in an apartment complex",
  "intro": "I hatched at the top of a zelkova tree in an apartment complex. Mom and Dad built our house out of wire coat hangers they stole from balconies. City crows usually live seven or eight years. We never forget a face.",
  "kidUnit": "eggs",
  "scenes": {
    "K1": {
      "title": "Coat Hanger Nest",
      "text": "My three brothers and sisters open their red mouths wide. Wires poke up from the bottom of the nest and dig into my butt. And a magpie down there has been staring up at our nest for a while. I don't like the look in its eye.",
      "choices": [
        {
          "t": "Open my mouth the widest",
          "msg": "Dad pushed a caterpillar deep down my throat. The loudest one wins. Obviously.",
          "hurt": {
            "msg": "My brother shoved me, and I scraped my wing on the end of a wire."
          }
        },
        {
          "t": "Climb up on the nest edge",
          "msg": "The wind gets between my feathers. I can see every apartment rooftop. The world's bigger than I thought.",
          "risk": {
            "msg": "My foot slipped. My wings don't listen to me yet."
          }
        },
        {
          "t": "Curl up under the others",
          "msg": "It's warm under their bellies. I'm a little hungry, but I slept well."
        },
        {
          "t": "Yell kaw at the magpie",
          "msg": "My yelling brought Dad, and he chased the magpie off. I helped.",
          "hurt": {
            "msg": "I stuck my neck out too far and bumped my chin on the edge of the nest."
          }
        }
      ]
    },
    "K2": {
      "title": "The Red Hair Clip",
      "text": "I've left the nest, but I can't fly high yet. I hop around the flower bed. Mom and Dad are busy dive-bombing a man's head. But a girl with a red hair clip squats down and looks at me. There's a peanut in her palm.",
      "choices": [
        {
          "t": "Take the peanut",
          "msg": "She put the peanut on the edge of the flower bed and stepped back three steps. \"I won't touch you.\" Round eyes, red hair clip. I memorized that face."
        },
        {
          "t": "Hide in the bushes",
          "msg": "Mom brought me food all day. Three days later, I flew all the way up to the wall."
        },
        {
          "t": "Hop to the parking lot",
          "msg": "There was a chip bag on the parking lot floor. I carried it back to the flower bed.",
          "risk": {
            "msg": "It's cool in the shade under the car. Then, suddenly, the engine starts."
          }
        },
        {
          "t": "Chase the man with Mom",
          "msg": "Kaw! I went for the back of his head too. He ran away. Ha.",
          "hurt": {
            "msg": "He swung his big umbrella and hit me."
          }
        }
      ]
    },
    "K3": {
      "title": "The Blue Cap",
      "text": "There are lots of cracker crumbs under the park bench. But a boy in a blue cap is picking up a stone. He threw one at me before, too. That face, that cap. I got a good look.",
      "choices": [
        {
          "t": "Get up on a high branch",
          "msg": "I looked down at him from the branch. I pressed his face into my head, hard."
        },
        {
          "t": "Finish the crumbs",
          "msg": "A stone landed next to me. Thunk. The crumbs are all mine.",
          "risk": {
            "msg": "Just one more… Whoosh. Something cuts through the air."
          }
        },
        {
          "t": "Kaw-kaw for my friends",
          "msg": "The crows from the neighborhood came and circled over his head, kaw-kawing. He ran off. Now we all know that face.",
          "hurt": {
            "msg": "His last stone grazed my tail."
          }
        },
        {
          "t": "Dig through the trash can",
          "msg": "I found the end of a kimbap roll. I spat out the pickled radish.",
          "hurt": {
            "msg": "The lid came down on my neck."
          }
        }
      ]
    },
    "K4": {
      "title": "Walnuts on the Crosswalk",
      "text": "It's fall. The walnuts in the flower bed are so hard my beak can't crack them. So I had a thought. If I put them on the crosswalk, the cars will run over them and crack them for me. When the light turns red and the cars stop, I go pick them up. Pretty smart, right?",
      "choices": [
        {
          "t": "Wait for the cars to stop",
          "msg": "When the cars stopped and people crossed, I hopped out between them and picked it up. Nutty and good."
        },
        {
          "t": "Grab it right after a car",
          "msg": "I snatched the cracked walnut and flew up a street tree. Okay, cars, crack me another one.",
          "risk": {
            "msg": "It cracked! Now. But a motorbike shoots out between the cars."
          }
        },
        {
          "t": "Drop it from up high",
          "msg": "After ten drops, it finally cracked a little. My beak is buzzing."
        },
        {
          "t": "Steal someone else's walnut",
          "msg": "The crow next to me looked away, and swoosh. Sorry. Finders keepers.",
          "hurt": {
            "msg": "The owner chased me and pecked the back of my head."
          }
        }
      ]
    },
    "K5": {
      "title": "Winter Night Wires",
      "text": "On winter nights, all the neighborhood crows gather. Enough to turn several power lines black. Packed in tight, it's less cold. People below cover their heads and run, scared of getting pooped on. The transformer on the pole hums and gives off warmth.",
      "choices": [
        {
          "t": "Squeeze into the middle",
          "msg": "The crows on both sides kept me warm all night. My stomach was empty, though."
        },
        {
          "t": "Sit on the transformer",
          "msg": "The top of the transformer is lukewarm. Like having a hotel room all to myself.",
          "risk": {
            "msg": "I'm thawing out. I stretch, and the tip of my wing touches the next wire."
          }
        },
        {
          "t": "Dig through trash at night",
          "msg": "I found a fried chicken box. There's a lot of meat on the bones.",
          "hurt": {
            "msg": "It was too dark to see the cat. I left a tail feather behind and got away."
          }
        },
        {
          "t": "Sleep alone in a street tree",
          "msg": "Nice and quiet. No chatterboxes. I slept well.",
          "hurt": {
            "msg": "The wind went right through me. I shivered all night."
          }
        }
      ]
    },
    "K6": {
      "title": "Snowy Alley",
      "text": "The snow buried all the food. If I tear open the trash bags put out by the pole, there are chicken bones. Over there, a rat is lying in the snow. It's not moving. Free meat. Oh, and the girl with the red hair clip leaves peanuts on the apartment wall every morning now.",
      "choices": [
        {
          "t": "Tear open a trash bag",
          "msg": "One long rip with my beak, and chicken bones come tumbling out. A feast.",
          "hurt": {
            "msg": "The grandma next door yelled, \"You again!\" and threw her broom."
          }
        },
        {
          "t": "Eat the rat that isn't moving",
          "msg": "Frozen solid, but it filled me up. Lucky, I guess.",
          "hurt": {
            "msg": "I ate half, and my legs wobbled all day."
          },
          "risk": {
            "msg": "It tasted fine. But that night, my stomach starts to feel wrong."
          }
        },
        {
          "t": "Eat the peanuts on the wall",
          "msg": "8:10. She left the peanuts and went to school. On the way, she turned around and waved at me. She knows me too."
        },
        {
          "t": "Dig up my buried walnut",
          "msg": "I buried it under the leaves in the flower bed last fall. I dug through the snow, and there it was. What a memory I have."
        }
      ]
    },
    "K7": {
      "title": "Kroo-kroo",
      "text": "I'm two now. A young one, as young as me, the inside of its mouth still pink, keeps sitting next to me. It lowers its head, spreads its tail, and makes a strange sound, kroo-kroo. Then it drops a peanut in front of me.",
      "choices": [
        {
          "t": "Groom the back of its neck",
          "msg": "We picked through each other's neck feathers. We shared the peanut it brought. Once we pair up, it's for life."
        },
        {
          "t": "Eat the peanut and run",
          "msg": "Thanks. But I still want to have fun. I flew off to the young crows' gang."
        },
        {
          "t": "Chase off the rival",
          "msg": "Another one tried to cut in, and I gave him a beating in midair. I have a mate.",
          "hurt": {
            "msg": "We tangled in the air, and I lost a beakful of wing feathers."
          }
        },
        {
          "t": "Show off on a streetlight",
          "msg": "Wings wide open, kaw-kaw! It fell for me. I have a mate.",
          "risk": {
            "msg": "Kaw-kaw! But a shadow bigger than me is coming down from the sky."
          }
        }
      ]
    },
    "B1": {
      "title": "The Drifters",
      "text": "Those of us without mates hang out in a gang. The food waste bins behind the restaurants are our dinner table. When one of us figures out how to open a lid, everyone copies. But none of us has a nest to go back to.",
      "choices": [
        {
          "t": "Keep going with the gang",
          "msg": "Restaurants today, the market tomorrow. Living with no fixed place isn't so bad."
        },
        {
          "t": "Go back where I was born",
          "msg": "I went back to the apartments. The kroo-kroo one was still alone. This time, I left the peanut. I have a mate."
        },
        {
          "t": "Try opening the bin lid",
          "msg": "I lifted the latch with my beak. Everyone's staring at me. This is why you use your head. I ate my fill and flew home.",
          "hurt": {
            "msg": "The owner swung a ladle at me. The top of my head stings."
          }
        },
        {
          "t": "Cross the road to the market",
          "msg": "I got a fish head behind the fish shop at the market. With a full belly, I started missing home, so I went back.",
          "risk": {
            "msg": "I'm crossing low, and a car comes out from behind a bus."
          }
        }
      ]
    },
    "K8": {
      "title": "Wire Coat Hangers",
      "text": "My mate and I are building a nest. The top of a utility pole is high, and you can see everything. But there are too many wires. And the rack outside the dry cleaner's is hung with wire coat hangers. My mom built her house out of those, she said.",
      "choices": [
        {
          "t": "Build in the tree I was born in",
          "msg": "Top of the zelkova, the branch right next to where I hatched. Lots of bugs in the flower bed. We have four eggs.",
          "hurt": {
            "msg": "Snapping off a dry twig, I chipped the tip of my beak."
          }
        },
        {
          "t": "Build on top of a pole",
          "msg": "We set the nest between the wires. You can see the whole neighborhood. We have four eggs.",
          "risk": {
            "msg": "I landed between the wires with a wet twig in my beak. Zap."
          }
        },
        {
          "t": "Steal the cleaner's hangers",
          "msg": "Three wire hangers! It's a house no storm can shake. We have five eggs.",
          "hurt": {
            "msg": "The dry cleaner yelled, \"You little thief!\" and sprayed me with his spray bottle. My wings got wet, and I couldn't fly for a long time."
          }
        },
        {
          "t": "Eat first, then build",
          "msg": "We picked too late, so we ended up in a plane tree in the park. We have three eggs."
        }
      ]
    },
    "K9": {
      "title": "Beware of Crows",
      "text": "The chicks have left the nest. They're still hopping on the ground. When people come close, my heart nearly bursts. Then the blue cap walks by. The boy who threw stones at me. Taller now, same face. The management office put up a sign: \"Caution: Crow Attacks.\"",
      "choices": [
        {
          "t": "Dive at the blue cap only",
          "msg": "Whoosh, right over his head. His cap went flying. I let everyone else walk by. Three chicks flew up safe.",
          "hurt": {
            "msg": "He swung his bag and hit my wing."
          }
        },
        {
          "t": "Dive at everyone who comes",
          "msg": "No one could get near. All four are safe. But the complaints at the management office are piling up.",
          "hurt": {
            "msg": "Someone swung a big umbrella. Direct hit."
          }
        },
        {
          "t": "Just warn from the branch",
          "msg": "I only yelled kaw-kaw. A cat took one chick… Two are left."
        },
        {
          "t": "Go get food first",
          "msg": "I came back with a beak full of food. Only two were left."
        }
      ]
    },
    "K10": {
      "title": "The Wire Cage",
      "text": "A big wire cage showed up in the park. There's meat inside, and a crow is trapped in there, crying. It's a trap for catching crows. The way in is on top. There's no way out. A man in work clothes watches from far off.",
      "choices": [
        {
          "t": "Kaw a warning till I'm hoarse",
          "msg": "I kaw-kawed from the tree all day. Since then, no crow in the neighborhood goes near that cage. We don't forget a dangerous place."
        },
        {
          "t": "Get the meat out",
          "msg": "From the edge of the hole, I stuck in just my neck and tore off some meat. I didn't go in. I'm smart, remember?",
          "risk": {
            "msg": "Getting in was easy. I fly up, and there's wire over my head."
          }
        },
        {
          "t": "Go eat the wall peanuts",
          "msg": "The peanuts are on the apartment wall again today. Red Hair Clip, in middle school now, said, \"Hi.\""
        },
        {
          "t": "Leave for another town",
          "msg": "I flew across the river to the industrial park. Nobody knows me here. That's easier."
        }
      ]
    },
    "K11": {
      "title": "8:10",
      "text": "I'm almost eight. My wings aren't what they used to be. The girl is a grown-up now. A suit and a big bag. But the red hair clip is the same. Today again, at 8:10, she leaves peanuts on the wall. Our kids, born this spring, look down at her face from the power line.",
      "choices": [
        {
          "t": "Give her my favorite bottle cap",
          "msg": "I put my favorite shiny bottle cap where the peanuts go. She looked at it for a long time, smiled, and put it in her pocket."
        },
        {
          "t": "Teach the kids her face",
          "msg": "Kaw, kaw. That face is okay. The kids tilted their heads back and forth and memorized it."
        },
        {
          "t": "Eat the peanuts first",
          "msg": "Nutty. Same taste for eight years."
        },
        {
          "t": "Watch from the rooftop",
          "msg": "From the sunny rooftop railing, I watched her walk all the way to the bus stop."
        }
      ]
    }
  },
  "endings": {
    "H1": {
      "title": "A Row of Bottle Caps",
      "cause": "old age",
      "line": "On her windowsill, the bottle caps I gave her sit in a row. My grandkids know her face too. The face of the peanut person."
    },
    "N1": {
      "title": "The Drifters",
      "cause": "old age",
      "line": "No nest, but never a dull moment. I had friends in every alley."
    },
    "N2": {
      "title": "From Far Away",
      "cause": "old age",
      "line": "She probably doesn't know who I am. Still, I watched that face for eight years."
    },
    "N3": {
      "title": "The Factory Chimney",
      "cause": "old age",
      "line": "It was warm on top of the chimney. Sometimes I looked at the sky over the apartments across the river."
    },
    "D1": {
      "title": "First Wind",
      "cause": "a stray cat",
      "line": "I should've stayed in the nest one more day."
    },
    "D2": {
      "title": "The Road",
      "cause": "a car",
      "line": "I didn't know wheels were that fast."
    },
    "D3": {
      "title": "The Blue Cap",
      "cause": "a thrown stone",
      "line": "I'll remember that face to the very end."
    },
    "D4": {
      "title": "Cracked Walnut",
      "cause": "a motorbike",
      "line": "I should've waited for the light. Like people do."
    },
    "D5": {
      "title": "Power Line",
      "cause": "electrocution",
      "line": "I didn't know there was that much electricity in the wires."
    },
    "D6": {
      "title": "Free Meat",
      "cause": "rat poison",
      "line": "I should've wondered why that rat was lying there."
    },
    "D7": {
      "title": "Showing Off",
      "cause": "a goshawk",
      "line": "I just wanted to look good for that one."
    },
    "D8": {
      "title": "The Wire Cage",
      "cause": "a crow trap",
      "line": "Now I know why the one inside was crying like that."
    },
    "W0": {
      "title": "Worn Out",
      "cause": "weakness",
      "line": "I spread my wings, but my body won't follow."
    },
    "W1": {
      "title": "Starving",
      "cause": "starvation",
      "line": "All that clever thinking, and today I found nothing."
    }
  }
});
