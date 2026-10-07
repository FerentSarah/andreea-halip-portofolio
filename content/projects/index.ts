export interface Project {
  slug: string;
  title: string;
  typology: string;
  year: number;
  accent: string;
  iconId: string;
}

export const projects: Project[] = [
  { slug: 'cibin', title: 'CIBIN', typology: 'RESIDENTIAL', year: 2023, accent: '#B7D7E8', iconId: 'Cibin' },
  { slug: 'mures', title: 'MUREȘ', typology: 'CULTURAL', year: 2024, accent: '#E8B69B', iconId: 'Mures' },
  { slug: 'tulcea', title: 'TULCEA', typology: 'LANDSCAPE', year: 2022, accent: '#BFD3B2', iconId: 'Tulcea' },
  { slug: 'sibiu', title: 'SIBIU', typology: 'HOUSING', year: 2024, accent: '#C9B9D9', iconId: 'Sibiu' },
  { slug: 'oradea', title: 'ORADEA', typology: 'PAVILION', year: 2021, accent: '#E9D9A0', iconId: 'Oradea' },
  { slug: 'brasov', title: 'BRAȘOV', typology: 'SCHOOL', year: 2025, accent: '#E3A9A6', iconId: 'Brasov' }
];

export default projects;
