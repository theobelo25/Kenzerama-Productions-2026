// Posters
import BC from "@/assets/posters/c&b-poster.webp";
// import JR from "@/assets/posters/j&r-poster.webp";
import OJ from "@/assets/posters/o&j-poster.webp";
import YM from "@/assets/posters/y&m-poster.webp";
import KM from "@/assets/posters/k&m-poster.webp";
import KD from "@/assets/posters/k&d-poster.webp";
import AK from "@/assets/posters/a&k-poster.webp";
import KJ from "@/assets/posters/k&j-poster.webp";
import PG from "@/assets/posters/p&g-poster.webp";
import MD from "@/assets/posters/m&d-poster.webp";

// Venues
import deltaKingstonWaterfront from "@/public/images/venues/delta-kingston-waterfront.webp";
// import hartHouse from "@/public/images/venues/Hart-House.webp";
import threeFeathersTerrace from "@/public/images/venues/three-feathers-terrace.webp";
import arlingtonEstate from "@/public/images/venues/arlington-estate.webp";
import kandmAirbnb from "@/public/images/venues/k-and-m-main.webp";
import ricardas from "@/public/images/venues/ricardas.webp";
import liunaStation from "@/public/images/venues/liuna-station.webp";
import millerLashHouse from "@/public/images/venues/miller-lash-house.webp";
import theSymes from "@/public/images/venues/the-symes.webp";

// Videos
import bandc from "@/videos/b_and_c_main.mp4";
// import jandr from "@/videos/j_and_r_main.mp4";
import oandj from "@/videos/o_and_j_main.mp4";
import yandm from "@/videos/y_and_m_main.mp4";
import kandm from "@/videos/k_and_m_main.mp4";
import kandd from "@/videos/k_and_d_main.mp4";
import aandk from "@/videos/a_and_k_main.mp4";
import kandj from "@/videos/k_and_j_main.mp4";
import pandg from "@/videos/g_and_p_main.mp4";
import mandd from "@/videos/d_and_m_main.mp4";

export const filmData = [
  // Pallavi & Geoff - featured
  {
    id: 1,
    isFeatured: true,
    type: "film",
    category: "Wedding",
    slug: "palavi-and-geoff",
    title: "Palavi & Geoff",
    date: new Date("2025-08-23"),
    publishDate: new Date("2026-01-30"),
    poster: {
      image: PG,
      alt: "Pallavi & Geoff enjoying a moment together at their pre-wedding event.",
    },
    video: pandg,
    tags: ["video"],
    description:
      "Pallavi & Geoff celebrated their wedding over three beautiful days, culminating in an absolutely stunning event at the miller lash house.",
    details: {
      venue: {
        name: "Miller Lash House",
        location: "Scarborough, On",
        url: "https://www.millerlashhouse.ca/",
        image: millerLashHouse,
      },
      vendors: [
        {
          name: "Emily Li Photography",
          title: "Photographer",
          url: "https://emilyliphotography.com/",
        },
        {
          name: "Purpletree Photography",
          title: "Photographer",
          url: "https://www.purpletree.ca/",
        },
        {
          name: "JT Wedding Events",
          title: "Planning",
          url: "https://www.jtweddingevents.com/",
        },
        // {
        //   name: "khushwin Dhaliwal",
        //   title: "Hair",
        //   url: "https://khushwindhair.as.me/schedule/8272df94",
        // },
        // {
        //   name: "Jeige Beauty",
        //   title: "Hair",
        //   url: "https://www.instagram.com/jeigebeauty/?hl=en",
        // },
        // {
        //   name: "MUAVEE Makeup Studio",
        //   title: "Makeup",
        //   url: "https://muavee.com/",
        // },
        // {
        //   name: "Styled By Luxshanaa",
        //   title: "Saree",
        //   url: "https://styledbyluxshanaa.com/",
        // },
        {
          name: "Mandeep Gandhi Music",
          title: "DJ / Live Entertainment",
          url: "https://www.instagram.com/mandeepgandhimusic/?hl=en",
        },
        {
          name: "DJ Harman",
          title: "DJ",
          url: "https://www.instagram.com/djharman__/?hl=en",
        },
      ],
    },
  },
  // Mackenzie & Davis - featured
  {
    id: 2,
    isFeatured: true,
    type: "film",
    category: "Wedding",
    slug: "mackenzie-and-davis",
    title: "Mackenzie & Davis",
    date: new Date("2024-12-07"),
    publishDate: new Date("2026-01-30"),
    poster: {
      image: MD,
      alt: "Mackenzie and Davis walking into their wedding during their Grand Entrance.",
    },
    video: mandd,
    tags: ["video"],
    description:
      "Mackenzie and Davis celebrated a beautiful winter wedding with their family and friends at the stunning Arlington Estate venue.",
    details: {
      venue: {
        name: "The Arlington Estate",
        location: "Vaughan, On",
        url: "https://thearlingtonestate.com/",
        image: arlingtonEstate,
      },
      vendors: [
        {
          name: "Rise Event Planning",
          title: "Planning",
          url: "https://www.riseventplanning.com",
        },
        {
          name: "Powder Bride",
          title: "Dress",
          url: "https://www.instagram.com/powder_bride/",
        },
        {
          name: "Royal Orchid Florist",
          title: "Florist",
          url: "https://www.facebook.com/RoyalOrchidFlorist/#",
        },
        {
          name: "Event Graffiti",
          title: "Floor Wrap",
          url: "https://eventgraffiti.com/",
        },
      ],
    },
  },
  // Kaylee & Jake - featured
  {
    id: 3,
    isFeatured: true,
    type: "film",
    category: "Wedding",
    slug: "kaylee-and-jake",
    title: "Kaylee & Jake",
    date: new Date("2025-09-20"),
    publishDate: new Date("2026-01-30"),
    poster: {
      image: KJ,
      alt: "Kaylee & Jake sharing their first kiss as husband and wife.",
    },
    video: kandj,
    tags: ["video"],
    description:
      "Kaylee & Jake's day started with a unique photo/video session at Objx studio, after which, they headed to the Symes, a beautiful venue that was the perfect backdrop for their vows under the chuppah.",
    details: {
      venue: {
        name: "The Symes",
        location: "Toronto, On",
        url: "https://www.thesymes.ca/",
        image: theSymes,
      },
      vendors: [
        {
          name: "Fern Arielle",
          title: "Photographer",
          url: "https://www.fernariellephotography.com/",
        },
        {
          name: "Fab Fete Events",
          title: "Planning",
          url: "https://fabfeteevents.com/",
        },
        {
          name: "Chuppah.ca",
          title: "Chuppah",
          url: "https://chuppah.ca/",
        },
        {
          name: "Rose & Shine",
          title: "Florals",
          url: "https://www.roseandshine.ca/",
        },
        {
          name: "Kwento",
          title: "Cake",
          url: "https://www.make-kwento.com/",
        },
      ],
    },
  },
  // Caroline & Brennen
  {
    id: 4,
    isFeatured: false,
    type: "film",
    category: "Wedding",
    slug: "caroline-and-brennen",
    title: "Caroline & Brennen",
    date: new Date("2024-10-11"),
    publishDate: new Date("2025-11-19"),
    poster: {
      image: BC,
      alt: "Caroline & Brennen in a dramatic dip kiss, standing on the steps of their church, being cheered on by their family and friends.",
    },
    video: bandc,
    tags: ["video"],
    description:
      "Caroline & Brennan’s wedding in Kingston was a beautiful celebration filled with love, tradition, and timeless charm. Their ceremony took place in a stunning church that added a sense of reverence and warmth to the day. Afterward, we explored the picturesque campus of Queen’s University for their photo and video session, capturing elegant moments surrounded by classic architecture and natural beauty. Their film is a heartfelt reflection of a day full of joy, connection, and unforgettable scenery.",
    details: {
      venue: {
        name: "Delta Hotels Kingston Waterfront",
        location: "Kingston, On",
        url: "https://www.marriott.com/en-us/hotels/ygkdk-delta-hotels-kingston-waterfront/events/",
        image: deltaKingstonWaterfront,
      },
      vendors: [
        {
          name: "Mango Studios",
          title: "Photographer",
          url: "https://mangostudios.com/",
        },
      ],
    },
  },
  // Olivia & Jacob - featured
  {
    id: 5,
    isFeatured: true,
    type: "film",
    category: "Wedding",
    slug: "olivia-and-jacob",
    title: "Olivia & Jacob",
    date: new Date("2024-09-27"),
    publishDate: new Date("2025-11-19"),
    poster: {
      image: OJ,
      alt: "Olivia & Jacob facing away from the camera as they walk out for a romantic moment on the dock.",
    },
    video: oandj,
    tags: ["video"],
    description:
      "Olivia & Jacob’s wedding at Three Feathers Terrace was a perfect mix of rustic charm and lively celebration. Their ceremony and photo session took place on the venue’s gorgeous property, surrounded by nature and warm, earthy details that made the day feel intimate and serene. As the sun set, the energy shifted into an unforgettable party full of laughter, dancing, and pure joy. Their film captures the heart of a couple who truly know how to celebrate love.",
    details: {
      venue: {
        name: "Three Feathers Terrace",
        location: "Lefroy, On",
        url: "https://threefeathersterrace.com/",
        image: threeFeathersTerrace,
      },
      vendors: [
        {
          name: "BB Beauty Boutique",
          title: "Hair",
          url: "https://bbbeautyboutique.ca/",
        },
        {
          name: "Face Studio By Olivia",
          title: "Makeup",
          url: "https://www.facestudiobyolivia.com/",
        },
        {
          name: "Soiree Entertainment",
          title: "DJ",
          url: "https://www.soireedjs.com/",
        },
        // {
        //   name: "Melanie Cakes",
        //   title: "Cake",
        //   url: "https://www.melaniescakes.ca/",
        // },
        {
          name: "Mid Valley Garden",
          title: "Florals",
          url: "https://www.midvalleygardens.com/",
        },
        // {
        //   name: "Bubbly Walls",
        //   title: "Champagne Tower",
        //   url: "https://canvasrebel.com/",
        // },
        // {
        //   name: "Casal Catering",
        //   title: "Catering",
        //   url: "https://casalcatering.ca/",
        // },
        {
          name: "Ceremony Bridal Studio",
          title: "Dress + Veil",
          url: "https://ceremonybarrie.com/",
        },
        // {
        //   name: "Dancefloor Dynamic",
        //   title: "Dance Floor",
        //   url: "https://dancefloordynamics.com/",
        // },
        // {
        //   name: "Made and True",
        //   title: "Wedding Signs",
        //   url: "https://madeandtrue.com/",
        // },
        // {
        //   name: "Forever Paper Co.",
        //   title: "Invites + Table Menus",
        //   url: "https://foreverpaperco.co.uk/",
        // },
      ],
    },
  },
  // Yasmin & Michael - featured
  {
    id: 6,
    isFeatured: true,
    type: "film",
    category: "Wedding",
    slug: "yasmin-and-michael",
    title: "Yasmin & Michael",
    date: new Date("2022-10-07"),
    publishDate: new Date("2025-11-19"),
    poster: {
      image: YM,
      alt: "Yasmin & Michael from behind,cheering as they run into their reception hall during their grand entrance.",
    },
    video: yandm,
    tags: ["video"],
    description:
      "Yasmin & Michael’s wedding at The Arlington Estate was the perfect blend of sophistication and celebration. Their intimate ceremony was heartfelt and beautifully set against the elegant backdrop of the venue. As the day turned to night, the energy soared with a lively, joy-filled reception that had everyone on their feet. Their film captures the elegance, emotion, and electric atmosphere of a truly unforgettable day.",
    details: {
      venue: {
        name: "The Arlington Estate",
        location: "Vaughan, On",
        url: "https://thearlingtonestate.com/",
        image: arlingtonEstate,
      },
      vendors: [
        {
          name: "Classy Affairs",
          title: "Planning",
          url: "https://classyaffairsto.com/",
        },
        {
          name: "515 Photo Co.",
          title: "Photographer",
          url: "https://515photoco.com/",
        },
        {
          name: "Kleinfeld",
          title: "Dress",
          url: "https://www.instagram.com/kleinfeldcanada/?hl=en",
        },
        {
          name: "Ridolfi",
          title: "Suit",
          url: "https://www.ridolfishirts.com/",
        },
        // {
        //   name: "Toronto Floor Wraps",
        //   title: "Floor Wrap",
        //   url: "https://www.torontofloorwraps.com/",
        // },
        {
          name: "Robin Ellingwood",
          title: "Officiant",
          url: "https://www.gtaweddingofficiant.ca/",
        },
        // {
        //   name: "bbBlanc",
        //   title: "DJ",
        //   url: "https://www.bbblanc.com/",
        // },
        // {
        //   name: "Craft Photography",
        //   title: "Photo Booth",
        //   url: "https://craftphotos.ca/",
        // },
        {
          name: "Royal Orchid Florist",
          title: "Florist",
          url: "https://www.facebook.com/RoyalOrchidFlorist/#",
        },
      ],
    },
  },
  // Krista & Mitch - featured
  {
    id: 7,
    isFeatured: true,
    type: "film",
    category: "Elopement",
    slug: "krista-and-mitch",
    title: "Krista & Mitch",
    date: new Date("2024-10-04"),
    publishDate: new Date("2025-11-19"),
    poster: {
      image: KM,
      alt: "Krista & Mitch sitting for a quient moment on the dock after their ceremony.",
    },
    video: kandm,
    tags: ["video"],
    description:
      "Krista & Mitch’s wedding in Haliburtan was a heartfelt, intimate celebration held at a cozy cottage Airbnb surrounded by nature. With only their closest family and friends present, the day was filled with warmth, connection, and quiet joy. One of the most special parts was how they embraced every moment with their young children, making them a central part of the day’s memories. Their film is a tender reflection of love, family, and the beauty of keeping things close to home.",
    details: {
      venue: {
        name: "Muskoka Paddle House",
        location: "Bracebridge",
        url: "https://www.muskokapaddlehouse.com/",
        image: kandmAirbnb,
      },
      vendors: [
        {
          name: "Rene Dawn",
          title: "Photographer",
          url: "https://renedawnphotography.mypixieset.com/",
        },
        {
          name: "Krew Catering",
          title: "Catering",
          url: "https://www.krewcateringco.ca/",
        },
        {
          name: "Orillia Flowers",
          title: "Florals",
          url: "https://www.orilliaflowers.com/",
        },
      ],
    },
  },
  // Kristina & Dan - featured
  {
    id: 8,
    isFeatured: true,
    type: "film",
    category: "Wedding",
    slug: "kristina-and-dan",
    title: "Kristina & Dan",
    date: new Date("2024-11-02"),
    publishDate: new Date("2025-11-19"),
    poster: {
      image: KD,
      alt: "Kristina & Dan spraying champagne in the middle of Spadina Ave in Toronto.",
    },
    video: kandd,
    tags: ["video"],
    description:
      "Kristina & Dan’s wedding at Ricarda’s in Toronto was a vibrant and stylish celebration from start to finish. After their heartfelt ceremony, we hit the downtown streets for a fun and spontaneous photo session, capturing their love against the city’s lively backdrop. The celebration continued back at Ricarda’s with a stunning, high-energy reception full of laughter, dancing, and unforgettable moments. Their film is a joyful tribute to a couple whose day was as dynamic and full of life as they are.",
    details: {
      venue: {
        name: "Ricarda's",
        location: "Toronto, On",
        url: "https://www.ricardas.com/",
        image: ricardas,
      },
      vendors: [
        {
          name: "Classy Affairs",
          title: "Planning",
          url: "https://classyaffairsto.com/",
        },
        {
          name: "Jennifer See",
          title: "Photographer",
          url: "https://jenniferseestudios.com/",
        },
        // {
        //   name: "Sutton Place Hotel",
        //   title: "Hotel",
        //   url: "https://www.suttonplace.com/toronto/",
        // },
        {
          name: "Fable Floral Design",
          title: "Florals",
          url: "https://fablefloraldesign.com/",
        },
        // {
        //   name: "Toronto Floor Wraps",
        //   title: "Floor Wrap",
        //   url: "https://www.torontofloorwraps.com/",
        // },
        // {
        //   name: "Gervais Party Rentals",
        //   title: "Rentals",
        //   url: "https://www.gervaisrentals.com/",
        // },
        {
          name: "True Ceremonies",
          title: "Officiant",
          url: "https://www.trueceremonies.com/",
        },
        // {
        //   name: "Lavish Cupcakes",
        //   title: "Cake",
        //   url: "https://www.lavishcupcakes.com/",
        // },
        {
          name: "Stolen Hearts Bridal",
          title: "Dress",
          url: "https://www.stolenheartsbridal.com/",
        },
        // {
        //   name: "Indochino",
        //   title: "Suit",
        //   url: "https://www.indochino.com/",
        // },
      ],
    },
  },
  // Annie & Knickoy
  {
    id: 9,
    isFeatured: false,
    type: "film",
    category: "Wedding",
    slug: "annie-and-knickoy",
    title: "Annie & Knickoy",
    date: new Date("2023-09-03"),
    publishDate: new Date("2025-11-19"),
    poster: {
      image: AK,
      alt: "Annie & Knickoy standing outside of Liuna Station at the end of the night, enjoying a moment of peace and quiet, and a sip of champagne.",
    },
    video: aandk,
    tags: ["video"],
    description:
      "Annie & Knickoy knew after dating for over 8 years that they wanted to have a short engagement. They planned their wedding in under six months, and not one detail was missed. With family flying in from all over the world for this celebration, they wanted to create a WOW factor for their guests. From steel pan drums playing during cocktail hour to a delicious midnight buffet of Jamaican patties, their guests danced the night away until the wee hours of the morning!",
    details: {
      venue: {
        name: "Liuna Station",
        location: "Hamilton, On",
        url: "https://liunastation.com/",
        image: liunaStation,
      },
      vendors: [
        // {
        //   name: "Dundurn Castle",
        //   title: "Park",
        //   url: "https://www.hamilton.ca/things-do/hamilton-civic-museums/dundurn-national-historic-site",
        // },
        {
          name: "Frances Morency Photography",
          title: "Photographer",
          url: "https://francesmorency.com/",
        },
        {
          name: "818 Events",
          title: "Planning",
          url: "https://www.experience818events.com/",
        },
        // {
        //   name: "BLUNT Hair & Co",
        //   title: "Hair",
        //   url: "https://www.blunthairco.com/",
        // },
        // {
        //   name: "Two Chicks and some Lip Stick",
        //   title: "Makeup",
        //   url: "https://www.instagram.com/twochicksandsomelipstick/?hl=en",
        // },
        {
          name: "Chez Jordan Oakville",
          title: "Dress",
          url: "https://www.chezjordanoakville.com/",
        },
        // {
        //   name: "Andrew's Formals",
        //   title: "Suit",
        //   url: "http://andrewsformals-com.securec96.ezhostingserver.com/",
        // },
        {
          name: "Chris Kidc Stewart",
          title: "DJ",
          url: "https://www.instagram.com/djkidc7/?hl=en",
        },
        // {
        //   name: "Passion Letterpress",
        //   title: "Invitations",
        //   url: "https://passionletterpress.com/",
        // },
        // {
        //   name: "Nothing Sweeter Than You & Co.",
        //   title: "Cake",
        //   url: "https://www.instagram.com/nothingsweeterthanyoucakes/?hl=en",
        // },
        {
          name: "JunePlum by Patois",
          title: "Late Night Food",
          url: "https://www.juneplumtoronto.com/",
        },
      ],
    },
  },
  // {
  //   id: 2,
  //   isFeatured: true,
  //   type: "film",
  //   category: "Wedding",
  //   slug: "jennika-and-ryan",
  //   title: "Jennika & Ryan",
  //   date: new Date("2023-09-16"),
  //   publishDate: new Date("2025-11-19"),
  //   poster: {
  //     image: JR,
  //     alt: "Jennika facing away from the camera infront of a window inside Hart House, beautifully backlit with sun shining through her long veil.",
  //   },
  //   video: jandr,
  //   tags: ["video"],
  //   description:
  //     "Jennika & Ryan’s wedding at Hart House in Toronto was the perfect blend of elegance and romance. Their ceremony took place in the stunning Hart House courtyard, surrounded by ivy-covered walls and historic charm. After the vows, we wandered through the University of Toronto campus to capture timeless portraits against its iconic architecture. Their wedding film is a graceful tribute to a day filled with love, laughter, and classic Toronto beauty.",
  //   details: {
  //     venue: {
  //       name: "Hart House",
  //       location: "Toronto, On",
  //       url: "https://harthouse.ca/spaces/weddings",
  //       image: hartHouse,
  //     },
  //     vendors: [
  //       {
  //         name: "Beautique Events",
  //         title: "Planning",
  //         url: "https://www.beautiqueevents.com/",
  //       },
  //       {
  //         name: "Emily Michelson",
  //         title: "Photographer",
  //         url: "https://emilymichelson.com/",
  //       },
  //       {
  //         name: "Riverside Flower Shop",
  //         title: "Florals",
  //         url: "https://www.riversideflowershopsu.com/",
  //       },
  //       {
  //         name: "Sounds of Joy Toronto",
  //         title: "Musicians",
  //         url: "https://www.instagram.com/soundsofjoyto.weddingmusic/?hl=en",
  //       },
  //       {
  //         name: "The Marrying Lady",
  //         title: "Officiant",
  //         url: "https://www.sheisthemarryinglady.com/",
  //       },
  //       {
  //         name: "Maximum Music",
  //         title: "DJ",
  //         url: "https://maximumdj.com/",
  //       },
  //       {
  //         name: "Cakes By Robert",
  //         title: "Cake",
  //         url: "https://www.cakesbyrobert.com/",
  //       },
  //       {
  //         name: "Lea-Ann Belter",
  //         title: "Dress",
  //         url: "https://lea-annbelter.com/",
  //       },
  //     ],
  //   },
  // },
];
