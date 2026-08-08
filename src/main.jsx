import { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

const DRIVE_FOLDER = 'https://drive.google.com/drive/folders/1KXnLnY_tfjyHWIlzmoqhhisAoNom1CjG'
const driveIds = {
  art: '1qVzbbm9iP_NPUHI6Qn84i57utaTghhu7',
  craft: '1q-qgybue_TgRGVxROE_pP5e2ywT2i0HY',
  gozel: '18hpC3tA9C3DpISLW5QhtVBtBhXx2rX8J',
  hammad: '1-Q-Kv7SbC_kXs7N1H2eQQJ0n7KcdaOH7',
  digi: '1yfL-F9Z2k1EHFqXy4QGUZtitoBIyefXS',
  surendar: '1si6_JWsFl1sByVyK3O-gYTCgKH3gns-P',
}

const drivePreview = (id) => `https://drive.google.com/file/d/${id}/preview?autoplay=1`
const showreelSource = '/media/showreel.mp4'
const driveFile = (id) => `https://drive.google.com/file/d/${id}/view`

const projects = [
  { title: 'Decision Fatigue', type: 'Thumbnail design', year: '2026', image: '/media/drive-01.jpg', clip: driveIds.art, role: 'Concept, art direction, thumbnail design', client: 'Creator-led campaign', summary: 'A sharp visual hook for a heavy idea — made to stop the scroll before the first sentence lands.', gallery: ['/media/drive-01.jpg', '/media/thumb-01.webp', '/media/thumb-03.webp'], software: 'Photoshop / After Effects / Premiere Pro' },
  { title: 'The Truth About Success', type: 'Short-form edit', year: '2026', image: '/media/drive-02.jpg', clip: driveIds.craft, role: 'Edit, motion graphics, sound design', client: 'Education creator', summary: 'A punchy social edit that turns a complex point of view into a fast visual argument.', gallery: ['/media/drive-02.jpg', '/media/thumb-02.webp', '/media/thumb-05.webp'], software: 'Premiere Pro / After Effects / Audition' },
  { title: 'Craftloom.Design', type: 'Brand story', year: '2026', image: '/media/thumb-07.webp', clip: driveIds.craft, role: 'Edit, story structure, finishing', client: 'Craftloom', summary: 'A slower, tactile cut that lets the product breathe without losing the rhythm of social.', gallery: ['/media/thumb-07.webp', '/media/thumb-09.webp', '/media/thumb-10.webp'], software: 'Premiere Pro / After Effects / DaVinci Resolve' },
  { title: 'Art of Elite', type: 'Motion design', year: '2026', image: '/media/thumb-10.webp', clip: driveIds.art, role: 'Edit, compositing, animation', client: 'Brand launch', summary: 'A dramatic motion-led promo built around confident pacing and a premium finish.', gallery: ['/media/thumb-10.webp', '/media/thumb-08.webp', '/media/thumb-11.webp'], software: 'After Effects / Premiere Pro / Photoshop' },
  { title: 'Gozel Ora', type: 'Brand story', year: '2026', image: '/media/thumb-13.webp', clip: driveIds.gozel, role: 'Edit, color, social versioning', client: 'Gozel Ora', summary: 'A polished campaign cut designed to feel tactile, premium, and native to social.', gallery: ['/media/thumb-13.webp', '/media/thumb-14.webp', '/media/thumb-15.webp'], software: 'Premiere Pro / After Effects / Lightroom' },
  { title: 'Hammad Khalid', type: 'Talking head', year: '2026', image: '/media/thumb-14.webp', clip: driveIds.hammad, role: 'Edit, captions, pacing', client: 'Personal brand', summary: 'A direct-to-camera edit that keeps the voice human while making every beat easier to follow.', gallery: ['/media/thumb-14.webp', '/media/thumb-16.webp', '/media/thumb-17.webp'], software: 'Premiere Pro / After Effects / Photoshop' },
  { title: 'Digithronex', type: 'Motion design', year: '2026', image: '/media/thumb-11.webp', clip: driveIds.digi, role: 'Motion graphics, edit, sound design', client: 'Tech education', summary: 'A tech-forward explainer with clean UI moments, high energy cuts, and a strong information rhythm.', gallery: ['/media/thumb-11.webp', '/media/thumb-18.webp', '/media/thumb-19.webp'], software: 'After Effects / Premiere Pro / Figma' },
  { title: 'Surendar Kumar', type: 'Talking head', year: '2026', image: '/media/thumb-20.webp', clip: driveIds.surendar, role: 'Edit, cleanup, social delivery', client: 'Creator-led campaign', summary: 'A clear and energetic talking-head treatment made for repeatable weekly publishing.', gallery: ['/media/thumb-20.webp', '/media/thumb-04.webp', '/media/thumb-05.webp'], software: 'Premiere Pro / After Effects / Audition' },
]

function Icon({ name, size = 18 }) {
  const props = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true }
  if (name === 'arrow') return <svg {...props}><path d="M4 12h15" /><path d="m13 6 6 6-6 6" /></svg>
  if (name === 'up') return <svg {...props}><path d="M7 17 17 7" /><path d="M7 7h10v10" /></svg>
  if (name === 'play') return <svg {...props} fill="currentColor" stroke="none"><path d="m8 5 11 7-11 7V5Z" /></svg>
  if (name === 'close') return <svg {...props}><path d="m6 6 12 12M18 6 6 18" /></svg>
  if (name === 'sound') return <svg {...props}><path d="M4 10v4h3l4 3V7l-4 3H4Z" /><path d="M15 9.5a4 4 0 0 1 0 5" /><path d="M18 7a7 7 0 0 1 0 10" /></svg>
  return null
}

function useAudio(enabled) {
  const contextRef = useRef(null)
  const musicRef = useRef(null)

  const getContext = () => {
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (!AudioContext) return null
    const context = contextRef.current || new AudioContext()
    contextRef.current = context
    return context
  }

  const sound = (kind = 'click') => {
    if (!enabled || typeof window === 'undefined') return
    try {
      const context = getContext()
      if (!context) return
      context.resume?.()
      const now = context.currentTime
      const oscillator = context.createOscillator()
      const gain = context.createGain()
      oscillator.type = kind === 'paper' ? 'triangle' : 'sine'
      oscillator.frequency.setValueAtTime(kind === 'door' ? 122 : kind === 'paper' ? 280 : 210, now)
      oscillator.frequency.exponentialRampToValueAtTime(kind === 'door' ? 58 : 110, now + (kind === 'paper' ? .34 : .2))
      gain.gain.setValueAtTime(.0001, now)
      gain.gain.exponentialRampToValueAtTime(kind === 'door' ? .13 : .07, now + .02)
      gain.gain.exponentialRampToValueAtTime(.0001, now + (kind === 'paper' ? .42 : .25))
      oscillator.connect(gain).connect(context.destination)
      oscillator.start(now)
      oscillator.stop(now + (kind === 'paper' ? .44 : .27))
    } catch {
      // Browser audio is intentionally best-effort; the visual interaction remains usable.
    }
  }

  const stopMusic = () => {
    const session = musicRef.current
    if (!session) return
    window.clearTimeout(session.timer)
    try {
      session.master.gain.cancelScheduledValues(session.context.currentTime)
      session.master.gain.setTargetAtTime(.0001, session.context.currentTime, .12)
      window.setTimeout(() => session.master.disconnect(), 500)
    } catch {
      // Audio cleanup is best-effort.
    }
    musicRef.current = null
  }

  const startMusic = () => {
    if (!enabled || typeof window === 'undefined' || musicRef.current) return
    try {
      const context = getContext()
      if (!context) return
      context.resume?.()
      const master = context.createGain()
      master.gain.value = .24
      master.connect(context.destination)
      const session = { context, master, timer: null, step: 0 }
      musicRef.current = session
      const chords = [
        [110, 164.81, 220],
        [98, 146.83, 196],
        [130.81, 196, 261.63],
        [87.31, 130.81, 174.61],
      ]
      const playBar = () => {
        if (musicRef.current !== session) return
        const now = context.currentTime
        chords[session.step % chords.length].forEach((frequency, index) => {
          const oscillator = context.createOscillator()
          const gain = context.createGain()
          oscillator.type = index === 0 ? 'sine' : 'triangle'
          oscillator.frequency.setValueAtTime(frequency, now)
          gain.gain.setValueAtTime(.0001, now)
          gain.gain.exponentialRampToValueAtTime(index === 0 ? .045 : .018, now + .42)
          gain.gain.exponentialRampToValueAtTime(.0001, now + 3.6)
          oscillator.connect(gain).connect(master)
          oscillator.start(now)
          oscillator.stop(now + 3.8)
        })
        session.step += 1
        session.timer = window.setTimeout(playBar, 3600)
      }
      playBar()
    } catch {
      // The site still works if a browser blocks Web Audio.
    }
  }

  useEffect(() => { if (!enabled) stopMusic() }, [enabled])
  return { sound, startMusic, stopMusic }
}

function AudioToggle({ enabled, onToggle }) {
  return <button className={`audio-toggle ${enabled ? 'is-on' : ''}`} onClick={onToggle} aria-label={enabled ? 'Turn audio off' : 'Turn audio on'}><Icon name="sound" size={16} /><span>audio</span><strong>{enabled ? 'ON' : 'OFF'}</strong></button>
}

function SketchScene() {
  return <div className="sketch-scene" aria-hidden="true">
    <div className="brick-wall" />
    <div className="sketch-horizon" />
    <svg className="sketch-tree" viewBox="0 0 500 650" preserveAspectRatio="none">
      <g fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M132 644c10-150 6-274-3-390M132 476c-43-67-69-139-86-208M133 382c58-70 83-141 103-231M126 301C72 234 42 161 40 73M146 266c50-42 87-100 105-164" />
        <path d="M50 103C18 90 10 52 44 29c31-21 66-9 82 20-17-35 13-60 43-39 29 20 19 58-1 82 39-46 93-20 92 24 0 31-26 49-52 55 43 7 52 43 30 70-22 27-58 20-81 0 12 43-25 75-59 55-24-14-25-45-13-70-31 29-73 7-75-26-2-26 17-47 40-55z" />
        <path d="M36 120c54-14 116 3 163 39M15 155c60-20 134 2 183 49M58 70c48 5 86 30 119 65" opacity=".5" />
      </g>
    </svg>
    <svg className="sketch-swing" viewBox="0 0 180 250">
      <g fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
        <path d="M20 0v105M126 0l-17 105M20 20h106M29 151h78" /><path d="M29 105v37M107 105v37" /><path d="M29 142c0 19 78 19 78 0" /><path d="M31 150h75" />
      </g>
    </svg>
    <svg className="sketch-cat" viewBox="0 0 180 240">
      <g fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M58 74 53 34l31 20 31-20-5 40c25 15 29 59 8 87-27 35-78 27-94-10-12-29-2-75 34-87Z" fill="rgba(255,255,255,.35)" />
        <circle cx="74" cy="91" r="3" fill="currentColor" /><circle cx="103" cy="91" r="3" fill="currentColor" /><path d="m85 102 5 4 5-4M90 106c-4 13-14 12-19 6M90 106c4 13 14 12 19 6M48 103 9 92M48 114 7 115M131 103l39-11M131 114l41 1M62 153c-10 16-12 35-10 55M117 153c11 16 13 35 11 55" />
      </g>
    </svg>
    <div className="sketch-window"><i /><i /><i /><i /></div>
    <div className="sketch-planter"><span /><span /><span /><span /><span /><b /></div>
    <div className="sketch-bird bird-one">⌁</div><div className="sketch-bird bird-two">⌁</div>
    <div className="sketch-path"><i /><i /><i /><i /><i /></div>
  </div>
}

function PortfolioDoor({ onEnter, sound }) {
  return <button className="portfolio-door" onClick={() => { sound('door'); onEnter() }} aria-label="Enter Suraj portfolio">
    <span className="door-sign">PORTFOLIO</span>
    <span className="door-panels"><i><b>PR</b><small>premiere</small></i><i><b>AE</b><small>motion</small></i><i><b>PS</b><small>design</small></i><i><b>✦</b><small>suraj</small></i></span>
    <span className="door-handle" />
  </button>
}

function Loader({ progress }) {
  return <section className="preloader"><div className="paper-crease crease-one" /><div className="paper-crease crease-two" /><div className="preloader-progress"><span>{progress}%</span><i style={{ '--progress': `${progress}%` }} /></div><p>suraj / opening the archive</p></section>
}

function HomeScene({ onEnter, onReel, audioOn, onToggleAudio, sound }) {
  return <section className="home-scene">
    <SketchScene />
    <div className="home-brand"><span className="brand-mark">S</span><span><strong>SURAJ</strong><small>creative video editor</small></span></div>
    <div className="scene-caption"><button className="scene-reel" onClick={onReel}>showreel <Icon name="up" size={13} /></button><span>walk in</span><strong>Suraj's visual archive</strong></div>
    <div className="portfolio-sign"><span>creative video editor</span><strong>PORTFOLIO</strong><small>short-form / motion / design</small></div>
    <PortfolioDoor onEnter={onEnter} sound={sound} />
    <div className="explorer-card"><strong>EXPLORER</strong><span>Click the door to enter.</span><AudioToggle enabled={audioOn} onToggle={onToggleAudio} /></div>
    <div className="home-footer"><span>West Bengal / India</span><span>scroll, move, explore</span><span>2026</span></div>
  </section>
}

function PaperTransition({ active }) {
  return <div className={`paper-transition ${active ? 'is-active' : ''}`} aria-hidden="true"><div className="tear-line" /><span>opening</span></div>
}

function SketchButton({ children, onClick, className = '' }) { return <button className={`sketch-button ${className}`} onClick={onClick}>{children}</button> }

function StudioNav({ view, onView, onReel, onBack, audioOn, onToggleAudio }) {
  return <header className="studio-nav"><button className="studio-logo" onClick={onBack}><span>S</span><strong>SURAJ</strong><small>creative video editor</small></button><div className="studio-location">archive / {view === 'studio' ? 'lobby' : view}</div><nav><button className={view === 'work' ? 'active' : ''} onClick={() => onView('work')}>Work</button><button className={view === 'about' ? 'active' : ''} onClick={() => onView('about')}>About</button><button className={view === 'contact' ? 'active' : ''} onClick={() => onView('contact')}>Contact</button><button onClick={onReel}>Reel</button></nav><AudioToggle enabled={audioOn} onToggle={onToggleAudio} /></header>
}

function Lobby({ onView, onReel, sound }) {
  return <div className="lobby-view"><div className="lobby-copy"><span>01 / the lobby</span><h1>Suraj<br /><em>in motion.</em></h1><p>Three years of editing, one sharp instinct: make the story impossible to skip.</p><SketchButton onClick={onReel}><Icon name="play" size={12} /> play showreel</SketchButton></div><div className="lobby-doors"><button onClick={() => { sound('click'); onView('work') }}><span className="mini-door work-door"><img src="/media/drive-01.jpg" alt="" /></span><strong>Work</strong><small>selected edits</small></button><button onClick={() => { sound('click'); onView('about') }}><span className="mini-door about-door"><img src="/media/suraj-intro.png" alt="" /></span><strong>About</strong><small>the editor</small></button><button onClick={() => { sound('click'); onView('contact') }}><span className="mini-door contact-door"><img src="/media/drive-02.jpg" alt="" /></span><strong>Contact</strong><small>start a project</small></button></div><div className="lobby-instruction">choose a room / audio is currently on</div></div>
}

function WorkView({ onOpen }) {
  const [filter, setFilter] = useState('All')
  const filters = ['All', 'Short-form edit', 'Motion design', 'Thumbnail design', 'Brand story', 'Talking head']
  const visible = filter === 'All' ? projects : projects.filter((project) => project.type === filter)
  return <div className="studio-view work-view"><div className="view-heading"><span>02 / room work</span><h2>Selected<br /><em>edits.</em></h2><p>Frames from Suraj's current archive — social cuts, motion studies, thumbnails, and brand stories.</p></div><div className="filter-row">{filters.map((item) => <button key={item} className={filter === item ? 'active' : ''} onClick={() => setFilter(item)}>{item}</button>)}</div><div className="project-wall">{visible.map((project, index) => <button key={project.title} className={`project-card card-${index % 3}`} onClick={() => onOpen(project)}><span className="project-image"><img src={project.image} alt="" /><i><Icon name="up" size={15} /></i></span><strong>{project.title}</strong><small>{project.type} / {project.year}</small></button>)}</div><a className="drive-link" href={DRIVE_FOLDER} target="_blank" rel="noreferrer">open full Drive archive <Icon name="up" size={15} /></a></div>
}

function AboutView() {
  return <div className="studio-view about-view"><div className="view-heading"><span>03 / room about</span><h2>More than<br /><em>an editor.</em></h2></div><div className="about-layout"><figure><img src="/media/suraj-intro.png" alt="Suraj" /><figcaption>still learning / always curious</figcaption></figure><div className="about-text"><p className="about-lead">I’m Suraj — a creative video editor with 3 years of experience creating engaging, high-quality content.</p><p>Alongside video editing, I bring 1+ year of graphic design experience to the frame. My focus is simple: make the story clear, the pacing feel right, and the final visual impossible to scroll past.</p><div className="about-stats"><span><strong>03+</strong><small>years editing</small></span><span><strong>01+</strong><small>year in design</small></span><span><strong>2026</strong><small>currently studying</small></span><span><strong>IN</strong><small>West Bengal</small></span></div></div></div></div>
}

function ContactView() {
  return <div className="studio-view contact-view"><div className="contact-copy"><span>04 / room contact</span><h2>Let’s make<br /><em>it move.</em></h2><p>Tell me what you’re making, where it needs to live, and when it needs to ship. I’ll bring the cut, polish, and a point of view.</p><a className="contact-email" href="mailto:yyyyyttttt92tt@gmail.com">yyyyyttttt92tt@gmail.com <Icon name="up" size={17} /></a></div><div className="contact-details"><div><span>WhatsApp</span><a href="https://wa.me/919641147392" target="_blank" rel="noreferrer">+91 96411 47392</a></div><div><span>Based in</span><strong>West Bengal, India</strong></div><div><span>Available for</span><strong>Freelance / collaborations</strong></div><div><span>Archive</span><a href={DRIVE_FOLDER} target="_blank" rel="noreferrer">Google Drive <Icon name="up" size={14} /></a></div></div><div className="contact-stamp">have a<br />good project?</div></div>
}

function ReelModal({ onClose }) {
  const videoRef = useRef(null)
  const [videoError, setVideoError] = useState(false)
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const startPlayback = async () => {
      try {
        await video.play()
      } catch {
        video.muted = true
        try { await video.play() } catch { /* The native play button remains available. */ }
      }
    }
    startPlayback()
  }, [])
  return <div className="modal-layer" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><div className="reel-modal"><button className="modal-close" onClick={onClose} aria-label="Close showreel"><Icon name="close" size={19} /></button><div className="reel-player">{videoError ? <div className="reel-error"><strong>Showreel preview unavailable</strong><span>Open the original MP4 from Drive.</span><a href={driveFile(driveIds.art)} target="_blank" rel="noreferrer">open video in Drive <Icon name="up" size={15} /></a></div> : <video ref={videoRef} src={showreelSource} title="Suraj showreel" controls autoPlay playsInline preload="auto" onError={() => setVideoError(true)} />}</div><div className="reel-modal-copy"><span>showreel / 2026</span><h2>Play the<br /><em>good stuff.</em></h2><p>Selected cuts from Suraj's current archive — short-form edits, motion studies, and brand stories.</p><a href={DRIVE_FOLDER} target="_blank" rel="noreferrer">open full archive <Icon name="up" size={15} /></a></div></div></div>
}

function ProjectModal({ project, onClose }) {
  useEffect(() => { const closeOnEscape = (event) => event.key === 'Escape' && onClose(); window.addEventListener('keydown', closeOnEscape); return () => window.removeEventListener('keydown', closeOnEscape) }, [onClose])
  return <div className="modal-layer" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><div className="project-modal"><button className="modal-close" onClick={onClose} aria-label="Close project"><Icon name="close" size={19} /></button><div className="project-hero"><img src={project.image} alt="" /><div><span>{project.type} / {project.year}</span><h2>{project.title}</h2></div></div><div className="project-body"><aside><div><span>Client</span><strong>{project.client}</strong></div><div><span>Role</span><strong>{project.role}</strong></div><div><span>Software</span><strong>{project.software}</strong></div><a href={driveFile(project.clip)} target="_blank" rel="noreferrer">watch source clip <Icon name="up" size={15} /></a></aside><article><p>{project.summary}</p><h3>selected frames</h3><div className="project-gallery">{project.gallery.map((image, index) => <img key={`${image}-${index}`} src={image} alt={`${project.title} frame ${index + 1}`} />)}</div></article></div></div></div>
}

function Studio({ view, onView, onBack, onReel, audioOn, onToggleAudio, onOpen, sound }) {
  return <section className="studio"><div className="studio-paper" /><StudioNav view={view} onView={onView} onReel={onReel} onBack={onBack} audioOn={audioOn} onToggleAudio={onToggleAudio} />{view === 'studio' && <Lobby onView={onView} onReel={onReel} sound={sound} />}{view === 'work' && <WorkView onOpen={onOpen} />}{view === 'about' && <AboutView />}{view === 'contact' && <ContactView />}<button className="return-home" onClick={onBack}>← return outside</button></section>
}

function App() {
  const [progress, setProgress] = useState(0)
  const [entered, setEntered] = useState(false)
  const [transitioning, setTransitioning] = useState(false)
  const [view, setView] = useState('studio')
  const [audioOn, setAudioOn] = useState(true)
  const [showReel, setShowReel] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)
  const { sound, startMusic, stopMusic } = useAudio(audioOn)

  useEffect(() => {
    const timer = window.setInterval(() => setProgress((current) => current >= 100 ? 100 : current + (current < 70 ? 4 : 2)), 55)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => { document.body.style.overflow = showReel || selectedProject ? 'hidden' : ''; return () => { document.body.style.overflow = '' } }, [showReel, selectedProject])

  const enterPortfolio = () => {
    if (transitioning) return
    startMusic()
    sound('paper')
    setTransitioning(true)
    window.setTimeout(() => { setEntered(true); setTransitioning(false) }, 900)
  }

  const toggleAudio = () => setAudioOn((current) => {
    const next = !current
    if (next) window.setTimeout(startMusic, 0)
    else stopMusic()
    return next
  })
  const returnOutside = () => { sound('click'); setEntered(false); setView('studio') }
  const openReel = () => { startMusic(); sound('click'); setShowReel(true) }

  if (!entered) return <div className="app">{progress < 100 && <Loader progress={progress} />}{progress >= 100 && <HomeScene onEnter={enterPortfolio} onReel={openReel} audioOn={audioOn} onToggleAudio={toggleAudio} sound={sound} />}<PaperTransition active={transitioning} />{showReel && <ReelModal onClose={() => setShowReel(false)} />}</div>
  return <div className="app"><Studio view={view} onView={setView} onBack={returnOutside} onReel={openReel} audioOn={audioOn} onToggleAudio={toggleAudio} onOpen={setSelectedProject} sound={sound} />{showReel && <ReelModal onClose={() => setShowReel(false)} />}{selectedProject && <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />}</div>
}

createRoot(document.getElementById('root')).render(<App />)
