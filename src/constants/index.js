// All facts below come from Amit's existing portfolio content.
// Leave `email` empty until you add one; the contact section hides it when empty.

export const profile = {
  name: "Amit Sarkar",
  location: "Haryana, India",
  timezone: "IST, UTC+5:30",
  email: "",
  linkedin: "https://www.linkedin.com/in/amit-sarkar-4baa5b320/",
  github: "https://github.com/amit-sarkar-svg",
  instagram: "https://www.instagram.com/amit_._sarkar/",
};

export const navLinks = [
  { label: "Work", href: "#work" },
  { label: "Impact", href: "#impact" },
  { label: "Process", href: "#process" },
  { label: "Skills", href: "#skills" },
  { label: "FAQ", href: "#faq" },
];

export const stats = [
  { to: 1, suffix: "M+", label: "Packets processed", source: "Deep Packet Inspection Engine" },
  { to: 40, suffix: "%", label: "Higher throughput", source: "Deep Packet Inspection Engine" },
  { to: 60, suffix: "%", label: "Less regression time", source: "API Test Automation Framework" },
  { to: 5, suffix: "K+", label: "Users supported", source: "Authentication System" },
];

export const tagline =
  "Systems should stay fast under load, stay secure under pressure, and stay simple enough for the next engineer to understand.";

export const projects = [
  {
    index: "01",
    title: "Deep Packet Inspection Engine",
    kind: "Distributed systems, C++",
    date: "Mar 2026",
    summary:
      "A network traffic analyzer that inspects packets in real time across a pool of worker threads.",
    points: [
      "Raised throughput by 40% with a multithreaded pipeline of a load balancer and worker threads.",
      "Cut latency by 30% through optimized TCP/IP parsing and flow tracking.",
      "Processed over 1M packets, extracting TLS and HTTP metadata for filtering.",
      "Built as a modular codebase with logging, monitoring, and debugging from the start.",
    ],
    tags: ["C++", "Distributed systems", "Networking", "Observability"],
    href: "https://github.com/amit-sarkar-svg/Packet-analyzer-main",
  },
  {
    index: "02",
    title: "API Test Automation Framework",
    kind: "QA and automation",
    date: "Jan 2026",
    summary:
      "An automated regression suite that checks backend services and REST APIs inside CI pipelines.",
    points: [
      "Cut regression time by 60% with an automated PyTest framework for REST APIs.",
      "Reached 95% API reliability using GitHub Actions and Docker workflows.",
      "Increased defect detection by 35% with parameterized tests and edge case coverage.",
      "Delivered in an Agile cycle against requirements that kept changing.",
    ],
    tags: ["Python", "PyTest", "Docker", "GitHub Actions"],
    href: "",
  },
  {
    index: "03",
    title: "Full Stack Authentication System",
    kind: "Secure web application",
    date: "Dec 2025",
    summary:
      "A secure sign in service with role based access, built to hold up under thousands of users.",
    points: [
      "Supported 5K+ users with JWT authentication and role based access control.",
      "Improved backend latency by 25% by optimizing Node.js and Express REST APIs.",
      "Deployed on AWS EC2 with MongoDB Atlas.",
      "Tuned SQL queries with joins and indexing alongside NoSQL storage.",
    ],
    tags: ["Node.js", "Express", "MongoDB", "AWS EC2"],
    href: "",
  },
];

export const process = [
  {
    step: "01",
    title: "Design for the load",
    body: "I start from the traffic the system must survive. Data structures and concurrency choices come from complexity analysis, not habit.",
  },
  {
    step: "02",
    title: "Test every path",
    body: "Regression suites, parameterized cases, and edge case coverage run in CI on every push, so a break shows up before a user sees it.",
  },
  {
    step: "03",
    title: "Ship and observe",
    body: "Logging and monitoring go in with the first release. When something fails in production, the cause is already on screen.",
  },
];

export const skillGroups = [
  { group: "Languages", items: ["C++", "Python", "JavaScript", "SQL"] },
  { group: "Backend", items: ["Node.js", "Express", "REST APIs", "JWT and RBAC"] },
  { group: "Data", items: ["MongoDB", "Relational design", "Query tuning", "Indexing"] },
  { group: "Quality and delivery", items: ["PyTest", "Docker", "GitHub Actions", "AWS EC2"] },
  { group: "Frontend", items: ["React", "HTML and CSS", "Tailwind CSS"] },
];

export const toolStrip = [
  "C++", "Python", "JavaScript", "Node.js", "Express", "MongoDB", "SQL",
  "Docker", "GitHub Actions", "PyTest", "AWS EC2", "React", "Tailwind CSS",
];

export const faqs = [
  {
    q: "Where are you based, and do you work remotely?",
    a: "I am based in Haryana, India (IST, UTC+5:30) and open to remote work with teams worldwide.",
  },
  {
    q: "What kind of work do you do best?",
    a: "Backend services, APIs, and systems code in C++, Python, and Node.js, plus the tests and pipelines that keep them honest.",
  },
  {
    q: "How do you keep a service reliable?",
    a: "I automate regression tests with PyTest, run them through GitHub Actions and Docker, and add logging and monitoring before release. On my API project this cut regression time by 60%.",
  },
  {
    q: "What results can you point to?",
    a: "A 40% throughput gain and 30% lower latency on a packet inspection engine that handled over 1M packets, and a secure authentication system that supported 5K+ users.",
  },
  {
    q: "Do you build frontends too?",
    a: "Yes. I work with React, JavaScript, HTML, CSS, and Tailwind CSS, with a focus on responsive and accessible interfaces.",
  },
  {
    q: "What is the best way to reach you?",
    a: "Send a message on LinkedIn. It is the fastest way to start a conversation about a project or a role.",
  },
];

// Percent changes reported in each project's own results.
export const impact = [
  { name: "Throughput", value: 40 },
  { name: "Defect detection", value: 35 },
  { name: "DPI latency", value: 30 },
  { name: "API latency", value: 25 },
  { name: "Regression time", value: 60 },
];
