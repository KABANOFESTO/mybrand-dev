import { useState } from 'react';
import PropTypes from 'prop-types';

const initialProjects = [
	{ name: 'Smart Hiring Assistant', stack: 'React, Node.js, OpenAI', status: 'Live' },
	{ name: 'Hotel Booking Platform', stack: 'React, Express, MongoDB', status: 'In progress' },
];

const initialCertificates = [
	{ name: 'Responsive Web Design', issuer: 'freeCodeCamp', year: '2025', file: 'certificate.pdf' },
	{ name: 'AI for Developers', issuer: 'Coursera', year: '2026', file: 'certificate.pdf' },
];

const sectionCopy = {
	home: {
		eyebrow: 'Workspace overview',
		title: 'Keep your portfolio ready to share.',
		description: 'Update the details recruiters see, publish strong project proof, and keep your credentials current.',
	},
	'code-review': { eyebrow: 'AI workspace', title: 'Review code with practical, actionable feedback.', description: 'Paste a snippet to identify issues, improve clarity, and build stronger engineering habits.' },
	skills: { eyebrow: 'AI workspace', title: 'Turn your skills into a sharper career story.', description: 'Analyze strengths, spot useful gaps, and focus your next learning step.' },
	resume: { eyebrow: 'Career tools', title: 'Create a resume that highlights your best work.', description: 'Build a clear, professional resume from your portfolio and experience.' },
	interview: { eyebrow: 'Career tools', title: 'Practice interviews with confident answers.', description: 'Simulate realistic technical and behavioral interviews at your own pace.' },
	activity: { eyebrow: 'Workspace', title: 'Keep track of your progress.', description: 'Review recent AI sessions, portfolio changes, and important milestones.' },
	plan: { eyebrow: 'Account', title: 'Choose the plan that fits your momentum.', description: 'Compare features and unlock more AI support when you are ready.' },
	billing: { eyebrow: 'Account', title: 'Manage your billing with confidence.', description: 'Review your subscription, payment method, and invoices in one place.' },
	settings: { eyebrow: 'Account', title: 'Make your workspace yours.', description: 'Control preferences, privacy, and account settings from one clear place.' },
	profile: {
		eyebrow: 'Public profile',
		title: 'Shape how people meet your work.',
		description: 'These details appear across your portfolio and help visitors understand your focus quickly.',
	},
	projects: {
		eyebrow: 'Project library',
		title: 'Make your best work easy to trust.',
		description: 'Add outcomes, technology choices, and delivery status to keep your work current.',
	},
	certificates: {
		eyebrow: 'Credentials',
		title: 'Keep your proof of skill close.',
		description: 'Attach certificates and maintain a concise, credible record of your learning.',
	},
};

const VisitorDashboard = ({ section }) => {
	const [profile, setProfile] = useState({
		name: 'Kabano Festo',
		role: 'Full-stack developer',
		bio: 'I build useful digital products with thoughtful interfaces and dependable systems.',
	});
	const [projects, setProjects] = useState(initialProjects);
	const [certificates, setCertificates] = useState(initialCertificates);
	const [projectForm, setProjectForm] = useState({ name: '', stack: '' });
	const [certificateForm, setCertificateForm] = useState({ name: '', issuer: '', year: '' });
	const [selectedFile, setSelectedFile] = useState('');
	const [notice, setNotice] = useState('');
	const copy = sectionCopy[section] || sectionCopy.home;

	const showNotice = (message) => {
		setNotice(message);
		window.setTimeout(() => setNotice(''), 2800);
	};

	const updateProfile = (event) => {
		event.preventDefault();
		showNotice('Profile changes saved locally.');
	};

	const addProject = (event) => {
		event.preventDefault();
		if (!projectForm.name.trim() || !projectForm.stack.trim()) return;
		setProjects((current) => [...current, { ...projectForm, status: 'Draft' }]);
		setProjectForm({ name: '', stack: '' });
		showNotice('Project added to your portfolio workspace.');
	};

	const attachCertificate = (event) => {
		event.preventDefault();
		if (!certificateForm.name.trim() || !certificateForm.issuer.trim() || !selectedFile) return;
		setCertificates((current) => [
			...current,
			{ ...certificateForm, file: selectedFile },
		]);
		setCertificateForm({ name: '', issuer: '', year: '' });
		setSelectedFile('');
		showNotice('Certificate attached to your library.');
	};

	return (
		<div className="mx-auto grid max-w-7xl gap-5">
			<section className="flex flex-col justify-between gap-5 rounded-2xl border border-[#293442] bg-[linear-gradient(135deg,#172631,#101821)] p-5 shadow-xl shadow-black/10 sm:p-7 lg:flex-row lg:items-end">
				<div className="max-w-2xl">
					<p className="mb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[#f2b84b]">{copy.eyebrow}</p>
					<h1 className="max-w-xl text-2xl font-semibold tracking-tight text-[#f4f8f8] sm:text-3xl">{copy.title}</h1>
					<p className="mt-3 max-w-xl text-sm leading-6 text-[#9aabb5]">{copy.description}</p>
				</div>
				<div className="flex items-center gap-2 rounded-lg border border-[#315062] bg-[#0d1b24] px-3 py-2 font-mono text-[11px] text-[#9adbc8]">
					<span className="h-2 w-2 rounded-full bg-[#57e0c2]" />
					Changes are saved in this session
				</div>
			</section>

			{notice && <div role="status" className="rounded-lg border border-[#57e0c2]/30 bg-[#57e0c2]/10 px-4 py-3 text-sm text-[#9adbc8]">{notice}</div>}

			{section === 'home' && (
				<section className="grid gap-4 sm:grid-cols-3">
					{[
						['Projects', projects.length, 'portfolio entries'],
						['Certificates', certificates.length, 'attached credentials'],
						['Profile', 'Ready', 'public details'],
					].map(([label, value, detail]) => (
						<article key={label} className="rounded-xl border border-[#293442] bg-[#151c24] p-5">
							<p className="text-sm text-[#8ea2ad]">{label}</p>
							<strong className="mt-2 block text-2xl text-[#f4f8f8]">{value}</strong>
							<span className="mt-1 block text-xs text-[#6f8490]">{detail}</span>
						</article>
					))}
				</section>
			)}

			{!['home', 'profile', 'projects', 'certificates'].includes(section) && (
				<section className="grid gap-4 sm:grid-cols-3">
					{['Personalized guidance', 'Private by design', 'Ready when you are'].map((title, index) => (
						<article key={title} className="rounded-xl border border-[#293442] bg-[#151c24] p-5 transition-colors hover:border-[#f2b84b]/35">
							<span className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#f2b84b]/25 bg-[#f2b84b]/10 text-[#f2b84b]"><i className={`bi ${['bi-stars', 'bi-shield-check', 'bi-arrow-up-right-circle'][index]}`} aria-hidden="true" /></span>
							<h2 className="mt-4 font-semibold text-[#f4f8f8]">{title}</h2>
							<p className="mt-2 text-sm leading-6 text-[#8ea2ad]">This area is set up for the next step in your developer journey.</p>
						</article>
					))}
				</section>
			)}

			{section === 'profile' && (
				<form onSubmit={updateProfile} className="grid gap-4 rounded-2xl border border-[#293442] bg-[#151c24] p-5 sm:p-7">
					<div className="grid gap-4 sm:grid-cols-2">
						<label className="grid gap-2 text-sm text-[#9aabb5]">Display name<input value={profile.name} onChange={(event) => setProfile({ ...profile, name: event.target.value })} className="rounded-lg border border-[#334653] bg-[#0d151c] px-3 py-2.5 text-[#f4f8f8] outline-none focus:border-[#f2b84b]" /></label>
						<label className="grid gap-2 text-sm text-[#9aabb5]">Professional role<input value={profile.role} onChange={(event) => setProfile({ ...profile, role: event.target.value })} className="rounded-lg border border-[#334653] bg-[#0d151c] px-3 py-2.5 text-[#f4f8f8] outline-none focus:border-[#f2b84b]" /></label>
					</div>
					<label className="grid gap-2 text-sm text-[#9aabb5]">Short introduction<textarea rows="5" value={profile.bio} onChange={(event) => setProfile({ ...profile, bio: event.target.value })} className="resize-y rounded-lg border border-[#334653] bg-[#0d151c] px-3 py-2.5 text-[#f4f8f8] outline-none focus:border-[#f2b84b]" /></label>
					<button type="submit" className="w-fit rounded-lg bg-[#f2b84b] px-4 py-2.5 text-sm font-semibold text-[#10121a] transition-transform hover:-translate-y-0.5">Save profile</button>
				</form>
			)}

			{section === 'projects' && (
				<div className="grid gap-5 lg:grid-cols-[1fr_360px]">
					<section className="rounded-2xl border border-[#293442] bg-[#151c24] p-5 sm:p-7"><div className="mb-5 flex items-center justify-between"><h2 className="text-lg font-semibold">Your projects</h2><span className="font-mono text-xs text-[#6f8490]">{projects.length} total</span></div><div className="grid gap-3">{projects.map((project) => <article key={project.name} className="flex items-center justify-between gap-4 rounded-xl border border-[#293442] bg-[#0d151c] p-4"><div><h3 className="font-medium text-[#f4f8f8]">{project.name}</h3><p className="mt-1 text-sm text-[#8ea2ad]">{project.stack}</p></div><span className="rounded-full bg-[#57e0c2]/10 px-2.5 py-1 text-xs text-[#9adbc8]">{project.status}</span></article>)}</div></section>
					<form onSubmit={addProject} className="grid content-start gap-4 rounded-2xl border border-[#293442] bg-[#151c24] p-5"><h2 className="text-lg font-semibold">Add a project</h2><label className="grid gap-2 text-sm text-[#9aabb5]">Project name<input required value={projectForm.name} onChange={(event) => setProjectForm({ ...projectForm, name: event.target.value })} className="rounded-lg border border-[#334653] bg-[#0d151c] px-3 py-2.5 text-[#f4f8f8] outline-none focus:border-[#f2b84b]" /></label><label className="grid gap-2 text-sm text-[#9aabb5]">Stack or tools<input required value={projectForm.stack} onChange={(event) => setProjectForm({ ...projectForm, stack: event.target.value })} className="rounded-lg border border-[#334653] bg-[#0d151c] px-3 py-2.5 text-[#f4f8f8] outline-none focus:border-[#f2b84b]" /></label><button type="submit" className="rounded-lg bg-[#f2b84b] px-4 py-2.5 text-sm font-semibold text-[#10121a]">Add project</button></form>
				</div>
			)}

			{section === 'certificates' && (
				<div className="grid gap-5 lg:grid-cols-[1fr_360px]">
					<section className="rounded-2xl border border-[#293442] bg-[#151c24] p-5 sm:p-7"><div className="mb-5 flex items-center justify-between"><h2 className="text-lg font-semibold">Certificate library</h2><span className="font-mono text-xs text-[#6f8490]">{certificates.length} attached</span></div><div className="grid gap-3">{certificates.map((certificate) => <article key={`${certificate.name}-${certificate.year}`} className="flex items-center justify-between gap-4 rounded-xl border border-[#293442] bg-[#0d151c] p-4"><div><h3 className="font-medium text-[#f4f8f8]">{certificate.name}</h3><p className="mt-1 text-sm text-[#8ea2ad]">{certificate.issuer} · {certificate.year}</p></div><span className="text-xs text-[#9adbc8]"><i className="bi bi-paperclip" /> {certificate.file}</span></article>)}</div></section>
					<form onSubmit={attachCertificate} className="grid content-start gap-4 rounded-2xl border border-[#293442] bg-[#151c24] p-5"><h2 className="text-lg font-semibold">Attach certificate</h2><label className="grid gap-2 text-sm text-[#9aabb5]">Certificate name<input required value={certificateForm.name} onChange={(event) => setCertificateForm({ ...certificateForm, name: event.target.value })} className="rounded-lg border border-[#334653] bg-[#0d151c] px-3 py-2.5 text-[#f4f8f8] outline-none focus:border-[#f2b84b]" /></label><label className="grid gap-2 text-sm text-[#9aabb5]">Issuer<input required value={certificateForm.issuer} onChange={(event) => setCertificateForm({ ...certificateForm, issuer: event.target.value })} className="rounded-lg border border-[#334653] bg-[#0d151c] px-3 py-2.5 text-[#f4f8f8] outline-none focus:border-[#f2b84b]" /></label><label className="grid gap-2 text-sm text-[#9aabb5]">Year<input required value={certificateForm.year} onChange={(event) => setCertificateForm({ ...certificateForm, year: event.target.value })} className="rounded-lg border border-[#334653] bg-[#0d151c] px-3 py-2.5 text-[#f4f8f8] outline-none focus:border-[#f2b84b]" /></label><label className="grid gap-2 text-sm text-[#9aabb5]">File<input required type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={(event) => setSelectedFile(event.target.files?.[0]?.name || '')} className="rounded-lg border border-dashed border-[#334653] bg-[#0d151c] px-3 py-2 text-xs text-[#8ea2ad] file:mr-3 file:rounded file:border-0 file:bg-[#263945] file:px-2 file:py-1 file:text-[#f4f8f8]" /></label><button type="submit" className="rounded-lg bg-[#f2b84b] px-4 py-2.5 text-sm font-semibold text-[#10121a]">Attach certificate</button></form>
				</div>
			)}
		</div>
	);
};

VisitorDashboard.propTypes = {
	section: PropTypes.string.isRequired,
};

export default VisitorDashboard;
