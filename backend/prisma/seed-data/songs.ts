// Sonicly Fictional Music Catalog — Songs
// 204 song records. 25 have real audio URLs (actual mp3 files to be placed in public/audio/).
// The rest reference placeholder URLs that will gracefully fall back.

// Songs marked with hasAudio: true should have a corresponding mp3 in frontend/public/audio/
// For V1, audioUrl still points to the path — the player handles missing files gracefully.

type SongSeed = {
  id: string;
  title: string;
  duration: number;
  trackNum: number;
  albumId: string;
  genreId: string;
  audioUrl: string;
};

const audio = (id: string) => `/audio/${id}.mp3`;

export const songs: SongSeed[] = [
  // ══════════════════════════════════════════════════════════════════════════
  // NEON PULSE — Midnight Circuit
  // ══════════════════════════════════════════════════════════════════════════
  { id: 'tr_np_mc_01', title: 'Pulse', duration: 218, trackNum: 1, albumId: 'al_neonpulse_01', genreId: 'gn_synthwave', audioUrl: audio('tr_np_mc_01') },
  { id: 'tr_np_mc_02', title: 'Grid', duration: 195, trackNum: 2, albumId: 'al_neonpulse_01', genreId: 'gn_synthwave', audioUrl: audio('tr_np_mc_02') },
  { id: 'tr_np_mc_03', title: 'Circuit Breaker', duration: 243, trackNum: 3, albumId: 'al_neonpulse_01', genreId: 'gn_synthwave', audioUrl: audio('tr_np_mc_03') },
  { id: 'tr_np_mc_04', title: 'Midnight Drive', duration: 271, trackNum: 4, albumId: 'al_neonpulse_01', genreId: 'gn_synthwave', audioUrl: audio('tr_np_mc_04') },
  { id: 'tr_np_mc_05', title: 'Signal Chain', duration: 229, trackNum: 5, albumId: 'al_neonpulse_01', genreId: 'gn_synthwave', audioUrl: audio('tr_np_mc_05') },
  { id: 'tr_np_mc_06', title: 'Overclock', duration: 204, trackNum: 6, albumId: 'al_neonpulse_01', genreId: 'gn_synthwave', audioUrl: audio('tr_np_mc_06') },
  { id: 'tr_np_mc_07', title: 'Bandwidth', duration: 258, trackNum: 7, albumId: 'al_neonpulse_01', genreId: 'gn_synthwave', audioUrl: audio('tr_np_mc_07') },
  { id: 'tr_np_mc_08', title: 'Electric Night', duration: 312, trackNum: 8, albumId: 'al_neonpulse_01', genreId: 'gn_synthwave', audioUrl: audio('tr_np_mc_08') },
  { id: 'tr_np_mc_09', title: 'Loop', duration: 187, trackNum: 9, albumId: 'al_neonpulse_01', genreId: 'gn_synthwave', audioUrl: audio('tr_np_mc_09') },
  { id: 'tr_np_mc_10', title: 'Shutdown Sequence', duration: 334, trackNum: 10, albumId: 'al_neonpulse_01', genreId: 'gn_synthwave', audioUrl: audio('tr_np_mc_10') },

  // NEON PULSE — Ultraviolet
  { id: 'tr_np_uv_01', title: 'Neon Nights', duration: 243, trackNum: 1, albumId: 'al_neonpulse_02', genreId: 'gn_synthwave', audioUrl: audio('tr_np_uv_01') },
  { id: 'tr_np_uv_02', title: 'Spectrum Shift', duration: 267, trackNum: 2, albumId: 'al_neonpulse_02', genreId: 'gn_synthwave', audioUrl: audio('tr_np_uv_02') },
  { id: 'tr_np_uv_03', title: 'Violet Hour', duration: 298, trackNum: 3, albumId: 'al_neonpulse_02', genreId: 'gn_synthwave', audioUrl: audio('tr_np_uv_03') },
  { id: 'tr_np_uv_04', title: 'Phosphor', duration: 221, trackNum: 4, albumId: 'al_neonpulse_02', genreId: 'gn_synthwave', audioUrl: audio('tr_np_uv_04') },
  { id: 'tr_np_uv_05', title: 'Black Light', duration: 254, trackNum: 5, albumId: 'al_neonpulse_02', genreId: 'gn_synthwave', audioUrl: audio('tr_np_uv_05') },
  { id: 'tr_np_uv_06', title: 'Aurora Protocol', duration: 289, trackNum: 6, albumId: 'al_neonpulse_02', genreId: 'gn_synthwave', audioUrl: audio('tr_np_uv_06') },
  { id: 'tr_np_uv_07', title: 'Reflex', duration: 198, trackNum: 7, albumId: 'al_neonpulse_02', genreId: 'gn_synthwave', audioUrl: audio('tr_np_uv_07') },
  { id: 'tr_np_uv_08', title: 'Last Transmission', duration: 341, trackNum: 8, albumId: 'al_neonpulse_02', genreId: 'gn_synthwave', audioUrl: audio('tr_np_uv_08') },

  // NEON PULSE — Frequency (Single)
  { id: 'tr_np_fr_01', title: 'Frequency', duration: 234, trackNum: 1, albumId: 'al_neonpulse_03', genreId: 'gn_synthwave', audioUrl: audio('tr_np_fr_01') },

  // ══════════════════════════════════════════════════════════════════════════
  // VELVET ECHO — Silver Lining
  // ══════════════════════════════════════════════════════════════════════════
  { id: 'tr_ve_sl_01', title: 'Harbour Lights', duration: 267, trackNum: 1, albumId: 'al_velvetecho_01', genreId: 'gn_dreampop', audioUrl: audio('tr_ve_sl_01') },
  { id: 'tr_ve_sl_02', title: 'Silver', duration: 243, trackNum: 2, albumId: 'al_velvetecho_01', genreId: 'gn_dreampop', audioUrl: audio('tr_ve_sl_02') },
  { id: 'tr_ve_sl_03', title: 'Fog', duration: 218, trackNum: 3, albumId: 'al_velvetecho_01', genreId: 'gn_dreampop', audioUrl: audio('tr_ve_sl_03') },
  { id: 'tr_ve_sl_04', title: 'Anchor', duration: 291, trackNum: 4, albumId: 'al_velvetecho_01', genreId: 'gn_dreampop', audioUrl: audio('tr_ve_sl_04') },
  { id: 'tr_ve_sl_05', title: 'Tide', duration: 235, trackNum: 5, albumId: 'al_velvetecho_01', genreId: 'gn_dreampop', audioUrl: audio('tr_ve_sl_05') },
  { id: 'tr_ve_sl_06', title: 'Lining', duration: 248, trackNum: 6, albumId: 'al_velvetecho_01', genreId: 'gn_dreampop', audioUrl: audio('tr_ve_sl_06') },
  { id: 'tr_ve_sl_07', title: 'Storm Window', duration: 312, trackNum: 7, albumId: 'al_velvetecho_01', genreId: 'gn_dreampop', audioUrl: audio('tr_ve_sl_07') },
  { id: 'tr_ve_sl_08', title: 'Recede', duration: 278, trackNum: 8, albumId: 'al_velvetecho_01', genreId: 'gn_dreampop', audioUrl: audio('tr_ve_sl_08') },

  // VELVET ECHO — Harbor (EP)
  { id: 'tr_ve_ha_01', title: 'Arrival', duration: 224, trackNum: 1, albumId: 'al_velvetecho_02', genreId: 'gn_dreampop', audioUrl: audio('tr_ve_ha_01') },
  { id: 'tr_ve_ha_02', title: 'Mooring', duration: 258, trackNum: 2, albumId: 'al_velvetecho_02', genreId: 'gn_dreampop', audioUrl: audio('tr_ve_ha_02') },
  { id: 'tr_ve_ha_03', title: 'The Return', duration: 287, trackNum: 3, albumId: 'al_velvetecho_02', genreId: 'gn_dreampop', audioUrl: audio('tr_ve_ha_03') },
  { id: 'tr_ve_ha_04', title: 'Departure (Reprise)', duration: 194, trackNum: 4, albumId: 'al_velvetecho_02', genreId: 'gn_dreampop', audioUrl: audio('tr_ve_ha_04') },

  // ══════════════════════════════════════════════════════════════════════════
  // SOLSTICE — Equinox
  // ══════════════════════════════════════════════════════════════════════════
  { id: 'tr_so_eq_01', title: 'Dusk Prelude', duration: 312, trackNum: 1, albumId: 'al_solstice_01', genreId: 'gn_ambient', audioUrl: audio('tr_so_eq_01') },
  { id: 'tr_so_eq_02', title: 'Equinox', duration: 456, trackNum: 2, albumId: 'al_solstice_01', genreId: 'gn_ambient', audioUrl: audio('tr_so_eq_02') },
  { id: 'tr_so_eq_03', title: 'Balance', duration: 398, trackNum: 3, albumId: 'al_solstice_01', genreId: 'gn_ambient', audioUrl: audio('tr_so_eq_03') },
  { id: 'tr_so_eq_04', title: 'Tilt', duration: 267, trackNum: 4, albumId: 'al_solstice_01', genreId: 'gn_ambient', audioUrl: audio('tr_so_eq_04') },
  { id: 'tr_so_eq_05', title: 'Solstice', duration: 523, trackNum: 5, albumId: 'al_solstice_01', genreId: 'gn_ambient', audioUrl: audio('tr_so_eq_05') },
  { id: 'tr_so_eq_06', title: 'Dawn Postlude', duration: 289, trackNum: 6, albumId: 'al_solstice_01', genreId: 'gn_ambient', audioUrl: audio('tr_so_eq_06') },

  // SOLSTICE — Still Light
  { id: 'tr_so_sl_01', title: 'Still', duration: 445, trackNum: 1, albumId: 'al_solstice_02', genreId: 'gn_ambient', audioUrl: audio('tr_so_sl_01') },
  { id: 'tr_so_sl_02', title: 'Diffuse', duration: 378, trackNum: 2, albumId: 'al_solstice_02', genreId: 'gn_ambient', audioUrl: audio('tr_so_sl_02') },
  { id: 'tr_so_sl_03', title: 'Glass Morning', duration: 412, trackNum: 3, albumId: 'al_solstice_02', genreId: 'gn_ambient', audioUrl: audio('tr_so_sl_03') },
  { id: 'tr_so_sl_04', title: 'Held Light', duration: 334, trackNum: 4, albumId: 'al_solstice_02', genreId: 'gn_ambient', audioUrl: audio('tr_so_sl_04') },
  { id: 'tr_so_sl_05', title: 'Illuminance', duration: 489, trackNum: 5, albumId: 'al_solstice_02', genreId: 'gn_ambient', audioUrl: audio('tr_so_sl_05') },

  // ══════════════════════════════════════════════════════════════════════════
  // CHROMATIC — Spectrum
  // ══════════════════════════════════════════════════════════════════════════
  { id: 'tr_ch_sp_01', title: 'Prismatic', duration: 237, trackNum: 1, albumId: 'al_chromatic_01', genreId: 'gn_neosoul', audioUrl: audio('tr_ch_sp_01') },
  { id: 'tr_ch_sp_02', title: 'Warm Frequency', duration: 259, trackNum: 2, albumId: 'al_chromatic_01', genreId: 'gn_neosoul', audioUrl: audio('tr_ch_sp_02') },
  { id: 'tr_ch_sp_03', title: 'Saturate', duration: 281, trackNum: 3, albumId: 'al_chromatic_01', genreId: 'gn_neosoul', audioUrl: audio('tr_ch_sp_03') },
  { id: 'tr_ch_sp_04', title: 'Hue', duration: 243, trackNum: 4, albumId: 'al_chromatic_01', genreId: 'gn_futurebass', audioUrl: audio('tr_ch_sp_04') },
  { id: 'tr_ch_sp_05', title: 'Gradient', duration: 298, trackNum: 5, albumId: 'al_chromatic_01', genreId: 'gn_neosoul', audioUrl: audio('tr_ch_sp_05') },
  { id: 'tr_ch_sp_06', title: 'Full Spectrum', duration: 324, trackNum: 6, albumId: 'al_chromatic_01', genreId: 'gn_neosoul', audioUrl: audio('tr_ch_sp_06') },
  { id: 'tr_ch_sp_07', title: 'Palette', duration: 212, trackNum: 7, albumId: 'al_chromatic_01', genreId: 'gn_neosoul', audioUrl: audio('tr_ch_sp_07') },
  { id: 'tr_ch_sp_08', title: 'White', duration: 267, trackNum: 8, albumId: 'al_chromatic_01', genreId: 'gn_neosoul', audioUrl: audio('tr_ch_sp_08') },
  { id: 'tr_ch_sp_09', title: 'Black', duration: 289, trackNum: 9, albumId: 'al_chromatic_01', genreId: 'gn_neosoul', audioUrl: audio('tr_ch_sp_09') },

  // CHROMATIC — Wavelength
  { id: 'tr_ch_wl_01', title: 'Frequency Response', duration: 243, trackNum: 1, albumId: 'al_chromatic_02', genreId: 'gn_futurebass', audioUrl: audio('tr_ch_wl_01') },
  { id: 'tr_ch_wl_02', title: 'Amplitude', duration: 267, trackNum: 2, albumId: 'al_chromatic_02', genreId: 'gn_futurebass', audioUrl: audio('tr_ch_wl_02') },
  { id: 'tr_ch_wl_03', title: 'Resonance', duration: 291, trackNum: 3, albumId: 'al_chromatic_02', genreId: 'gn_neosoul', audioUrl: audio('tr_ch_wl_03') },
  { id: 'tr_ch_wl_04', title: 'Interference', duration: 258, trackNum: 4, albumId: 'al_chromatic_02', genreId: 'gn_futurebass', audioUrl: audio('tr_ch_wl_04') },
  { id: 'tr_ch_wl_05', title: 'Crest', duration: 315, trackNum: 5, albumId: 'al_chromatic_02', genreId: 'gn_neosoul', audioUrl: audio('tr_ch_wl_05') },
  { id: 'tr_ch_wl_06', title: 'Wavelength', duration: 347, trackNum: 6, albumId: 'al_chromatic_02', genreId: 'gn_futurebass', audioUrl: audio('tr_ch_wl_06') },

  // CHROMATIC — Iridescent (Single)
  { id: 'tr_ch_ir_01', title: 'Iridescent', duration: 254, trackNum: 1, albumId: 'al_chromatic_03', genreId: 'gn_neosoul', audioUrl: audio('tr_ch_ir_01') },

  // ══════════════════════════════════════════════════════════════════════════
  // MIRAGE — Open Architecture
  // ══════════════════════════════════════════════════════════════════════════
  { id: 'tr_mi_oa_01', title: 'Foundation', duration: 231, trackNum: 1, albumId: 'al_mirage_01', genreId: 'gn_altpop', audioUrl: audio('tr_mi_oa_01') },
  { id: 'tr_mi_oa_02', title: 'Blueprint', duration: 254, trackNum: 2, albumId: 'al_mirage_01', genreId: 'gn_altpop', audioUrl: audio('tr_mi_oa_02') },
  { id: 'tr_mi_oa_03', title: 'Glass Walls', duration: 278, trackNum: 3, albumId: 'al_mirage_01', genreId: 'gn_altpop', audioUrl: audio('tr_mi_oa_03') },
  { id: 'tr_mi_oa_04', title: 'Load Bearing', duration: 241, trackNum: 4, albumId: 'al_mirage_01', genreId: 'gn_altpop', audioUrl: audio('tr_mi_oa_04') },
  { id: 'tr_mi_oa_05', title: 'Threshold', duration: 298, trackNum: 5, albumId: 'al_mirage_01', genreId: 'gn_dreampop', audioUrl: audio('tr_mi_oa_05') },
  { id: 'tr_mi_oa_06', title: 'Open Plan', duration: 312, trackNum: 6, albumId: 'al_mirage_01', genreId: 'gn_altpop', audioUrl: audio('tr_mi_oa_06') },
  { id: 'tr_mi_oa_07', title: 'Skylight', duration: 267, trackNum: 7, albumId: 'al_mirage_01', genreId: 'gn_altpop', audioUrl: audio('tr_mi_oa_07') },
  { id: 'tr_mi_oa_08', title: 'Ruin', duration: 334, trackNum: 8, albumId: 'al_mirage_01', genreId: 'gn_altpop', audioUrl: audio('tr_mi_oa_08') },
  { id: 'tr_mi_oa_09', title: 'Rebuild', duration: 289, trackNum: 9, albumId: 'al_mirage_01', genreId: 'gn_altpop', audioUrl: audio('tr_mi_oa_09') },
  { id: 'tr_mi_oa_10', title: 'Open Architecture', duration: 356, trackNum: 10, albumId: 'al_mirage_01', genreId: 'gn_altpop', audioUrl: audio('tr_mi_oa_10') },

  // MIRAGE — Vanishing Point
  { id: 'tr_mi_vp_01', title: 'Perspective', duration: 243, trackNum: 1, albumId: 'al_mirage_02', genreId: 'gn_altpop', audioUrl: audio('tr_mi_vp_01') },
  { id: 'tr_mi_vp_02', title: 'Horizon', duration: 267, trackNum: 2, albumId: 'al_mirage_02', genreId: 'gn_altpop', audioUrl: audio('tr_mi_vp_02') },
  { id: 'tr_mi_vp_03', title: 'Distance', duration: 291, trackNum: 3, albumId: 'al_mirage_02', genreId: 'gn_dreampop', audioUrl: audio('tr_mi_vp_03') },
  { id: 'tr_mi_vp_04', title: 'Receding', duration: 254, trackNum: 4, albumId: 'al_mirage_02', genreId: 'gn_altpop', audioUrl: audio('tr_mi_vp_04') },
  { id: 'tr_mi_vp_05', title: 'Convergence', duration: 312, trackNum: 5, albumId: 'al_mirage_02', genreId: 'gn_altpop', audioUrl: audio('tr_mi_vp_05') },
  { id: 'tr_mi_vp_06', title: 'Vanishing', duration: 343, trackNum: 6, albumId: 'al_mirage_02', genreId: 'gn_altpop', audioUrl: audio('tr_mi_vp_06') },
  { id: 'tr_mi_vp_07', title: 'Still Here', duration: 278, trackNum: 7, albumId: 'al_mirage_02', genreId: 'gn_altpop', audioUrl: audio('tr_mi_vp_07') },

  // MIRAGE — Afterimage (EP)
  { id: 'tr_mi_ai_01', title: 'Ghost Image', duration: 234, trackNum: 1, albumId: 'al_mirage_03', genreId: 'gn_altpop', audioUrl: audio('tr_mi_ai_01') },
  { id: 'tr_mi_ai_02', title: 'Afterimage', duration: 258, trackNum: 2, albumId: 'al_mirage_03', genreId: 'gn_altpop', audioUrl: audio('tr_mi_ai_02') },
  { id: 'tr_mi_ai_03', title: 'Burn In', duration: 212, trackNum: 3, albumId: 'al_mirage_03', genreId: 'gn_dreampop', audioUrl: audio('tr_mi_ai_03') },

  // ══════════════════════════════════════════════════════════════════════════
  // OBSIDIAN — Black Mirror
  // ══════════════════════════════════════════════════════════════════════════
  { id: 'tr_ob_bm_01', title: 'Reflection', duration: 267, trackNum: 1, albumId: 'al_obsidian_01', genreId: 'gn_darkwave', audioUrl: audio('tr_ob_bm_01') },
  { id: 'tr_ob_bm_02', title: 'Shatter', duration: 243, trackNum: 2, albumId: 'al_obsidian_01', genreId: 'gn_darkwave', audioUrl: audio('tr_ob_bm_02') },
  { id: 'tr_ob_bm_03', title: 'Dark Surface', duration: 289, trackNum: 3, albumId: 'al_obsidian_01', genreId: 'gn_darkwave', audioUrl: audio('tr_ob_bm_03') },
  { id: 'tr_ob_bm_04', title: 'Mirror Stage', duration: 312, trackNum: 4, albumId: 'al_obsidian_01', genreId: 'gn_darkwave', audioUrl: audio('tr_ob_bm_04') },
  { id: 'tr_ob_bm_05', title: 'Distortion', duration: 254, trackNum: 5, albumId: 'al_obsidian_01', genreId: 'gn_darkwave', audioUrl: audio('tr_ob_bm_05') },
  { id: 'tr_ob_bm_06', title: 'Obsidian', duration: 378, trackNum: 6, albumId: 'al_obsidian_01', genreId: 'gn_darkwave', audioUrl: audio('tr_ob_bm_06') },
  { id: 'tr_ob_bm_07', title: 'Black Mirror', duration: 334, trackNum: 7, albumId: 'al_obsidian_01', genreId: 'gn_darkwave', audioUrl: audio('tr_ob_bm_07') },

  // OBSIDIAN — Voids (Single)
  { id: 'tr_ob_vo_01', title: 'Voids', duration: 276, trackNum: 1, albumId: 'al_obsidian_02', genreId: 'gn_darkwave', audioUrl: audio('tr_ob_vo_01') },

  // ══════════════════════════════════════════════════════════════════════════
  // PRISM — Refraction
  // ══════════════════════════════════════════════════════════════════════════
  { id: 'tr_pr_rf_01', title: 'Entry Angle', duration: 198, trackNum: 1, albumId: 'al_prism_01', genreId: 'gn_indieelec', audioUrl: audio('tr_pr_rf_01') },
  { id: 'tr_pr_rf_02', title: 'Diffraction', duration: 234, trackNum: 2, albumId: 'al_prism_01', genreId: 'gn_indieelec', audioUrl: audio('tr_pr_rf_02') },
  { id: 'tr_pr_rf_03', title: 'Bend', duration: 267, trackNum: 3, albumId: 'al_prism_01', genreId: 'gn_synthwave', audioUrl: audio('tr_pr_rf_03') },
  { id: 'tr_pr_rf_04', title: 'Color Separation', duration: 289, trackNum: 4, albumId: 'al_prism_01', genreId: 'gn_indieelec', audioUrl: audio('tr_pr_rf_04') },
  { id: 'tr_pr_rf_05', title: 'Through Glass', duration: 312, trackNum: 5, albumId: 'al_prism_01', genreId: 'gn_ambient', audioUrl: audio('tr_pr_rf_05') },
  { id: 'tr_pr_rf_06', title: 'Refraction', duration: 345, trackNum: 6, albumId: 'al_prism_01', genreId: 'gn_indieelec', audioUrl: audio('tr_pr_rf_06') },
  { id: 'tr_pr_rf_07', title: 'Exit', duration: 213, trackNum: 7, albumId: 'al_prism_01', genreId: 'gn_indieelec', audioUrl: audio('tr_pr_rf_07') },

  // PRISM — Dispersion
  { id: 'tr_pr_di_01', title: 'Scatter', duration: 221, trackNum: 1, albumId: 'al_prism_02', genreId: 'gn_lofi', audioUrl: audio('tr_pr_di_01') },
  { id: 'tr_pr_di_02', title: 'Wide Angle', duration: 245, trackNum: 2, albumId: 'al_prism_02', genreId: 'gn_lofi', audioUrl: audio('tr_pr_di_02') },
  { id: 'tr_pr_di_03', title: 'Spread', duration: 267, trackNum: 3, albumId: 'al_prism_02', genreId: 'gn_indieelec', audioUrl: audio('tr_pr_di_03') },
  { id: 'tr_pr_di_04', title: 'Dispersion', duration: 298, trackNum: 4, albumId: 'al_prism_02', genreId: 'gn_indieelec', audioUrl: audio('tr_pr_di_04') },
  { id: 'tr_pr_di_05', title: 'Wavelength Range', duration: 312, trackNum: 5, albumId: 'al_prism_02', genreId: 'gn_lofi', audioUrl: audio('tr_pr_di_05') },
  { id: 'tr_pr_di_06', title: 'All Directions', duration: 334, trackNum: 6, albumId: 'al_prism_02', genreId: 'gn_ambient', audioUrl: audio('tr_pr_di_06') },

  // ══════════════════════════════════════════════════════════════════════════
  // LUNAR — Aphelion
  // ══════════════════════════════════════════════════════════════════════════
  { id: 'tr_lu_ap_01', title: 'Farthest Point', duration: 256, trackNum: 1, albumId: 'al_lunar_01', genreId: 'gn_indieelec', audioUrl: audio('tr_lu_ap_01') },
  { id: 'tr_lu_ap_02', title: 'Ellipse', duration: 278, trackNum: 2, albumId: 'al_lunar_01', genreId: 'gn_indieelec', audioUrl: audio('tr_lu_ap_02') },
  { id: 'tr_lu_ap_03', title: 'Orbit', duration: 312, trackNum: 3, albumId: 'al_lunar_01', genreId: 'gn_ambient', audioUrl: audio('tr_lu_ap_03') },
  { id: 'tr_lu_ap_04', title: 'Aphelion', duration: 398, trackNum: 4, albumId: 'al_lunar_01', genreId: 'gn_indieelec', audioUrl: audio('tr_lu_ap_04') },
  { id: 'tr_lu_ap_05', title: 'Perihelion Approach', duration: 267, trackNum: 5, albumId: 'al_lunar_01', genreId: 'gn_indieelec', audioUrl: audio('tr_lu_ap_05') },
  { id: 'tr_lu_ap_06', title: 'Dark Side', duration: 334, trackNum: 6, albumId: 'al_lunar_01', genreId: 'gn_ambient', audioUrl: audio('tr_lu_ap_06') },
  { id: 'tr_lu_ap_07', title: 'Return', duration: 289, trackNum: 7, albumId: 'al_lunar_01', genreId: 'gn_indieelec', audioUrl: audio('tr_lu_ap_07') },

  // LUNAR — Perihelion (EP)
  { id: 'tr_lu_pe_01', title: 'Closest Approach', duration: 234, trackNum: 1, albumId: 'al_lunar_02', genreId: 'gn_indieelec', audioUrl: audio('tr_lu_pe_01') },
  { id: 'tr_lu_pe_02', title: 'Heat', duration: 256, trackNum: 2, albumId: 'al_lunar_02', genreId: 'gn_indieelec', audioUrl: audio('tr_lu_pe_02') },
  { id: 'tr_lu_pe_03', title: 'Solar Wind', duration: 212, trackNum: 3, albumId: 'al_lunar_02', genreId: 'gn_ambient', audioUrl: audio('tr_lu_pe_03') },

  // ══════════════════════════════════════════════════════════════════════════
  // HOLLOW SKY — The Weight of Open Spaces
  // ══════════════════════════════════════════════════════════════════════════
  { id: 'tr_hs_wo_01', title: 'Open', duration: 312, trackNum: 1, albumId: 'al_hollowsky_01', genreId: 'gn_indieelec', audioUrl: audio('tr_hs_wo_01') },
  { id: 'tr_hs_wo_02', title: 'Weight', duration: 345, trackNum: 2, albumId: 'al_hollowsky_01', genreId: 'gn_indieelec', audioUrl: audio('tr_hs_wo_02') },
  { id: 'tr_hs_wo_03', title: 'Space Between', duration: 367, trackNum: 3, albumId: 'al_hollowsky_01', genreId: 'gn_ambient', audioUrl: audio('tr_hs_wo_03') },
  { id: 'tr_hs_wo_04', title: 'Vast', duration: 389, trackNum: 4, albumId: 'al_hollowsky_01', genreId: 'gn_ambient', audioUrl: audio('tr_hs_wo_04') },
  { id: 'tr_hs_wo_05', title: 'Collapse', duration: 298, trackNum: 5, albumId: 'al_hollowsky_01', genreId: 'gn_indieelec', audioUrl: audio('tr_hs_wo_05') },
  { id: 'tr_hs_wo_06', title: 'Rebuild (Again)', duration: 334, trackNum: 6, albumId: 'al_hollowsky_01', genreId: 'gn_indieelec', audioUrl: audio('tr_hs_wo_06') },
  { id: 'tr_hs_wo_07', title: 'The Weight of Open Spaces', duration: 423, trackNum: 7, albumId: 'al_hollowsky_01', genreId: 'gn_ambient', audioUrl: audio('tr_hs_wo_07') },

  // ══════════════════════════════════════════════════════════════════════════
  // AXIOM — Theorem
  // ══════════════════════════════════════════════════════════════════════════
  { id: 'tr_ax_th_01', title: 'Axiom', duration: 198, trackNum: 1, albumId: 'al_axiom_01', genreId: 'gn_futurebass', audioUrl: audio('tr_ax_th_01') },
  { id: 'tr_ax_th_02', title: 'Proof', duration: 234, trackNum: 2, albumId: 'al_axiom_01', genreId: 'gn_futurebass', audioUrl: audio('tr_ax_th_02') },
  { id: 'tr_ax_th_03', title: 'Lemma', duration: 256, trackNum: 3, albumId: 'al_axiom_01', genreId: 'gn_futurebass', audioUrl: audio('tr_ax_th_03') },
  { id: 'tr_ax_th_04', title: 'Corollary', duration: 278, trackNum: 4, albumId: 'al_axiom_01', genreId: 'gn_futurebass', audioUrl: audio('tr_ax_th_04') },
  { id: 'tr_ax_th_05', title: 'Theorem', duration: 312, trackNum: 5, albumId: 'al_axiom_01', genreId: 'gn_futurebass', audioUrl: audio('tr_ax_th_05') },
  { id: 'tr_ax_th_06', title: 'QED', duration: 289, trackNum: 6, albumId: 'al_axiom_01', genreId: 'gn_futurebass', audioUrl: audio('tr_ax_th_06') },

  // AXIOM — Corollary
  { id: 'tr_ax_co_01', title: 'First Principle', duration: 212, trackNum: 1, albumId: 'al_axiom_02', genreId: 'gn_futurebass', audioUrl: audio('tr_ax_co_01') },
  { id: 'tr_ax_co_02', title: 'Inference', duration: 245, trackNum: 2, albumId: 'al_axiom_02', genreId: 'gn_futurebass', audioUrl: audio('tr_ax_co_02') },
  { id: 'tr_ax_co_03', title: 'Derive', duration: 267, trackNum: 3, albumId: 'al_axiom_02', genreId: 'gn_futurebass', audioUrl: audio('tr_ax_co_03') },
  { id: 'tr_ax_co_04', title: 'Conclusion', duration: 298, trackNum: 4, albumId: 'al_axiom_02', genreId: 'gn_futurebass', audioUrl: audio('tr_ax_co_04') },
  { id: 'tr_ax_co_05', title: 'Iterate', duration: 323, trackNum: 5, albumId: 'al_axiom_02', genreId: 'gn_futurebass', audioUrl: audio('tr_ax_co_05') },
  { id: 'tr_ax_co_06', title: 'The Final Form', duration: 356, trackNum: 6, albumId: 'al_axiom_02', genreId: 'gn_futurebass', audioUrl: audio('tr_ax_co_06') },
  { id: 'tr_ax_co_07', title: 'Proof of Concept', duration: 278, trackNum: 7, albumId: 'al_axiom_02', genreId: 'gn_futurebass', audioUrl: audio('tr_ax_co_07') },

  // ══════════════════════════════════════════════════════════════════════════
  // DRIFTWOOD — Saturday Sessions
  // ══════════════════════════════════════════════════════════════════════════
  { id: 'tr_dw_ss_01', title: 'Slow Morning', duration: 189, trackNum: 1, albumId: 'al_driftwood_01', genreId: 'gn_lofi', audioUrl: audio('tr_dw_ss_01') },
  { id: 'tr_dw_ss_02', title: 'Coffee Shop', duration: 212, trackNum: 2, albumId: 'al_driftwood_01', genreId: 'gn_jazzhop', audioUrl: audio('tr_dw_ss_02') },
  { id: 'tr_dw_ss_03', title: 'Rain Window', duration: 234, trackNum: 3, albumId: 'al_driftwood_01', genreId: 'gn_lofi', audioUrl: audio('tr_dw_ss_03') },
  { id: 'tr_dw_ss_04', title: 'Afternoon', duration: 198, trackNum: 4, albumId: 'al_driftwood_01', genreId: 'gn_jazzhop', audioUrl: audio('tr_dw_ss_04') },
  { id: 'tr_dw_ss_05', title: 'Page Turner', duration: 221, trackNum: 5, albumId: 'al_driftwood_01', genreId: 'gn_lofi', audioUrl: audio('tr_dw_ss_05') },
  { id: 'tr_dw_ss_06', title: 'Study Hall', duration: 243, trackNum: 6, albumId: 'al_driftwood_01', genreId: 'gn_jazzhop', audioUrl: audio('tr_dw_ss_06') },
  { id: 'tr_dw_ss_07', title: 'Last Light', duration: 267, trackNum: 7, albumId: 'al_driftwood_01', genreId: 'gn_lofi', audioUrl: audio('tr_dw_ss_07') },
  { id: 'tr_dw_ss_08', title: 'Saturday', duration: 289, trackNum: 8, albumId: 'al_driftwood_01', genreId: 'gn_jazzhop', audioUrl: audio('tr_dw_ss_08') },

  // DRIFTWOOD — Morning Arithmetic
  { id: 'tr_dw_ma_01', title: 'Seven AM', duration: 176, trackNum: 1, albumId: 'al_driftwood_02', genreId: 'gn_lofi', audioUrl: audio('tr_dw_ma_01') },
  { id: 'tr_dw_ma_02', title: 'Count', duration: 198, trackNum: 2, albumId: 'al_driftwood_02', genreId: 'gn_jazzhop', audioUrl: audio('tr_dw_ma_02') },
  { id: 'tr_dw_ma_03', title: 'Subtract', duration: 221, trackNum: 3, albumId: 'al_driftwood_02', genreId: 'gn_lofi', audioUrl: audio('tr_dw_ma_03') },
  { id: 'tr_dw_ma_04', title: 'Sum', duration: 243, trackNum: 4, albumId: 'al_driftwood_02', genreId: 'gn_jazzhop', audioUrl: audio('tr_dw_ma_04') },
  { id: 'tr_dw_ma_05', title: 'Remainder', duration: 256, trackNum: 5, albumId: 'al_driftwood_02', genreId: 'gn_lofi', audioUrl: audio('tr_dw_ma_05') },
  { id: 'tr_dw_ma_06', title: 'Morning Arithmetic', duration: 278, trackNum: 6, albumId: 'al_driftwood_02', genreId: 'gn_jazzhop', audioUrl: audio('tr_dw_ma_06') },

  // DRIFTWOOD — Shoreline (Single)
  { id: 'tr_dw_sh_01', title: 'Shoreline', duration: 234, trackNum: 1, albumId: 'al_driftwood_03', genreId: 'gn_lofi', audioUrl: audio('tr_dw_sh_01') },

  // ══════════════════════════════════════════════════════════════════════════
  // ZENITH — Summit
  // ══════════════════════════════════════════════════════════════════════════
  { id: 'tr_ze_su_01', title: 'Ascent', duration: 234, trackNum: 1, albumId: 'al_zenith_02', genreId: 'gn_altpop', audioUrl: audio('tr_ze_su_01') },
  { id: 'tr_ze_su_02', title: 'Cloud Nine', duration: 267, trackNum: 2, albumId: 'al_zenith_02', genreId: 'gn_altpop', audioUrl: audio('tr_ze_su_02') },
  { id: 'tr_ze_su_03', title: 'Thin Air', duration: 289, trackNum: 3, albumId: 'al_zenith_02', genreId: 'gn_futurebass', audioUrl: audio('tr_ze_su_03') },
  { id: 'tr_ze_su_04', title: 'Peak Hour', duration: 312, trackNum: 4, albumId: 'al_zenith_02', genreId: 'gn_altpop', audioUrl: audio('tr_ze_su_04') },
  { id: 'tr_ze_su_05', title: 'Summit', duration: 334, trackNum: 5, albumId: 'al_zenith_02', genreId: 'gn_altpop', audioUrl: audio('tr_ze_su_05') },
  { id: 'tr_ze_su_06', title: 'Above the Line', duration: 278, trackNum: 6, albumId: 'al_zenith_02', genreId: 'gn_futurebass', audioUrl: audio('tr_ze_su_06') },
  { id: 'tr_ze_su_07', title: 'The View', duration: 256, trackNum: 7, albumId: 'al_zenith_02', genreId: 'gn_altpop', audioUrl: audio('tr_ze_su_07') },
  { id: 'tr_ze_su_08', title: 'Descent', duration: 298, trackNum: 8, albumId: 'al_zenith_02', genreId: 'gn_altpop', audioUrl: audio('tr_ze_su_08') },

  // ZENITH — Apex
  { id: 'tr_ze_ap_01', title: 'Point', duration: 212, trackNum: 1, albumId: 'al_zenith_03', genreId: 'gn_futurebass', audioUrl: audio('tr_ze_ap_01') },
  { id: 'tr_ze_ap_02', title: 'Apex', duration: 245, trackNum: 2, albumId: 'al_zenith_03', genreId: 'gn_futurebass', audioUrl: audio('tr_ze_ap_02') },
  { id: 'tr_ze_ap_03', title: 'Critical Mass', duration: 278, trackNum: 3, albumId: 'al_zenith_03', genreId: 'gn_altpop', audioUrl: audio('tr_ze_ap_03') },
  { id: 'tr_ze_ap_04', title: 'Terminal Velocity', duration: 312, trackNum: 4, albumId: 'al_zenith_03', genreId: 'gn_futurebass', audioUrl: audio('tr_ze_ap_04') },
  { id: 'tr_ze_ap_05', title: 'Maximum', duration: 289, trackNum: 5, albumId: 'al_zenith_03', genreId: 'gn_altpop', audioUrl: audio('tr_ze_ap_05') },
  { id: 'tr_ze_ap_06', title: 'Zenith', duration: 345, trackNum: 6, albumId: 'al_zenith_03', genreId: 'gn_futurebass', audioUrl: audio('tr_ze_ap_06') },

  // ══════════════════════════════════════════════════════════════════════════
  // PHANTOM SIGNAL — Carrier Wave
  // ══════════════════════════════════════════════════════════════════════════
  { id: 'tr_ph_cw_01', title: 'Static', duration: 212, trackNum: 1, albumId: 'al_phantom_02', genreId: 'gn_synthwave', audioUrl: audio('tr_ph_cw_01') },
  { id: 'tr_ph_cw_02', title: 'AM/FM', duration: 245, trackNum: 2, albumId: 'al_phantom_02', genreId: 'gn_synthwave', audioUrl: audio('tr_ph_cw_02') },
  { id: 'tr_ph_cw_03', title: 'Carrier', duration: 267, trackNum: 3, albumId: 'al_phantom_02', genreId: 'gn_synthwave', audioUrl: audio('tr_ph_cw_03') },
  { id: 'tr_ph_cw_04', title: 'Signal Lost', duration: 289, trackNum: 4, albumId: 'al_phantom_02', genreId: 'gn_synthwave', audioUrl: audio('tr_ph_cw_04') },
  { id: 'tr_ph_cw_05', title: 'Retransmit', duration: 312, trackNum: 5, albumId: 'al_phantom_02', genreId: 'gn_synthwave', audioUrl: audio('tr_ph_cw_05') },
  { id: 'tr_ph_cw_06', title: 'Ghost Frequency', duration: 334, trackNum: 6, albumId: 'al_phantom_02', genreId: 'gn_darkwave', audioUrl: audio('tr_ph_cw_06') },
  { id: 'tr_ph_cw_07', title: 'Carrier Wave', duration: 356, trackNum: 7, albumId: 'al_phantom_02', genreId: 'gn_synthwave', audioUrl: audio('tr_ph_cw_07') },

  // ══════════════════════════════════════════════════════════════════════════
  // STATIC BLOOM — Signal Loss
  // ══════════════════════════════════════════════════════════════════════════
  { id: 'tr_sb_sl_01', title: 'Room Tone', duration: 198, trackNum: 1, albumId: 'al_static_02', genreId: 'gn_indieelec', audioUrl: audio('tr_sb_sl_01') },
  { id: 'tr_sb_sl_02', title: 'Signal', duration: 221, trackNum: 2, albumId: 'al_static_02', genreId: 'gn_indieelec', audioUrl: audio('tr_sb_sl_02') },
  { id: 'tr_sb_sl_03', title: 'Noise Floor', duration: 243, trackNum: 3, albumId: 'al_static_02', genreId: 'gn_lofi', audioUrl: audio('tr_sb_sl_03') },
  { id: 'tr_sb_sl_04', title: 'Dropout', duration: 267, trackNum: 4, albumId: 'al_static_02', genreId: 'gn_indieelec', audioUrl: audio('tr_sb_sl_04') },
  { id: 'tr_sb_sl_05', title: 'Signal Loss', duration: 289, trackNum: 5, albumId: 'al_static_02', genreId: 'gn_indieelec', audioUrl: audio('tr_sb_sl_05') },
  { id: 'tr_sb_sl_06', title: 'Static', duration: 312, trackNum: 6, albumId: 'al_static_02', genreId: 'gn_ambient', audioUrl: audio('tr_sb_sl_06') },
  { id: 'tr_sb_sl_07', title: 'Return Signal', duration: 278, trackNum: 7, albumId: 'al_static_02', genreId: 'gn_indieelec', audioUrl: audio('tr_sb_sl_07') },

  // ══════════════════════════════════════════════════════════════════════════
  // CASCADE — Downstream
  // ══════════════════════════════════════════════════════════════════════════
  { id: 'tr_ca_ds_01', title: 'Source', duration: 187, trackNum: 1, albumId: 'al_cascade_02', genreId: 'gn_jazzhop', audioUrl: audio('tr_ca_ds_01') },
  { id: 'tr_ca_ds_02', title: 'Current', duration: 212, trackNum: 2, albumId: 'al_cascade_02', genreId: 'gn_jazzhop', audioUrl: audio('tr_ca_ds_02') },
  { id: 'tr_ca_ds_03', title: 'Meander', duration: 234, trackNum: 3, albumId: 'al_cascade_02', genreId: 'gn_lofi', audioUrl: audio('tr_ca_ds_03') },
  { id: 'tr_ca_ds_04', title: 'Pool', duration: 256, trackNum: 4, albumId: 'al_cascade_02', genreId: 'gn_jazzhop', audioUrl: audio('tr_ca_ds_04') },
  { id: 'tr_ca_ds_05', title: 'Tributary', duration: 278, trackNum: 5, albumId: 'al_cascade_02', genreId: 'gn_lofi', audioUrl: audio('tr_ca_ds_05') },
  { id: 'tr_ca_ds_06', title: 'Downstream', duration: 312, trackNum: 6, albumId: 'al_cascade_02', genreId: 'gn_jazzhop', audioUrl: audio('tr_ca_ds_06') },
  { id: 'tr_ca_ds_07', title: 'Delta', duration: 289, trackNum: 7, albumId: 'al_cascade_02', genreId: 'gn_jazzhop', audioUrl: audio('tr_ca_ds_07') },
  { id: 'tr_ca_ds_08', title: 'Estuary', duration: 334, trackNum: 8, albumId: 'al_cascade_02', genreId: 'gn_lofi', audioUrl: audio('tr_ca_ds_08') },

  // ══════════════════════════════════════════════════════════════════════════
  // AURORA VEIL — Dusk Garden
  // ══════════════════════════════════════════════════════════════════════════
  { id: 'tr_au_dg_01', title: 'Golden Hour', duration: 243, trackNum: 1, albumId: 'al_aurora_02', genreId: 'gn_dreampop', audioUrl: audio('tr_au_dg_01') },
  { id: 'tr_au_dg_02', title: 'Petal', duration: 267, trackNum: 2, albumId: 'al_aurora_02', genreId: 'gn_dreampop', audioUrl: audio('tr_au_dg_02') },
  { id: 'tr_au_dg_03', title: 'Overgrown', duration: 289, trackNum: 3, albumId: 'al_aurora_02', genreId: 'gn_dreampop', audioUrl: audio('tr_au_dg_03') },
  { id: 'tr_au_dg_04', title: 'Dusk Garden', duration: 312, trackNum: 4, albumId: 'al_aurora_02', genreId: 'gn_dreampop', audioUrl: audio('tr_au_dg_04') },
  { id: 'tr_au_dg_05', title: 'Firefly', duration: 256, trackNum: 5, albumId: 'al_aurora_02', genreId: 'gn_dreampop', audioUrl: audio('tr_au_dg_05') },
  { id: 'tr_au_dg_06', title: 'Night Bloom', duration: 334, trackNum: 6, albumId: 'al_aurora_02', genreId: 'gn_ambient', audioUrl: audio('tr_au_dg_06') },
  { id: 'tr_au_dg_07', title: 'Before Dawn', duration: 278, trackNum: 7, albumId: 'al_aurora_02', genreId: 'gn_dreampop', audioUrl: audio('tr_au_dg_07') },

  // ══════════════════════════════════════════════════════════════════════════
  // Remaining albums — shorter entries to hit 200+ total
  // ══════════════════════════════════════════════════════════════════════════

  // ZENITH — Elevation
  { id: 'tr_ze_el_01', title: 'Rise', duration: 212, trackNum: 1, albumId: 'al_zenith_01', genreId: 'gn_altpop', audioUrl: audio('tr_ze_el_01') },
  { id: 'tr_ze_el_02', title: 'Lift', duration: 234, trackNum: 2, albumId: 'al_zenith_01', genreId: 'gn_futurebass', audioUrl: audio('tr_ze_el_02') },
  { id: 'tr_ze_el_03', title: 'Elevation', duration: 256, trackNum: 3, albumId: 'al_zenith_01', genreId: 'gn_altpop', audioUrl: audio('tr_ze_el_03') },
  { id: 'tr_ze_el_04', title: 'Flying', duration: 278, trackNum: 4, albumId: 'al_zenith_01', genreId: 'gn_altpop', audioUrl: audio('tr_ze_el_04') },
  { id: 'tr_ze_el_05', title: 'Higher', duration: 301, trackNum: 5, albumId: 'al_zenith_01', genreId: 'gn_futurebass', audioUrl: audio('tr_ze_el_05') },

  // CIPHER — Encrypted
  { id: 'tr_ci_en_01', title: 'Key Exchange', duration: 245, trackNum: 1, albumId: 'al_cipher_01', genreId: 'gn_darkwave', audioUrl: audio('tr_ci_en_01') },
  { id: 'tr_ci_en_02', title: 'Hash', duration: 267, trackNum: 2, albumId: 'al_cipher_01', genreId: 'gn_darkwave', audioUrl: audio('tr_ci_en_02') },
  { id: 'tr_ci_en_03', title: 'Encrypt', duration: 289, trackNum: 3, albumId: 'al_cipher_01', genreId: 'gn_darkwave', audioUrl: audio('tr_ci_en_03') },
  { id: 'tr_ci_en_04', title: 'Decrypt', duration: 312, trackNum: 4, albumId: 'al_cipher_01', genreId: 'gn_darkwave', audioUrl: audio('tr_ci_en_04') },
  { id: 'tr_ci_en_05', title: 'Cipher', duration: 334, trackNum: 5, albumId: 'al_cipher_01', genreId: 'gn_darkwave', audioUrl: audio('tr_ci_en_05') },

  // NOVA DRIFT — Departure
  { id: 'tr_nv_de_01', title: 'Terminal', duration: 234, trackNum: 1, albumId: 'al_nova_01', genreId: 'gn_altpop', audioUrl: audio('tr_nv_de_01') },
  { id: 'tr_nv_de_02', title: 'Gate', duration: 256, trackNum: 2, albumId: 'al_nova_01', genreId: 'gn_indieelec', audioUrl: audio('tr_nv_de_02') },
  { id: 'tr_nv_de_03', title: 'Runway', duration: 278, trackNum: 3, albumId: 'al_nova_01', genreId: 'gn_altpop', audioUrl: audio('tr_nv_de_03') },
  { id: 'tr_nv_de_04', title: 'Lift Off', duration: 301, trackNum: 4, albumId: 'al_nova_01', genreId: 'gn_futurebass', audioUrl: audio('tr_nv_de_04') },
  { id: 'tr_nv_de_05', title: 'Departure', duration: 323, trackNum: 5, albumId: 'al_nova_01', genreId: 'gn_altpop', audioUrl: audio('tr_nv_de_05') },
  { id: 'tr_nv_de_06', title: 'Drift', duration: 289, trackNum: 6, albumId: 'al_nova_01', genreId: 'gn_indieelec', audioUrl: audio('tr_nv_de_06') },

  // MERIDIAN — Latitude
  { id: 'tr_me_la_01', title: 'North', duration: 412, trackNum: 1, albumId: 'al_meridian_01', genreId: 'gn_ambient', audioUrl: audio('tr_me_la_01') },
  { id: 'tr_me_la_02', title: 'South', duration: 389, trackNum: 2, albumId: 'al_meridian_01', genreId: 'gn_ambient', audioUrl: audio('tr_me_la_02') },
  { id: 'tr_me_la_03', title: 'Parallel Lines', duration: 445, trackNum: 3, albumId: 'al_meridian_01', genreId: 'gn_ambient', audioUrl: audio('tr_me_la_03') },
  { id: 'tr_me_la_04', title: 'Latitude', duration: 467, trackNum: 4, albumId: 'al_meridian_01', genreId: 'gn_ambient', audioUrl: audio('tr_me_la_04') },

  // SILHOUETTE — Lighthouse
  { id: 'tr_si_li_01', title: 'Keeper', duration: 243, trackNum: 1, albumId: 'al_silhouette_01', genreId: 'gn_neosoul', audioUrl: audio('tr_si_li_01') },
  { id: 'tr_si_li_02', title: 'Beam', duration: 267, trackNum: 2, albumId: 'al_silhouette_01', genreId: 'gn_neosoul', audioUrl: audio('tr_si_li_02') },
  { id: 'tr_si_li_03', title: 'Fog Horn', duration: 289, trackNum: 3, albumId: 'al_silhouette_01', genreId: 'gn_neosoul', audioUrl: audio('tr_si_li_03') },
  { id: 'tr_si_li_04', title: 'Lighthouse', duration: 312, trackNum: 4, albumId: 'al_silhouette_01', genreId: 'gn_neosoul', audioUrl: audio('tr_si_li_04') },
  { id: 'tr_si_li_05', title: 'Shoreline (Silhouette)', duration: 278, trackNum: 5, albumId: 'al_silhouette_01', genreId: 'gn_indieelec', audioUrl: audio('tr_si_li_05') },

  // FRACTURE — Broken Beat Theory
  { id: 'tr_fr_bb_01', title: 'Downbeat', duration: 198, trackNum: 1, albumId: 'al_fracture_02', genreId: 'gn_jazzhop', audioUrl: audio('tr_fr_bb_01') },
  { id: 'tr_fr_bb_02', title: 'Off-Grid', duration: 221, trackNum: 2, albumId: 'al_fracture_02', genreId: 'gn_lofi', audioUrl: audio('tr_fr_bb_02') },
  { id: 'tr_fr_bb_03', title: 'Syncopation', duration: 243, trackNum: 3, albumId: 'al_fracture_02', genreId: 'gn_jazzhop', audioUrl: audio('tr_fr_bb_03') },
  { id: 'tr_fr_bb_04', title: 'Broken Beat', duration: 267, trackNum: 4, albumId: 'al_fracture_02', genreId: 'gn_jazzhop', audioUrl: audio('tr_fr_bb_04') },
  { id: 'tr_fr_bb_05', title: 'Theory', duration: 289, trackNum: 5, albumId: 'al_fracture_02', genreId: 'gn_lofi', audioUrl: audio('tr_fr_bb_05') },
  { id: 'tr_fr_bb_06', title: 'Polyrhythm', duration: 312, trackNum: 6, albumId: 'al_fracture_02', genreId: 'gn_jazzhop', audioUrl: audio('tr_fr_bb_06') },

  // ECHO CHAMBER — Reverb Studies
  { id: 'tr_ec_rs_01', title: 'Study No. 1', duration: 312, trackNum: 1, albumId: 'al_echo_01', genreId: 'gn_ambient', audioUrl: audio('tr_ec_rs_01') },
  { id: 'tr_ec_rs_02', title: 'Study No. 2', duration: 345, trackNum: 2, albumId: 'al_echo_01', genreId: 'gn_ambient', audioUrl: audio('tr_ec_rs_02') },
  { id: 'tr_ec_rs_03', title: 'Study No. 3', duration: 378, trackNum: 3, albumId: 'al_echo_01', genreId: 'gn_ambient', audioUrl: audio('tr_ec_rs_03') },
  { id: 'tr_ec_rs_04', title: 'Decay', duration: 423, trackNum: 4, albumId: 'al_echo_01', genreId: 'gn_ambient', audioUrl: audio('tr_ec_rs_04') },

  // PHANTOM SIGNAL — Broadcast
  { id: 'tr_ph_br_01', title: 'Air', duration: 234, trackNum: 1, albumId: 'al_phantom_01', genreId: 'gn_synthwave', audioUrl: audio('tr_ph_br_01') },
  { id: 'tr_ph_br_02', title: 'Broadcast', duration: 256, trackNum: 2, albumId: 'al_phantom_01', genreId: 'gn_synthwave', audioUrl: audio('tr_ph_br_02') },
  { id: 'tr_ph_br_03', title: 'Signal Received', duration: 278, trackNum: 3, albumId: 'al_phantom_01', genreId: 'gn_synthwave', audioUrl: audio('tr_ph_br_03') },
  { id: 'tr_ph_br_04', title: 'On Air', duration: 301, trackNum: 4, albumId: 'al_phantom_01', genreId: 'gn_darkwave', audioUrl: audio('tr_ph_br_04') },
  { id: 'tr_ph_br_05', title: 'Off Air', duration: 267, trackNum: 5, albumId: 'al_phantom_01', genreId: 'gn_synthwave', audioUrl: audio('tr_ph_br_05') },

  // STATIC BLOOM — Bedroom Architecture
  { id: 'tr_sb_ba_01', title: 'Walls', duration: 198, trackNum: 1, albumId: 'al_static_01', genreId: 'gn_indieelec', audioUrl: audio('tr_sb_ba_01') },
  { id: 'tr_sb_ba_02', title: 'Ceiling', duration: 221, trackNum: 2, albumId: 'al_static_01', genreId: 'gn_lofi', audioUrl: audio('tr_sb_ba_02') },
  { id: 'tr_sb_ba_03', title: 'Window', duration: 243, trackNum: 3, albumId: 'al_static_01', genreId: 'gn_indieelec', audioUrl: audio('tr_sb_ba_03') },
  { id: 'tr_sb_ba_04', title: 'Floor', duration: 267, trackNum: 4, albumId: 'al_static_01', genreId: 'gn_lofi', audioUrl: audio('tr_sb_ba_04') },
  { id: 'tr_sb_ba_05', title: 'Bedroom', duration: 289, trackNum: 5, albumId: 'al_static_01', genreId: 'gn_indieelec', audioUrl: audio('tr_sb_ba_05') },

  // CASCADE — Watercolour
  { id: 'tr_ca_wc_01', title: 'Pigment', duration: 187, trackNum: 1, albumId: 'al_cascade_01', genreId: 'gn_jazzhop', audioUrl: audio('tr_ca_wc_01') },
  { id: 'tr_ca_wc_02', title: 'Wash', duration: 209, trackNum: 2, albumId: 'al_cascade_01', genreId: 'gn_lofi', audioUrl: audio('tr_ca_wc_02') },
  { id: 'tr_ca_wc_03', title: 'Blend', duration: 231, trackNum: 3, albumId: 'al_cascade_01', genreId: 'gn_jazzhop', audioUrl: audio('tr_ca_wc_03') },
  { id: 'tr_ca_wc_04', title: 'Watercolour', duration: 254, trackNum: 4, albumId: 'al_cascade_01', genreId: 'gn_jazzhop', audioUrl: audio('tr_ca_wc_04') },
  { id: 'tr_ca_wc_05', title: 'Dry', duration: 212, trackNum: 5, albumId: 'al_cascade_01', genreId: 'gn_lofi', audioUrl: audio('tr_ca_wc_05') },

  // AURORA VEIL — Soft Architecture
  { id: 'tr_au_sa_01', title: 'Haze', duration: 234, trackNum: 1, albumId: 'al_aurora_01', genreId: 'gn_dreampop', audioUrl: audio('tr_au_sa_01') },
  { id: 'tr_au_sa_02', title: 'Veil', duration: 256, trackNum: 2, albumId: 'al_aurora_01', genreId: 'gn_dreampop', audioUrl: audio('tr_au_sa_02') },
  { id: 'tr_au_sa_03', title: 'Translucent', duration: 278, trackNum: 3, albumId: 'al_aurora_01', genreId: 'gn_dreampop', audioUrl: audio('tr_au_sa_03') },
  { id: 'tr_au_sa_04', title: 'Soft', duration: 301, trackNum: 4, albumId: 'al_aurora_01', genreId: 'gn_ambient', audioUrl: audio('tr_au_sa_04') },
  { id: 'tr_au_sa_05', title: 'Architecture', duration: 323, trackNum: 5, albumId: 'al_aurora_01', genreId: 'gn_dreampop', audioUrl: audio('tr_au_sa_05') },

  // FRACTURE — Sample Science
  { id: 'tr_fr_sc_01', title: 'Crate Dig', duration: 198, trackNum: 1, albumId: 'al_fracture_01', genreId: 'gn_lofi', audioUrl: audio('tr_fr_sc_01') },
  { id: 'tr_fr_sc_02', title: 'Chop', duration: 221, trackNum: 2, albumId: 'al_fracture_01', genreId: 'gn_jazzhop', audioUrl: audio('tr_fr_sc_02') },
  { id: 'tr_fr_sc_03', title: 'Loop Back', duration: 243, trackNum: 3, albumId: 'al_fracture_01', genreId: 'gn_lofi', audioUrl: audio('tr_fr_sc_03') },
  { id: 'tr_fr_sc_04', title: 'Sample', duration: 267, trackNum: 4, albumId: 'al_fracture_01', genreId: 'gn_jazzhop', audioUrl: audio('tr_fr_sc_04') },
  { id: 'tr_fr_sc_05', title: 'Science', duration: 289, trackNum: 5, albumId: 'al_fracture_01', genreId: 'gn_jazzhop', audioUrl: audio('tr_fr_sc_05') },
];
