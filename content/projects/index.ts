export interface ProjectSheet {
  src: string;
  alt: string;
}

export interface Project {
  slug: string;
  title: string;
  typology: string;
  year: number;
  accent: string;
  iconId: string;
  description: string;
  location: string;
  sheets: ProjectSheet[];
}

export const projects: Project[] = [
  {
    slug: 'cibin',
    title: 'CIBIN',
    typology: 'RESIDENTIAL',
    year: 2023,
    accent: '#B7D7E8',
    iconId: 'Cibin',
    location: 'Romania',
    description: 'A residential proposal focused on rhythm, filtered light, and a slower daily routine, designed to bring together communal living and private retreat.',
    sheets: [
      { src: '/project-sheets-hires/1.jpg', alt: 'Isometric drawing of the CIBIN residential building, sheet 1 of 8' },
      { src: '/project-sheets-hires/2.jpg', alt: 'Architectural drawing of the CIBIN residential building, sheet 2 of 8' },
      { src: '/project-sheets-hires/3.jpg', alt: 'Architectural drawing of the CIBIN residential building, sheet 3 of 8' },
      { src: '/project-sheets-hires/4.jpg', alt: 'Architectural drawing of the CIBIN residential building, sheet 4 of 8' },
      { src: '/project-sheets-hires/5.jpg', alt: 'Architectural drawing of the CIBIN residential building, sheet 5 of 8' },
      { src: '/project-sheets-hires/6.jpg', alt: 'Architectural drawing of the CIBIN residential building, sheet 6 of 8' },
      { src: '/project-sheets-hires/7.jpg', alt: 'Architectural drawing of the CIBIN residential building, sheet 7 of 8' },
      { src: '/project-sheets-hires/8.jpg', alt: 'Architectural drawing of the CIBIN residential building, sheet 8 of 8' },
    ],
  },
  {
    slug: 'mures',
    title: 'MUREȘ',
    typology: 'CULTURAL',
    year: 2024,
    accent: '#E8B69B',
    iconId: 'Mures',
    location: 'Romania',
    description: 'A cultural centre shaped by the river and the neighbouring vernacular blocks, creating a continuous public threshold between gathering and reflection.',
    sheets: [],
  },
  {
    slug: 'tulcea',
    title: 'TULCEA',
    typology: 'LANDSCAPE',
    year: 2022,
    accent: '#BFD3B2',
    iconId: 'Tulcea',
    location: 'Romania',
    description: 'A landscape-led intervention proposing a quiet sequence of terraces, pathways, and observation points that reconnect the site to the delta edge.',
    sheets: [],
  },
  {
    slug: 'sibiu',
    title: 'SIBIU',
    typology: 'HOUSING',
    year: 2024,
    accent: '#C9B9D9',
    iconId: 'Sibiu',
    location: 'Romania',
    description: 'Housing for a dense urban block where courtyards, stair cores, and roof terraces create multiple social layers within a compact footprint.',
    sheets: [],
  },
  {
    slug: 'oradea',
    title: 'ORADEA',
    typology: 'PAVILION',
    year: 2021,
    accent: '#E9D9A0',
    iconId: 'Oradea',
    location: 'Romania',
    description: 'An experimental pavilion intended to test thresholds between public movement and sheltered rest through material contrast and openness.',
    sheets: [],
  },
  {
    slug: 'brasov',
    title: 'BRAȘOV',
    typology: 'SCHOOL',
    year: 2025,
    accent: '#E3A9A6',
    iconId: 'Brasov',
    location: 'Romania',
    description: 'A school for the mountain edge, balancing flexible classrooms, collaborative studios, and generous daylight in a compact assembly of volumes.',
    sheets: [],
  },
];

export default projects;
