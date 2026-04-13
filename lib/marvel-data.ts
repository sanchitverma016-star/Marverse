export interface MarvelItem {
  id: number;
  title: string;
  type: "movie" | "series";
  phase: number;
  releaseOrder: number;
  tmdbId: number;
  prerequisite?: number[]; // TMDB IDs of movies to watch before
}

// Marvel Cinematic Universe content organized by phase
export const marvelMovies: MarvelItem[] = [
  // Phase 1
  { id: 1, title: "Iron Man", type: "movie", phase: 1, releaseOrder: 1, tmdbId: 1726 },
  { id: 2, title: "The Incredible Hulk", type: "movie", phase: 1, releaseOrder: 2, tmdbId: 1724, prerequisite: [1726] },
  { id: 3, title: "Iron Man 2", type: "movie", phase: 1, releaseOrder: 3, tmdbId: 10138, prerequisite: [1726] },
  { id: 4, title: "Thor", type: "movie", phase: 1, releaseOrder: 4, tmdbId: 10195 },
  { id: 5, title: "Captain America: The First Avenger", type: "movie", phase: 1, releaseOrder: 5, tmdbId: 1771 },
  { id: 6, title: "The Avengers", type: "movie", phase: 1, releaseOrder: 6, tmdbId: 24428, prerequisite: [1726, 1724, 10138, 10195, 1771] },
  
  // Phase 2
  { id: 7, title: "Iron Man 3", type: "movie", phase: 2, releaseOrder: 7, tmdbId: 68721, prerequisite: [24428] },
  { id: 8, title: "Thor: The Dark World", type: "movie", phase: 2, releaseOrder: 8, tmdbId: 76338, prerequisite: [10195, 24428] },
  { id: 9, title: "Captain America: The Winter Soldier", type: "movie", phase: 2, releaseOrder: 9, tmdbId: 100402, prerequisite: [1771, 24428] },
  { id: 10, title: "Guardians of the Galaxy", type: "movie", phase: 2, releaseOrder: 10, tmdbId: 118340 },
  { id: 11, title: "Avengers: Age of Ultron", type: "movie", phase: 2, releaseOrder: 11, tmdbId: 99861, prerequisite: [24428, 68721, 76338, 100402] },
  { id: 12, title: "Ant-Man", type: "movie", phase: 2, releaseOrder: 12, tmdbId: 102899, prerequisite: [99861] },
  
  // Phase 3
  { id: 13, title: "Captain America: Civil War", type: "movie", phase: 3, releaseOrder: 13, tmdbId: 271110, prerequisite: [100402, 99861, 102899] },
  { id: 14, title: "Doctor Strange", type: "movie", phase: 3, releaseOrder: 14, tmdbId: 284052 },
  { id: 15, title: "Guardians of the Galaxy Vol. 2", type: "movie", phase: 3, releaseOrder: 15, tmdbId: 283995, prerequisite: [118340] },
  { id: 16, title: "Spider-Man: Homecoming", type: "movie", phase: 3, releaseOrder: 16, tmdbId: 315635, prerequisite: [271110] },
  { id: 17, title: "Thor: Ragnarok", type: "movie", phase: 3, releaseOrder: 17, tmdbId: 284053, prerequisite: [76338, 99861] },
  { id: 18, title: "Black Panther", type: "movie", phase: 3, releaseOrder: 18, tmdbId: 284054, prerequisite: [271110] },
  { id: 19, title: "Avengers: Infinity War", type: "movie", phase: 3, releaseOrder: 19, tmdbId: 299536, prerequisite: [271110, 284052, 283995, 315635, 284053, 284054] },
  { id: 20, title: "Ant-Man and the Wasp", type: "movie", phase: 3, releaseOrder: 20, tmdbId: 363088, prerequisite: [102899, 271110] },
  { id: 21, title: "Captain Marvel", type: "movie", phase: 3, releaseOrder: 21, tmdbId: 299537 },
  { id: 22, title: "Avengers: Endgame", type: "movie", phase: 3, releaseOrder: 22, tmdbId: 299534, prerequisite: [299536, 363088, 299537] },
  { id: 23, title: "Spider-Man: Far From Home", type: "movie", phase: 3, releaseOrder: 23, tmdbId: 429617, prerequisite: [299534, 315635] },
  
  // Phase 4
  { id: 24, title: "Black Widow", type: "movie", phase: 4, releaseOrder: 24, tmdbId: 497698, prerequisite: [271110] },
  { id: 25, title: "Shang-Chi and the Legend of the Ten Rings", type: "movie", phase: 4, releaseOrder: 25, tmdbId: 566525 },
  { id: 26, title: "Eternals", type: "movie", phase: 4, releaseOrder: 26, tmdbId: 524434, prerequisite: [299534] },
  { id: 27, title: "Spider-Man: No Way Home", type: "movie", phase: 4, releaseOrder: 27, tmdbId: 634649, prerequisite: [429617, 284052] },
  { id: 28, title: "Doctor Strange in the Multiverse of Madness", type: "movie", phase: 4, releaseOrder: 28, tmdbId: 453395, prerequisite: [284052, 634649] },
  { id: 29, title: "Thor: Love and Thunder", type: "movie", phase: 4, releaseOrder: 29, tmdbId: 616037, prerequisite: [284053, 299534] },
  { id: 30, title: "Black Panther: Wakanda Forever", type: "movie", phase: 4, releaseOrder: 30, tmdbId: 505642, prerequisite: [284054, 299534] },
  
  // Phase 5
  { id: 31, title: "Ant-Man and the Wasp: Quantumania", type: "movie", phase: 5, releaseOrder: 31, tmdbId: 640146, prerequisite: [363088, 299534] },
  { id: 32, title: "Guardians of the Galaxy Vol. 3", type: "movie", phase: 5, releaseOrder: 32, tmdbId: 447365, prerequisite: [283995, 299534] },
  { id: 33, title: "The Marvels", type: "movie", phase: 5, releaseOrder: 33, tmdbId: 609681, prerequisite: [299537] },
  { id: 34, title: "Deadpool & Wolverine", type: "movie", phase: 5, releaseOrder: 34, tmdbId: 533535 },
  { id: 35, title: "Captain America: Brave New World", type: "movie", phase: 5, releaseOrder: 35, tmdbId: 822119, prerequisite: [88396] },
  { id: 36, title: "Thunderbolts*", type: "movie", phase: 5, releaseOrder: 36, tmdbId: 986056, prerequisite: [497698, 299534] },
  
  // Phase 6
  { id: 37, title: "Fantastic Four: First Steps", type: "movie", phase: 6, releaseOrder: 37, tmdbId: 617126 },
];

export const marvelSeries: MarvelItem[] = [
  // Phase 2 (Netflix Era)
  { id: 100, title: "Marvel's Iron Fist Season 1", type: "series", phase: 2, releaseOrder: 1, tmdbId: 62127 },
  
  // Phase 3 (Netflix Era)
  { id: 99, title: "Marvel's Iron Fist Season 2", type: "series", phase: 3, releaseOrder: 1, tmdbId: 62127 },
  
  // Phase 4
  { id: 101, title: "WandaVision", type: "series", phase: 4, releaseOrder: 1, tmdbId: 85271, prerequisite: [99861, 299534] },
  { id: 102, title: "The Falcon and the Winter Soldier", type: "series", phase: 4, releaseOrder: 2, tmdbId: 88396, prerequisite: [100402, 299534] },
  { id: 103, title: "Loki", type: "series", phase: 4, releaseOrder: 3, tmdbId: 84958, prerequisite: [24428, 299534] },
  { id: 104, title: "What If...? Season 1", type: "series", phase: 4, releaseOrder: 4, tmdbId: 91363, prerequisite: [299534] },
  { id: 105, title: "Hawkeye", type: "series", phase: 4, releaseOrder: 5, tmdbId: 88329, prerequisite: [99861, 299534] },
  { id: 106, title: "Moon Knight", type: "series", phase: 4, releaseOrder: 6, tmdbId: 92749 },
  { id: 107, title: "Ms. Marvel", type: "series", phase: 4, releaseOrder: 7, tmdbId: 92782, prerequisite: [299537] },
  { id: 108, title: "She-Hulk: Attorney at Law", type: "series", phase: 4, releaseOrder: 8, tmdbId: 92783, prerequisite: [1724, 299534] },
  { id: 114, title: "I Am Groot Season 1", type: "series", phase: 4, releaseOrder: 10, tmdbId: 114461, prerequisite: [118340] },
  
  // Phase 5
  { id: 109, title: "Secret Invasion", type: "series", phase: 5, releaseOrder: 11, tmdbId: 114472, prerequisite: [299537, 299534] },
  { id: 110, title: "Loki Season 2", type: "series", phase: 5, releaseOrder: 12, tmdbId: 84958, prerequisite: [84958] },
  { id: 112, title: "Agatha All Along", type: "series", phase: 5, releaseOrder: 14, tmdbId: 138501, prerequisite: [85271] },
  { id: 115, title: "I Am Groot Season 2", type: "series", phase: 5, releaseOrder: 15, tmdbId: 114461, prerequisite: [114461] },
  { id: 116, title: "What If...? Season 2", type: "series", phase: 5, releaseOrder: 16, tmdbId: 91363, prerequisite: [91363] },
  { id: 117, title: "What If...? Season 3", type: "series", phase: 5, releaseOrder: 17, tmdbId: 91363, prerequisite: [91363] },
  { id: 118, title: "X-Men '97 Season 1", type: "series", phase: 5, releaseOrder: 18, tmdbId: 138502 },
  
  // Phase 6
  { id: 120, title: "Daredevil: Born Again Season 1", type: "series", phase: 6, releaseOrder: 20, tmdbId: 202555, prerequisite: [88329] },
  { id: 121, title: "Daredevil: Born Again Season 2", type: "series", phase: 6, releaseOrder: 21, tmdbId: 202555, prerequisite: [202555] },
  { id: 123, title: "Marvel Zombies", type: "series", phase: 6, releaseOrder: 23, tmdbId: 114463, prerequisite: [91363] },
  { id: 124, title: "Ironheart", type: "series", phase: 6, releaseOrder: 24, tmdbId: 114471, prerequisite: [505642] },
];

export function getMarvelByPhase(phase: number, type: "movie" | "series"): MarvelItem[] {
  const items = type === "movie" ? marvelMovies : marvelSeries;
  return items.filter(item => item.phase === phase).sort((a, b) => a.releaseOrder - b.releaseOrder);
}

export function getAllPhases(): number[] {
  const moviePhases = [...new Set(marvelMovies.map(m => m.phase))];
  const seriesPhases = [...new Set(marvelSeries.map(s => s.phase))];
  return [...new Set([...moviePhases, ...seriesPhases])].sort((a, b) => a - b);
}

export function getPrerequisites(item: MarvelItem): number[] {
  return item.prerequisite || [];
}
