/**
 * Recommendations shown in the "Kind Words" slideshow. This is the built-in
 * copy; once the admin store is connected, items edited there take over.
 */
export type Testimonial = {
  /** The client's own words, in the language they wrote them. */
  quote: string;
  /** BCP-47 tag for `quote`, e.g. 'ar'. Omit for English. */
  quoteLang?: string;
  /** Faithful translation, shown beneath the original and labelled as such. */
  translation?: string;
  name: string;
  /** Role and company, e.g. "Project owner, Media Gate". */
  role: string;
  /** Public permalink so a reader can verify the review themselves. */
  link?: string;
  /** Where the review lives, e.g. 'Mostaql'. */
  source?: string;
  /** Shown instead of a verify link when the text is a LinkedIn recommendation. */
  note?: string;
};

/**
 * Real client quotes only — never paraphrased, never invented.
 *
 * The section renders nothing while the array is empty, so the live site never
 * shows an empty shell. To add another, get the client's written permission (a
 * LinkedIn recommendation or a platform review both work) and paste their exact
 * words, keeping the original language plus a translation when it isn't English.
 */
export const testimonials: Testimonial[] = [
  {
    // Verbatim from a LinkedIn recommendation dated 15 September 2026.
    quote:
      "It was a pleasure mentoring Laila during her Data Governance internship at Banque Misr. She was truly one of the standout interns, demonstrating great commitment, enthusiasm, and eagerness to learn.\n\nHer positive energy, collaborative spirit, and drive to grow make her a valuable addition to any team. I'm confident that Laila is ready for the professional world and will make a strong impact wherever she goes.\n\nWishing her continued success in her career journey!",
    name: 'Alaa Ghaly',
    role: "Assistant Manager, Credit Assessment at Banque Misr. Laila's mentor",
    note: 'LinkedIn recommendation, September 2026',
  },
  {
    // Verbatim from a LinkedIn recommendation dated 14 September 2026.
    quote:
      "Leila stood out as one of the most proactive interns in Banque Misr's Data Governance Internship Program. She was recognized among the program's six exceptional interns and was a member of the winning use case squad. Her initiative, enthusiasm for learning, and collaborative approach made her a valued contributor. I look forward to seeing her continued growth and future achievements.",
    name: 'Amr Elharony',
    role: 'Fintech Delivery Lead. Worked with Laila on the same team',
    note: 'LinkedIn recommendation, September 2026',
  },
  {
    // Verbatim from the client's public Mostaql review of the engagement.
    quote:
      'كلمة حق في المهندسة ليلى، ونعم الاشخاص اللي ممكن نتعامل معهم. كانت المتجاوبة، ولولا ظروف قاهرة واجهتنا لكان التسليم في الموعد المحدد. اتمنى لكي كل الخير والنجاح في مسيرتك، وانصح بشدة بالتعامل معها.',
    quoteLang: 'ar',
    translation:
      'A word of truth about Engineer Laila — she is among the very best people to work with. She was responsive, and were it not for the difficult circumstances we ran into, delivery would have been exactly on schedule. I wish you all the best and every success in your career, and I strongly recommend working with her.',
    name: 'Media G.',
    role: 'Project owner — custom web development engagement',
    link: 'https://mostaql.com/u/Laila_Mf/reviews/9186572',
    source: 'Mostaql',
  },
];
