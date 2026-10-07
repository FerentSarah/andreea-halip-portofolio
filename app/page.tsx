import Image from 'next/image';
import homePhoto from '../home-photo.png';

export default function HomePage() {
  return (
    <main className="view home active show" id="homeView">
      <h1 className="sr-only">Andreea Halip</h1>
      <div className="home-inner">
        <div className="photo">
          <Image
            src={homePhoto}
            alt="Andreea Halip portrait"
            width={265}
            height={431}
            priority
          />
        </div>

        <div className="bio">
          <p>
            I am a fifth-year architecture student at the Technical University of Cluj-Napoca, Romania.
            During my studies, I had the opportunity to take part in two Erasmus exchanges, at Roma Tre
            University in Rome, Italy and at the Polytechnic University of Cartagena, in Spain, experiences
            that introduced me to different approaches to architecture.
          </p>
          <p>
            What interests me most is the relationship between architecture and human behaviour. Whether
            working at the scale of a city, a building, or a piece of furniture, we are ultimately designing
            for people. For me, understanding how they live, move, interact, and perceive space is an
            essential part of designing responsibly. I believe architecture should not begin with assumptions,
            but with observation, communication, and a genuine effort to understand.
          </p>
        </div>
      </div>
    </main>
  );
}
