---
# Global identity. Every section reads its own file; this one holds what is shared.
name: "Mrinmoy Nandi"                 # used in <title>, alt text and footer credit
role: "Student Engineer"              # short role line
wordmark: "MRINMOY"                   # nav logo + giant footer wordmark
email: "mrinmoy@mrinmoynandi.in"
location: "Kolkata, West Bengal, India"

meta:
  title: "Mrinmoy Nandi — Student Engineer"
  description: "Mrinmoy Nandi is a student engineer exploring the intersection of software engineering, AI, systems and mathematics, building practical developer tools while working toward long-term interests in intelligent systems and quantum computing."

# Intro loader. The word is split around a small image chip that flickers through crops.
loader:
  enabled: true
  left: "MRIN"
  right: "MOY"
  image: "/media/portrait.webp"
  # object-position values; each one is a different crop of the same image (9 frames, 230ms each)
  frames: ["50% 30%", "30% 40%", "60% 35%", "70% 55%", "45% 45%", "55% 20%", "35% 60%", "65% 70%", "50% 40%"]

# Menu links. href "#id" scrolls to a section on the home page.
# Blog is not listed yet: add it once the blog exists.
nav:
  - { label: "Home",                 href: "#top" }
  - { label: "Projects",             href: "#projects" }
  - { label: "About",                href: "#about" }
  - { label: "Research & Interests", href: "#explorer" }
  - { label: "Skills",               href: "#skills" }
  - { label: "Contact",              href: "#contact" }

socials:
  - { label: "GitHub", href: "https://github.com/MrinmoyNandi" }
  # PLACEHOLDER: uncomment once the real URLs are available.
  - { label: "Leetcode", href: "https://leetcode.com/u/_mrinmoy_nandi/" }
  - { label: "LinkedIn",  href: "https://www.linkedin.com/in/mrinmoy-nandi-48141937b?utm_source=share_via&utm_content=profile&utm_medium=member_android" }
  - { label: "Instagram", href: "https://www.instagram.com/yourfavrorangeflag?utm_source=qr&dlrf=MXFoZGJ2bXo0c3UzMA%3D%3D" }

# Order of home page sections. Remove an id to hide that section.
# Valid ids: hero, explorer, about, clients, projects, lab, skills, contact
sections: [hero, about, projects, explorer, clients, lab, skills, contact]
---
