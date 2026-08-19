/* ============================================================
   PORTFOLIO CONTENT FILE
   ------------------------------------------------------------
   This is the ONLY file you should need to edit to update your
   portfolio. Add projects, change skill levels, update your
   bio, add timeline entries — all here as plain data.

   Do NOT touch style.css or script.js unless you want to change
   how things look/behave, not what they say.

   After editing, just save and refresh index.html in your browser.
   ============================================================ */

const PORTFOLIO_DATA = {

  // ----------------------------------------------------------
  // PERSONAL / BRAND
  // ----------------------------------------------------------
  profile: {
    name: "Aman Srivastava",
    title: "Data Engineer",
    subtitle: "Data Science · Data Analysis",
    location: "Chennai, India",
    email: "as0448380@gmail.com",
    phone: "+91 62009 66118",
    github: "https://github.com/Aman-3003",
    linkedin: "https://www.linkedin.com/in/sriam3003",
    resumeFile: "assets/Aman_Srivastava_Resume.pdf",

    // Shown as a placeholder frame until you add a real photo.
    // Drop a photo into /assets and put the filename here.
    photo: null, // e.g. "assets/photo.jpg"

    // Short line under the name in the hero.
    heroStatement:
      "I build the systems that move, clean, and make sense of data — then I go learn the next thing.",

    // Longer intro used in the "About / Beyond the Resume" section.
    bio:
      "I'm a Computer Science undergrad who moved from writing SQL queries " +
      "to building full pipelines that connect data, APIs, and AI models. " +
      "I'm more energized by picking up new tools and problems than by " +
      "polishing the same solution twice — which means my stack keeps " +
      "growing, but it also means everything I ship, I actually understand " +
      "end to end, because I built it while learning it.",

    // Optional tagline - can be left as empty string "" if you don't want one yet.
    tagline: "",
  },

  // ----------------------------------------------------------
  // SKILLS
  // level: "strong" | "comfortable" | "learning"
  // group: used to build the skill-tree branches
  // ----------------------------------------------------------
  skills: [
    // Foundations
    { name: "Python", level: "strong", group: "foundation" },
    { name: "SQL", level: "strong", group: "foundation" },
    { name: "OOP", level: "strong", group: "foundation" },
    { name: "DBMS", level: "strong", group: "foundation" },
    { name: "Data Structures & Algorithms", level: "comfortable", group: "foundation" },

    // Databases
    { name: "MySQL", level: "strong", group: "data" },
    { name: "PostgreSQL", level: "strong", group: "data" },

    // Data analysis
    { name: "Pandas", level: "comfortable", group: "data" },
    { name: "NumPy", level: "comfortable", group: "data" },
    { name: "Matplotlib", level: "comfortable", group: "data" },
    { name: "Seaborn", level: "comfortable", group: "data" },

    // Data engineering (learning track)
    { name: "ETL / ELT", level: "learning", group: "engineering" },
    { name: "Apache Kafka", level: "learning", group: "engineering" },
    { name: "Apache Spark", level: "learning", group: "engineering" },
    { name: "Airflow", level: "learning", group: "engineering" },
    { name: "Data Warehousing", level: "learning", group: "engineering" },
    { name: "Cloud (AWS/GCP/Azure)", level: "learning", group: "engineering" },
    { name: "Docker", level: "learning", group: "engineering" },

    // AI / Backend
    { name: "NLP", level: "comfortable", group: "ai" },
    { name: "Sentence Transformers", level: "comfortable", group: "ai" },
    { name: "FastAPI", level: "comfortable", group: "ai" },

    // Tools
    { name: "Git / GitHub", level: "comfortable", group: "tools" },
  ],

  // ----------------------------------------------------------
  // PROJECTS
  // Add a new object to this array to add a new project.
  // Leave metrics as [] if you don't have real numbers yet —
  // do not fill in fake numbers.
  // ----------------------------------------------------------
  projects: [
    {
      id: "recruitai",
      name: "RecruitAI",
      tagline: "AI-powered candidate ranking platform",
      category: ["ai", "backend", "data-engineering"],
      year: "2025",
      problem:
        "Manually screening resumes against a job description is slow and " +
        "inconsistent — recruiters skim, keyword-match, and miss qualified " +
        "candidates who phrase things differently than the job post.",
      solution:
        "A full-stack platform that parses resumes, extracts structured " +
        "skill data, and semantically ranks candidates against a job " +
        "description using sentence embeddings instead of keyword matching.",
      architecture: [
        { stage: "Resume Upload", detail: "PDF/text resumes ingested via API" },
        { stage: "Parsing", detail: "Text and structured fields extracted from raw resumes" },
        { stage: "Embedding", detail: "Resume + job description encoded with Sentence Transformers" },
        { stage: "Matching", detail: "Semantic similarity scoring ranks candidates" },
        { stage: "API Layer", detail: "FastAPI serves parsing + ranking endpoints" },
        { stage: "Storage", detail: "PostgreSQL via SQLAlchemy stores candidates, jobs, scores" },
        { stage: "Dashboard", detail: "Next.js frontend for recruiters to review rankings" },
      ],
      stack: ["Python", "FastAPI", "Next.js", "PostgreSQL", "SQLAlchemy", "NLP", "Sentence Transformers"],
      challenges: [
        "Choosing semantic similarity over keyword matching to reduce false negatives from phrasing differences.",
        "Designing a schema that cleanly separates raw parsed data from normalized candidate/job records.",
      ],
      whatIBuilt:
        "Resume parsing pipeline, semantic matching logic, REST API layer, and the ranking dashboard.",
      results: [], // no verified metrics yet — intentionally empty
      suggestedMetrics: [
        "Ranking accuracy against a labeled test set of resumes/job pairs",
        "Average API response time for ranking a batch of resumes",
        "Number of resumes processed in testing",
      ],
      learned:
        "How semantic search actually behaves differently from keyword search in a real messy dataset, and how much schema design matters once an app has more than one moving part.",
      future: [
        "Add a feedback loop so recruiter overrides improve future rankings.",
        "Support bulk resume upload and background job processing.",
      ],
      github: "https://github.com/Aman-3003",
      demo: null,
      screenshots: [], // add image paths here later, e.g. "assets/recruitai-1.png"
    },
    {
      id: "chess-engine",
      name: "Chess Engine with AI Opponent",
      tagline: "A playable chess engine with a Minimax-driven AI opponent",
      category: ["ai", "backend"],
      year: "2024",
      problem:
        "Building a correct, playable chess implementation from scratch — full rule " +
        "enforcement plus a non-trivial AI opponent — touches state management, " +
        "search algorithms, and UI all at once.",
      solution:
        "A complete chess engine with full rule validation and an AI opponent " +
        "that searches moves using Minimax with Alpha-Beta pruning.",
      architecture: [
        { stage: "Game State", detail: "Board representation and full chess rule validation" },
        { stage: "UI Layer", detail: "Interactive GUI built with Pygame" },
        { stage: "Move Engine", detail: "Legal move generation, highlighting, undo" },
        { stage: "AI Search", detail: "Minimax with Alpha-Beta pruning selects the AI's move" },
        { stage: "Depth Control", detail: "Configurable search depth trades off strength vs. speed" },
      ],
      stack: ["Python", "Pygame", "Minimax", "Alpha-Beta Pruning", "OOP"],
      challenges: [
        "Implementing full chess rule correctness (check, checkmate, special moves) without shortcuts.",
        "Pruning the search tree effectively so the AI responds at a reasonable depth without lag.",
      ],
      whatIBuilt:
        "The entire engine — board/state logic, move validation, the GUI, and the Minimax/Alpha-Beta AI opponent.",
      results: [],
      suggestedMetrics: [
        "Average AI move time at each configurable search depth",
        "Search depth reached before response time becomes noticeable",
      ],
      learned:
        "How adversarial search actually behaves in practice, and why pruning strategy matters more than raw depth once the tree gets large.",
      future: [
        "Add an opening book to speed up early-game decisions.",
        "Experiment with a simple evaluation function upgrade beyond material count.",
      ],
      github: "https://github.com/Aman-3003",
      demo: null,
      screenshots: [],
    },

    // Add your next project here, following the same structure:
    // {
    //   id: "unique-id",
    //   name: "...",
    //   tagline: "...",
    //   category: ["ai" | "data-engineering" | "backend" | "other"],
    //   ...
    // },
  ],

  // ----------------------------------------------------------
  // EDUCATION
  // ----------------------------------------------------------
  education: [
    {
      institution: "SRM Institute of Science and Technology",
      credential: "B.Tech, Computer Science and Engineering",
      location: "Chennai, Tamil Nadu",
      period: "Aug 2023 – May 2027",
      detail: "CGPA: 8.83",
    },
    {
      institution: "VIG English School",
      credential: "Intermediate",
      location: "Jamshedpur, Jharkhand",
      period: "Apr 2021 – Mar 2023",
      detail: "Percentage: 72.8%",
    },
    {
      institution: "VIG English School",
      credential: "Matriculation",
      location: "Jamshedpur, Jharkhand",
      period: "Apr 2020 – Mar 2021",
      detail: "Percentage: 72.2%",
    },
  ],

  // ----------------------------------------------------------
  // CERTIFICATIONS
  // ----------------------------------------------------------
  certifications: [
    { name: "Complete Python Programming: From Basics to Advance", issuer: "Udemy" },
    { name: "Smart India Hackathon — Participation", issuer: "Smart India Hackathon" },
  ],

  // ----------------------------------------------------------
  // TIMELINE — your journey. Edit freely, keep chronological.
  // ----------------------------------------------------------
  timeline: [
    { period: "2020–2023", label: "School", detail: "Completed matriculation and intermediate education in Jamshedpur." },
    { period: "Aug 2023", label: "Started B.Tech CSE", detail: "Began Computer Science at SRM Institute of Science and Technology, Chennai." },
    { period: "2024", label: "Algorithms & Game AI", detail: "Built a full chess engine with a Minimax/Alpha-Beta AI opponent." },
    { period: "2025", label: "Full-Stack + AI", detail: "Built RecruitAI — combining FastAPI, PostgreSQL, and semantic NLP matching." },
    { period: "Now", label: "Going deeper into data engineering", detail: "Learning Kafka, Spark, Airflow, and cloud data infrastructure." },
  ],

  // ----------------------------------------------------------
  // HOW I THINK — engineering workflow stages
  // ----------------------------------------------------------
  workflow: [
    { stage: "Understand", detail: "Get specific about the real problem before touching a tool — what's actually broken, for whom." },
    { stage: "Design", detail: "Sketch the data flow and architecture first, even roughly, before writing code." },
    { stage: "Choose tools", detail: "Pick technologies for what the problem needs, not what's trendy." },
    { stage: "Build", detail: "Build the smallest working version end-to-end before adding features." },
    { stage: "Test", detail: "Check it against real or realistic data, not just the happy path." },
    { stage: "Optimize", detail: "Only optimize once something works and I know what's actually slow." },
    { stage: "Learn", detail: "Every project is also a chance to pick up the next tool deliberately." },
  ],

  // ----------------------------------------------------------
  // CURRENTLY BUILDING
  // ----------------------------------------------------------
  currentlyBuilding: {
    active: true,
    project: "Deepening data engineering fundamentals",
    detail: "Working through Kafka, Spark, and Airflow to move from data analysis into real pipeline engineering.",
    nextMilestone: "Ship a small end-to-end pipeline project using at least one of these tools.",
  },

  // ----------------------------------------------------------
  // DASHBOARD METRICS — only real, countable things.
  // Update these numbers as they change. Do not estimate.
  // ----------------------------------------------------------
  metrics: {
    projectsCompleted: 2,
    technologiesUsed: 19,
    yearsLearning: 2, // since Aug 2023
    certifications: 2,
  },
};
