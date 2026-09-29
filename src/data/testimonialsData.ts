export interface Testimonial {
  id: string;
  callsign: string;
  name: string;
  role: string;
  discipline: 'combat' | 'engineering' | 'executive';
  disciplineLabel: string;
  verifiedHash: string;
  duration: string;
  rating: number; // 5 out of 5
  quote: string;
  impactMetric: string;
  dateStamp: string;
}

export const PROTOCOL_TESTIMONIALS: Testimonial[] = [
  {
    id: 'rep-01',
    callsign: 'OPERATOR #0841',
    name: 'KAIEN V.',
    role: 'BJJ 2nd Degree Black Belt & Studio Founder',
    discipline: 'combat',
    disciplineLabel: 'Combat Athletics',
    verifiedHash: 'SHA256-8F21..90A1',
    duration: '14 Months on Protocol',
    rating: 5,
    quote: 'Most modern self-development is covert narcissism wrapped in soft language. The Iron Will codex treats human consciousness like mechanical metallurgy. The horse-stance drills and 72-hour dopamine embargoes rewired my morning output entirely.',
    impactMetric: '+4.5 hrs daily deep output // 0% morning phone contact',
    dateStamp: '2026.04.12'
  },
  {
    id: 'rep-02',
    callsign: 'OPERATOR #1193',
    name: 'MARCUS T.',
    role: 'Lead Systems Architect & Computational Designer',
    discipline: 'engineering',
    disciplineLabel: 'Engineering & Creative',
    verifiedHash: 'SHA256-3C98..44E2',
    duration: '8 Months on Protocol',
    rating: 5,
    quote: 'The dual-blade doctrine was the catalyst I lacked. I was spending 12 hours behind 4K monitors slowly losing physical tension and sharpness. Reintroducing deliberate cold exposure and violent isometric resistance restored my cognitive clarity tenfold.',
    impactMetric: 'Eliminated chronic brain fog // Shipped kernel rewrite in 6 weeks',
    dateStamp: '2026.05.02'
  },
  {
    id: 'rep-03',
    callsign: 'OPERATOR #0327',
    name: 'DR. A. LEVINE',
    role: 'Cognitive Neurobiologist & 100M Ultra-Runner',
    discipline: 'executive',
    disciplineLabel: 'Founders & Research',
    verifiedHash: 'SHA256-7D12..81B9',
    duration: '18 Months on Protocol',
    rating: 5,
    quote: 'From a neurological standpoint, Tenet 02 (Elimination of Hedonic Leaks) is spot-on. The systematic pruning of micro-dopamine triggers restores baseline receptor density. The 8K art plates printed on matte metallic aluminium now frame my laboratory.',
    impactMetric: 'Restored baseline dopamine sensitivity within 14 days',
    dateStamp: '2026.02.19'
  },
  {
    id: 'rep-04',
    callsign: 'OPERATOR #2204',
    name: 'SORA K.',
    role: 'Robotics Hardware Lead & Muay Thai Practitioner',
    discipline: 'combat',
    disciplineLabel: 'Combat Athletics',
    verifiedHash: 'SHA256-1A56..67C0',
    duration: '6 Months on Protocol',
    rating: 5,
    quote: 'The 184-page codex has no padding. No author storytelling or anecdotes trying to sell you a course. Just cold, tactical operational parameters that you execute immediately. The Swiss typographic grid makes referencing field protocols instantaneous.',
    impactMetric: '184 pages implemented without skipping a single drill',
    dateStamp: '2026.06.11'
  },
  {
    id: 'rep-05',
    callsign: 'OPERATOR #0940',
    name: 'DEVON R.',
    role: 'Autonomous Infrastructure Engineer & Mountain Ultraist',
    discipline: 'engineering',
    disciplineLabel: 'Engineering & Creative',
    verifiedHash: 'SHA256-9E43..22F4',
    duration: '11 Months on Protocol',
    rating: 5,
    quote: 'I thought $19 was going to be an introductory preview with a paywall behind it. Having the complete vector PDF and full 8K art plates delivered DRM-free on direct download restored my faith in sovereign digital independent creators.',
    impactMetric: 'Perpetual cold-storage copy secured across 3 offline drives',
    dateStamp: '2026.07.29'
  },
  {
    id: 'rep-06',
    callsign: 'OPERATOR #1822',
    name: 'ELENA M.',
    role: 'Autonomous Mobility Executive & Competitive Judoka',
    discipline: 'executive',
    disciplineLabel: 'Founders & Research',
    verifiedHash: 'SHA256-4B81..99D7',
    duration: '9 Months on Protocol',
    rating: 5,
    quote: 'Tenet 03 (Tactical Silence) alone saved me hundreds of hours of social posturing. Doing the work in dark isolation until release changed the velocity of our company. If you are weak-willed, this will irritate you; if you are serious, it is armor.',
    impactMetric: 'Zero social announcements prior to product deployment',
    dateStamp: '2026.08.15'
  }
];
