import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarClock,
  CircleCheckBig,
  FileSearch,
  GraduationCap,
  LayoutGrid,
  Rocket,
  Sparkles,
  Users,
} from "lucide-react";
import "./landing.css";

const featureCards = [
  {
    icon: <FileSearch size={20} />,
    title: "Focused Discovery",
    description:
      "Find internships by company, role context, and deadlines with a cleaner decision flow.",
  },
  {
    icon: <CalendarClock size={20} />,
    title: "Deadline Clarity",
    description:
      "Track due dates at a glance and avoid missing opportunities during peak application weeks.",
  },
  {
    icon: <LayoutGrid size={20} />,
    title: "Organized Dashboard",
    description:
      "Students and admins see exactly what matters with role-specific views and actions.",
  },
  {
    icon: <Users size={20} />,
    title: "Admin Control",
    description:
      "Create, update, and manage internship cards and student applications in one place.",
  },
];

const processSteps = [
  {
    title: "Explore",
    text: "Browse active opportunities and shortlist roles aligned with your profile.",
  },
  {
    title: "Apply",
    text: "Submit details quickly with a guided flow designed for student submissions.",
  },
  {
    title: "Track",
    text: "Watch application status updates and prepare for upcoming rounds confidently.",
  },
];

const stats = [
  { label: "Student-first flow", value: "01" },
  { label: "Role-based access", value: "02" },
  { label: "Smart admin actions", value: "03" },
];

const LandingPage = () => {
  return (
    <div className="landing-shell">
      <div className="landing-noise" aria-hidden="true" />
      <header className="landing-topbar">
        <div className="landing-brand">
          <div className="brand-dot" />
          <span>IMPing</span>
        </div>
        <nav className="landing-nav">
          <a href="#features">Features</a>
          <a href="#flow">How It Works</a>
          <a href="#about">About</a>
        </nav>
        <div className="landing-actions">
          <Link to="/register/login" className="ghost-link">
            Login
          </Link>
          <Link to="/register/signup" className="solid-link">
            Create Account
          </Link>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy reveal delay-1">
            <p className="eyebrow">
              <Sparkles size={16} />
              Internship Management Platform
            </p>
            <h1>From opportunity discovery to application tracking, in one elegant space.</h1>
            <p className="hero-subtitle">
              IMPing helps students discover internships faster while giving admins complete control over listings, updates,
              and application workflows.
            </p>
            <div className="hero-cta-row">
              <Link to="/register/signup" className="solid-link large">
                Start as Student
                <ArrowRight size={16} />
              </Link>
              <Link to="/internships" className="outline-link large">
                Open Dashboard
              </Link>
            </div>
          </div>

          <div className="hero-panel reveal delay-2">
            <div className="hero-panel-title">
              <Rocket size={18} />
              Live Workflow Preview
            </div>
            <div className="panel-grid">
              <article>
                <BriefcaseBusiness size={18} />
                <h3>Rich Internship Cards</h3>
                <p>Company context, role summary, stipend, and deadline in a single card.</p>
              </article>
              <article>
                <CircleCheckBig size={18} />
                <h3>Application Status</h3>
                <p>Students get transparent progress signals for every application.</p>
              </article>
              <article>
                <GraduationCap size={18} />
                <h3>Campus-ready UX</h3>
                <p>Built to stay usable during high-traffic placement and internship windows.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="stats-strip reveal delay-3" aria-label="Platform strengths">
          {stats.map((stat) => (
            <div key={stat.value} className="stat-block">
              <p>{stat.value}</p>
              <span>{stat.label}</span>
            </div>
          ))}
        </section>

        <section id="features" className="features">
          <div className="section-heading reveal delay-1">
            <p>What Makes IMPing Different</p>
            <h2>Designed for students, trusted by admins.</h2>
          </div>
          <div className="feature-grid">
            {featureCards.map((feature, index) => (
              <article key={feature.title} className={`feature-card reveal delay-${(index % 3) + 1}`}>
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="flow" className="flow">
          <div className="section-heading reveal delay-1">
            <p>Simple 3-Step Flow</p>
            <h2>Make decisions faster, without losing detail.</h2>
          </div>
          <div className="flow-track">
            {processSteps.map((step, index) => (
              <article key={step.title} className={`flow-step reveal delay-${(index % 3) + 1}`}>
                <span>{`0${index + 1}`}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="about" className="about reveal delay-2">
          <div>
            <h2>Built for modern internship operations.</h2>
            <p>
              IMPing brings discovery, updates, and tracking into one consistent experience so teams can spend less time
              coordinating tools and more time helping students succeed.
            </p>
          </div>
          <Link to="/register/login" className="solid-link large">
            Continue to Login
            <ArrowRight size={16} />
          </Link>
        </section>
      </main>
    </div>
  );
};

export default LandingPage;
