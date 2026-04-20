import { create } from 'zustand'
import { getMyProfile } from '../api/profile'

export const useProfileStore = create((set) => ({
  profile: null,
  skills: [],
  projects: [],
  socialLinks: [],
  sectionOrder: ['hero', 'about', 'skills', 'projects', 'contact'],
  experiences: [],
  educations: [],
  certifications: [],
  services: [],
  testimonials: [],
  books: [],
  publications: [],
  quotes: [],
  customSections: [],
  loading: false,
  error: null,

  fetchProfile: async () => {
    set({ loading: true, error: null })
    try {
      const data = await getMyProfile()
      set({
        profile: data.profile,
        skills: data.skills || [],
        projects: data.projects || [],
        socialLinks: data.social_links || [],
        sectionOrder: data.section_order || ['hero', 'about', 'skills', 'projects', 'contact'],
        experiences: data.experiences || [],
        educations: data.educations || [],
        certifications: data.certifications || [],
        services: data.services || [],
        testimonials: data.testimonials || [],
        books: data.books || [],
        publications: data.publications || [],
        quotes: data.quotes || [],
        customSections: data.custom_sections || [],
        loading: false,
      })
    } catch (err) {
      set({ error: err.message, loading: false })
    }
  },

  updateProfile: (fields) => set((state) => ({ profile: { ...state.profile, ...fields } })),

  setProjects: (projects) => set({ projects }),
  setSkills: (skills) => set({ skills }),
  setSectionOrder: (sectionOrder) => set({ sectionOrder }),
  setExperiences: (experiences) => set({ experiences }),
  setEducations: (educations) => set({ educations }),
  setCertifications: (certifications) => set({ certifications }),
  setServices: (services) => set({ services }),
  setTestimonials: (testimonials) => set({ testimonials }),
  setBooks: (books) => set({ books }),
  setPublications: (publications) => set({ publications }),
  setQuotes: (quotes) => set({ quotes }),
  setCustomSections: (customSections) => set({ customSections }),
}))
