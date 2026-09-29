export interface ExcerptPage {
  pageNumber: number;
  chapterNumber: string;
  chapterTitle: string;
  subtitle: string;
  content: string[];
  callout?: string;
  ruleOfAction?: string;
}

export const EXCERPT_PAGES: ExcerptPage[] = [
  {
    pageNumber: 1,
    chapterNumber: 'CHAPTER 01',
    chapterTitle: 'THE ARCHITECTURE OF SUFFERING',
    subtitle: 'Why the undisciplined mind seeks comfort as an existential bunker',
    content: [
      'In an era characterized by hyper-palatable calories, infinite algorithmic micro-entertainment, and effortless thermal regulation, human biology faces an unprecedented crisis: the total absence of natural friction.',
      'The ancient brain interprets the lack of adversity not as victory, but as decay. When you do not hunt, your predatory instincts turn inward, giving rise to existential anxiety, lethargy, and neurosis.',
      'To reclaim autonomy, one must deliberately reinstall synthetic difficulty into daily life. We do not train because it is enjoyable; we train because without resistance, the will calcifies.'
    ],
    callout: '“You do not rise to the occasion. You sink to the level of your daily voluntary suffering.”',
    ruleOfAction: 'Rule 01: The first action of the day must demand overcoming visceral physical resistance.'
  },
  {
    pageNumber: 2,
    chapterNumber: 'CHAPTER 02',
    chapterTitle: 'THE HEDONIC EMBARGO',
    subtitle: 'Severing micro-dopamine leaks and chemical sedation',
    content: [
      'Every notification chime, sugar surge, and digital validation loop is a micro-transaction against your baseline dopamine reserves.',
      'When your receptors are perpetually saturated with low-effort gratification, the high-threshold energy required for profound creative or philosophical breakthroughs is permanently unavailable.',
      'The Embargo is not puritanical denial—it is strategic neurochemical replenishment. We starve the trivial appetite so the grand hunger can awaken.'
    ],
    callout: '“A mind enslaved by immediate pleasure cannot orchestrate generational conquest.”',
    ruleOfAction: 'Rule 02: Impose a total zero-stimulant digital quarantine for the first 120 minutes of waking consciousness.'
  },
  {
    pageNumber: 3,
    chapterNumber: 'CHAPTER 03',
    chapterTitle: 'THE COGNITIVE FORTRESS',
    subtitle: 'Defending mental bandwidth against digital parasites',
    content: [
      'Look at the modern worker: eyes glazed, seated under fluorescent tubes, checking thirty browser tabs while waiting for a message that requires zero genuine intellectual depth.',
      'This is cognitive cattle farming. Your dopamine system is mined like lithium by corporations whose sole KPI is the aggregation of your finite biological attention.',
      'The warrior protocol establishes iron boundaries. When the studio door closes, you enter operational lockdown. No notifications. No background chatter. No multi-tasking.'
    ],
    callout: '“Single-threaded focus is the superpower of the post-industrial era. Protect it with violence.”',
    ruleOfAction: 'Rule 03: Four uninterrupted hours of deep creation will outwork an entire week of distracted busywork.'
  }
];
