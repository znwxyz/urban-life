/* 비둘기 영어판 문장. 모양은 js/data/species/pigeon.js와 같고 문장만 담는다 (js/core/i18n.js overlayText) */
(function register(text) {
  if (typeof module !== 'undefined' && module.exports) module.exports = text;
  else registerTranslation('en', 'pigeon', text);
})({
  "name": "Pigeon",
  "place": "an air conditioner unit outside a low apartment",
  "intro": "I hatched on the stand of an air conditioner unit outside a third-floor apartment. A few twigs woven together. That's our home. Pigeons always lay exactly two eggs. So I have one little brother. City pigeons usually live three or four years.",
  "kidUnit": "chicks",
  "scenes": {
    "P1": {
      "title": "Next Door's AC Unit",
      "text": "Mom and Dad feed me thick stuff they bring up from their throats. They call it pigeon milk. Last night there was a big storm. This morning, on the AC unit next door, a pigeon I've never seen is soaked and shivering. Checkered wings. A green ring on one ankle.",
      "choices": [
        {
          "t": "Beg with my beak in Mom's",
          "msg": "Mom's throat went glug glug and she passed me something warm. My belly's full and round.",
          "hurt": {
            "msg": "I bonked heads with my brother. Stings around my eye."
          }
        },
        {
          "t": "Walk to the edge of the nest",
          "msg": "The next AC unit is two wing-spans away. The wet one lifts its head. Orange eyes. Same as mine.",
          "risk": {
            "msg": "My foot slips off the edge of the stand. My wings can only flap so far."
          }
        },
        {
          "t": "Coo at the wet one",
          "msg": "Coo. It cooed back. Its voice is hoarse. It must have been out in the rain all night."
        },
        {
          "t": "Burrow under my brother",
          "msg": "It's warm under my brother's belly. I slept hard to the sound of the AC fan. Mom woke me up to feed me."
        }
      ]
    },
    "P2": {
      "title": "The One Pecking Pebbles",
      "text": "All my feathers are in. Mom and Dad hardly feed me now. That means go. The ringed one is still in the alley. I call it Greenfoot. Greenfoot pecks a pebble, spits it out. Pecks, spits. Doesn't know how to find food out here, I guess. A cat sits under the wall.",
      "choices": [
        {
          "t": "Fly up to the power line",
          "msg": "Flap flap. My toes catch the wire. I did it! I can see the whole alley.",
          "hurt": {
            "msg": "I lost my grip on the wire and thudded onto a car roof."
          }
        },
        {
          "t": "Show Greenfoot how to peck rice",
          "msg": "I pecked a grain of rice outside the chicken place first. Greenfoot watched and pecked too. One grain, two. After that, it followed me everywhere.",
          "hurt": {
            "msg": "The cat crept closer and we both scrambled into the air. I scraped my wing on the wall."
          }
        },
        {
          "t": "Hop down and grab crumbs",
          "msg": "I rolled head over tail. But I got a piece of puffed rice cracker.",
          "risk": {
            "msg": "I hit the ground and my wings won't open. The cat stands up."
          }
        },
        {
          "t": "Stay in the nest one more day",
          "msg": "Mom fed me just one more time. Next morning I just flew."
        }
      ]
    },
    "P3": {
      "title": "Exit 2",
      "text": "There are over a hundred pigeons in the square outside the station. Every morning people pour out of the subway exit. They're all in a hurry, so they keep dropping things. Greenfoot seems scared of people's feet. It just circles the edge of the square.",
      "choices": [
        {
          "t": "Go for toast by the stairs",
          "msg": "Half a slice of toast! Egg still on it.",
          "hurt": {
            "msg": "The tip of a shoe kicked me. The person jumped too. \"Oh!\""
          }
        },
        {
          "t": "Bring a toast corner to Greenfoot",
          "msg": "I carried a corner over to the edge. Greenfoot ate about half, then pushed the rest toward me."
        },
        {
          "t": "Follow people down the stairs",
          "msg": "Hop, hop, down the stairs between dress shoes and sneakers. Where's everybody going? There's a big door open. I went in too."
        },
        {
          "t": "Take a bath in the fountain",
          "msg": "I spread my wings wide and splashed. Greenfoot slipped in too. We both got soaked."
        }
      ]
    },
    "B1": {
      "title": "The Subway",
      "text": "The doors closed. The floor rattles and it's dark out the window. Everyone's looking at their phone. Nobody looks at me. Only one kid sees me and tugs on her mom's sleeve. \"Mom, pigeons ride the subway too.\"",
      "choices": [
        {
          "t": "Get off at the next stop",
          "msg": "I ran out the second the doors opened. A station I've never seen. I went up the stairs and found my way by the sun. I got to our alley around sunset."
        },
        {
          "t": "Get the snack by the kid's feet",
          "msg": "The kid dropped a snack for me. I think on purpose. I got off at the next stop and flew a long way home.",
          "hurt": {
            "msg": "The train jolted and I hit my head on a seat leg."
          }
        },
        {
          "t": "Dash out the closing doors",
          "msg": "I squeezed through the gap. One tail feather got caught in the door and left with the train. By evening I was back in the alley.",
          "risk": {
            "msg": "The doors close faster than I thought."
          }
        },
        {
          "t": "Ride it to the end",
          "msg": "At the last stop, everyone got off. So did I. At the top of the stairs, there's a neighborhood I've never seen."
        }
      ]
    },
    "P4": {
      "title": "Under the Overpass",
      "text": "Monsoon season. Third day of rain. Everyone crowds under the overpass. Every ledge on the pillars has rows of sharp spikes. They put them there so pigeons can't sit. Up top, the green netting has a hole in it. Not one drop of rain gets in there.",
      "choices": [
        {
          "t": "Huddle with Greenfoot by a pillar",
          "msg": "Behind the pillar the rain doesn't splash as much. Greenfoot leans toward me. Smells like wet feathers."
        },
        {
          "t": "Go in through the net hole",
          "msg": "It's dry inside the net. First good sleep in ages.",
          "risk": {
            "msg": "Getting in was easy, but I can't see the way out. My toes are caught in the mesh."
          }
        },
        {
          "t": "Squeeze between the spikes",
          "msg": "I crammed myself between the spikes. Stayed out of the rain.",
          "hurt": {
            "msg": "I turned over in my sleep and a spike jabbed my chest."
          }
        },
        {
          "t": "Look for food in the rain",
          "msg": "I found ramen noodles swollen with rainwater.",
          "hurt": {
            "msg": "All my feathers got soaked and heavy. I shivered all night."
          }
        }
      ]
    },
    "P5": {
      "title": "The Vent",
      "text": "January. My feet are frozen. On the sidewalk outside the station there's a subway vent. Warm air comes up through the grate, so pigeons sit packed together on top. Every sunset, Greenfoot looks at the southern sky for a long time. I don't know what's there.",
      "choices": [
        {
          "t": "Puff up next to Greenfoot",
          "msg": "We both puffed up our feathers. We turned into two round balls. Greenfoot slept with its beak tucked on my shoulder."
        },
        {
          "t": "Push into the middle of the vent",
          "msg": "Warm from the soles of my feet up. I thawed out all night.",
          "hurt": {
            "msg": "Fighting for a spot, I got pecked on the head."
          }
        },
        {
          "t": "Get rice outside the corner store",
          "msg": "Lots of rice dropped from triangle kimbap.",
          "risk": {
            "msg": "I was watching the rice. I saw the motorbike light too late."
          }
        },
        {
          "t": "Go under the station stairs",
          "msg": "No wind under the stairs. I found a dropped piece of fish cake too.",
          "hurt": {
            "msg": "The cleaner shooed me with a mop. Now my feet are wet and even colder."
          }
        }
      ]
    },
    "P6": {
      "title": "Round and Round",
      "text": "It's spring. Greenfoot is acting strange. Puffing out its neck in front of me, dragging its tail on the ground, turning round and round. Coo-coo-coo-coo. Over there, a male with a shiny neck is turning the same way.",
      "choices": [
        {
          "t": "Follow the shiny male",
          "msg": "I followed the one with the rainbow neck. When I looked back, Greenfoot was still turning there."
        },
        {
          "t": "Put my beak in Greenfoot's",
          "msg": "Greenfoot brought up a little food and passed it to me. This is how pigeons pair up. Once a pair, it's for life."
        },
        {
          "t": "Peck them both away",
          "msg": "Too noisy. I pecked them both away. Then I ate all I wanted, by myself.",
          "hurt": {
            "msg": "The shiny male hit me in the face with his wing."
          }
        },
        {
          "t": "Sunbathe with Greenfoot",
          "msg": "We sat side by side, each with one wing lifted to the sun. That evening, Greenfoot turned round and round again. This time I turned too. We're a pair."
        }
      ]
    },
    "S1": {
      "title": "The Shiny Male",
      "text": "The male with the shiny neck follows me everywhere. He's good at bringing twigs too. But every sunset, Greenfoot sits alone at the edge of the square, looking south.",
      "choices": [
        {
          "t": "Build a nest with Shiny",
          "msg": "We built a nest behind a sign by the station. Every year we raised two chicks.",
          "hurt": {
            "msg": "I scraped my chest on the spikes on the sign."
          }
        },
        {
          "t": "Land next to Greenfoot",
          "msg": "I sat down next to Greenfoot. Greenfoot looked at me, surprised. Then it puffed up its neck and turned round and round. This time I turned too. We're a pair."
        },
        {
          "t": "Fly across the road to the park",
          "msg": "I saw the post at the end of the sound wall and just missed it. I settled in at the park.",
          "risk": {
            "msg": "I can see the trees right over there. I can just fly straight through."
          }
        },
        {
          "t": "Stay at the square alone",
          "msg": "Alone is fine. There's plenty to eat in the square."
        }
      ]
    },
    "P7": {
      "title": "Twenty-Two Twigs",
      "text": "We're building a nest. Greenfoot brings twigs one at a time, and I take them and lay them under my feet. That's how pigeons build. I get to choose where.",
      "choices": [
        {
          "t": "On an AC unit in my old alley",
          "msg": "The AC unit right next to the one I hatched on. Where Greenfoot sat soaked and shivering the day we met. Greenfoot brought twigs twenty-two times. I laid two eggs. Greenfoot brought grains of rice too, tucked between the twigs."
        },
        {
          "t": "Behind a pot on a balcony",
          "msg": "It's cozy behind the flowerpot. I laid two eggs.",
          "hurt": {
            "msg": "The window flew open. \"Oh my!\" I panicked and hit my wing on the window frame."
          }
        },
        {
          "t": "Behind a shop sign",
          "msg": "Rain doesn't get behind the sign. I laid two eggs.",
          "hurt": {
            "msg": "I scraped my chest on the spikes on the sign."
          }
        },
        {
          "t": "Eat first, decide later",
          "msg": "By the time I chose, all that was left was a spot by an AC pipe hole. Tight, but I laid two eggs.",
          "hurt": {
            "msg": "I had to fight another pigeon for the spot."
          }
        }
      ]
    },
    "P8": {
      "title": "Taking Turns",
      "text": "We take turns sitting on the eggs. Greenfoot has the day shift, I have the night. Around ten in the morning Greenfoot comes and pokes my side with its beak. Move, my turn. Then I go find food until evening.",
      "choices": [
        {
          "t": "Pick up crumbs in the square",
          "msg": "I found the end of a kimbap roll. In the evening I went back to the nest and switched places with Greenfoot.",
          "hurt": {
            "msg": "A bike wheel brushed my tail feathers."
          }
        },
        {
          "t": "Get bread by the restaurants",
          "msg": "I ate a whole bread crust. That'll keep me going.",
          "risk": {
            "msg": "Fishing line is wrapped around my toes. I shake and shake. It won't come off."
          },
          "hurt": {
            "msg": "A hair got wrapped around my toes. I limped for days."
          }
        },
        {
          "t": "Look for seeds on the park lawn",
          "msg": "I pecked all the grass seeds I wanted.",
          "risk": {
            "msg": "Everyone flies up at once. I'm the only one who looks up too late."
          }
        },
        {
          "t": "Watch the nest from the wire",
          "msg": "I sat on a wire where I could see the nest. Greenfoot was dozing, then jerked its head up and looked for me."
        }
      ]
    },
    "P9": {
      "title": "Rattle",
      "text": "Two chicks hatched. Patchy yellow fuzz. But the window by the nest rattles open and a woman looks out. She's holding a broom. \"Well, look at that. They built a nest here.\"",
      "choices": [
        {
          "t": "Spread my wings over the chicks",
          "msg": "I covered the chicks and didn't move. She looked for a long time. \"Leave when they're grown,\" she said, and shut the window. Both chicks grew up safe."
        },
        {
          "t": "Flap my wings at her",
          "msg": "She jumped and shut the window. Both chicks grew up safe.",
          "risk": {
            "msg": "She must be scared too. Here comes the broom."
          }
        },
        {
          "t": "Take turns guarding with Greenfoot",
          "msg": "Greenfoot and I took turns guarding the nest. Neither of us ate much. But both chicks grew up safe."
        },
        {
          "t": "Go get food first",
          "msg": "I came back with food and half the nest had been swept away. Only one chick was left."
        }
      ]
    },
    "P10": {
      "title": "The Fine",
      "text": "A banner went up in the square. Feeding pigeons means a fine. The grandma who tore up bread for us every morning walks by empty-handed now. She puts her hand in her pocket, then takes it out again. Everyone's hungry. Someone scattered pink grains around.",
      "choices": [
        {
          "t": "Eat the pink grains",
          "msg": "Strangely, nothing happened. Lucky, I guess.",
          "risk": {
            "msg": "My throat is burning. They put it out on purpose."
          }
        },
        {
          "t": "Follow the grandma",
          "msg": "She turned the corner, then dropped a bread crust from her pocket. Like it was an accident. Greenfoot and I shared it."
        },
        {
          "t": "Fly to the river with Greenfoot",
          "msg": "The grass by the river has lots of seeds. The trip there and back took all day.",
          "hurt": {
            "msg": "The river wind pushed me into a bridge railing."
          }
        },
        {
          "t": "Wait it out on the AC unit",
          "msg": "I spent the whole day without moving. My stomach is growling. So is Greenfoot's."
        }
      ]
    },
    "P11": {
      "title": "South",
      "text": "Six years have gone by. Greenfoot's legs have gotten thin, and the green ring is loose. Our chicks are all grown and live in the station square. At sunset, Greenfoot still looks south. Today it looks back at me once, then spreads its wings.",
      "choices": [
        {
          "t": "Follow Greenfoot south",
          "msg": "We crossed the river and flew over so many apartment blocks. Before sunset, Greenfoot landed on a rooftop. There's a pigeon loft made of wood and wire. And an old man."
        },
        {
          "t": "Stay on the AC unit and wait",
          "msg": "Greenfoot got smaller and smaller in the southern sky. That night the nest felt big."
        },
        {
          "t": "Take the lead",
          "msg": "I took off first. But only Greenfoot knows where south is. Greenfoot slipped ahead and led the way. Before sunset we reached a rooftop. There's a pigeon loft made of wood and wire. And an old man."
        },
        {
          "t": "Sleep on it, go tomorrow",
          "msg": "Next morning, Greenfoot wasn't on the AC unit."
        }
      ]
    }
  },
  "endings": {
    "H1": {
      "title": "The Rooftop Loft",
      "cause": "old age",
      "line": "The old man looked at the ring on Greenfoot's ankle and laughed for a long time. \"Six years! And you brought a mate?\" He scattered a handful of beans for us. My first beans ever. They're hard. Now I know why Greenfoot pecked at pebbles in the alley."
    },
    "N1": {
      "title": "Square Pigeon",
      "cause": "old age",
      "line": "I grew old as a square pigeon. At sunset, sometimes I look south too. Did Greenfoot make it home?"
    },
    "N2": {
      "title": "A Checkered Feather",
      "cause": "old age",
      "line": "One of Greenfoot's feathers was left on the AC unit. Checkered. I laid it at the very bottom of the nest."
    },
    "N3": {
      "title": "End of the Line",
      "cause": "old age",
      "line": "Pigeons at the end of the line coo a little differently. I grew old there. Every time the subway doors opened, I looked to see if Greenfoot would get off."
    },
    "D1": {
      "title": "First Flight",
      "cause": "a stray cat",
      "line": "I should have stayed in the nest one more day."
    },
    "D2": {
      "title": "Closing Doors",
      "cause": "subway doors",
      "line": "I didn't know doors could close that fast."
    },
    "D3": {
      "title": "The Green Net",
      "cause": "tangled in a net",
      "line": "You could only see the hole from the way in."
    },
    "D4": {
      "title": "Headlight",
      "cause": "a motorbike",
      "line": "All I could see was rice."
    },
    "D5": {
      "title": "String on My Toes",
      "cause": "fishing line",
      "line": "My toes turned black. I can't stand up anymore."
    },
    "D6": {
      "title": "The Broom",
      "cause": "a broom",
      "line": "She was scared. So was I."
    },
    "D7": {
      "title": "Shadow in the Sky",
      "cause": "a goshawk",
      "line": "I was watching the seeds. I didn't watch the sky."
    },
    "D8": {
      "title": "Pink Grains",
      "cause": "poison",
      "line": "I was hungry. That's all."
    },
    "D9": {
      "title": "The Clear Sound Wall",
      "cause": "a glass wall",
      "line": "There was nothing there. I'm sure there was nothing there."
    },
    "W0": {
      "title": "Too Weak",
      "cause": "weakness",
      "line": "My wings won't lift anymore."
    },
    "W1": {
      "title": "Starving",
      "cause": "starvation",
      "line": "They say the city's full of food. Today I couldn't find any."
    }
  }
});
