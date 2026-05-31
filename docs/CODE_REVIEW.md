# Code Review — Jawad Khmaysa Portfolio

**Reviewed:** 2026-05-24  
**Scope:** `index.html`, `projects.html`, `samples.html`, `style.css`, `main.js`  
**Effort:** High (3 finder angles × verification pass)

---

## Findings

### 1. YouTube contact link is permanently broken (`index.html:443`)

The third contact entry has `href="#"` in the HTML. JavaScript overwrites its visible label to "YouTube" and its display value to "Jawad Khamaysa" via `setList`, but **never touches the `href` attribute**. Clicking the link scrolls the user back to the top of the page instead of opening YouTube.

**Root cause:** `setList` only sets `textContent`/`innerHTML` on child elements — it never modifies the parent anchor's `href`. The actual YouTube URL (`https://www.youtube.com/@jawad_khamaysa`) exists in the socials section but is not applied here. Both EN and AR locales are affected.

**Fix:** Replace `href="#"` with the YouTube URL, or have `updateHome()` call `setAttribute('href', ...)` on that anchor.

---

### 2. All audio MP3 files are missing — no real playback (`index.html:247`, `samples.html:76–146`)

Every `<audio>` element references a file that does not exist (`assets/audio/sample-01.mp3` through `sample-06.mp3`). The `assets/audio/` directory contains only a `README.md` and unrelated WAV files. All six players silently fall back to the fake simulation on both pages. Visitors who come to evaluate voice samples hear nothing.

**Fix:** Add the correct MP3 files to `assets/audio/`, or update the `src` attributes to point to the actual WAV files (renaming or re-encoding as needed).

---

### 3. Stopping a player by clicking another leaves its waveform and timer frozen (`main.js:579–588`)

The "stop all other players" loop correctly pauses audio and resets the button icon, but never calls `syncWaveform(j, 0)` or `updateTime(j, 0)`. The interrupted player's waveform bars remain highlighted and its timestamp stays at the paused position indefinitely.

**Contrast:** The `audio.ended` handler and `startSimulation`'s reset branch both call both functions with `0`. Only this path omits them.

**Failure scenario:** User plays Sample 01 to 15 s (waveform 50% lit, timer shows `0:15`), then clicks Sample 02. Sample 01's card stays half-lit with `0:15` displayed, looking like it is still active.

**Fix:** After `other.innerHTML = playIcon`, add:
```js
syncWaveform(j, 0);
updateTime(j, 0);
state.progress[j] = 0;
```

---

### 4. Race condition: rapid play→pause spawns a zombie simulation (`main.js:595`)

If the user clicks play (calling `audio.play()`) and then clicks pause before the promise rejects, the following happens:

1. Play: `state.playing[id]` → `true`. `audio.play()` called. `state.interval[id]` is not yet set.
2. Pause: `clearInterval(state.interval[id])` — `state.interval[id]` is `undefined`, so this is a no-op. `state.playing[id]` → `false`. Button shows play icon.
3. Reject: `.catch(() => startSimulation(id, dur, this))` fires. `startSimulation` creates a new `setInterval` and stores it in `state.interval[id]`.
4. The simulation now runs in the background — updating the waveform and timer — even though `state.playing[id]` is `false` and the button shows the play icon. `startSimulation`'s tick callback never checks `state.playing[id]`.

A follow-up play click overwrites `state.interval[id]` with a new interval, orphaning the zombie with no reference to clear it.

**Fix:** Inside `startSimulation`'s interval callback, add an early return if `!state.playing[id]`:
```js
state.interval[id] = setInterval(() => {
  if (!state.playing[id]) { clearInterval(state.interval[id]); return; }
  // ...rest of tick
}, TICK);
```

---

### 5. Waveform patterns repeat on the samples page (`main.js:503`, `samples.html`)

Only 3 waveform patterns are defined. The init code uses `id % patterns.length` (i.e., `id % 3`), causing players wf0 & wf3, wf1 & wf4, and wf2 & wf5 to render identical bar-height sequences. On `samples.html`, three pairs of players are visually indistinguishable by waveform shape.

**Fix:** Add 3 more distinct patterns to the `patterns` array (one per additional player), or generate patterns procedurally so each player gets a unique shape.

---

### 6. `direction: LTR` uses an uppercase CSS keyword (`style.css:2022`)

The CSS spec requires keyword values to be lowercase (`ltr`, not `LTR`). Most browsers accept it case-insensitively today, but a strict parser would drop the declaration. The `.cv` class relies on this rule to force left-to-right rendering for Latin/numeric strings (email, phone number) inside RTL layouts. If ignored, the phone number and email address would render right-to-left and appear garbled in Arabic locale.

**Fix:** Change `direction: LTR` to `direction: ltr`.

---

## Summary

| # | File | Line | Severity | Status |
|---|------|------|----------|--------|
| 1 | `index.html` | 443 | High | CONFIRMED |
| 2 | `index.html`, `samples.html` | 247, 76–146 | High | CONFIRMED |
| 3 | `main.js` | 579–588 | Medium | CONFIRMED |
| 4 | `main.js` | 595 | Medium | PLAUSIBLE |
| 5 | `main.js` | 503 | Low | PLAUSIBLE |
| 6 | `style.css` | 2022 | Low | PLAUSIBLE |
