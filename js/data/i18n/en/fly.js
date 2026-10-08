/* 똥파리 영어판 문장. 모양은 js/data/species/fly.js와 같고 문장만 담는다 (js/core/i18n.js overlayText) */
(function register(text) {
  if (typeof module !== 'undefined' && module.exports) module.exports = text;
  else registerTranslation('en', 'fly', text);
})({
  "name": "Fly",
  "place": "a corner of the junkyard",
  "intro": "In a corner of the junkyard, in the dirt under a pile of dog poop, I slept for a few days as a pupa. I'm a housefly. People call me a dung fly. We live a month at most, they say. The dog chained up in this yard is twelve.",
  "kidUnit": "eggs",
  "scenes": {
    "F1": {
      "title": "Black Nose",
      "text": "I tear out of my pupa case and crawl up out of the dirt. My wings are still crumpled and damp. A black, wet nose comes close and sniffs. One nostril is bigger than my whole body.",
      "choices": [
        {
          "t": "Stay still till my wings dry",
          "msg": "The nose sniffs for a long time, then backs off. I lick the edge of the poop pile, little by little, and my wings spread out. A grandpa's voice, far off: \"Baekgu, dinner.\" So the nose is called Baekgu."
        },
        {
          "t": "Crawl onto the poop and lick",
          "msg": "Warm and rich. This is my very first meal. I'm a dung fly, after all.",
          "hurt": {
            "msg": "A puff of breath. I roll right off the pile."
          }
        },
        {
          "t": "Try flying right now",
          "msg": "Wobbly, but I'm up! I land on a rusty fridge door and catch my breath.",
          "risk": {
            "msg": "My wings weren't open yet. I drop to the ground. A sparrow turns its head."
          }
        },
        {
          "t": "Land on the tip of the nose",
          "msg": "The nose is wet and slick. I lick a little of the salty damp. The big head tilts.",
          "hurt": {
            "msg": "Achoo! The sneeze blows me into a sheet of metal."
          }
        }
      ]
    },
    "F2": {
      "title": "The Dented Pot",
      "text": "Grandpa pours dog food into a dented pot, then leftover rice and doenjang soup. The smell spreads across the yard. Flies swarm in. Baekgu whips his head around and snaps at the air. Tak. His teeth clack loud.",
      "choices": [
        {
          "t": "Lick the soup off the rim",
          "msg": "Soup splashed on the rim. I taste it with my feet first. Flies taste with their feet. Salty and savory.",
          "risk": {
            "msg": "Tak. The teeth clack right by my ear."
          }
        },
        {
          "t": "Wait till Baekgu's done eating",
          "msg": "Baekgu eats slowly. He doesn't have many teeth left. He licks the pot clean and walks off. The grease and two grains of rice at the bottom are mine."
        },
        {
          "t": "Rest on the sun-warm chain",
          "msg": "The chain is warm from the sun. Every time Baekgu moves, it clanks, and I sway with it."
        },
        {
          "t": "Grab a spilled grain of rice",
          "msg": "One grain of rice, spilled outside the pot. For me it's the size of a pillow.",
          "hurt": {
            "msg": "Grandpa's rubber boot stomps down right beside me. The gust knocks me over."
          }
        }
      ]
    },
    "F3": {
      "title": "Water Bowl",
      "text": "Midday. The dirt in the yard is hot. I'm drinking at the edge of the water bowl and I slip. My wings stick to the water and won't come off. A shadow falls over the bowl. Baekgu's come for a drink. A pink tongue comes down.",
      "choices": [
        {
          "t": "Climb up the side of the bowl",
          "msg": "Tiptoe by tiptoe, I climb the wall of the bowl. I just make it to the rim. Drying my wings takes half the day.",
          "hurt": {
            "msg": "The wall is slippery. I slide back in twice."
          }
        },
        {
          "t": "Grab onto the tongue",
          "msg": "The tongue scoops me up with the water and flicks me off. Splat in the dirt. I'm alive.",
          "risk": {
            "msg": "The tongue curls back in. Me with it."
          }
        },
        {
          "t": "Shake my wings like crazy",
          "msg": "I flap and flap, and one wing peels free of the water. I half-swim to the edge.",
          "hurt": {
            "msg": "More water splashes up and my wings get wetter. I float there a long time."
          }
        },
        {
          "t": "Go limp and float",
          "msg": "Baekgu laps the water, and it makes ripples. The ripples carry me to the edge. Then a puff from his nose pushes me right out of the bowl. Baekgu probably never knew I was there."
        }
      ]
    },
    "F4": {
      "title": "Nap",
      "text": "In the afternoon Baekgu naps in the shade of an old fridge. Grandpa nods off in a plastic chair. Under the chair is a half-finished bowl of makgeolli. A male fly has been following me around all day.",
      "choices": [
        {
          "t": "Drink from Baekgu's teary eyes",
          "msg": "The water pooled in the corner of his eye is salty. Baekgu blinks and rubs his face with a paw. Other flies crowd around his eyes too."
        },
        {
          "t": "Lick the makgeolli bowl",
          "msg": "Sour and sweet. The last sip Grandpa left. I feel so good I fly three laps around the chair leg.",
          "hurt": {
            "msg": "Spinning around, I nearly fall into the bowl. My head's swimming."
          }
        },
        {
          "t": "Rest in the sun on his ear tip",
          "msg": "The tip of his ear is fuzzy and sunny. It twitches once. Then Baekgu goes back to snoring. The male lands next to me. We mate that day."
        },
        {
          "t": "Follow the male to the junk pile",
          "msg": "We mate on the blade of a broken electric fan. The junk pile is warm from the sun.",
          "risk": {
            "msg": "Between the fan blades, there was a shiny thread."
          }
        }
      ]
    },
    "F5": {
      "title": "The 1-Ton Truck",
      "text": "At dawn Grandpa starts up his truck. He's going into town to collect cardboard. Baekgu gets up, wagging, and follows him out, then stops at the gate. That's as far as the chain goes.",
      "choices": [
        {
          "t": "Ride between the boxes in back",
          "msg": "I squeeze in between the flattened boxes. The truck rattles, and the yard gets smaller. Baekgu stands at the end of his chain and watches for a long time."
        },
        {
          "t": "Fly in the driver's window",
          "msg": "I lick instant-coffee powder spilled on the dashboard. Sweet. Wind comes in through the gap in the window.",
          "risk": {
            "msg": "Grandpa's palm comes flying."
          }
        },
        {
          "t": "Stay one more day with Baekgu",
          "msg": "I stay in the yard one more day. The shade of Baekgu's tail is cool. The next dawn, I take the truck."
        },
        {
          "t": "Hang on to the side mirror",
          "msg": "The wind presses me flat. In the mirror, the alley runs away backwards.",
          "hurt": {
            "msg": "The wind's too strong. I almost fall off the mirror."
          }
        }
      ]
    },
    "F6": {
      "title": "Mackerel Head",
      "text": "The truck stops behind the market. Styrofoam boxes are stacked at the fish shop's back door. A mackerel head floats in melted ice water. My belly feels heavy. It's time to lay my eggs. The shop lady sits there holding a fly swatter.",
      "choices": [
        {
          "t": "Lay eggs under the gills",
          "msg": "I eat a little gill meat, and in the shade underneath I lay a hundred and twenty eggs. In a day they'll be maggots. Eat well and grow, little ones."
        },
        {
          "t": "Eat the fish in the ice water",
          "msg": "The flesh in the ice water is cold and fishy. Delicious.",
          "risk": {
            "msg": "Smack. The swatter's shadow hit the water first."
          }
        },
        {
          "t": "Lay eggs in the garbage bag knot",
          "msg": "I lay my eggs in the knot of a food-waste bag. It smells good here too.",
          "hurt": {
            "msg": "A cat paws the bag open. I barely get away."
          }
        },
        {
          "t": "Rub my front legs in the shade",
          "msg": "I rub my front legs together, scrub scrub. I'm cleaning my feet. I taste with them, so they have to be clean."
        }
      ]
    },
    "F7": {
      "title": "Yellow Ribbon",
      "text": "I've come into the kitchen of a gukbap place in the market. A yellow ribbon dangles from the ceiling. It smells strongly of honey. But the flies stuck to it are just kicking their legs. In the corner, a blue light hums. I keep wanting to go to it.",
      "choices": [
        {
          "t": "Just lick the honey at the tip",
          "msg": "I stop just under the ribbon. I lick only the drop of honey at the tip and turn away.",
          "risk": {
            "msg": "My foot's stuck. The harder I pull, the more it sticks."
          }
        },
        {
          "t": "Pick up crumbs under the light",
          "msg": "I pick up fried-batter crumbs under the light. Overhead it goes zzt, zzt.",
          "risk": {
            "msg": "The light looked so warm. Just a little closer."
          }
        },
        {
          "t": "Follow the wall outside",
          "msg": "The honey smell follows me a long way. I don't look back."
        },
        {
          "t": "Lick the soup spilled on the floor",
          "msg": "Gukbap broth spilled by a table leg. Still warm.",
          "hurt": {
            "msg": "The closing-time mop sweeps right over me. I'm dizzy."
          }
        }
      ]
    },
    "F8": {
      "title": "Kimbap",
      "text": "The wind carries me all the way to a park. Someone on a bench is eating kimbap. I can smell the yellow pickled radish. But the hand keeps swatting at me. I've dodged it twice already.",
      "choices": [
        {
          "t": "Land just one more time",
          "msg": "Third try, I land on the end of the radish. Sour and sweet.",
          "risk": {
            "msg": "The third time, I didn't get away."
          }
        },
        {
          "t": "Pick up rice under the bench",
          "msg": "Two grains of rice under the bench. The hand only waves around up top.",
          "hurt": {
            "msg": "A fingertip grazes me and I go tumbling across the ground."
          }
        },
        {
          "t": "Rest on top of a streetlight",
          "msg": "Too high for the hand to reach. The smell of park grass drifts up. I wonder if Baekgu's ever smelled anything like this."
        },
        {
          "t": "Lick a thrown-away foil wrapper",
          "msg": "The foil by the trash can is shiny with sesame oil. I eat all I want, all by myself. My feet smell like sesame oil now."
        }
      ]
    },
    "F9": {
      "title": "Watermelon",
      "text": "The kitchen window of a first-floor apartment is open. Watermelon on the table, a food-waste bin under the sink. The owner is holding an electric fly swatter. There's a can of bug spray by the table too. The watermelon smells so good.",
      "choices": [
        {
          "t": "Eat the rind in the waste bin",
          "msg": "A watermelon rind hanging over the edge of the bin. Sweet and cool. The owner doesn't know yet."
        },
        {
          "t": "Go straight for the table",
          "msg": "Sweet! The swatter just barely misses me.",
          "risk": {
            "msg": "Something like a tennis racket swings. The net flashes blue."
          }
        },
        {
          "t": "Wait on the windowsill",
          "msg": "I wait for the owner to leave. The window shuts, and I'm on the outside."
        },
        {
          "t": "Pick up snack crumbs under the table",
          "msg": "A few snack crumbs. I keep low to the floor the whole time.",
          "risk": {
            "msg": "Psssht. A white fog comes down on me."
          }
        }
      ]
    },
    "F10": {
      "title": "White Fur",
      "text": "My wing tips are starting to fray. A familiar truck is parked behind the market. On a scrap of cardboard by the wheel, there are a few white hairs. I know the smell. It's Baekgu's fur. Grandpa is having lunch at the gukbap place.",
      "choices": [
        {
          "t": "Sit by Baekgu's fur and wait",
          "msg": "I sit by the fur. It smells like the dirt in the yard. Grandpa picks up that scrap of cardboard and tosses it in the back. Me too. The truck rattles off, home."
        },
        {
          "t": "Stay at the market",
          "msg": "There's no end to the food at the market. I watch the truck leave from on top of a fish box."
        },
        {
          "t": "Eat soup first, then hop on",
          "msg": "I fill up on broth and follow Grandpa's boots onto the truck.",
          "hurt": {
            "msg": "The truck leaves first. I chase after it and barely grab onto the back."
          }
        },
        {
          "t": "Ride on Grandpa's shoulder",
          "msg": "Grandpa's shoulder smells like sweat and like Baekgu. The truck rattles off, home.",
          "risk": {
            "msg": "Grandpa slaps the back of his neck."
          }
        }
      ]
    },
    "K1": {
      "title": "Market at Night",
      "text": "The shops pull their shutters down. In the fish box, my eggs have turned into maggots, wriggling. The market smells nice. But I keep thinking of the dirt in the yard. At dawn, Grandpa's truck stops by once more to pick up boxes.",
      "choices": [
        {
          "t": "Keep living here",
          "msg": "The market smells of lots of things, even at night. I decide to live here."
        },
        {
          "t": "Wait for the truck by the shutter",
          "msg": "I spend the night under the shutter. At dawn the truck comes. I climb in the back."
        },
        {
          "t": "Eat with my maggots",
          "msg": "Wriggle wriggle. My babies are eating their way into a fish head. I eat right beside them. At dawn the truck comes.",
          "hurt": {
            "msg": "A man dumps water into the box. I get drenched."
          }
        },
        {
          "t": "Go to the lit-up chicken place",
          "msg": "I eat fried batter out of a fried-chicken bag, then catch the dawn truck.",
          "risk": {
            "msg": "There was a blue light by the chicken place's door too."
          }
        }
      ]
    },
    "F11": {
      "title": "Monsoon Rain",
      "text": "The moment I'm back in the yard, the monsoon rain pours down. One raindrop is heavier than me. Baekgu is lying inside his doghouse. Warm breath puffs out of the doorway.",
      "choices": [
        {
          "t": "Go in next to Baekgu's belly",
          "msg": "Inside his belly fur it's warm and muggy. Baekgu puts his nose to my feet and sniffs for a long time. They must smell like the market, like gukbap. I stay there all night."
        },
        {
          "t": "Hide in a gap in the doghouse roof",
          "msg": "The gap between the roof boards is dry. I can hear Baekgu breathing underneath."
        },
        {
          "t": "Go eat from the pot in the rain",
          "msg": "I eat my fill of rain-soaked rice and dash into the doghouse.",
          "risk": {
            "msg": "A raindrop hits me and smashes me down into the pot."
          }
        },
        {
          "t": "Crawl into the old fridge",
          "msg": "There's dried kimchi juice on the fridge shelf.",
          "hurt": {
            "msg": "The wind slams the door shut. I'm stuck all night and squeeze out a crack in the morning."
          }
        }
      ]
    },
    "F12": {
      "title": "One Month",
      "text": "It's been a month. My wing tips are all frayed, so I can only fly low. Baekgu is lying down, facing where the sun sets. In the corner where I was born, there's fresh poop Baekgu left this morning. I have one last batch of eggs inside me.",
      "choices": [
        {
          "t": "Lay my last eggs where I was born",
          "msg": "Right on the dirt I crawled out of. I lay my eggs. In ten days, my babies will be drying their wings here."
        },
        {
          "t": "Fly to the tip of Baekgu's nose",
          "msg": "I laid my eggs in the poop pile. Now, to the tip of Baekgu's nose, low and slow."
        },
        {
          "t": "Fly to the sun on his ear tip",
          "msg": "I laid my eggs in the poop pile. Now I fly low, toward the sun on the tip of his ear."
        },
        {
          "t": "One sip from Baekgu's eyes",
          "msg": "I laid my eggs in the poop pile. The water in the corner of his eye is salty. It's my last day, so just one sip."
        }
      ]
    }
  },
  "endings": {
    "H1": {
      "title": "The Smell on My Feet",
      "cause": "old age",
      "line": "Baekgu's ear twitches once. Then he puts his nose to my feet and sniffs for a long time. They must smell like the market, the park, the watermelon. All places Baekgu's never been. In ten days my babies will be landing on your nose. Go easy on them, just once."
    },
    "N1": {
      "title": "Market Fly",
      "cause": "old age",
      "line": "I lived out my month on the fish boxes at the market. Sometimes the wind brought a smell of dirt, and I turned my head that way."
    },
    "N2": {
      "title": "Doghouse Roof",
      "cause": "old age",
      "line": "Baekgu shakes his head hard. His eyes are sore and runny, and he can't stand flies near his face. I was one of those flies. I sit on the doghouse roof and listen to him breathe."
    },
    "D1": {
      "title": "Wings Not Dry",
      "cause": "a sparrow",
      "line": "I should've waited a little longer. Wings dry so fast."
    },
    "D2": {
      "title": "Tak",
      "cause": "a dog",
      "line": "Baekgu was just annoyed. And I was just hungry."
    },
    "D3": {
      "title": "Gulp",
      "cause": "a dog",
      "line": "Baekgu was only having a drink. It was a hot day."
    },
    "D4": {
      "title": "The Old Fan",
      "cause": "a spider",
      "line": "The fan was broken, but the web was working just fine."
    },
    "D5": {
      "title": "Grandpa's Palm",
      "cause": "a hand",
      "line": "Grandpa doesn't know me. But I know his truck."
    },
    "D6": {
      "title": "Ice Water",
      "cause": "a fly swatter",
      "line": "One bite of mackerel. That was my last taste."
    },
    "D7": {
      "title": "Yellow Ribbon",
      "cause": "flypaper",
      "line": "The honey smelled so good. So that's why they were all stuck there."
    },
    "D8": {
      "title": "Blue Light",
      "cause": "a bug zapper",
      "line": "Some things you know better than, and you go anyway."
    },
    "D9": {
      "title": "Third Time",
      "cause": "a hand",
      "line": "It was one piece of pickled radish. The hand didn't miss the third time."
    },
    "D10": {
      "title": "Electric Swatter",
      "cause": "an electric swatter",
      "line": "Zzt. At least the last thing was the smell of watermelon."
    },
    "D11": {
      "title": "White Fog",
      "cause": "bug spray",
      "line": "It was a few snack crumbs. One breath, and my legs gave out."
    },
    "D12": {
      "title": "Rain in the Pot",
      "cause": "drowning",
      "line": "Rain filled the pot. It tasted like doenjang soup."
    },
    "W0": {
      "title": "Worn Out",
      "cause": "exhaustion",
      "line": "My wings won't buzz anymore. Let me rest in the sun a little."
    },
    "W1": {
      "title": "Empty Belly",
      "cause": "starvation",
      "line": "There's nothing left to taste with my feet."
    }
  }
});
