// Sonicly Fictional Music Catalog — Curated Playlists
// 16 curated Sonicly playlists with song references

export type PlaylistSeed = {
  id: string;
  name: string;
  description: string;
  coverUrl: string;
  isCurated: boolean;
  songIds: string[];
};

export const playlists: PlaylistSeed[] = [
  {
    id: 'pl_midnight_drives',
    name: 'Midnight Drives',
    description: 'A collection for roads that don\'t end. Synthwave and electronic for the hours between.',
    coverUrl: '/images/playlists/pl_midnight_drives.webp',
    isCurated: true,
    songIds: [
      'tr_np_mc_04', 'tr_np_uv_01', 'tr_np_mc_08', 'tr_ph_cw_01', 'tr_ph_cw_03',
      'tr_ph_br_02', 'tr_np_uv_06', 'tr_np_mc_03', 'tr_ph_cw_07', 'tr_np_uv_03',
      'tr_ob_bm_03', 'tr_ob_bm_07', 'tr_ph_cw_06', 'tr_np_mc_07', 'tr_ph_br_03',
    ],
  },
  {
    id: 'pl_deep_focus',
    name: 'Deep Focus',
    description: 'Ambient and lo-fi for work sessions that require complete immersion.',
    coverUrl: '/images/playlists/pl_deep_focus.webp',
    isCurated: true,
    songIds: [
      'tr_so_eq_02', 'tr_so_sl_01', 'tr_dw_ss_01', 'tr_so_eq_05', 'tr_dw_ma_01',
      'tr_so_sl_05', 'tr_ec_rs_01', 'tr_me_la_01', 'tr_so_sl_03', 'tr_ec_rs_04',
      'tr_dw_ss_05', 'tr_me_la_04', 'tr_so_eq_03', 'tr_lu_ap_06', 'tr_hs_wo_04',
    ],
  },
  {
    id: 'pl_saturday_morning',
    name: 'Saturday Morning',
    description: 'Jazz-hop and lo-fi for slow mornings when time doesn\'t matter.',
    coverUrl: '/images/playlists/pl_saturday_morning.webp',
    isCurated: true,
    songIds: [
      'tr_dw_ss_01', 'tr_ca_wc_01', 'tr_dw_ma_01', 'tr_ca_ds_01', 'tr_fr_sc_01',
      'tr_dw_ss_03', 'tr_ca_wc_03', 'tr_fr_bb_01', 'tr_dw_ss_06', 'tr_ca_ds_03',
      'tr_dw_ma_06', 'tr_ca_wc_04', 'tr_fr_sc_04', 'tr_dw_ss_08', 'tr_ca_ds_06',
    ],
  },
  {
    id: 'pl_luminous',
    name: 'Luminous',
    description: 'Sonicly\'s signature playlist. Dark, glowing, and deeply immersive.',
    coverUrl: '/images/playlists/pl_luminous.webp',
    isCurated: true,
    songIds: [
      'tr_np_uv_01', 'tr_ch_sp_01', 'tr_mi_oa_05', 'tr_ze_su_05', 'tr_au_dg_04',
      'tr_sb_sl_01', 'tr_lu_ap_04', 'tr_ax_th_05', 'tr_ve_sl_01', 'tr_pr_rf_06',
      'tr_nv_de_05', 'tr_ze_ap_06', 'tr_ch_wl_06', 'tr_sb_sl_05', 'tr_np_mc_04',
    ],
  },
  {
    id: 'pl_dream_state',
    name: 'Dream State',
    description: 'Dream pop and ambient for the threshold between waking and sleep.',
    coverUrl: '/images/playlists/pl_dream_state.webp',
    isCurated: true,
    songIds: [
      'tr_ve_sl_01', 'tr_au_sa_01', 'tr_au_dg_01', 'tr_ve_sl_05', 'tr_lu_ap_03',
      'tr_au_sa_04', 'tr_so_sl_01', 'tr_ve_ha_01', 'tr_au_dg_06', 'tr_lu_ap_06',
      'tr_au_sa_02', 'tr_ve_sl_07', 'tr_au_dg_07', 'tr_so_eq_02', 'tr_ve_ha_03',
    ],
  },
  {
    id: 'pl_new_energy',
    name: 'New Energy',
    description: 'Future bass and electronic pop to recalibrate your frequency.',
    coverUrl: '/images/playlists/pl_new_energy.webp',
    isCurated: true,
    songIds: [
      'tr_ax_th_05', 'tr_ch_wl_06', 'tr_ze_ap_04', 'tr_ax_co_05', 'tr_ch_sp_04',
      'tr_ze_su_03', 'tr_ax_co_06', 'tr_ch_wl_02', 'tr_ze_ap_01', 'tr_ax_th_01',
      'tr_nv_de_04', 'tr_ch_wl_04', 'tr_ze_el_05', 'tr_ax_co_02', 'tr_ch_ir_01',
    ],
  },
  {
    id: 'pl_dark_room',
    name: 'Dark Room',
    description: 'Darkwave and brooding electronic for the hours that ask nothing of you.',
    coverUrl: '/images/playlists/pl_dark_room.webp',
    isCurated: true,
    songIds: [
      'tr_ob_bm_07', 'tr_ci_en_05', 'tr_ob_bm_03', 'tr_ph_cw_06', 'tr_ci_en_03',
      'tr_ob_bm_04', 'tr_ci_en_01', 'tr_ph_br_04', 'tr_ob_vo_01', 'tr_ob_bm_06',
      'tr_ci_en_04', 'tr_ob_bm_01', 'tr_ph_cw_04', 'tr_ci_en_02', 'tr_ob_bm_02',
    ],
  },
  {
    id: 'pl_indie_electric',
    name: 'Indie Electric',
    description: 'Bedroom projects and bedroom recordings. Independent and beautifully imperfect.',
    coverUrl: '/images/playlists/pl_indie_electric.webp',
    isCurated: true,
    songIds: [
      'tr_sb_sl_01', 'tr_lu_ap_01', 'tr_sb_ba_05', 'tr_pr_rf_02', 'tr_lu_pe_01',
      'tr_sb_sl_05', 'tr_pr_di_03', 'tr_lu_ap_07', 'tr_sb_ba_03', 'tr_hs_wo_01',
      'tr_pr_rf_06', 'tr_sb_sl_07', 'tr_lu_ap_04', 'tr_pr_di_04', 'tr_sb_ba_01',
    ],
  },
  {
    id: 'pl_late_night',
    name: 'Late Night',
    description: 'After midnight, when the city gets quiet and the music gets honest.',
    coverUrl: '/images/playlists/pl_late_night.webp',
    isCurated: true,
    songIds: [
      'tr_np_mc_04', 'tr_ve_sl_07', 'tr_ob_bm_07', 'tr_lu_ap_04', 'tr_si_li_04',
      'tr_ch_sp_06', 'tr_mi_vp_06', 'tr_au_dg_06', 'tr_ze_su_05', 'tr_sb_sl_05',
      'tr_dw_ss_07', 'tr_ca_ds_06', 'tr_mi_oa_10', 'tr_ze_ap_06', 'tr_np_uv_08',
    ],
  },
  {
    id: 'pl_morning_glow',
    name: 'Morning Glow',
    description: 'Warm and unhurried. For mornings that deserve to be felt rather than rushed.',
    coverUrl: '/images/playlists/pl_morning_glow.webp',
    isCurated: true,
    songIds: [
      'tr_dw_ma_01', 'tr_ca_wc_01', 'tr_au_dg_01', 'tr_so_eq_01', 'tr_ca_ds_02',
      'tr_dw_ss_02', 'tr_au_sa_01', 'tr_fr_sc_01', 'tr_dw_ma_06', 'tr_ca_wc_04',
      'tr_ve_sl_01', 'tr_dw_ss_04', 'tr_ca_ds_03', 'tr_so_sl_02', 'tr_au_dg_02',
    ],
  },
  {
    id: 'pl_weightless',
    name: 'Weightless',
    description: 'Long-form ambient and atmospheric. Let go of everything and just listen.',
    coverUrl: '/images/playlists/pl_weightless.webp',
    isCurated: true,
    songIds: [
      'tr_so_eq_02', 'tr_me_la_04', 'tr_ec_rs_04', 'tr_hs_wo_04', 'tr_so_sl_05',
      'tr_lu_ap_06', 'tr_me_la_03', 'tr_ec_rs_02', 'tr_so_eq_05', 'tr_hs_wo_07',
      'tr_pr_rf_05', 'tr_au_sa_04', 'tr_so_sl_01', 'tr_me_la_01', 'tr_pr_di_06',
    ],
  },
  {
    id: 'pl_discovery',
    name: 'Discover Something New',
    description: 'Hand-picked tracks from artists you haven\'t heard yet. Expand your world.',
    coverUrl: '/images/playlists/pl_discovery.webp',
    isCurated: true,
    songIds: [
      'tr_ci_en_01', 'tr_me_la_02', 'tr_ec_rs_01', 'tr_si_li_04', 'tr_fr_bb_04',
      'tr_nv_de_05', 'tr_hollow_wo_01', 'tr_lu_pe_02', 'tr_pr_di_04', 'tr_sb_ba_05',
    ].filter(Boolean) as string[],
  },
  {
    id: 'pl_neo_soul',
    name: 'Neo Soul Nights',
    description: 'Rich chords, soulful runs, and beats that find the pocket and stay there.',
    coverUrl: '/images/playlists/pl_neo_soul.webp',
    isCurated: true,
    songIds: [
      'tr_ch_sp_01', 'tr_si_li_01', 'tr_ch_wl_03', 'tr_si_li_02', 'tr_ch_sp_05',
      'tr_si_li_04', 'tr_ch_sp_06', 'tr_si_li_03', 'tr_ch_sp_08', 'tr_ch_wl_05',
      'tr_ch_sp_03', 'tr_si_li_05', 'tr_ch_ir_01', 'tr_ch_sp_09', 'tr_ch_wl_06',
    ],
  },
  {
    id: 'pl_sonicly_top',
    name: 'Sonicly Top 50',
    description: 'The 50 most played songs on Sonicly right now.',
    coverUrl: '/images/playlists/pl_sonicly_top.webp',
    isCurated: true,
    songIds: [
      'tr_np_uv_01', 'tr_ch_sp_01', 'tr_ze_su_05', 'tr_mi_vp_06', 'tr_ax_th_05',
      'tr_dw_ss_01', 'tr_ve_sl_01', 'tr_ob_bm_07', 'tr_sb_sl_05', 'tr_au_dg_04',
      'tr_lu_ap_04', 'tr_pr_rf_06', 'tr_mi_oa_10', 'tr_ze_ap_06', 'tr_nv_de_05',
      'tr_ca_ds_06', 'tr_si_li_04', 'tr_ch_wl_06', 'tr_fr_bb_04', 'tr_so_sl_05',
      'tr_np_mc_04', 'tr_ci_en_05', 'tr_ze_el_05', 'tr_dw_ma_06', 'tr_ph_cw_07',
      'tr_ch_sp_06', 'tr_mi_oa_05', 'tr_sb_ba_05', 'tr_au_sa_05', 'tr_np_uv_06',
    ],
  },
  {
    id: 'pl_new_releases',
    name: 'New Releases',
    description: 'Fresh from the catalog. The newest sounds on Sonicly.',
    coverUrl: '/images/playlists/pl_new_releases.webp',
    isCurated: true,
    songIds: [
      'tr_np_fr_01', 'tr_ch_ir_01', 'tr_dw_sh_01', 'tr_ze_ap_01', 'tr_ze_ap_02',
      'tr_ze_ap_03', 'tr_ze_ap_04', 'tr_ze_ap_05', 'tr_ze_ap_06', 'tr_sb_sl_01',
      'tr_sb_sl_02', 'tr_sb_sl_03', 'tr_sb_sl_04', 'tr_sb_sl_05', 'tr_au_dg_01',
    ],
  },
  {
    id: 'pl_synthwave_essentials',
    name: 'Synthwave Essentials',
    description: 'From the neon archive. The best of the retro-futurist electronic sound.',
    coverUrl: '/images/playlists/pl_synthwave_essentials.webp',
    isCurated: true,
    songIds: [
      'tr_np_mc_01', 'tr_np_uv_01', 'tr_ph_br_02', 'tr_ph_cw_07', 'tr_np_mc_04',
      'tr_np_uv_06', 'tr_ph_cw_03', 'tr_np_mc_08', 'tr_ph_br_03', 'tr_np_uv_03',
      'tr_np_mc_03', 'tr_ph_cw_05', 'tr_np_uv_08', 'tr_ph_br_05', 'tr_np_fr_01',
    ],
  },
];
