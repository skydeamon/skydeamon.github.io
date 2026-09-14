/* ============================================
   CV RENDERER — pure render functions + DOM shell (Jade Makwela)
   UMD: browser -> window.CVRenderer
        Node.js -> module.exports
   ============================================ */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.CVRenderer = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  /* ---------- helpers ---------- */

  function wrapSection(label, inner) {
    return (
      '<section class="section" aria-label="' + label + '">' +
      '<h2 class="section-title">' + label + '</h2>' +
      inner +
      '</section>'
    );
  }

  function tagList(tags, primary) {
    return tags
      .map(function (tag) {
        var cls = primary.indexOf(tag) !== -1 ? 'skill-tag primary' : 'skill-tag';
        return '<span class="' + cls + '">' + tag + '</span>';
      })
      .join('');
  }

  function skillCategories(categories, data) {
    return categories
      .map(function (cat) {
        var resolved = typeof cat === 'string' ? data.skills[cat] : cat;
        if (!resolved) return '';
        return (
          '<div class="skill-category">' +
          '<h3>' + resolved.title + '</h3>' +
          '<div class="skill-tags">' + tagList(resolved.tags, resolved.primary || []) + '</div>' +
          '</div>'
        );
      })
      .join('');
  }

  function projectItems(projects) {
    return projects
      .map(function (project) {
        var title = project.url
          ? '<a href="' + project.url + '" target="_blank" rel="noopener noreferrer">' + project.title + '</a>'
          : project.title;
        var tech = (project.tech || [])
          .map(function (t) { return '<span>' + t + '</span>'; })
          .join('');
        return (
          '<div class="project-item">' +
          '<div class="project-title">' + title + '</div>' +
          '<p class="project-description">' + project.description + '</p>' +
          '<div class="project-tech">' + tech + '</div>' +
          '</div>'
        );
      })
      .join('');
  }

  function bulletList(bullets) {
    return bullets
      .map(function (b) { return '<li>' + b + '</li>'; })
      .join('');
  }

  /* ---------- section templates ---------- */

  function renderSummary(profile) {
    return wrapSection('Professional Summary', '<p>' + profile.summary + '</p>');
  }

  function renderSkillsGrid(profile, data, skillsKey, title) {
    var categories = profile[skillsKey] || profile.skills || [];
    return wrapSection(title, '<div class="skills-grid">' + skillCategories(categories, data) + '</div>');
  }

  function renderSkillBars(profile) {
    var bars = (profile.skillBars || [])
      .map(function (bar) {
        return (
          '<div class="skill-bar">' +
          '<div class="skill-bar-header"><span>' + bar.name + '</span><span>' + bar.level + '%</span></div>' +
          '<div class="skill-bar-track"><div class="skill-bar-fill" style="width: ' + bar.level + '%;"></div></div>' +
          '</div>'
        );
      })
      .join('');
    return wrapSection('Skills', bars);
  }

  function renderTimeline(profile, data) {
    var items = data.experience
      .map(function (job) {
        var bullets = (profile.experienceBullets && profile.experienceBullets[job.roleKey]) || job.bullets;
        return (
          '<div class="timeline-item">' +
          '<div class="timeline-date">' + job.date + '</div>' +
          '<div class="experience-title">' + job.title + '</div>' +
          '<div class="experience-company">' + job.company + ' · ' + job.location + '</div>' +
          '<ul class="timeline-bullets">' + bulletList(bullets) + '</ul>' +
          '</div>'
        );
      })
      .join('');
    return wrapSection('Experience', '<div class="timeline">' + items + '</div>');
  }

  function renderStatsGrid(profile) {
    var cards = (profile.stats || [])
      .map(function (stat) {
        return (
          '<div class="stat-card">' +
          '<div class="stat-number">' + stat.number + '</div>' +
          '<div class="stat-label">' + stat.label + '</div>' +
          '</div>'
        );
      })
      .join('');
    return '<div class="stats-grid">' + cards + '</div>';
  }

  function renderExperienceList(profile, data) {
    var items = data.experience
      .map(function (job) {
        var bullets = (profile.experienceBullets && profile.experienceBullets[job.roleKey]) || job.bullets;
        return (
          '<div class="experience-item">' +
          '<div class="experience-header">' +
          '<div>' +
          '<div class="experience-title">' + job.title + '</div>' +
          '<div class="experience-company">' + job.company + '</div>' +
          '</div>' +
          '<div class="text-right">' +
          '<div class="experience-date">' + job.date + '</div>' +
          '<div class="experience-location">' + job.location + '</div>' +
          '</div>' +
          '</div>' +
          '<div class="experience-description"><ul>' + bulletList(bullets) + '</ul></div>' +
          '</div>'
        );
      })
      .join('');
    return wrapSection('Professional Experience', items);
  }

  function renderProjects(profile, data) {
    return wrapSection('Selected Projects', projectItems(data.projects));
  }

  function renderEducation(profile, data) {
    var items = data.education
      .map(function (edu) {
        return (
          '<div class="education-item">' +
          '<div class="education-degree">' + edu.degree + '</div>' +
          '<div class="education-school">' + edu.school + '</div>' +
          '<div class="education-date">' + edu.date + '</div>' +
          (edu.details ? '<div class="education-details">' + edu.details + '</div>' : '') +
          '</div>'
        );
      })
      .join('');
    return wrapSection('Education', items);
  }

  function renderCertifications(profile, data) {
    var items = data.certifications
      .map(function (cert) {
        return (
          '<div class="cert-item">' +
          '<div class="cert-icon">' + cert.icon + '</div>' +
          '<div class="cert-info"><h3>' + cert.title + '</h3><p>' + cert.detail + '</p></div>' +
          '</div>'
        );
      })
      .join('');
    return wrapSection('Certifications', items);
  }

  function renderLanguages(profile, data) {
    var items = data.languages
      .map(function (lang) {
        return (
          '<div class="language-item">' +
          '<span class="language-name">' + lang.name + '</span>' +
          '<span class="language-level">' + lang.level + '</span>' +
          '</div>'
        );
      })
      .join('');
    return wrapSection('Languages', items);
  }

  function renderAffiliations(profile, data) {
    return wrapSection('Professional Affiliations', '<ul>' + bulletList(data.affiliations) + '</ul>');
  }

  function renderInterests(profile, data) {
    return wrapSection('Interests', '<div class="skill-tags">' + tagList(data.interests, []) + '</div>');
  }

  function renderAvailability(profile) {
    if (!profile.availability || profile.availability.length === 0) return '';
    var rows = profile.availability
      .map(function (row) {
        return (
          '<p style="color: var(--text-secondary); font-size: 0.95rem; margin-top: var(--space-xs);">' +
          '<strong>' + row.label + ':</strong> ' + row.value +
          '</p>'
        );
      })
      .join('');
    return wrapSection(
      'Availability',
      '<div style="background: var(--bg-tertiary); padding: var(--space-md); border-radius: var(--radius-md); border-left: 4px solid var(--primary);">' +
      rows +
      '</div>'
    );
  }

  function renderTargetRole(profile) {
    return wrapSection('Target Role', '<p>' + profile.targetRole + '</p>');
  }

  function renderImpactHighlights(profile) {
    return wrapSection('Proven Impact', '<ul>' + bulletList(profile.impactHighlights) + '</ul>');
  }

  function renderLeadershipPhilosophy(profile) {
    return wrapSection('Leadership Philosophy', '<p>' + profile.leadershipPhilosophy + '</p>');
  }

  function renderPublications(profile) {
    return wrapSection('Publications', projectItems(profile.publications));
  }

  function renderTeaching(profile) {
    return wrapSection('Teaching & Mentoring', '<ul>' + bulletList(profile.teaching) + '</ul>');
  }

  function renderHealthcareCompliance(profile) {
    return wrapSection('Healthcare & Compliance', '<ul>' + bulletList(profile.healthcareCompliance) + '</ul>');
  }

  function renderTechnicalStack(profile) {
    var rows = profile.technicalStack
      .map(function (row) {
        return '<p><strong>' + row.label + ':</strong> ' + row.value + '</p>';
      })
      .join('');
    return wrapSection(
      'Technical Stack',
      '<div style="color: var(--text-secondary); font-size: 0.95rem; line-height: 1.8;">' + rows + '</div>'
    );
  }

  function renderServices(profile, data) {
    return wrapSection('Services Offered', '<div class="skills-grid">' + skillCategories(profile.services, data) + '</div>');
  }

  function renderResearchInterests(profile) {
    return wrapSection('Research Interests', '<div class="skill-tags">' + tagList(profile.researchInterests, []) + '</div>');
  }

  function renderResearchProjects(profile) {
    return wrapSection('Research Projects', projectItems(profile.researchProjects));
  }

  function renderReferences() {
    return wrapSection('References', '<p style="color: var(--text-muted); font-style: italic;">Available upon request.</p>');
  }

  /* ---------- flat (engagement) renderers ---------- */

  var ENGAGEMENT_SECTION_ORDER = [
    'summary',
    'skills',
    'experience',
    'projects',
    'education',
    'certifications',
    'languages',
    'affiliations',
    'availability',
    'references',
  ];

  function flatSection(label, inner) {
    return '<h2>' + label + '</h2>' + inner;
  }

  function flatHeader(profile, data) {
    var c = data.contact;
    return (
      '<h1>' + c.name + '</h1>' +
      '<p class="contact">' +
      c.location +
      ' | Email: ' + c.email +
      ' | LinkedIn: ' + c.linkedin.replace(/^https?:\/\//, '') +
      ' | GitHub: ' + c.github.replace(/^https?:\/\//, '') +
      '</p>'
    );
  }

  function flatSummary(profile) {
    return flatSection('Professional Summary', '<p>' + profile.summary + '</p>');
  }

  function flatSkills(profile, data) {
    var categories = profile.skills || [];
    var lines = categories
      .map(function (cat) {
        var resolved = typeof cat === 'string' ? data.skills[cat] : cat;
        if (!resolved) return '';
        return '<p class="skills-line"><strong>' + resolved.title + ':</strong> ' + resolved.tags.join(', ') + '</p>';
      })
      .join('');
    return flatSection('Technical Skills', lines);
  }

  function flatExperience(profile, data) {
    var items = data.experience
      .map(function (job) {
        var bullets = (profile.experienceBullets && profile.experienceBullets[job.roleKey]) || job.bullets;
        return (
          '<h3>' + job.title + ' — ' + job.company + '</h3>' +
          '<p class="job-date">' + job.date + ' | ' + job.location + '</p>' +
          '<ul>' + bulletList(bullets) + '</ul>'
        );
      })
      .join('');
    return flatSection('Professional Experience', items);
  }

  function flatProjects(profile, data) {
    var items = data.projects
      .map(function (project) {
        var title = project.url
          ? project.title + ' (' + project.url.replace(/^https?:\/\//, '') + ')'
          : project.title;
        return (
          '<h3>' + title + '</h3>' +
          '<p>' + project.description + '</p>' +
          (project.tech && project.tech.length ? '<p class="job-date">' + project.tech.join(', ') + '</p>' : '')
        );
      })
      .join('');
    return flatSection('Selected Projects', items);
  }

  function flatEducation(profile, data) {
    var items = data.education
      .map(function (edu) {
        return (
          '<h3>' + edu.degree + '</h3>' +
          '<p>' + edu.school + ' | ' + edu.date + '</p>' +
          (edu.details ? '<p>' + edu.details + '</p>' : '')
        );
      })
      .join('');
    return flatSection('Education', items);
  }

  function flatCertifications(profile, data) {
    var items = data.certifications
      .map(function (cert) {
        return '<li>' + cert.title + ' — ' + cert.detail + '</li>';
      })
      .join('');
    return flatSection('Certifications', '<ul>' + items + '</ul>');
  }

  function flatLanguages(profile, data) {
    var items = data.languages
      .map(function (lang) {
        return '<li>' + lang.name + ' — ' + lang.level + '</li>';
      })
      .join('');
    return flatSection('Languages', '<ul>' + items + '</ul>');
  }

  function flatAffiliations(profile, data) {
    return flatSection('Professional Affiliations', '<ul>' + bulletList(data.affiliations) + '</ul>');
  }

  function flatAvailability(profile) {
    if (!profile.availability || profile.availability.length === 0) return '';
    var rows = profile.availability
      .map(function (row) {
        return '<li><strong>' + row.label + ':</strong> ' + row.value + '</li>';
      })
      .join('');
    return flatSection('Availability', '<ul>' + rows + '</ul>');
  }

  function flatReferences() {
    return flatSection('References', '<p>Available upon request.</p>');
  }

  var flatRenderers = {
    summary: flatSummary,
    skills: flatSkills,
    experience: flatExperience,
    projects: flatProjects,
    education: flatEducation,
    certifications: flatCertifications,
    languages: flatLanguages,
    affiliations: flatAffiliations,
    availability: flatAvailability,
    references: flatReferences,
  };

  function renderEngagement(profile, data) {
    var sections = ENGAGEMENT_SECTION_ORDER
      .map(function (name) {
        var renderer = flatRenderers[name];
        return renderer ? renderer(profile, data) : '';
      })
      .join('');
    return flatHeader(profile, data) + sections;
  }

  var sectionRenderers = {
    summary: renderSummary,
    'skills-grid': function (profile, data) {
      return renderSkillsGrid(profile, data, 'skills', 'Technical Skills');
    },
    'skills-grid-ai': function (profile, data) {
      return renderSkillsGrid(profile, data, 'skillsAI', 'Core LLM/AI Competencies');
    },
    'skills-grid-data': function (profile, data) {
      return renderSkillsGrid(profile, data, 'skillsData', 'Data Platform & Systems Engineering');
    },
    'skill-bars': renderSkillBars,
    timeline: renderTimeline,
    'stats-grid': renderStatsGrid,
    experience: renderExperienceList,
    projects: renderProjects,
    education: renderEducation,
    certifications: renderCertifications,
    languages: renderLanguages,
    affiliations: renderAffiliations,
    interests: renderInterests,
    availability: renderAvailability,
    'target-role': renderTargetRole,
    'impact-highlights': renderImpactHighlights,
    'leadership-philosophy': renderLeadershipPhilosophy,
    publications: renderPublications,
    teaching: renderTeaching,
    'healthcare-compliance': renderHealthcareCompliance,
    'technical-stack': renderTechnicalStack,
    services: renderServices,
    references: renderReferences,
    'research-interests': renderResearchInterests,
    'research-projects': renderResearchProjects,
  };

  function renderSection(sectionName, profile, data) {
    var renderer = sectionRenderers[sectionName];
    return renderer ? renderer(profile, data) : '';
  }

  /* ---------- header ---------- */

  function renderHeader(profile, data) {
    var contact = data.contact;
    return (
      '<header class="cv-header">' +
      '<h1>' + contact.name + '</h1>' +
      '<p class="subtitle">' + profile.subtitle + '</p>' +
      '<div class="contact-info">' +
      '<a href="mailto:' + contact.email + '">📧 ' + contact.email + '</a>' +
      '<span class="separator">|</span>' +
      '<a href="' + contact.linkedin + '" target="_blank" rel="noopener noreferrer">🔗 LinkedIn</a>' +
      '<span class="separator">|</span>' +
      '<a href="' + contact.github + '" target="_blank" rel="noopener noreferrer">💻 GitHub</a>' +
      '<span class="separator">|</span>' +
      '<span>📍 ' + contact.location + '</span>' +
      '</div>' +
      '</header>'
    );
  }

  /* ---------- controls ---------- */

  function renderControls(opts) {
    opts = opts || {};
    var base = opts.base || '../';
    var themeToggle = opts.plain
      ? ''
      : '<button class="control-btn" id="theme-toggle" aria-label="Toggle dark mode">' +
        '<span id="theme-icon">🌙</span> Dark' +
        '</button>';
    return (
      '<div class="controls">' +
      themeToggle +
      '<button class="control-btn secondary" id="print-btn" aria-label="Print CV">🖨️ Print / PDF</button>' +
      '<a href="' + base + 'index.html" class="control-btn secondary">← CVs</a>' +
      '<a href="' + base + '../index.html" class="control-btn secondary">Home</a>' +
      '</div>'
    );
  }

  /* ---------- renderCV ---------- */

  function renderCV(profile, data) {
    var header = renderHeader(profile, data);
    var content;

    if (profile.layout && profile.layout.type === 'two-column') {
      var mainSections = profile.layout.main
        .map(function (name) { return renderSection(name, profile, data); })
        .join('');
      var sidebarSections = profile.layout.sidebar
        .map(function (name) { return renderSection(name, profile, data); })
        .join('');
      var stats = profile.sectionOrder.indexOf('stats-grid') !== -1 ? renderStatsGrid(profile) : '';
      content =
        '<div class="cv-content">' +
        stats +
        '<div class="two-column">' +
        '<div class="main-content" style="padding: 0;">' + mainSections + '</div>' +
        '<aside class="sidebar" aria-label="Sidebar">' + sidebarSections + '</aside>' +
        '</div>' +
        '</div>';
    } else {
      var sections = profile.sectionOrder
        .map(function (name) {
          if (name === 'stats-grid') {
            return wrapSection('Proven Impact', renderStatsGrid(profile));
          }
          return renderSection(name, profile, data);
        })
        .join('');
      content = '<div class="cv-content">' + sections + '</div>';
    }

    return header + content;
  }

  /* ---------- DOM-wiring shell ---------- */

  function initCV(profileKey, opts) {
    if (typeof window === 'undefined' || !window.CV_DATA) return;
    var profile = window.CV_DATA.cvProfiles[profileKey];
    if (!profile) return;
    var root = document.getElementById('cv-root');
    if (!root) return;

    opts = opts || {};
    var engagement = opts.format === 'engagement';

    if (!engagement) {
      // Apply persisted/system theme preference (matches app.js behavior).
      var stored = null;
      try { stored = localStorage.getItem('theme'); } catch (e) { /* ignore */ }
      var initial = stored || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : null);
      if (initial) document.documentElement.setAttribute('data-theme', initial);
    }

    root.insertAdjacentHTML('beforebegin', renderControls({ plain: engagement, base: opts.base }));
    root.innerHTML = engagement
      ? renderEngagement(profile, window.CV_DATA)
      : renderCV(profile, window.CV_DATA);

    var toggle = document.getElementById('theme-toggle');
    var icon = document.getElementById('theme-icon');
    if (toggle && icon) {
      toggle.addEventListener('click', function () {
        var html = document.documentElement;
        var next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', next);
        icon.textContent = next === 'dark' ? '☀️' : '🌙';
        toggle.lastChild.textContent = next === 'dark' ? ' Light' : ' Dark';
        try { localStorage.setItem('theme', next); } catch (e) { /* ignore */ }
      });
    }

    var printBtn = document.getElementById('print-btn');
    if (printBtn) {
      printBtn.addEventListener('click', function () { window.print(); });
    }
  }

  return {
    renderHeader: renderHeader,
    renderControls: renderControls,
    renderSection: renderSection,
    renderCV: renderCV,
    renderEngagement: renderEngagement,
    initCV: initCV,
    sectionRenderers: sectionRenderers,
    ENGAGEMENT_SECTION_ORDER: ENGAGEMENT_SECTION_ORDER,
  };
});