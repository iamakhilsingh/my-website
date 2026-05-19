/* eslint-disable */
import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HeartPulse,
  ShieldCheck,
  Plane,
  Stethoscope,
  Phone,
  Mail,
  MapPin,
  Star,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Menu,
  X,
  CalendarDays,
  FileText,
  Building2,
  Users,
  BadgeCheck,
  Eye,
  Bone,
  Activity,
  Brain,
  Baby,
  Smile,
  Scissors,
  CheckCircle2,
  Play,
} from "lucide-react";

const BRAND = {
  navy: "#132033",
  green: "#009B7D",
  gold: "#D4AF37",
  light: "#F4F7F8",
};

const whatsappNumber = "917838247423";
const defaultMessage = "Hello MedTreatIndia, I need information about medical treatment in India.";
const waLink = (message = defaultMessage) =>
  `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

const treatments = [
  { title: "Cardiac Surgery", desc: "CABG, valve replacement, pediatric cardiology, angioplasty.", icon: HeartPulse },
  { title: "Cancer / Oncology", desc: "Chemotherapy, radiation, surgical oncology, targeted therapy.", icon: Activity },
  { title: "Orthopedics & Joint", desc: "Knee replacement, hip replacement, spine surgery, sports injuries.", icon: Bone },
  { title: "Kidney Transplant", desc: "Living donor transplant, dialysis support, nephrology care.", icon: Activity },
  { title: "Liver Transplant", desc: "Comprehensive liver care and living donor transplant coordination.", icon: Activity },
  { title: "IVF & Fertility", desc: "IVF, ICSI, egg freezing, male and female infertility support.", icon: Baby },
  { title: "Neurosurgery", desc: "Brain tumor surgery, deep brain stimulation, spine surgery.", icon: Brain },
  { title: "Spine Surgery", desc: "Scoliosis correction, spinal fusion, minimally invasive spine care.", icon: Bone },
  { title: "Eye Surgery", desc: "LASIK, cataract, glaucoma, retinal treatment options.", icon: Eye },
  { title: "Dental Treatment", desc: "Dental implants, smile designing, root canal, maxillofacial surgery.", icon: Smile },
  { title: "Cosmetic Surgery", desc: "Rhinoplasty, liposuction, hair transplant, breast augmentation.", icon: Scissors },
  { title: "Health Checkups", desc: "Executive health packages and preventive screening plans.", icon: ShieldCheck },
];

const hospitals = [
  {
    name: "Apollo Hospitals",
    city: "Multiple Cities",
    image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=80",
    desc: "A large hospital network offering advanced multi-specialty treatment options.",
    specs: ["Heart Care", "Oncology", "Transplants", "Robotics"],
  },
  {
    name: "Fortis Healthcare",
    city: "Delhi NCR & India",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80",
    desc: "Modern facilities with experienced specialists across major medical disciplines.",
    specs: ["Cardiac", "Neuro", "Orthopedics", "ICU Care"],
  },
  {
    name: "Max Hospitals",
    city: "Delhi NCR",
    image: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=1200&q=80",
    desc: "Premium healthcare facilities for international patients and complex procedures.",
    specs: ["Cancer Care", "Heart Care", "Neurosciences", "Orthopedics"],
  },
  {
    name: "Medanta",
    city: "Gurugram",
    image: "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1200&q=80",
    desc: "Integrated medical institute known for advanced care and specialty departments.",
    specs: ["Liver", "Kidney", "Cardiac", "Neuro"],
  },
];

const testimonials = [
  {
    name: "Sarah M.",
    country: "Kenya",
    treatment: "Cardiac Surgery",
    quote:
      "The coordination was smooth from consultation to hospital appointment. The team helped us understand every step clearly.",
  },
  {
    name: "Grace O.",
    country: "Nigeria",
    treatment: "IVF Treatment",
    quote:
      "After years of trying, we finally found the right guidance. The doctors were compassionate and the process was transparent.",
  },
  {
    name: "Ahmed R.",
    country: "UAE",
    treatment: "Orthopedics",
    quote:
      "I received clear cost estimates and hospital options before travelling. The local support in India was very helpful.",
  },
];

const videos = [
  {
    name: "David M.",
    country: "Nigeria",
    treatment: "Cardiac Bypass Surgery",
    url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    story: "Patient story placeholder for a complex cardiac journey and recovery support.",
  },
  {
    name: "Amina K.",
    country: "Oman",
    treatment: "Cancer Treatment",
    url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    story: "Video testimonial placeholder. Replace with real approved patient video.",
  },
];

function Logo() {
  return (
    <div className="flex items-center">
      <img src="/logo.png" alt="MedTreat India" className="h-14 w-auto" />
    </div>
  );
}

function SectionHeader({ eyebrow, title, text, dark = false }) {
  return (
    <div className="mx-auto mb-12 max-w-3xl text-center">
      {eyebrow && <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-[#D4AF37]">{eyebrow}</p>}
      <h2 className={`text-3xl font-black tracking-tight md:text-5xl ${dark ? "text-white" : "text-[#132033]"}`}>{title}</h2>
      {text && <p className={`mt-5 text-base leading-7 ${dark ? "text-white/75" : "text-slate-500"}`}>{text}</p>}
    </div>
  );
}

function ConsultationForm({ compact = false }) {
  const [form, setForm] = useState({ name: "", country: "", phone: "", email: "", treatment: "", budget: "", date: "", source: "" });
  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const submit = (e) => {
    e.preventDefault();
    const msg = `Hello MedTreatIndia, I want a free consultation.\nName: ${form.name}\nCountry: ${form.country}\nTreatment Needed: ${form.treatment}\nWhatsApp Number: ${form.phone}\nEmail: ${form.email}\nBudget: ${form.budget}\nPreferred Travel Date: ${form.date}`;
    window.open(waLink(msg), "_blank");
  };
  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="md:col-span-2 text-sm font-semibold text-slate-900">Full Name *<input value={form.name} onChange={(e) => update("name", e.target.value)} required placeholder="John Doe" className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#009B7D]" /></label>
        <label className="text-sm font-semibold text-slate-900">Country *<select value={form.country} onChange={(e) => update("country", e.target.value)} required className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 outline-none focus:border-[#009B7D]"><option value="">Select Country</option><option>Nigeria</option><option>Kenya</option><option>UAE</option><option>Oman</option><option>Bangladesh</option><option>Other</option></select></label>
        <label className="text-sm font-semibold text-slate-900">WhatsApp Number *<input value={form.phone} onChange={(e) => update("phone", e.target.value)} required placeholder="+123 456 7890" className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#009B7D]" /></label>
        {!compact && <label className="md:col-span-2 text-sm font-semibold text-slate-900">Email Address *<input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} required placeholder="john@example.com" className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#009B7D]" /></label>}
        <label className="md:col-span-2 text-sm font-semibold text-slate-900">Medical Condition / Treatment Needed *<textarea value={form.treatment} onChange={(e) => update("treatment", e.target.value)} required placeholder="Please describe your condition..." rows={compact ? 3 : 4} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#009B7D]" /></label>
        {!compact && <><label className="text-sm font-semibold text-slate-900">Estimated Budget (USD)<input value={form.budget} onChange={(e) => update("budget", e.target.value)} placeholder="e.g. 5000" className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#009B7D]" /></label><label className="text-sm font-semibold text-slate-900">Preferred Travel Date<input type="date" value={form.date} onChange={(e) => update("date", e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#009B7D]" /></label><label className="md:col-span-2 text-sm font-semibold text-slate-900">How did you hear about us?<select value={form.source} onChange={(e) => update("source", e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 outline-none focus:border-[#009B7D]"><option value="">Select Source</option><option>Google</option><option>Instagram</option><option>Facebook</option><option>Friend</option></select></label></>}
      </div>
      <button type="submit" className="w-full rounded-xl bg-[#009B7D] px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-900/10 transition hover:bg-[#00836a]">Get Free Consultation Now</button>
    </form>
  );
}

function Popup() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (sessionStorage.getItem("mti_popup_closed")) return;
    const t = setTimeout(() => setOpen(true), 3000);
    return () => clearTimeout(t);
  }, []);
  const close = () => { sessionStorage.setItem("mti_popup_closed", "1"); setOpen(false); };
  return (
    <AnimatePresence>
      {open && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-[#132033]/70 p-4 backdrop-blur-sm">
        <motion.div initial={{ y: 24, scale: 0.96 }} animate={{ y: 0, scale: 1 }} exit={{ y: 24, scale: 0.96 }} className="relative w-full max-w-xl rounded-[2rem] bg-white p-7 shadow-2xl">
          <button onClick={close} className="absolute right-5 top-5 rounded-full bg-slate-100 p-2 text-slate-500"><X size={18} /></button>
          <div className="mb-5 pr-10"><h3 className="text-3xl font-black text-[#132033]">Get a Free Medical Opinion</h3><p className="mt-2 text-slate-500">Share your treatment requirement and our medical coordinator will contact you within 24 hours.</p></div>
          <ConsultationForm compact />
          <a href={waLink()} target="_blank" className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-[#009B7D] px-5 py-3.5 text-sm font-bold text-[#009B7D]"><MessageCircle size={18} /> Chat on WhatsApp</a>
        </motion.div>
      </motion.div>}
    </AnimatePresence>
  );
}

function Header() {
  const [menu, setMenu] = useState(false);
  const links = ["Home", "About", "Treatments", "How It Works", "Hospitals", "Testimonials", "Contact"];
  return <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur">
    <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5">
      <a href="#home"><Logo /></a>
      <nav className="hidden items-center gap-8 text-sm font-semibold text-slate-700 lg:flex">{links.map(l => <a key={l} href={`#${l.toLowerCase().replaceAll(" ", "-")}`} className="hover:text-[#009B7D]">{l}</a>)}</nav>
      <div className="hidden items-center gap-4 lg:flex"><a href={waLink()} target="_blank" className="flex items-center gap-2 text-sm font-bold text-[#009B7D]"><MessageCircle size={18} /> +91 78382 47423</a><a href="#contact" className="rounded-full bg-[#009B7D] px-6 py-3 text-sm font-bold text-white">Free Consultation</a></div>
      <button onClick={() => setMenu(!menu)} className="lg:hidden"><Menu /></button>
    </div>
    {menu && <div className="border-t bg-white p-5 lg:hidden">{links.map(l => <a onClick={() => setMenu(false)} key={l} href={`#${l.toLowerCase().replaceAll(" ", "-")}`} className="block py-3 font-semibold text-slate-700">{l}</a>)}</div>}
  </header>;
}

function Hero() {
  return <section id="home" className="relative min-h-[820px] overflow-hidden bg-[#132033] pt-24 text-white">
    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1626315869436-d6781ba69d6e?auto=format&fit=crop&w=1800&q=80')] bg-cover bg-center opacity-25" />
    <div className="absolute inset-0 bg-gradient-to-r from-[#132033] via-[#132033]/95 to-[#132033]/65" />
    <div className="relative mx-auto grid max-w-7xl gap-10 px-5 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col justify-center">
        <div className="mb-7 w-fit rounded-full bg-[#D4AF37]/15 px-4 py-2 text-xs font-bold text-[#D4AF37]">Trusted by patients from 20+ countries | Free consultation available</div>
        <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-tight md:text-6xl">Get World-Class Medical Treatment in India at Fraction of the Cost</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-white/75">Connect with India’s top accredited hospitals and expert surgeons. We provide end-to-end support from visa assistance to post-treatment care.</p>
        <div className="mt-8 flex flex-wrap gap-5 text-sm font-semibold text-white/90"><span className="flex items-center gap-2"><CheckCircle2 size={17} className="text-[#D4AF37]" /> Save 60–80%</span><span className="flex items-center gap-2"><CheckCircle2 size={17} className="text-[#D4AF37]" /> Top Surgeons</span><span className="flex items-center gap-2"><CheckCircle2 size={17} className="text-[#D4AF37]" /> Zero Wait Time</span></div>
      </motion.div>
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="rounded-[2rem] bg-white p-7 text-slate-900 shadow-2xl"><h2 className="text-2xl font-black text-[#132033]">Get Free Consultation</h2><p className="mb-5 mt-2 text-sm text-slate-500">Our medical case team will review your case and provide a treatment plan within 24 hours.</p><ConsultationForm /></motion.div>
    </div>
    <div className="relative bg-[#009B7D] py-7"><div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 px-5 text-center md:grid-cols-4">{[["5000+", "Patients Served"], ["20+", "Countries"], ["50+", "Hospital Partners"], ["15+", "Years Experience"]].map(([n, t]) => <div key={t}><div className="text-3xl font-black text-[#D4AF37]">{n}</div><div className="mt-1 text-xs font-bold uppercase tracking-widest text-white">{t}</div></div>)}</div></div>
  </section>;
}

function About() {
  return <section id="about" className="bg-[#F4F7F8] py-24"><div className="mx-auto max-w-7xl px-5"><SectionHeader title="Why Choose MedTreatIndia?" text="We make your medical journey to India seamless, affordable, and stress-free." />
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">{[
      [ShieldCheck, "Save 60–80% on Costs", "Get premium healthcare at a fraction of Western countries without compromising quality."],
      [Building2, "Top Accredited Hospitals", "Treatment options from leading hospitals with advanced medical technology."],
      [Users, "End-to-End Support", "From airport pickup to accommodation and hospital appointments, we support every step."],
      [Plane, "Visa & Travel Help", "Dedicated assistance for medical visa, flight booking, and local travel arrangements."],
    ].map(([Icon, title, desc]) => <motion.div whileHover={{ y: -6 }} key={title} className="rounded-3xl bg-white p-7 shadow-sm"><div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-[#009B7D]"><Icon size={22} /></div><h3 className="text-lg font-black text-[#132033]">{title}</h3><p className="mt-3 text-sm leading-6 text-slate-500">{desc}</p></motion.div>)}</div></div></section>;
}

function Treatments() {
  return <section id="treatments" className="bg-white py-24"><div className="mx-auto max-w-7xl px-5"><SectionHeader title="Medical Treatments" text="World-class medical procedures performed by internationally experienced specialists." />
    <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">{treatments.map(({ title, desc, icon: Icon }) => <div key={title} className="rounded-3xl bg-white p-7 shadow-[0_12px_40px_rgba(19,32,51,0.08)]"><div className="mb-7 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-[#009B7D]"><Icon size={22} /></div><h3 className="text-lg font-black text-[#132033]">{title}</h3><p className="mt-3 min-h-[54px] text-sm leading-6 text-slate-500">{desc}</p><a href={waLink(`Hello MedTreatIndia, I need a quote for ${title}.`)} target="_blank" className="mt-6 block rounded-xl bg-[#009B7D] px-4 py-3 text-center text-sm font-bold text-white">Get Free Quote</a></div>)}</div></div></section>;
}

function Hospitals() {
  const [i, setI] = useState(0); const h = hospitals[i];
  return <section id="hospitals" className="bg-[#F4F7F8] py-24"><div className="mx-auto max-w-7xl px-5"><SectionHeader title="Our Partner Hospitals" text="Explore treatment options through leading healthcare facilities in India." />
    <div className="mx-auto overflow-hidden rounded-[2rem] bg-white shadow-2xl shadow-slate-900/10 lg:grid lg:max-w-5xl lg:grid-cols-2"><img src={h.image} className="h-80 w-full object-cover lg:h-full" /><div className="p-10"><p className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#009B7D]"><MapPin size={16} />{h.city}</p><h3 className="text-3xl font-black text-[#132033]">{h.name}</h3><p className="mt-5 text-lg leading-8 text-slate-500">{h.desc}</p><p className="mt-8 text-xs font-black uppercase tracking-[0.2em] text-[#009B7D]">Top Specialties</p><div className="mt-4 grid grid-cols-2 gap-3">{h.specs.map(s => <span key={s} className="flex items-center gap-2 text-sm font-semibold text-slate-600"><Star size={15} className="text-[#D4AF37]" /> {s}</span>)}</div><a href="#contact" className="mt-8 block rounded-xl bg-[#009B7D] px-5 py-3 text-center text-sm font-bold text-white">Learn More</a></div></div>
    <div className="mt-8 flex items-center justify-center gap-4"><button onClick={() => setI((i - 1 + hospitals.length) % hospitals.length)} className="rounded-full bg-white p-3 text-[#009B7D] shadow"><ChevronLeft /></button><div className="flex gap-2">{hospitals.map((_, idx) => <button key={idx} onClick={() => setI(idx)} className={`h-2.5 rounded-full ${idx === i ? "w-8 bg-[#009B7D]" : "w-2.5 bg-emerald-100"}`} />)}</div><button onClick={() => setI((i + 1) % hospitals.length)} className="rounded-full bg-white p-3 text-[#009B7D] shadow"><ChevronRight /></button></div></div></section>;
}

function HowItWorks() {
  const steps = [[FileText, "Fill Inquiry Form", "Tell us about your medical condition, share reports, and specify your treatment needs."], [Phone, "Free Consultation Call", "Our medical team calls you within 24 hours to understand your case in detail."], [CalendarDays, "Get Treatment Plan & Cost", "Receive a detailed medical opinion, treatment plan, and transparent pricing."], [Plane, "Visa & Travel Assistance", "We provide medical visa support guidance and help with flight planning."], [MapPin, "Arrive in India", "Airport pickup, local SIM card, accommodation assistance, and appointment support."], [HeartPulse, "Treatment & Recovery", "Hospital assistance, language support, and post-treatment follow-up support."]];
  return <section id="how-it-works" className="bg-white py-24"><div className="mx-auto max-w-6xl px-5"><SectionHeader title="How It Works" text="Your journey to health made simple, transparent, and stress-free." />
    <div className="relative mx-auto max-w-4xl before:absolute before:left-6 before:top-0 before:h-full before:w-px before:bg-[#009B7D]/30 md:before:left-1/2">{steps.map(([Icon, title, desc], idx) => <div key={title} className={`relative mb-12 flex md:${idx % 2 ? "justify-start" : "justify-end"}`}><div className={`ml-16 w-full rounded-3xl bg-[#F4F7F8] p-7 shadow-sm md:ml-0 md:w-[42%]`}><h3 className="text-xl font-black text-[#009B7D]">Step {idx + 1}: {title}</h3><p className="mt-3 leading-7 text-slate-500">{desc}</p></div><div className="absolute left-0 top-6 flex h-12 w-12 items-center justify-center rounded-full bg-[#009B7D] text-white shadow-lg ring-8 ring-white md:left-1/2 md:-translate-x-1/2"><Icon size={22} /></div></div>)}</div></div></section>;
}

function Testimonials() {
  const [ti, setTi] = useState(0); const [vi, setVi] = useState(0); const t = testimonials[ti]; const v = videos[vi];
  return <section id="testimonials" className="bg-[#F4F7F8] py-24"><div className="mx-auto max-w-7xl px-5"><SectionHeader title="Patient Testimonials" text="Real testimonial sections ready for your approved patient stories and videos." />
    <div className="mx-auto mb-20 overflow-hidden rounded-[2rem] bg-[#132033] text-white shadow-2xl lg:grid lg:max-w-5xl lg:grid-cols-[1.2fr_0.8fr]"><iframe className="aspect-video w-full lg:h-full" src={v.url} title="Video testimonial" allowFullScreen /><div className="p-10"><p className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[#D4AF37]"><Play size={18} /> Patient Story</p><h3 className="text-2xl font-black">{v.name}</h3><p className="mt-2 text-sm text-white/65">{v.country} · <span className="text-[#D4AF37]">{v.treatment}</span></p><p className="mt-6 leading-8 text-white/75">{v.story}</p></div></div>
    <div className="mx-auto max-w-4xl rounded-[2rem] bg-white p-10 text-center shadow-2xl shadow-slate-900/10"><div className="mb-6 flex justify-center gap-1 text-[#D4AF37]">{Array.from({ length: 5 }).map((_, idx) => <Star key={idx} fill="currentColor" size={24} />)}</div><p className="text-2xl italic leading-10 text-slate-600">“{t.quote}”</p><div className="mx-auto mt-8 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-xl font-black text-[#009B7D]">{t.name[0]}</div><h4 className="mt-4 font-black text-[#132033]">{t.name}</h4><p className="mt-1 text-sm text-slate-500">{t.country} · <span className="text-[#009B7D]">{t.treatment}</span></p><a href="#contact" className="mt-6 inline-block rounded-xl bg-[#009B7D] px-6 py-3 text-sm font-bold text-white">Get Similar Treatment</a></div>
    <div className="mt-8 flex justify-center gap-4"><button onClick={() => setTi((ti - 1 + testimonials.length) % testimonials.length)} className="rounded-full bg-white p-3 text-[#009B7D]"><ChevronLeft /></button><button onClick={() => setVi((vi + 1) % videos.length)} className="rounded-full bg-white px-5 py-3 text-sm font-bold text-[#009B7D]">Next Video</button><button onClick={() => setTi((ti + 1) % testimonials.length)} className="rounded-full bg-white p-3 text-[#009B7D]"><ChevronRight /></button></div></div></section>;
}

function FAQ() {
  const faqs = ["How much does treatment cost in India?", "Is it safe to travel to India for medical treatment?", "How long does the visa process take?", "Can I get hospital cost estimates before travelling?", "Do you help with airport pickup and accommodation?", "Which treatments are popular in India?"];
  return <section className="bg-white py-24"><div className="mx-auto max-w-4xl px-5"><SectionHeader title="Frequently Asked Questions" />{faqs.map(q => <details key={q} className="group border-b border-slate-200 bg-white p-5"><summary className="cursor-pointer list-none font-bold text-[#132033]">{q}<span className="float-right text-[#009B7D]">+</span></summary><p className="mt-4 leading-7 text-slate-500">Our team provides guidance based on your medical reports and hospital evaluation. Final advice, cost, and treatment plan are provided by registered doctors and hospitals.</p></details>)}</div></section>;
}

function Contact() {
  return <section id="contact" className="bg-[#F4F7F8] py-24"><div className="mx-auto max-w-7xl px-5"><SectionHeader title="Contact Us" text="We are here to help you 24/7. Get in touch for a free medical opinion." />
    <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]"><div><h3 className="text-3xl font-black text-[#009B7D]">Get in Touch</h3><p className="mt-5 text-lg leading-8 text-slate-500">Our medical coordinators are ready to assist you with treatment queries, visa process, and travel arrangements.</p><div className="mt-8 space-y-6">{[[MessageCircle, "WhatsApp (Fastest Response)", "+91 78382 47423"], [Mail, "Email Us", "info@medtreatindia.com"], [Phone, "Response Time Promise", "We respond to all inquiries within 24 hours"], [MapPin, "Global Patient Office", "New Delhi, India"]].map(([Icon, a, b]) => <div key={a} className="flex gap-4"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-[#009B7D]"><Icon /></div><div><h4 className="font-black text-[#132033]">{a}</h4><p className="mt-1 text-slate-500">{b}</p></div></div>)}</div><div className="mt-8 flex h-56 items-center justify-center rounded-3xl bg-slate-200 text-slate-500"><MapPin size={34} /> Google Maps Embed</div></div><div className="rounded-[2rem] bg-white p-8 shadow-xl"><h3 className="text-2xl font-black text-[#009B7D]">Request Free Consultation</h3><p className="mb-6 mt-2 text-slate-500">Fill out the form below and attach medical reports later on WhatsApp if available.</p><ConsultationForm /></div></div></div></section>;
}

function Footer() {
  return <footer className="bg-[#132033] py-16 text-white"><div className="mx-auto max-w-7xl px-5"><div className="grid gap-10 md:grid-cols-4"><div><div className="brightness-0 invert"><Logo /></div><p className="mt-6 leading-7 text-white/60">Connecting global patients with India’s finest healthcare facilities. World-class treatment at a fraction of the cost.</p><div className="mt-6 flex gap-3"><span className="rounded-full bg-white/10 p-3">f</span><span className="rounded-full bg-white/10 p-3">◎</span><span className="rounded-full bg-white/10 p-3">in</span><span className="rounded-full bg-white/10 p-3">▶</span></div></div>{[["Quick Links", ["About Us", "How It Works", "Hospitals", "Testimonials", "Contact Us"]], ["Top Treatments", ["Cardiac Surgery", "Oncology", "Orthopedics", "Organ Transplant", "IVF & Fertility"]]].map(([h, items]) => <div key={h}><h4 className="font-black text-[#D4AF37]">{h}</h4><div className="mt-6 space-y-4">{items.map(x => <a key={x} href="#" className="block text-white/60 hover:text-white">{x}</a>)}</div></div>)}<div><h4 className="font-black text-[#D4AF37]">Contact Us</h4><div className="mt-6 space-y-4 text-white/60"><p>info@medtreatindia.com</p><p>+91 78382 47423</p><p>New Delhi, India<br />Global Patient Office</p></div></div></div><div className="mt-12 border-t border-white/10 pt-8 text-sm text-white/50"><p>Disclaimer: MedTreatIndia is a medical tourism assistance platform. Final diagnosis, treatment advice, cost, and medical decisions are provided by registered hospitals and doctors. Results may vary depending on individual medical condition.</p><div className="mt-6 flex flex-col justify-between gap-4 md:flex-row"><p>© 2026 MedTreatIndia. All rights reserved.</p><p>Privacy Policy &nbsp;&nbsp; Terms & Conditions</p></div></div></div></footer>;
}

export default function MedTreatIndiaWebsite() {
  useEffect(() => {
    document.title = "Medical Tourism in India | Affordable Treatment in India | MedTreatIndia";
    const meta = document.querySelector('meta[name="description"]') || document.createElement("meta");
    meta.setAttribute("name", "description");
    meta.setAttribute("content", "MedTreatIndia helps international patients access affordable, high-quality medical treatment in India with hospital coordination, visa assistance, travel support, and free consultation.");
    document.head.appendChild(meta);
  }, []);
  return <div className="min-h-screen scroll-smooth bg-white font-sans text-slate-900"><Header /><Hero /><About /><Treatments /><HowItWorks /><Hospitals /><Testimonials /><FAQ /><Contact /><Footer /><Popup /><a href={waLink()} target="_blank" className="fixed bottom-6 right-6 z-40 flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl"><MessageCircle size={32} /></a></div>;
}
