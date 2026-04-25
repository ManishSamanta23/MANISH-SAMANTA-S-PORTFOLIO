import { useEffect, useRef, useState } from "react";

const initialForm = { name: "", email: "", message: "" };

function AppTailwind() {
  const [stylePreset, setStylePreset] = useState("executive");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState(initialForm);
  const [contactStatus, setContactStatus] = useState("");

  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatTyping, setChatTyping] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const chatMessagesRef = useRef(null);

  useEffect(() => {
    const loadPortfolio = async () => {
      try {
        const res = await fetch("/api/portfolio");
        if (!res.ok) {
          throw new Error("Failed to load portfolio data");
        }
        const data = await res.json();
        setPortfolio(data);
        setChatMessages([{ role: "ai", content: data.chatIntro }]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadPortfolio();
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 900) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const nodes = document.querySelectorAll(".reveal-up");
    if (!nodes.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.18,
        rootMargin: "0px 0px -42px 0px"
      }
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [portfolio]);

  useEffect(() => {
    if (!chatOpen || !chatMessagesRef.current) return;

    const raf = requestAnimationFrame(() => {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    });

    return () => cancelAnimationFrame(raf);
  }, [chatOpen, chatMessages, chatTyping]);

  const submitContact = async (e) => {
    e.preventDefault();
    setContactStatus("Sending...");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      setContactStatus("Message sent successfully.");
      setForm(initialForm);
    } catch (err) {
      setContactStatus(err.message);
    }
  };

  const sendChat = async () => {
    const msg = chatInput.trim();
    if (!msg) return;

    setChatMessages((prev) => [...prev, { role: "user", content: msg }]);
    setChatInput("");
    setChatTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Chat request failed");
      }

      setChatMessages((prev) => [...prev, { role: "ai", content: data.reply }]);
    } catch (_err) {
      setChatMessages((prev) => [
        ...prev,
        { role: "ai", content: "I am having trouble replying right now. Please try again." }
      ]);
    } finally {
      setChatTyping(false);
    }
  };

  const resolveProjectImage = (image) => {
    if (!image) return image;
    if (image.includes("/assets/avaran.png") || image.includes("/assets/finance-dashboard.png")) {
      return `${image.split("?")[0]}?v=4`;
    }
    return image;
  };

  const styleModes = [
    { id: "executive", label: "Minimal executive" },
    { id: "luxury", label: "Dark luxury" }
  ];

  if (loading) {
    return <main className="grid min-h-screen place-items-center text-[color:var(--muted)]">Loading your portfolio...</main>;
  }

  if (error || !portfolio) {
    return <main className="grid min-h-screen place-items-center text-[color:var(--muted)]">{error || "Unable to load portfolio"}</main>;
  }

  const navButton = "inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition duration-200 hover:-translate-y-0.5";
  const sectionPanel = "relative overflow-hidden rounded-[28px] border border-[color:var(--stroke)] bg-[color:var(--surface)] shadow-[var(--shadow)]";
  const sectionHeading = "font-['Space_Grotesk',sans-serif] text-center md:text-left text-[clamp(1.8rem,2.6vw,2.6rem)] tracking-[-0.02em] text-[color:var(--text)]";
  const eyebrowText = "text-xs font-semibold uppercase tracking-[0.24em]";
  const bodyCopy = "text-sm leading-7 sm:text-base lg:text-lg";
  const cardBodyCopy = "text-sm leading-6 sm:text-base";
  const mutedText = "text-[color:var(--muted)]";
  const actionButton = "inline-flex items-center justify-center rounded-full px-5 py-3 text-base font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:shadow-lg";
  const linkButton = "inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5";
  const selectedSkills = portfolio.skills.slice(0, 6);
  const portfolioStats = [
    { label: "Projects", value: String(portfolio.projects.length).padStart(2, "0") },
    { label: "Skills", value: String(portfolio.skills.length).padStart(2, "0") },
    { label: "Links", value: String(Object.values(portfolio.socialLinks || {}).filter(Boolean).length).padStart(2, "0") }
  ];

  return (
    <>
      <div className="bg-blobs" aria-hidden="true">
        <span className="blob blob-a" />
        <span className="blob blob-b" />
        <span className="blob blob-c" />
      </div>

      <main className={`style-${stylePreset} relative min-h-screen overflow-x-hidden text-[color:var(--text)]`}>
        <nav className="sticky top-3 z-30 mx-auto mt-3 w-[calc(100%-1rem)] max-w-[var(--max-width)] rounded-[22px] border border-[color:var(--stroke)] bg-[color:var(--surface)] shadow-[var(--shadow)] backdrop-blur-xl">
          <div className="relative mx-auto flex w-full items-center justify-between gap-3 px-4 py-3 sm:px-5">
            <div className="font-['Space_Grotesk',sans-serif] text-base font-semibold tracking-tight sm:text-lg">
              {portfolio.name}&apos;s Portfolio
            </div>

            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--stroke)] bg-[color:var(--surface-strong)] text-lg lg:hidden"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((v) => !v)}
            >
              ☰
            </button>

            <div
              className={`absolute left-4 right-4 top-[calc(100%+0.75rem)] grid origin-top gap-2 rounded-2xl border border-[color:var(--stroke)] bg-[color:var(--surface-strong)] p-3 shadow-[var(--shadow)] transition duration-200 lg:static lg:flex lg:translate-y-0 lg:items-center lg:gap-2 lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none ${mobileMenuOpen ? "pointer-events-auto scale-100 opacity-100" : "pointer-events-none scale-[0.98] opacity-0 lg:pointer-events-auto lg:opacity-100 lg:scale-100"}`}
            >
              <a className={`${navButton} text-[color:var(--text)]`} href="#home" onClick={() => setMobileMenuOpen(false)}>
                Home
              </a>
              <a className={`${navButton} text-[color:var(--text)]`} href="#about" onClick={() => setMobileMenuOpen(false)}>
                About
              </a>
              <a className={`${navButton} text-[color:var(--text)]`} href="#skills" onClick={() => setMobileMenuOpen(false)}>
                Skills
              </a>
              <a className={`${navButton} text-[color:var(--text)]`} href="#projects" onClick={() => setMobileMenuOpen(false)}>
                Projects
              </a>
              <a className={`${navButton} text-[color:var(--text)]`} href="#contact" onClick={() => setMobileMenuOpen(false)}>
                Contact
              </a>
            </div>
          </div>
        </nav>

        <section id="home" className="mx-auto max-w-[1180px] px-4 pt-10 md:pt-16 lg:pt-20">
          <div className="grid gap-5 rounded-[32px] border border-[color:var(--stroke)] bg-[linear-gradient(145deg,var(--hero-grad-a),var(--hero-grad-b))] p-5 shadow-[var(--shadow)] md:gap-6 md:p-7 lg:grid-cols-[minmax(220px,260px)_1fr] lg:items-center lg:gap-8 lg:p-10" style={{ animation: "heroCardGlow 7s ease-in-out infinite" }}>
            <div className="order-2 flex flex-col items-center gap-3 lg:order-1 lg:items-start">
              <div className="relative">
                <img
                  src={portfolio.heroImage}
                  alt="Profile"
                  className="h-32 w-32 rounded-full border-[5px] border-[color:var(--brand)] object-cover shadow-[0_18px_38px_rgba(15,23,42,0.2)] sm:h-40 sm:w-40 lg:h-[220px] lg:w-[220px]"
                  style={{ animation: "profileFloat 4.2s ease-in-out infinite" }}
                />
                <span className="absolute inset-x-4 -bottom-2 h-3 rounded-full bg-[rgba(15,23,42,0.08)] blur-md dark:bg-[rgba(226,232,240,0.14)]" />
              </div>

              <div className="grid w-full max-w-sm grid-cols-3 gap-2 text-center">
                {portfolioStats.map((item) => (
                  <div key={item.label} className="rounded-2xl border border-[color:var(--stroke)] bg-[color:var(--surface-strong)] px-3 py-3 shadow-sm">
                    <div className="text-sm font-semibold text-[color:var(--text)]">{item.value}</div>
                    <div className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--muted)]">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="order-1 space-y-4 text-center lg:order-2 lg:text-left">
              <p className={`inline-flex items-center justify-center rounded-full border border-[color:var(--stroke)] bg-[color:var(--surface-strong)] px-4 py-2 ${eyebrowText} text-[color:var(--accent-2)] shadow-sm lg:justify-start`}>
                Full Stack Developer
              </p>
              <div className="space-y-2">
                <h1 className="font-['Space_Grotesk',sans-serif] text-[clamp(2.4rem,5vw,4.8rem)] font-bold tracking-[-0.05em]" style={{ lineHeight: 1.02 }}>
                  Hi, I&apos;m {portfolio.name}
                </h1>
                <p className={`text-[color:var(--accent-2)] ${eyebrowText}`}>
                  {portfolio.role}
                </p>
              </div>

              <p className={`${mutedText} ${bodyCopy} mx-auto max-w-2xl lg:mx-0`}>
                {portfolio.about?.[0]}
              </p>

              <div className="flex flex-wrap justify-center gap-3 lg:justify-start">
                <a href="#projects" className="inline-flex items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--brand),var(--accent-2))] px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_28px_rgba(59,130,246,0.24)] transition duration-200 hover:-translate-y-0.5">
                  View Projects
                </a>
                <a href="#contact" className="inline-flex items-center justify-center rounded-full border border-[color:var(--stroke)] bg-[color:var(--surface-strong)] px-5 py-3 text-sm font-semibold text-[color:var(--text)] transition duration-200 hover:-translate-y-0.5 hover:shadow-lg">
                  Contact Me
                </a>
              </div>

              <div className="flex flex-wrap justify-center gap-2 lg:justify-start">
                {styleModes.map((mode) => {
                  const active = stylePreset === mode.id;
                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setStylePreset(mode.id)}
                      className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] transition duration-200 ${
                        active
                          ? "border-[color:var(--brand)] bg-[linear-gradient(135deg,var(--brand),var(--accent-2))] text-white shadow-[0_14px_24px_rgba(59,130,246,0.22)]"
                          : "border-[color:var(--stroke)] bg-[color:var(--surface-strong)] text-[color:var(--muted)] hover:-translate-y-0.5 hover:shadow-md"
                      }`}
                    >
                      {mode.label}
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-wrap justify-center gap-2 lg:justify-start">
                {selectedSkills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-[color:var(--stroke)] bg-[color:var(--surface-strong)] px-3 py-1 text-xs font-medium text-[color:var(--muted)] shadow-sm sm:text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="mx-auto max-w-[1180px] px-4 pt-5 md:pt-6">
          <div className={`${sectionPanel} px-5 py-7 sm:px-8 sm:py-10`}>
            <h2 className={sectionHeading} style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
              About Me
            </h2>
            <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(280px,0.7fr)] lg:items-start">
              <div className={`space-y-4 text-center ${bodyCopy} md:text-left`}>
                {portfolio.about.map((line, idx) => (
                  <p key={line} className={`reveal-up ${mutedText}`} style={{ animationDelay: `${idx * 120}ms` }}>
                    {line}
                  </p>
                ))}
              </div>

              <div className="rounded-[24px] border border-[color:var(--stroke)] bg-[color:var(--surface-elevated)] p-5 shadow-sm">
                <p className={`${eyebrowText} text-[color:var(--accent-2)]`}>Profile Snapshot</p>
                <div className={`mt-3 space-y-3 ${cardBodyCopy} text-[color:var(--muted)]`}>
                  <p>Building modern web applications with a focus on clarity, responsiveness, and practical user value.</p>
                  <p>Comfortable across frontend, backend, and tooling, with a learning path that includes AI and mobile development.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="skills" className="mx-auto max-w-[1180px] px-4 pt-5 md:pt-6">
          <div className={`${sectionPanel} px-5 py-7 sm:px-8 sm:py-10`}>
            <h2 className={sectionHeading} style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
              My Skills
            </h2>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {portfolio.skills.map((skill, idx) => (
                <div
                  key={skill}
                  className="reveal-up rounded-full border border-[color:var(--stroke)] bg-[linear-gradient(135deg,rgba(59,130,246,0.1),rgba(20,184,166,0.1))] px-4 py-3 text-center text-sm font-semibold text-[color:var(--text)] shadow-[0_12px_24px_rgba(15,23,42,0.08)] transition duration-200 hover:-translate-y-1 hover:border-[rgba(20,184,166,0.34)] hover:shadow-[0_16px_30px_rgba(15,23,42,0.12)] sm:text-base"
                  style={{ animationDelay: `${idx * 60}ms` }}
                >
                  {skill}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="projects" className="mx-auto max-w-[1180px] px-4 pt-5 md:pt-6">
          <div className={`${sectionPanel} px-5 py-7 sm:px-8 sm:py-10`}>
            <h2 className={sectionHeading} style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
              My Projects
            </h2>
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {portfolio.projects.map((project, idx) => (
                <article
                  key={project.title}
                  className="reveal-up group flex h-full flex-col overflow-hidden rounded-[28px] border border-[color:var(--stroke)] bg-[color:var(--surface-strong)] shadow-[0_18px_38px_rgba(15,23,42,0.1)] transition duration-300 hover:-translate-y-2 hover:shadow-[0_28px_42px_rgba(15,23,42,0.16)]"
                  style={{ animationDelay: `${idx * 90}ms` }}
                >
                  <div className="overflow-hidden">
                    <img
                      src={resolveProjectImage(project.image)}
                      alt={project.title}
                      className="h-56 w-full object-cover object-top transition duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-4 p-5">
                    <div>
                      <h3 className="text-lg font-bold tracking-tight text-[color:var(--text)] sm:text-xl">{project.title}</h3>
                      <p className={`mt-3 ${cardBodyCopy} text-[color:var(--muted)]`}>{project.description}</p>
                    </div>
                    <div className="mt-auto flex flex-wrap gap-3">
                      {project.repoUrl && (
                        <a href={project.repoUrl} target="_blank" rel="noreferrer" className={`${linkButton} bg-[linear-gradient(135deg,var(--accent-2),#7a86ff)]`}>
                          View on GitHub
                        </a>
                      )}
                      {project.liveUrl && (
                        <a href={project.liveUrl} target="_blank" rel="noreferrer" className={`${linkButton} bg-[linear-gradient(135deg,#0f9d8f,#2aa68e)]`}>
                          Live Demo
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="mx-auto max-w-[1180px] px-4 pt-5 pb-28 md:pt-6 md:pb-8">
          <div className={`${sectionPanel} px-5 py-7 sm:px-8 sm:py-10`}>
            <h2 className={sectionHeading} style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
              Contact Me
            </h2>
            <p className={`mt-3 max-w-3xl ${bodyCopy} ${mutedText}`}>Feel free to reach out for collaborations or just a chat.</p>

            <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={submitContact}>
              <input
                type="text"
                placeholder="Your name"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                required
                className="rounded-2xl border border-[color:var(--stroke)] bg-[color:var(--surface-elevated)] px-4 py-3 text-[color:var(--text)] outline-none transition duration-200 placeholder:text-[color:var(--muted)] focus:-translate-y-0.5 focus:border-[rgba(25,199,165,0.5)] focus:shadow-[0_0_0_4px_rgba(25,199,165,0.16)] md:col-span-1"
              />
              <input
                type="email"
                placeholder="Your email"
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                required
                className="rounded-2xl border border-[color:var(--stroke)] bg-[color:var(--surface-elevated)] px-4 py-3 text-[color:var(--text)] outline-none transition duration-200 placeholder:text-[color:var(--muted)] focus:-translate-y-0.5 focus:border-[rgba(25,199,165,0.5)] focus:shadow-[0_0_0_4px_rgba(25,199,165,0.16)] md:col-span-1"
              />
              <textarea
                rows="5"
                placeholder="Your message"
                value={form.message}
                onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
                required
                className="md:col-span-2 rounded-2xl border border-[color:var(--stroke)] bg-[color:var(--surface-elevated)] px-4 py-3 text-[color:var(--text)] outline-none transition duration-200 placeholder:text-[color:var(--muted)] focus:-translate-y-0.5 focus:border-[rgba(25,199,165,0.5)] focus:shadow-[0_0_0_4px_rgba(25,199,165,0.16)]"
              />
              <button
                type="submit"
                className={`${actionButton} md:col-span-2 bg-[linear-gradient(130deg,var(--brand),var(--brand-2))] shadow-[0_16px_28px_rgba(255,107,91,0.24)]`}
              >
                Send Message
              </button>
            </form>

            {contactStatus && <p className="mt-4 text-center text-[color:var(--muted)] md:text-left">{contactStatus}</p>}

            <div className="mt-6 flex justify-center gap-4 md:justify-start">
              <a
                href={portfolio.socialLinks.linkedIn}
                target="_blank"
                rel="noreferrer"
                title="LinkedIn"
                className="grid h-12 w-12 place-items-center rounded-full border border-[color:var(--stroke)] bg-[color:var(--surface-strong)] text-[1.35rem] transition duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                🔗
              </a>
              <a
                href={portfolio.socialLinks.github}
                target="_blank"
                rel="noreferrer"
                title="GitHub"
                className="grid h-12 w-12 place-items-center rounded-full border border-[color:var(--stroke)] bg-[color:var(--surface-strong)] text-[1.35rem] transition duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                🐙
              </a>
            </div>
          </div>
        </section>

        {!chatOpen && (
          <button
            type="button"
            className="fixed bottom-3 right-3 z-[1100] inline-flex h-11 w-11 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--brand),var(--brand-2))] text-base font-semibold text-white shadow-[0_14px_28px_rgba(255,107,91,0.34)] transition hover:-translate-y-0.5 sm:bottom-4 sm:right-4 sm:h-auto sm:w-auto sm:px-4 sm:py-3 sm:text-sm"
            onClick={() => setChatOpen(true)}
            aria-label="Open chat assistant"
          >
            <span className="sm:hidden" aria-hidden="true">💬</span>
            <span className="hidden sm:inline">Ask anything about me</span>
          </button>
        )}

        {chatOpen && (
          <aside className="fixed bottom-20 left-3 right-3 z-[1200] flex max-h-[70vh] w-auto flex-col overflow-hidden rounded-[24px] border border-[color:var(--stroke)] bg-[color:var(--chat-shell)] shadow-[0_30px_70px_rgba(18,22,47,0.28)] animate-[chatIn_250ms_cubic-bezier(0.2,0.75,0.2,1)] sm:left-auto sm:right-4 sm:w-[min(380px,95vw)]">
            <div className="flex items-center gap-3 bg-[linear-gradient(130deg,var(--accent-2),var(--accent))] px-4 py-3 text-[color:var(--chat-header-text)]">
              <img src={portfolio.heroImage} alt="Profile" className="h-9 w-9 rounded-full object-cover" />
              <h3 className="flex-1 text-base font-semibold sm:text-lg">Chat with Me</h3>
              <button className="text-lg leading-none sm:text-xl" type="button" onClick={() => setChatOpen(false)}>
                ×
              </button>
            </div>

            <div className="flex-1 overflow-auto bg-[linear-gradient(180deg,var(--chat-grad-a),var(--chat-grad-b))] p-4">
              <div className="grid gap-3" ref={chatMessagesRef}>
                {chatMessages.map((m, idx) => (
                  <div className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`} key={`${m.role}-${idx}`}>
                    <div
                      className={`max-w-[82%] rounded-2xl px-3 py-2 text-sm leading-6 sm:text-base ${
                        m.role === "user"
                          ? "bg-[color:var(--chat-user-bg)] text-[color:var(--chat-user-text)]"
                          : "bg-[color:var(--chat-ai-bg)] text-[color:var(--chat-ai-text)]"
                      }`}
                    >
                      {m.content}
                    </div>
                  </div>
                ))}

                {chatTyping && (
                  <div className="flex justify-start">
                    <div className="rounded-2xl bg-[color:var(--chat-ai-bg)] px-3 py-2 text-sm leading-6 text-[color:var(--chat-ai-text)]">
                      Typing <span className="dot" /> <span className="dot" /> <span className="dot" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2 border-t border-[color:var(--stroke)] bg-[color:var(--surface-elevated)] p-3">
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type a message..."
                onKeyDown={(e) => e.key === "Enter" && sendChat()}
                className="min-w-0 flex-1 rounded-full border border-[color:var(--stroke)] bg-[color:var(--surface-strong)] px-4 py-3 text-sm text-[color:var(--text)] outline-none placeholder:text-[color:var(--muted)] sm:text-base"
              />
              <button
                type="button"
                onClick={sendChat}
                className="rounded-full bg-[linear-gradient(130deg,var(--accent-2),var(--accent))] px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 sm:text-base"
              >
                ➤
              </button>
            </div>
          </aside>
        )}
      </main>
    </>
  );
}

export default AppTailwind;
