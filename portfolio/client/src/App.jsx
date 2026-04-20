import { useEffect, useRef, useState } from "react";

const initialForm = { name: "", email: "", message: "" };

function App() {
  const [darkTheme, setDarkTheme] = useState(false);
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
    document.body.classList.toggle("dark-theme", darkTheme);
  }, [darkTheme]);

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

  if (loading) {
    return <main className="status-screen" aria-live="polite">Loading your portfolio...</main>;
  }

  if (error || !portfolio) {
    return <main className="status-screen">{error || "Unable to load portfolio"}</main>;
  }

  return (
    <>
      <div className="bg-blobs" aria-hidden="true">
        <span className="blob blob-a" />
        <span className="blob blob-b" />
        <span className="blob blob-c" />
      </div>

      <nav>
        <div className="nav-container">
          <div className="logo">{portfolio.name}'s Portfolio</div>

          <button
            type="button"
            className="menu-toggle"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((v) => !v)}
          >
            ☰
          </button>

          <div className={`nav-links ${mobileMenuOpen ? "open" : ""}`}>
            <a href="#home" onClick={() => setMobileMenuOpen(false)}>
              Home
            </a>
            <a href="#about" onClick={() => setMobileMenuOpen(false)}>
              About
            </a>
            <a href="#skills" onClick={() => setMobileMenuOpen(false)}>
              Skills
            </a>
            <a href="#projects" onClick={() => setMobileMenuOpen(false)}>
              Projects
            </a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)}>
              Contact
            </a>
            <button
              className="theme-toggle"
              type="button"
              onClick={() => setDarkTheme((v) => !v)}
              title="Toggle Theme"
            >
              {darkTheme ? "☀️" : "🌙"}
            </button>
          </div>
        </div>
      </nav>

      <section id="home" className="hero">
        <div className="hero-content reveal-up">
          <img src={portfolio.heroImage} alt="Profile" className="profile-pic" />
          <h1>Hi, I&apos;m {portfolio.name}</h1>
          <p className="hero-role">{portfolio.role.toUpperCase()}</p>
          <p className="hero-summary">{portfolio.about?.[0]}</p>
        </div>
      </section>

      <section id="about" className="about">
        <h2 className="section-heading">About Me</h2>
        {portfolio.about.map((line, idx) => (
          <p key={line} className="reveal-up" style={{ animationDelay: `${idx * 120}ms` }}>
            {line}
          </p>
        ))}
      </section>

      <section id="skills" className="skills">
        <h2 className="section-heading">My Skills</h2>
        <div className="skills-grid">
          {portfolio.skills.map((skill, idx) => (
            <div key={skill} className="skill-badge reveal-up" style={{ animationDelay: `${idx * 60}ms` }}>
              {skill}
            </div>
          ))}
        </div>
      </section>

      <section id="projects" className="projects">
        <h2 className="section-heading">My Projects</h2>
        <div className="project-grid">
          {portfolio.projects.map((project, idx) => (
            <article key={project.title} className="project-card reveal-up" style={{ animationDelay: `${idx * 90}ms` }}>
              <img src={resolveProjectImage(project.image)} alt={project.title} />
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <div className="project-links">
                {project.repoUrl && (
                  <a href={project.repoUrl} target="_blank" rel="noreferrer" className="github-link">
                    View on GitHub
                  </a>
                )}
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noreferrer" className="live-link">
                    Live Demo
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="contact" className="contact">
        <h2 className="section-heading">Contact Me</h2>
        <p>Feel free to reach out for collaborations or just a chat.</p>

        <form className="contact-form reveal-up" onSubmit={submitContact}>
          <input
            type="text"
            placeholder="Your name"
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            required
          />
          <input
            type="email"
            placeholder="Your email"
            value={form.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            required
          />
          <textarea
            rows="4"
            placeholder="Your message"
            value={form.message}
            onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
            required
          />
          <button type="submit">Send Message</button>
        </form>

        {contactStatus && <p className="contact-status">{contactStatus}</p>}

        <div className="social-links">
          <a href={portfolio.socialLinks.linkedIn} target="_blank" rel="noreferrer" title="LinkedIn">
            🔗
          </a>
          <a href={portfolio.socialLinks.github} target="_blank" rel="noreferrer" title="GitHub">
            🐙
          </a>
        </div>
      </section>

      {!chatOpen && (
        <button type="button" className="chat-bubble" onClick={() => setChatOpen(true)} aria-label="Open chat assistant">
          Ask anything about me
        </button>
      )}

      {chatOpen && (
        <aside className="chatbot-overlay">
          <div className="chatbot-header">
            <img src={portfolio.heroImage} alt="Profile" className="chatbot-profile-pic" />
            <h3>Chat with Me</h3>
            <button className="chatbot-close" type="button" onClick={() => setChatOpen(false)}>
              ×
            </button>
          </div>

          <div className="chatbot-messages" ref={chatMessagesRef}>
            {chatMessages.map((m, idx) => (
              <div className={`message ${m.role === "user" ? "user-message" : "ai-message"}`} key={`${m.role}-${idx}`}>
                <div className="message-content">{m.content}</div>
              </div>
            ))}

            {chatTyping && (
              <div className="typing-indicator">
                <div className="message-content">
                  Typing <span className="dot" /> <span className="dot" /> <span className="dot" />
                </div>
              </div>
            )}
          </div>

          <div className="chatbot-input">
            <input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Type a message..."
              onKeyDown={(e) => e.key === "Enter" && sendChat()}
            />
            <button type="button" onClick={sendChat}>
              ➤
            </button>
          </div>
        </aside>
      )}
    </>
  );
}

export default App;
