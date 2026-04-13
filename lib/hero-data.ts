import { marvelMovies, type MarvelItem } from "./marvel-data";

export interface HeroCharacter {
  id: string;
  name: string;
  quote: string;
  glowColor: string;
  imagePosition: "left" | "right";
  borderColor: string;
  bgGradient: string;
  movieTitles: string[];
  imagePath: string;
}

// Get movies by hero name
function getMoviesByHero(heroName: string): MarvelItem[] {
  return marvelMovies.filter(movie =>
    movie.title.toLowerCase().includes(heroName.toLowerCase())
  );
}

export const heroCharacters: HeroCharacter[] = [
  {
    id: "iron-man",
    name: "Iron Man",
    quote: "Big man in a suit of armor, take the off what you are ?....... Genius, billionaire, playboy, philanthropist.",
    glowColor: "from-red-500 to-red-600",
    imagePosition: "right",
    borderColor: "#EF4444",
    bgGradient: "hover:shadow-[0_0_30px_rgba(239,68,68,0.4)]",
    movieTitles: ["Iron Man", "Iron Man 2", "Iron Man 3"],
    imagePath: "/heroes/iron-man.jpg",
  },
  {
    id: "captain-america",
    name: "Captain America",
    quote: "On your left.....on your left.....on your left.....I can do that all day !",
    glowColor: "from-blue-500 to-blue-600",
    imagePosition: "left",
    borderColor: "#3B82F6",
    bgGradient: "hover:shadow-[0_0_30px_rgba(59,130,246,0.4)]",
    movieTitles: [
      "Captain America: The First Avenger",
      "Captain America: The Winter Soldier",
      "Captain America: Civil War",
      "Captain America: Brave New World",
    ],
    imagePath: "/heroes/captain-america.jpg",
  },
  {
    id: "thor",
    name: "Thor",
    quote: "Are you Thor God hammers...?",
    glowColor: "from-cyan-500 to-cyan-600",
    imagePosition: "right",
    borderColor: "#06B6D4",
    bgGradient: "hover:shadow-[0_0_30px_rgba(6,182,212,0.4)]",
    movieTitles: ["Thor", "Thor: The Dark World", "Thor: Ragnarok", "Thor: Love and Thunder"],
    imagePath: "/heroes/thor.jpg",
  },
  {
    id: "guardians",
    name: "Guardians of the Galaxy",
    quote: "We are Groot.",
    glowColor: "from-purple-500 to-purple-600",
    imagePosition: "left",
    borderColor: "#A855F7",
    bgGradient: "hover:shadow-[0_0_30px_rgba(168,85,247,0.4)]",
    movieTitles: [
      "Guardians of the Galaxy",
      "Guardians of the Galaxy Vol. 2",
      "Guardians of the Galaxy Vol. 3",
    ],
    imagePath: "/heroes/guardians.jpg",
  },
  {
    id: "ant-man",
    name: "Ant-Man",
    quote: "It is a secret.",
    glowColor: "from-red-900 to-red-800",
    imagePosition: "right",
    borderColor: "#991B1B",
    bgGradient: "hover:shadow-[0_0_30px_rgba(153,27,27,0.4)]",
    movieTitles: ["Ant-Man", "Ant-Man and the Wasp", "Ant-Man and the Wasp: Quantumania"],
    imagePath: "/heroes/ant-man.jpg",
  },
  {
    id: "spider-man",
    name: "Spider-Man",
    quote: "With great powers comes with great responsibilities",
    glowColor: "from-blue-500 via-red-500 to-red-600",
    imagePosition: "left",
    borderColor: "#3B82F6",
    bgGradient: "hover:shadow-[0_0_30px_rgba(59,130,246,0.3),0_0_30px_rgba(239,68,68,0.3)]",
    movieTitles: [
      "Spider-Man: Homecoming",
      "Spider-Man: Far From Home",
      "Spider-Man: No Way Home",
    ],
    imagePath: "/heroes/spider-man.jpg",
  },
];

export function getMoviesByHeroId(heroId: string): MarvelItem[] {
  const hero = heroCharacters.find(h => h.id === heroId);
  if (!hero) return [];

  return marvelMovies.filter(movie =>
    hero.movieTitles.some(title =>
      movie.title.toLowerCase() === title.toLowerCase()
    )
  );
}
