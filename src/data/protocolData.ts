import { Tenet, AudioTrack, ExcerptPage } from '../types';

export const TENETS: Tenet[] = [
  {
    id: 'tenet-1',
    number: '01',
    title: 'THE SANCTITY OF VOLUNTARY ADVERSITY',
    subtitle: 'Physical Hardship as Daily Inoculation',
    coreRule: 'If suffering is not chosen deliberately, it will be imposed upon you ruthlessly.',
    description:
      'The modern psyche is softened through perpetual thermal, physical, and nutritional convenience. The warrior protocol mandates at least one non-negotiable bout of cold, muscle failure, or sustained exhaustion within the first 120 minutes of waking.',
    dailyDrill: '500 kettlebell swings or 5km run in rain/cold prior to digital engagement.',
    quote: 'Comfort is the anesthesia of potential.'
  },
  {
    id: 'tenet-2',
    number: '02',
    title: 'ELIMINATION OF HEDONIC LEAKS',
    subtitle: 'Closing the Cognitive Exhaust Ports',
    coreRule: 'Every reactive dopamine stimulus degrades your executive authority by 1.8%.',
    description:
      'Social feeds, trivial notifications, and casual stimulation leak mental pressure. Pressure when contained transforms into ruthless focus. Treat your attention like a pressurized combustion chamber.',
    dailyDrill: 'Zero audio-visual entertainment for 72 consecutive hours during creation sprints.',
    quote: 'The distracted mind is already occupied territory.'
  },
  {
    id: 'tenet-3',
    number: '03',
    title: 'TACTICAL SILENCE & STRATEGIC INVISIBILITY',
    subtitle: 'Do Not Announce the Strike Before It Lands',
    coreRule: 'Public proclamation releases the dopamine intended to fuel the execution.',
    description:
      'Amateurs broadcast intentions; masters reveal completed artifacts. When beginning a major physical or creative undertaking, tell no one outside your inner circle until the work exists as physical or digital reality.',
    dailyDrill: '30-day silence rule on all new projects until Phase 1 deployment is live.',
    quote: 'Move like shadows, strike like thunder.'
  },
  {
    id: 'tenet-4',
    number: '04',
    title: 'ABSOLUTE BODILY SUBJUGATION',
    subtitle: 'The Flesh Is a Tool, Not the Master',
    coreRule: 'Your mind does not ask your limbs for permission; it commands.',
    description:
      'The body negotiates when lactic acid builds, when breath is short, when sleep calls. The Iron Will severs the feedback loop between physical reluctance and motor execution.',
    dailyDrill: 'Hold an isometric horse stance for 4 minutes when fatigue first whispers surrender.',
    quote: 'The flesh will obey what the will demands.'
  },
  {
    id: 'tenet-5',
    number: '05',
    title: 'THE DUAL-BLADE PHILOSOPHY',
    subtitle: 'Synthesizing the Creator and the Destroyer',
    coreRule: 'The martial artist who cannot construct is incomplete; the creator who cannot fight is vulnerable.',
    description:
      'Never allow yourself to become merely an intellectual or merely a brute. The ancient warrior-monks cultivated brushwork, calligraphy, and poetry alongside kenjutsu. Build software, write code, forge businesses, and train combat daily.',
    dailyDrill: 'Split each day: 4 hours of deep cerebral creation, 2 hours of violent physical training.',
    quote: 'Pen in the left hand, katana in the right.'
  },
  {
    id: 'tenet-6',
    number: '06',
    title: 'SOVEREIGN COGNITIVE ARCHITECTURE',
    subtitle: 'Refusing Mediated Thought-Forms',
    coreRule: 'If you read what everyone else reads, you will think what everyone else thinks.',
    description:
      'Purge generic consensus opinion. Construct your worldview from primary sources, physiological observation, and immutable laws of physics and biology.',
    dailyDrill: 'Read only texts written prior to 1950 or raw scientific whitepapers for 30 days.',
    quote: 'Independence is not granted; it is fortified.'
  },
  {
    id: 'tenet-7',
    number: '07',
    title: 'DEATH CONTEMPLATION AS TEMPORAL FUEL',
    subtitle: 'Memento Mori as a Kinetic Accelerator',
    coreRule: 'You are dying continuously; laziness is merely premature burial.',
    description:
      'Every morning at dawn, envision your final breath. Recognize that this day is not guaranteed. Strip away hesitation, petty slights, and fear of social friction. You have no time for hesitation.',
    dailyDrill: '60 seconds of silent death meditation before crossing your workspace threshold.',
    quote: 'Act as if the blade has already parted your neck.'
  }
];

export const AUDIO_TRACKS: AudioTrack[] = [
  {
    id: 'track-1',
    title: 'PROTOCOL ZERO // BINAURAL COLD',
    bpm: '130 BPM',
    duration: '18:40',
    frequency: '432 Hz + 8 Hz Theta',
    purpose: 'Deep work induction & cognitive tunnel focus'
  },
  {
    id: 'track-2',
    title: 'KATANA RESIDUAL // HARSH DRONE',
    bpm: '142 BPM',
    duration: '22:15',
    frequency: '528 Hz Sub-Bass',
    purpose: 'Martial bag work, heavy deadlifts & sprints'
  },
  {
    id: 'track-3',
    title: 'BLACK MONOLITH // AMBIENT STATIC',
    bpm: '95 BPM',
    duration: '31:00',
    frequency: '174 Hz Low Resonance',
    purpose: 'Prolonged night coding & architectural design'
  },
  {
    id: 'track-4',
    title: 'IRON TEMPLE // TACTICAL PULSE',
    bpm: '124 BPM',
    duration: '16:45',
    frequency: '7.83 Hz Schumann Carrier',
    purpose: 'Active recovery, mobility & breathwork'
  },
  {
    id: 'track-5',
    title: 'ASHES OF KYOTO // SYNTH REFLECTION',
    bpm: '80 BPM',
    duration: '14:20',
    frequency: '639 Hz Harmonic',
    purpose: 'Post-battle review & daily journal debrief'
  }
];

export { EXCERPT_PAGES, type ExcerptPage } from './chaptersData';

export const TECHNICAL_SPECS = [
  { label: 'DELIVERY FORMAT', value: 'Complete Compressed Digital Archive (.ZIP)' },
  { label: 'CODEX VOLUME', value: '184-Page Master PDF (Vector Typography, High-Res Plates)' },
  { label: 'COLOR PROFILE', value: 'CMYK FOGRA39 (Print-Ready) + Screen sRGB RGB-16' },
  { label: 'ART PLATES', value: '12 Full-Bleed 8K Exhibition Plates (7680 × 4320 px)' },
  { label: 'DRM RESTRICTIONS', value: '0% DRM // Local Ownership // No Cloud Sign-in Required' },
  { label: 'SECURITY CHECKSUM', value: 'SHA-256: 4f9b2c8a1e93847291a0b5c7e8d2f1092a837c64e5b9' },
  { label: 'COMPATIBILITY', value: 'All PDF Readers, iPad/Remarkable, Mobile & Desktop Displays' },
  { label: 'LICENSE TYPE', value: 'Perpetual Personal & Commercial Studio Display License' }
];
